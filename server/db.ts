import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_REVIEWS } from '../src/lib/constants.js';
import { Product, Order, Coupon, StoreSettings, Review } from '../src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Supabase Connection if available
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-url'))
  ? createClient(supabaseUrl, supabaseKey)
  : null;

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  reviews: Review[];
}

const defaultData: DatabaseSchema = {
  products: INITIAL_PRODUCTS,
  orders: [],
  coupons: INITIAL_COUPONS,
  settings: INITIAL_SETTINGS,
  reviews: INITIAL_REVIEWS
};

// Initialize DB file
function initDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading db.json, resetting to defaults:', err);
    return defaultData;
  }
}

let dbState = initDatabase();

function persistDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// Database helper methods
export const db = {
  // Products
  getProducts: () => dbState.products,
  getProductBySlugOrId: (identifier: string) => {
    return dbState.products.find(p => p.slug === identifier || p.id === identifier);
  },
  addProduct: (product: Product) => {
    dbState.products.unshift(product);
    persistDatabase();
    return product;
  },
  updateProduct: (product: Product) => {
    dbState.products = dbState.products.map(p => p.id === product.id ? product : p);
    persistDatabase();
    return product;
  },
  deleteProduct: (id: string) => {
    dbState.products = dbState.products.filter(p => p.id !== id);
    persistDatabase();
  },

  // Orders
  getOrders: () => dbState.orders,
  getOrderByIdOrNumber: (identifier: string) => {
    const clean = identifier.trim().toUpperCase();
    return dbState.orders.find(o => o.id.toUpperCase() === clean || o.orderNumber.toUpperCase() === clean);
  },
  addOrder: (order: Order) => {
    dbState.orders.unshift(order);
    // Deduct stock for ordered items
    for (const item of order.items) {
      const prod = dbState.products.find(p => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find(v => v.id === item.variantId || v.weight === item.weight);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }
    persistDatabase();
    return order;
  },
  updateOrderStatus: (
    idOrNumber: string,
    status: Order['status'],
    trackingNumber?: string,
    courierPartner?: string
  ) => {
    const order = db.getOrderByIdOrNumber(idOrNumber);
    if (!order) return null;
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierPartner) order.courierPartner = courierPartner;
    order.statusTimeline.push({
      status,
      timestamp: new Date().toISOString(),
      notes: `Order status updated to ${status}${trackingNumber ? ` via ${courierPartner || 'Courier'} (${trackingNumber})` : ''}`
    });
    persistDatabase();
    return order;
  },

  // Coupons
  getCoupons: () => dbState.coupons,
  getCouponByCode: (code: string) => {
    return dbState.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  },
  addCoupon: (coupon: Coupon) => {
    dbState.coupons.unshift(coupon);
    persistDatabase();
    return coupon;
  },
  toggleCouponStatus: (code: string) => {
    const coupon = db.getCouponByCode(code);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      persistDatabase();
      return coupon;
    }
    return null;
  },
  deleteCoupon: (code: string) => {
    dbState.coupons = dbState.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    persistDatabase();
  },

  // Reviews
  getReviews: (productId?: string) => {
    if (productId) {
      return dbState.reviews.filter(r => r.productId === productId);
    }
    return dbState.reviews;
  },
  addReview: (review: Review) => {
    dbState.reviews.unshift(review);
    persistDatabase();
    return review;
  },

  // Settings
  getSettings: () => dbState.settings,
  updateSettings: (newSettings: StoreSettings) => {
    dbState.settings = { ...dbState.settings, ...newSettings };
    persistDatabase();
    return dbState.settings;
  }
};
