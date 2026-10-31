import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Truck, 
  IndianRupee, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Product, ProductVariant, Order, OrderStatus, Coupon, StoreSettings } from '../../types';
import { ProductImageManager } from '../../components/admin/ProductImageManager';

export const AdminDashboard: React.FC = () => {
  const { isAdmin, logoutAdmin } = useAuth();
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCouponStatus,
    deleteCoupon,
    settings,
    updateSettings
  } = useStore();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'settings'>('overview');

  // Product Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [courierInput, setCourierInput] = useState('Blue Dart');

  // Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState<number>(10);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(499);

  // Settings State
  const [storeSettingsForm, setStoreSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  // Product Form State
  const [pName, setPName] = useState('');
  const [pHindiName, setPHindiName] = useState('');
  const [pCategory, setPCategory] = useState<'petha' | 'namkeen' | 'gift-boxes'>('petha');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pIngredients, setPIngredients] = useState('');
  const [pShelfLife, setPShelfLife] = useState('15 Days');
  const [pStorage, setPStorage] = useState('Store in refrigeration once opened');
  const [pImagesList, setPImagesList] = useState<string[]>([]);
  const [pIsBestseller, setPIsBestseller] = useState(false);
  const [pVariants, setPVariants] = useState<ProductVariant[]>([
    { id: 'v1', weight: '500g', weightInGrams: 500, price: 200, mrp: 240, stock: 50, isDefault: true }
  ]);

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] bg-brand-ivory flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-brand-magenta mb-3" />
        <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">Access Restricted</h2>
        <p className="text-xs text-stone-500 mb-6">You must be logged in as an authorized store administrator.</p>
        <button
          onClick={() => navigate('/admin-login')}
          className="bg-brand-magenta text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-royal"
        >
          Go to Admin Login
        </button>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status !== 'Cancelled' ? ord.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => ['Pending', 'Confirmed', 'Processing'].includes(o.status)).length;
  const lowStockCount = products.filter((p) => p.variants.some((v) => v.stock <= 10)).length;

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPHindiName('');
    setPCategory('petha');
    setPShortDesc('');
    setPDesc('');
    setPIngredients('Winter Melon, Sugar, Saffron, Cardamom');
    setPShelfLife('15 Days');
    setPStorage('Refrigerate once opened');
    setPImagesList(['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80']);
    setPIsBestseller(false);
    setPVariants([
      { id: `var-${Date.now()}-1`, weight: '500g', weightInGrams: 500, price: 220, mrp: 260, stock: 40, isDefault: true }
    ]);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPHindiName(prod.hindiName || '');
    setPCategory(prod.category);
    setPShortDesc(prod.shortDescription);
    setPDesc(prod.description);
    setPIngredients(prod.ingredients.join(', '));
    setPShelfLife(prod.shelfLife);
    setPStorage(prod.storageInstructions);
    setPImagesList(prod.images && prod.images.length > 0 ? [...prod.images] : ['/brijwasi-logo.jpg']);
    setPIsBestseller(Boolean(prod.isBestseller));
    setPVariants([...prod.variants]);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const imagesList = pImagesList.filter(Boolean);

    const ingredientList = pIngredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: pName,
        hindiName: pHindiName,
        category: pCategory,
        shortDescription: pShortDesc,
        description: pDesc,
        ingredients: ingredientList,
        shelfLife: pShelfLife,
        storageInstructions: pStorage,
        images: imagesList.length > 0 ? imagesList : (editingProduct.images.length > 0 ? editingProduct.images : ['/brijwasi-logo.jpg']),
        isBestseller: pIsBestseller,
        variants: pVariants
      };
      updateProduct(updated);
    } else {
      const newSlug = pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const created: Product = {
        id: `prod-${Date.now()}`,
        slug: newSlug,
        name: pName,
        hindiName: pHindiName,
        category: pCategory,
        shortDescription: pShortDesc,
        description: pDesc,
        ingredients: ingredientList,
        shelfLife: pShelfLife,
        storageInstructions: pStorage,
        images: imagesList.length > 0 ? imagesList : ['https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'],
        isVegetarian: true,
        isBestseller: pIsBestseller,
        rating: 5.0,
        reviewCount: 1,
        variants: pVariants
      };
      addProduct(created);
    }
    setIsProductModalOpen(false);
  };

  const handleUpdateOrderStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, trackingNumberInput, courierInput);
    setSelectedOrder(null);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const newCoupon: Coupon = {
      code: newCouponCode.trim().toUpperCase(),
      description: newCouponDesc || `${newCouponValue}${newCouponType === 'percentage' ? '%' : '₹'} discount`,
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrderAmount: Number(newCouponMinOrder),
      isActive: true
    };
    addCoupon(newCoupon);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(storeSettingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="bg-brand-navy text-white px-6 py-3.5 border-b-2 border-brand-gold flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-white rounded-lg">
            <img src="/brijwasi-logo.jpg" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-brand-gold-light">
              Brijwasi Pethe Wale — Store Manager
            </h1>
            <span className="text-[10px] text-stone-300 font-mono">Agra Flagship Administration</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1 text-xs text-brand-gold-light hover:text-white px-3 py-1.5 rounded-lg border border-brand-gold/40 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              logoutAdmin();
              navigate('/');
            }}
            className="flex items-center gap-1 text-xs bg-red-800 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-stone-200 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'products'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'orders'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'coupons'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'settings'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings & Fees</span>
          </button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                    <span>Total Sales Revenue</span>
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-brand-navy">₹{totalRevenue}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">From customer orders</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                    <span>Total Orders</span>
                    <Package className="w-4 h-4 text-brand-magenta" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-brand-navy">{totalOrdersCount}</p>
                  <span className="text-[10px] text-stone-500">Live order database</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                    <span>Action Needed / Pending</span>
                    <Truck className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-amber-700">{pendingOrdersCount}</p>
                  <span className="text-[10px] text-amber-600 font-semibold">Awaiting packaging / dispatch</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                    <span>Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-red-600">{lowStockCount}</p>
                  <span className="text-[10px] text-red-500 font-semibold">Items with &le; 10 packs</span>
                </div>

              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-bold text-brand-navy">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-brand-magenta font-semibold hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 italic text-center">No orders placed yet. Place an order on the storefront to test!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b">
                        <tr>
                          <th className="p-3">Order #</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-stone-50">
                            <td className="p-3 font-mono font-bold text-brand-magenta">{ord.orderNumber}</td>
                            <td className="p-3 font-semibold text-stone-800">{ord.customer.fullName}</td>
                            <td className="p-3 font-bold text-stone-900">₹{ord.total}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-stone-100 font-medium">
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-3 text-stone-400">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 2. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl font-bold text-brand-navy">Product Catalog</h2>
                  <p className="text-xs text-stone-500">Add, edit, manage weight variants, prices and stock inventory.</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-brand-magenta hover:bg-brand-magenta-dark text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-royal flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b">
                      <tr>
                        <th className="p-3">Delicacy</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Variants & Prices</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Rating</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map((p) => {
                        const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
                        return (
                          <tr key={p.id} className="hover:bg-stone-50">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.name}
                                  className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                                />
                                <div>
                                  <p className="font-bold text-brand-navy">{p.name}</p>
                                  {p.hindiName && <span className="text-[10px] text-brand-gold-dark">{p.hindiName}</span>}
                                </div>
                              </div>
                            </td>
                            <td className="p-3 uppercase text-[10px] font-bold text-stone-600">
                              {p.category}
                            </td>
                            <td className="p-3">
                              <div className="space-y-0.5">
                                {p.variants.map((v) => (
                                  <span key={v.id} className="inline-block mr-2 text-[11px] bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">
                                    {v.weight}: <strong>₹{v.price}</strong>
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                                totalStock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700 font-bold'
                              }`}>
                                {totalStock} total packs
                              </span>
                            </td>
                            <td className="p-3 text-stone-700 font-semibold">
                              ★ {p.rating} ({p.reviewCount})
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-stone-600 hover:text-brand-magenta hover:bg-stone-100 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-navy">Customer Orders Management</h2>
                <p className="text-xs text-stone-500">Track shipments, update order statuses, and add courier tracking details.</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                  No customer orders found yet.
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b">
                        <tr>
                          <th className="p-3">Order Number</th>
                          <th className="p-3">Customer & Contact</th>
                          <th className="p-3">Address & City</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-stone-50">
                            <td className="p-3 font-mono font-bold text-brand-magenta">
                              {order.orderNumber}
                            </td>
                            <td className="p-3">
                              <p className="font-bold text-stone-800">{order.customer.fullName}</p>
                              <span className="text-stone-500 text-[11px] block">{order.customer.phone}</span>
                              <span className="text-stone-400 text-[10px] block">{order.customer.email}</span>
                            </td>
                            <td className="p-3 text-stone-600 max-w-xs">
                              {order.customer.addressLine1}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                            </td>
                            <td className="p-3">
                              <span className="font-bold">{order.items.length} items</span>
                            </td>
                            <td className="p-3 font-serif font-bold text-stone-900">
                              ₹{order.total}
                              <span className="block text-[10px] text-stone-400 font-sans font-normal">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'Cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.status}
                              </span>
                              {order.trackingNumber && (
                                <span className="block text-[10px] font-mono text-stone-500 mt-1">
                                  {order.courierPartner}: {order.trackingNumber}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setNewStatus(order.status);
                                  setTrackingNumberInput(order.trackingNumber || '');
                                  setCourierInput(order.courierPartner || 'Blue Dart');
                                }}
                                className="px-3 py-1.5 bg-brand-navy hover:bg-brand-magenta text-white font-semibold rounded-lg transition-colors text-[11px]"
                              >
                                Manage Status
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-navy">Promotional Discount Coupons</h2>
                <p className="text-xs text-stone-500">Create special discount codes for festivals, weddings, and first-time buyers.</p>
              </div>

              {/* Create Coupon Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <h3 className="font-serif text-sm font-bold text-brand-navy mb-3">Create New Coupon</h3>
                <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DIWALI25"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none uppercase font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Type</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Min Order Amount (₹)</label>
                    <input
                      type="number"
                      value={newCouponMinOrder}
                      onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-magenta hover:bg-brand-magenta-dark text-white font-bold rounded-lg shadow-xs transition-colors"
                    >
                      Add Coupon
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b">
                    <tr>
                      <th className="p-3">Code</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Min Order</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-brand-navy">{c.code}</td>
                        <td className="p-3 text-stone-600">{c.description}</td>
                        <td className="p-3 font-bold text-brand-magenta">
                          {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                        </td>
                        <td className="p-3 text-stone-700">₹{c.minOrderAmount}</td>
                        <td className="p-3">
                          <button
                            onClick={() => toggleCouponStatus(c.code)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {c.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteCoupon(c.code)}
                            className="p-1 text-stone-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-navy">Store Configuration</h2>
                <p className="text-xs text-stone-500">Configure shipping rules, announcement banner, contact info, and payment settings.</p>
              </div>

              {settingsSavedNotice && (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4" /> Store settings successfully saved!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
                
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Top Announcement Bar Text</label>
                  <input
                    type="text"
                    value={storeSettingsForm.announcementBar}
                    onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, announcementBar: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Standard Delivery Fee (₹)</label>
                    <input
                      type="number"
                      value={storeSettingsForm.standardShippingFee}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, standardShippingFee: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={storeSettingsForm.freeShippingThreshold}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={storeSettingsForm.phone}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, phone: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Customer Support Email</label>
                    <input
                      type="email"
                      value={storeSettingsForm.email}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, email: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Agra Store Address</label>
                  <input
                    type="text"
                    value={storeSettingsForm.address}
                    onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, address: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={storeSettingsForm.isCodEnabled}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, isCodEnabled: e.target.checked })}
                      className="accent-brand-magenta"
                    />
                    <span>Allow Cash on Delivery (COD) on checkout</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="py-3 px-6 bg-brand-navy hover:bg-brand-navy-light text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  Save Store Configurations
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-serif text-lg font-bold text-brand-navy">
                {editingProduct ? 'Edit Agra Delicacy' : 'Add New Agra Delicacy'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Saffron Angoori Petha"
                    className="w-full p-2.5 bg-stone-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hindi Name</label>
                  <input
                    type="text"
                    value={pHindiName}
                    onChange={(e) => setPHindiName(e.target.value)}
                    placeholder="e.g. केसर अंगूरी पेठा"
                    className="w-full p-2.5 bg-stone-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 border rounded-lg"
                  >
                    <option value="petha">Agra Petha</option>
                    <option value="namkeen">Agra Namkeen</option>
                    <option value="gift-boxes">Royal Gift Boxes</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={pIsBestseller}
                      onChange={(e) => setPIsBestseller(e.target.checked)}
                      className="accent-brand-magenta"
                    />
                    <span>Mark as Royal Bestseller</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={pShortDesc}
                  onChange={(e) => setPShortDesc(e.target.value)}
                  placeholder="One sentence summary"
                  className="w-full p-2.5 bg-stone-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={3}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Ingredients (comma separated)</label>
                  <input
                    type="text"
                    value={pIngredients}
                    onChange={(e) => setPIngredients(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Shelf Life</label>
                  <input
                    type="text"
                    value={pShelfLife}
                    onChange={(e) => setPShelfLife(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-sm text-brand-navy">
                  Product Gallery & Storage Management
                </label>
                <ProductImageManager
                  productId={editingProduct?.id}
                  images={pImagesList}
                  onChange={setPImagesList}
                />
              </div>

              {/* Variants Section */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-800 block mb-2">Weight Variants & Pricing</span>
                <div className="space-y-2">
                  {pVariants.map((v, i) => (
                    <div key={v.id} className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        placeholder="Weight (e.g. 500g)"
                        value={v.weight}
                        onChange={(e) => {
                          const updated = [...pVariants];
                          updated[i].weight = e.target.value;
                          setPVariants(updated);
                        }}
                        className="p-2 bg-white border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={v.price}
                        onChange={(e) => {
                          const updated = [...pVariants];
                          updated[i].price = Number(e.target.value);
                          setPVariants(updated);
                        }}
                        className="p-2 bg-white border rounded"
                      />
                      <input
                        type="number"
                        placeholder="MRP (₹)"
                        value={v.mrp}
                        onChange={(e) => {
                          const updated = [...pVariants];
                          updated[i].mrp = Number(e.target.value);
                          setPVariants(updated);
                        }}
                        className="p-2 bg-white border rounded"
                      />
                      <input
                        type="number"
                        placeholder="Stock Packs"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...pVariants];
                          updated[i].stock = Number(e.target.value);
                          setPVariants(updated);
                        }}
                        className="p-2 bg-white border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded-xl text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-magenta hover:bg-brand-magenta-dark text-white font-bold rounded-xl shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-serif text-base font-bold text-brand-navy">
                Update Status: #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Change Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 bg-stone-50 border rounded-lg font-bold"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing / Simmering</option>
                  <option value="Packed">Packed in Sealed Box</option>
                  <option value="Shipped">Shipped via Express Courier</option>
                  <option value="Delivered">Delivered Successfully</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  placeholder="e.g. Blue Dart, Delhivery, DTDC"
                  className="w-full p-2.5 bg-stone-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tracking Number / AWB</label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="e.g. BD78291024IN"
                  className="w-full p-2.5 bg-stone-50 border rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border rounded-xl text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-magenta text-white font-bold rounded-xl shadow-xs"
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
