import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Coupon, StoreSettings, Review, OrderStatus } from '../types';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredOrders,
  saveStoredOrders,
  getStoredCoupons,
  saveStoredCoupons,
  getStoredSettings,
  saveStoredSettings,
  getStoredReviews,
  saveStoredReviews,
  syncOrderToSupabase
} from '../lib/storage';
import { api } from '../lib/api';

interface StoreContextType {
  products: Product[];
  allProducts: Product[];
  isLoadingProducts: boolean;
  productError: string | null;
  refetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  togglePublishProduct: (productId: string, isPublished?: boolean) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  
  orders: Order[];
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierPartner?: string) => void;
  getOrderByIdOrNumber: (identifier: string) => Order | undefined;
  
  coupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;
  validateCoupon: (code: string, subtotal: number) => { valid: boolean; message: string; discount: number; coupon?: Coupon };
  
  settings: StoreSettings;
  updateSettings: (settings: StoreSettings) => void;
  
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  getProductReviews: (productId: string) => Review[];
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const products = React.useMemo(() => allProducts.filter((p) => p.isPublished !== false), [allProducts]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings());
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const refetchProducts = async () => {
    setIsLoadingProducts(true);
    setProductError(null);
    try {
      const res = await api.getProducts({ includeDrafts: true });
      if (res.success && Array.isArray(res.data)) {
        setAllProducts(res.data);
        saveStoredProducts(res.data);
      }
    } catch (err: any) {
      console.warn('Error fetching products from Supabase API:', err);
      setProductError(err.message || 'Could not connect to database');
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Initialize from storage & sync with backend API if online
  useEffect(() => {
    // 1. Initial immediate local cache
    const initialProducts = getStoredProducts();
    const initialOrders = getStoredOrders();
    const initialCoupons = getStoredCoupons();
    const initialSettings = getStoredSettings();
    const initialReviews = getStoredReviews();

    setAllProducts(initialProducts);
    setOrders(initialOrders);
    setCoupons(initialCoupons);
    setSettings(initialSettings);
    setReviews(initialReviews);

    // 2. Async backend sync with live Supabase
    refetchProducts();

    const syncOtherData = async () => {
      try {
        const [ordRes, coupRes, settRes, revRes] = await Promise.allSettled([
          api.getOrders(),
          api.getCoupons(),
          api.getSettings(),
          api.getReviews()
        ]);

        if (ordRes.status === 'fulfilled' && ordRes.value.data?.length) {
          setOrders(ordRes.value.data);
          saveStoredOrders(ordRes.value.data);
        }
        if (coupRes.status === 'fulfilled' && coupRes.value.data?.length) {
          setCoupons(coupRes.value.data);
          saveStoredCoupons(coupRes.value.data);
        }
        if (settRes.status === 'fulfilled' && settRes.value.data) {
          setSettings(settRes.value.data);
          saveStoredSettings(settRes.value.data);
        }
        if (revRes.status === 'fulfilled' && revRes.value.data?.length) {
          setReviews(revRes.value.data);
          saveStoredReviews(revRes.value.data);
        }
      } catch {
        // Safe fallback to local cache
      }
    };

    syncOtherData();
  }, []);

  // Products CRUD with Supabase API integration
  const addProduct = async (product: Product) => {
    const updated = [product, ...allProducts];
    setAllProducts(updated);
    saveStoredProducts(updated);
    try {
      await api.createProduct(product);
      await refetchProducts();
    } catch (err) {
      console.error('Failed to create product in Supabase:', err);
    }
  };

  const updateProduct = async (product: Product) => {
    const updated = allProducts.map((p) => (p.id === product.id ? product : p));
    setAllProducts(updated);
    saveStoredProducts(updated);
    try {
      await api.updateProduct(product.id, product);
      await refetchProducts();
    } catch (err) {
      console.error('Failed to update product in Supabase:', err);
    }
  };

  const deleteProduct = async (productId: string) => {
    const updated = allProducts.filter((p) => p.id !== productId);
    setAllProducts(updated);
    saveStoredProducts(updated);
    try {
      await api.deleteProduct(productId);
      await refetchProducts();
    } catch (err) {
      console.error('Failed to delete product in Supabase:', err);
    }
  };

  const togglePublishProduct = async (productId: string, isPublished?: boolean) => {
    try {
      const res = await api.togglePublishProduct(productId, isPublished);
      if (res.success && res.data) {
        const updated = allProducts.map((p) => (p.id === productId ? res.data : p));
        setAllProducts(updated);
        saveStoredProducts(updated);
      }
    } catch (err) {
      console.error('Failed to toggle publication status:', err);
    }
  };

  const getProductBySlug = (slug: string) => {
    return allProducts.find((p) => p.slug === slug || p.id === slug);
  };

  // Orders
  const addOrder = async (order: Order) => {
    const updated = [order, ...orders];
    setOrders(updated);
    saveStoredOrders(updated);
    
    // Sync to backend API
    try {
      await api.createOrder(order);
    } catch (e) {
      console.warn('API order sync note:', e);
    }

    await syncOrderToSupabase(order);
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierPartner?: string
  ) => {
    const updated = orders.map((order) => {
      if (order.id === orderId || order.orderNumber === orderId) {
        const timeline = [
          ...order.statusTimeline,
          {
            status,
            timestamp: new Date().toISOString(),
            notes: `Order marked as ${status}` + (trackingNumber ? ` (Tracking: ${trackingNumber})` : '')
          }
        ];
        return {
          ...order,
          status,
          trackingNumber: trackingNumber ?? order.trackingNumber,
          courierPartner: courierPartner ?? order.courierPartner,
          statusTimeline: timeline
        };
      }
      return order;
    });
    setOrders(updated);
    saveStoredOrders(updated);

    // Sync to backend API
    try {
      api.updateOrderStatus(orderId, status, trackingNumber, courierPartner);
    } catch (e) {
      console.warn('API status update note:', e);
    }
  };

  const getOrderByIdOrNumber = (identifier: string) => {
    const clean = identifier.trim().toUpperCase();
    return orders.find(
      (o) => o.id.toUpperCase() === clean || o.orderNumber.toUpperCase() === clean
    );
  };

  // Coupons
  const addCoupon = (coupon: Coupon) => {
    const updated = [coupon, ...coupons];
    setCoupons(updated);
    saveStoredCoupons(updated);
  };

  const toggleCouponStatus = (code: string) => {
    const updated = coupons.map((c) =>
      c.code.toUpperCase() === code.toUpperCase() ? { ...c, isActive: !c.isActive } : c
    );
    setCoupons(updated);
    saveStoredCoupons(updated);
  };

  const deleteCoupon = (code: string) => {
    const updated = coupons.filter((c) => c.code.toUpperCase() !== code.toUpperCase());
    setCoupons(updated);
    saveStoredCoupons(updated);
  };

  const validateCoupon = (code: string, subtotal: number) => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code', discount: 0 };
    }
    if (!coupon.isActive) {
      return { valid: false, message: 'This coupon has expired or is inactive', discount: 0 };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`,
        discount: 0
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      discount,
      coupon
    };
  };

  // Settings
  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  // Reviews
  const addReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const created: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    };
    const updated = [created, ...reviews];
    setReviews(updated);
    saveStoredReviews(updated);
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        allProducts,
        isLoadingProducts,
        productError,
        refetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublishProduct,
        getProductBySlug,
        orders,
        addOrder,
        updateOrderStatus,
        getOrderByIdOrNumber,
        coupons,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        validateCoupon,
        settings,
        updateSettings,
        reviews,
        addReview,
        getProductReviews,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
