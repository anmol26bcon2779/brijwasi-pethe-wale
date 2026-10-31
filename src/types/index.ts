export type CategorySlug = 'all' | 'petha' | 'namkeen' | 'gift-boxes' | 'premium';

export interface ProductVariant {
  id: string;
  weight: string; // e.g. "250g", "500g", "1kg"
  weightInGrams: number;
  price: number;
  mrp: number;
  stock: number;
  sku?: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  hindiName?: string;
  category: 'petha' | 'namkeen' | 'gift-boxes';
  subCategory?: string; // 'traditional', 'flavoured', 'premium', 'dry', 'syrup'
  shortDescription: string;
  description: string;
  ingredients: string[];
  shelfLife: string;
  storageInstructions: string;
  allergenInfo?: string;
  isVegetarian: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  isAvailable?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  variants: ProductVariant[];
  nutritionalInfo?: {
    calories?: string;
    carbohydrates?: string;
    protein?: string;
    fat?: string;
  };
}

export interface CartItem {
  id: string; // combination of productId_variantId
  product: Product;
  selectedVariant: ProductVariant;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'COD' | 'Razorpay' | 'Card' | 'UPI';

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  weight: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customer: ShippingAddress;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  razorpayPaymentId?: string;
  trackingNumber?: string;
  courierPartner?: string;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    notes?: string;
  }[];
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerCity?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  announcementBar: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  standardShippingFee: number;
  freeShippingThreshold: number;
  isCodEnabled: boolean;
  codFee: number;
  razorpayKeyId?: string;
}
