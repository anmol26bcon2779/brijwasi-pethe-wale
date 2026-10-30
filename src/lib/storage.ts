import { Product, Order, Coupon, StoreSettings, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_REVIEWS } from './constants';
import { supabase, isSupabaseConfigured } from './supabase';

const PRODUCTS_KEY = 'bpw_products_v1';
const ORDERS_KEY = 'bpw_orders_v1';
const COUPONS_KEY = 'bpw_coupons_v1';
const SETTINGS_KEY = 'bpw_settings_v1';
const REVIEWS_KEY = 'bpw_reviews_v1';

export const getStoredProducts = (): Product[] => {
  try {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getStoredOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getStoredCoupons = (): Coupon[] => {
  try {
    const data = localStorage.getItem(COUPONS_KEY);
    if (!data) {
      localStorage.setItem(COUPONS_KEY, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_COUPONS;
  }
};

export const saveStoredCoupons = (coupons: Coupon[]) => {
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
};

export const getStoredSettings = (): StoreSettings => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_SETTINGS;
  }
};

export const saveStoredSettings = (settings: StoreSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getStoredReviews = (): Review[] => {
  try {
    const data = localStorage.getItem(REVIEWS_KEY);
    if (!data) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REVIEWS;
  }
};

export const saveStoredReviews = (reviews: Review[]) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
};

// Supabase synchronization helpers
export async function syncOrderToSupabase(order: Order) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error: orderError } = await supabase.from('orders').insert([
      {
        id: order.id,
        order_number: order.orderNumber,
        customer_name: order.customer.fullName,
        customer_email: order.customer.email,
        customer_phone: order.customer.phone,
        shipping_address: order.customer,
        subtotal: order.subtotal,
        discount: order.discount,
        shipping_fee: order.shippingFee,
        total: order.total,
        status: order.status,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        razorpay_payment_id: order.razorpayPaymentId,
        coupon_applied: order.couponCode,
        tracking_number: order.trackingNumber,
        courier_partner: order.courierPartner,
        created_at: order.createdAt,
      }
    ]);
    if (orderError) {
      console.warn('Supabase sync order error:', orderError);
    }
  } catch (err) {
    console.warn('Failed to sync to Supabase:', err);
  }
}
