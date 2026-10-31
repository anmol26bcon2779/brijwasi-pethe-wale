import { Product, Order, Coupon, StoreSettings, Review, OrderStatus } from '../types';

const API_BASE = 
  import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/api' : 'http://localhost:5000/api');

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const adminToken = typeof window !== 'undefined' ? (localStorage.getItem('bpw_admin_token') || 'brijwasi@admin') : '';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || 'API Request failed');
  }
  return data;
}

export const api = {
  // Health
  checkHealth: () => fetchJson<{ status: string }>('/health'),

  // Products
  getProducts: (params?: { category?: string; search?: string; sort?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return fetchJson<{ success: boolean; data: Product[] }>(`/products${query ? `?${query}` : ''}`);
  },
  getProduct: (slugOrId: string) => fetchJson<{ success: boolean; data: Product }>(`/products/${slugOrId}`),
  createProduct: (product: Partial<Product>) => fetchJson<{ success: boolean; data: Product }>('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  updateProduct: (id: string, product: Partial<Product>) => fetchJson<{ success: boolean; data: Product }>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  deleteProduct: (id: string) => fetchJson<{ success: boolean; message: string }>(`/products/${id}`, {
    method: 'DELETE'
  }),
  updateProductImages: (id: string, images: string[]) => fetchJson<{ success: boolean; data: Product; message: string }>(`/products/${id}/images`, {
    method: 'PATCH',
    body: JSON.stringify({ images })
  }),

  // Product Image Management & Supabase Storage
  uploadProductImages: (payload: {
    files: Array<{ name: string; type: string; base64: string }>;
    productId?: string;
    updateProduct?: boolean;
    replace?: boolean;
  }) => fetchJson<{
    success: boolean;
    message: string;
    urls: string[];
    data: Array<{ filename: string; url: string; size: number }>;
  }>('/upload/product-images', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  deleteProductImage: (url: string, productId?: string) => fetchJson<{ success: boolean; message: string }>('/upload/delete-image', {
    method: 'POST',
    body: JSON.stringify({ url, productId })
  }),

  // Orders
  getOrders: (status?: string) => fetchJson<{ success: boolean; data: Order[] }>(`/orders${status ? `?status=${status}` : ''}`),
  getOrder: (identifier: string) => fetchJson<{ success: boolean; data: Order }>(`/orders/${identifier}`),
  createOrder: (orderData: any) => fetchJson<{ success: boolean; data: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
  updateOrderStatus: (
    identifier: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierPartner?: string
  ) => fetchJson<{ success: boolean; data: Order }>(`/orders/${identifier}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, trackingNumber, courierPartner })
  }),

  // Coupons
  getCoupons: () => fetchJson<{ success: boolean; data: Coupon[] }>('/coupons'),
  validateCoupon: (code: string, subtotal: number) => fetchJson<{ success: boolean; valid: boolean; discount: number; message: string; coupon?: Coupon }>('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  }),
  createCoupon: (coupon: Partial<Coupon>) => fetchJson<{ success: boolean; data: Coupon }>('/coupons', {
    method: 'POST',
    body: JSON.stringify(coupon)
  }),
  toggleCoupon: (code: string) => fetchJson<{ success: boolean; data: Coupon }>(`/coupons/${code}/toggle`, {
    method: 'PATCH'
  }),
  deleteCoupon: (code: string) => fetchJson<{ success: boolean; message: string }>(`/coupons/${code}`, {
    method: 'DELETE'
  }),

  // Reviews
  getReviews: (productId?: string) => fetchJson<{ success: boolean; data: Review[] }>(`/reviews${productId ? `?productId=${productId}` : ''}`),
  createReview: (review: Partial<Review>) => fetchJson<{ success: boolean; data: Review }>('/reviews', {
    method: 'POST',
    body: JSON.stringify(review)
  }),

  // Settings
  getSettings: () => fetchJson<{ success: boolean; data: StoreSettings }>('/settings'),
  updateSettings: (settings: Partial<StoreSettings>) => fetchJson<{ success: boolean; data: StoreSettings }>('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  }),

  // Payment
  createRazorpayOrder: (amount: number, receipt?: string) => fetchJson<{
    success: boolean;
    orderId: string;
    amount: number;
    currency: string;
    keyId?: string;
  }>('/payment/razorpay/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount, receipt })
  }),
  verifyRazorpayPayment: (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
  }) => fetchJson<{ success: boolean; verified: boolean }>('/payment/razorpay/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
