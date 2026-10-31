import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SETTINGS, INITIAL_REVIEWS } from '../src/lib/constants.js';
import { Product, ProductVariant, Order, OrderItem, Coupon, StoreSettings, Review, OrderStatus } from '../src/types/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'db.json');

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-supabase-url'))
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })
  : null;

if (supabase) {
  console.log(`[Database] Connected to Supabase at ${supabaseUrl} using ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role key (Admin)' : 'anon key'}`);
} else {
  console.log('[Database] Supabase credentials not found or unconfigured. Operating on fallback local JSON datastore.');
}

// Fallback Local Storage
interface LocalDatabaseSchema {
  products: Product[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  reviews: Review[];
}

const defaultData: LocalDatabaseSchema = {
  products: INITIAL_PRODUCTS,
  orders: [],
  coupons: INITIAL_COUPONS,
  settings: INITIAL_SETTINGS,
  reviews: INITIAL_REVIEWS
};

function initLocalDatabase(): LocalDatabaseSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading fallback db.json, using defaults:', err);
    return defaultData;
  }
}

let localDbState = initLocalDatabase();

function persistLocalDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localDbState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local db.json:', err);
  }
}

// Helper: Convert Postgres snake_case product row to TypeScript Product
function formatProduct(row: any, variants: any[] = []): Product {
  const mappedVariants: ProductVariant[] = (variants || []).map((v: any) => ({
    id: v.id,
    weight: v.weight,
    weightInGrams: Number(v.weight_in_grams || 0),
    price: Number(v.price),
    mrp: Number(v.mrp),
    stock: Number(v.stock),
    sku: v.sku || undefined,
    isDefault: Boolean(v.is_default)
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    hindiName: row.hindi_name || undefined,
    category: row.category,
    subCategory: row.sub_category || undefined,
    shortDescription: row.short_description || '',
    description: row.description || '',
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    shelfLife: row.shelf_life || '15 Days',
    storageInstructions: row.storage_instructions || 'Store in refrigeration',
    allergenInfo: row.allergen_info || undefined,
    isVegetarian: Boolean(row.is_vegetarian),
    isBestseller: Boolean(row.is_bestseller),
    isFeatured: Boolean(row.is_featured),
    isPublished: row.is_published !== undefined ? Boolean(row.is_published) : true,
    isAvailable: row.is_available !== undefined ? Boolean(row.is_available) : true,
    tags: Array.isArray(row.tags) ? row.tags : [],
    rating: Number(row.rating || 4.9),
    reviewCount: Number(row.review_count || 0),
    images: Array.isArray(row.images) ? row.images : [],
    variants: mappedVariants,
    nutritionalInfo: row.nutritional_info || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

// Helper: Convert Postgres snake_case order row to TypeScript Order
function formatOrder(row: any, items: any[] = []): Order {
  const mappedItems: OrderItem[] = (items || []).map((item: any) => ({
    productId: item.product_id,
    variantId: item.variant_id || 'v1',
    productName: item.product_name,
    weight: item.weight,
    price: Number(item.unit_price),
    quantity: Number(item.quantity),
    total: Number(item.total_price),
    image: item.image_url || '/brijwasi-logo.jpg'
  }));

  const customerObj = typeof row.shipping_address === 'string'
    ? JSON.parse(row.shipping_address)
    : (row.shipping_address || {
        fullName: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email || '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: ''
      });

  const timeline = Array.isArray(row.status_timeline)
    ? row.status_timeline
    : (typeof row.status_timeline === 'string' ? JSON.parse(row.status_timeline) : []);

  return {
    id: row.id,
    orderNumber: row.order_number,
    items: mappedItems,
    customer: customerObj,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    total: Number(row.total),
    couponCode: row.coupon_applied || undefined,
    status: row.status as OrderStatus,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    razorpayPaymentId: row.razorpay_payment_id || undefined,
    trackingNumber: row.tracking_number || undefined,
    courierPartner: row.courier_partner || undefined,
    statusTimeline: timeline,
    createdAt: row.created_at || new Date().toISOString()
  };
}

// Async Database Interface
export const db = {
  // ==========================================
  // SEED INITIAL DATA (Auto-populates empty Supabase)
  // ==========================================
  seedInitialData: async (): Promise<{ success: boolean; productsMigrated: number; variantsMigrated: number; message?: string }> => {
    if (!supabase) {
      return {
        success: false,
        productsMigrated: 0,
        variantsMigrated: 0,
        message: 'Supabase client is not connected. Please verify environment variables.'
      };
    }
    try {
      console.log('[Supabase] Auto-seeding initial store data to Supabase...');

      // 1. Seed store settings
      await supabase.from('store_settings').upsert({
        id: 1,
        store_name: INITIAL_SETTINGS.storeName,
        tagline: INITIAL_SETTINGS.tagline,
        announcement_bar: INITIAL_SETTINGS.announcementBar,
        phone: INITIAL_SETTINGS.phone,
        whatsapp: INITIAL_SETTINGS.whatsapp,
        email: INITIAL_SETTINGS.email,
        address: INITIAL_SETTINGS.address,
        city: INITIAL_SETTINGS.city,
        state: INITIAL_SETTINGS.state,
        pincode: INITIAL_SETTINGS.pincode,
        standard_shipping_fee: INITIAL_SETTINGS.standardShippingFee,
        free_shipping_threshold: INITIAL_SETTINGS.freeShippingThreshold,
        is_cod_enabled: INITIAL_SETTINGS.isCodEnabled,
        cod_fee: INITIAL_SETTINGS.codFee
      }, { onConflict: 'id' });

      // 2. Seed initial coupons
      for (const coupon of INITIAL_COUPONS) {
        await supabase.from('coupons').upsert({
          code: coupon.code,
          description: coupon.description,
          discount_type: coupon.discountType,
          discount_value: coupon.discountValue,
          min_order_amount: coupon.minOrderAmount,
          max_discount: coupon.maxDiscount || null,
          is_active: coupon.isActive
        }, { onConflict: 'code' });
      }

      // 3. Seed initial products & variants
      let prodCount = 0;
      let varCount = 0;
      for (const prod of INITIAL_PRODUCTS) {
        const { error: pErr } = await supabase.from('products').upsert({
          id: prod.id,
          slug: prod.slug,
          name: prod.name,
          hindi_name: prod.hindiName || null,
          category: prod.category,
          sub_category: prod.subCategory || null,
          short_description: prod.shortDescription,
          description: prod.description,
          ingredients: prod.ingredients,
          shelf_life: prod.shelfLife,
          storage_instructions: prod.storageInstructions,
          allergen_info: prod.allergenInfo || null,
          is_vegetarian: prod.isVegetarian,
          is_bestseller: prod.isBestseller || false,
          is_featured: prod.isFeatured || false,
          rating: prod.rating,
          review_count: prod.reviewCount,
          images: prod.images,
          nutritional_info: prod.nutritionalInfo || {}
        }, { onConflict: 'id' });

        if (!pErr) {
          prodCount++;
        }

        if (prod.variants && prod.variants.length > 0) {
          const variantsToInsert = prod.variants.map(v => ({
            id: v.id,
            product_id: prod.id,
            weight: v.weight,
            weight_in_grams: v.weightInGrams,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock,
            sku: v.sku || null,
            is_default: Boolean(v.isDefault)
          }));
          const { error: vErr } = await supabase.from('product_variants').upsert(variantsToInsert, { onConflict: 'id' });
          if (!vErr) {
            varCount += prod.variants.length;
          }
        }
      }
      console.log(`[Supabase] Seeded ${prodCount} products and ${varCount} variants to Supabase!`);
      return {
        success: true,
        productsMigrated: prodCount,
        variantsMigrated: varCount,
        message: `Successfully migrated ${prodCount} products and ${varCount} variants into Supabase.`
      };
    } catch (err: any) {
      console.error('[Supabase] Error during initial data seed:', err);
      return {
        success: false,
        productsMigrated: 0,
        variantsMigrated: 0,
        message: err.message
      };
    }
  },

  // ==========================================
  // PRODUCTS
  // ==========================================
  getProducts: async (): Promise<Product[]> => {
    if (supabase) {
      try {
        const { data: prods, error: prodErr } = await supabase
          .from('products')
          .select('*, product_variants(*)')
          .order('created_at', { ascending: false });

        if (!prodErr && prods && prods.length > 0) {
          return prods.map(p => formatProduct(p, p.product_variants));
        }

        // If table exists but has 0 rows, auto-seed and return
        if (!prodErr && prods && prods.length === 0) {
          await db.seedInitialData();
          const { data: seededProds } = await supabase
            .from('products')
            .select('*, product_variants(*)')
            .order('created_at', { ascending: false });
          if (seededProds && seededProds.length > 0) {
            return seededProds.map(p => formatProduct(p, p.product_variants));
          }
        }
      } catch (err) {
        console.error('[Supabase] Failed to fetch products, falling back to local data:', err);
      }
    }
    return localDbState.products;
  },

  getProductBySlugOrId: async (identifier: string): Promise<Product | null> => {
    if (supabase) {
      try {
        const query = supabase
          .from('products')
          .select('*, product_variants(*)')
          .or(`slug.eq.${identifier},id.eq.${identifier}`)
          .limit(1)
          .maybeSingle();

        const { data, error } = await query;
        if (!error && data) {
          return formatProduct(data, data.product_variants);
        }
      } catch (err) {
        console.error('[Supabase] Failed to get product by slug/id, falling back:', err);
      }
    }

    const localProd = localDbState.products.find(p => p.slug === identifier || p.id === identifier);
    return localProd || null;
  },

  addProduct: async (product: Product): Promise<Product> => {
    if (supabase) {
      try {
        const { error: prodErr } = await supabase
          .from('products')
          .insert({
            id: product.id,
            slug: product.slug,
            name: product.name,
            hindi_name: product.hindiName || null,
            category: product.category,
            sub_category: product.subCategory || null,
            short_description: product.shortDescription,
            description: product.description,
            ingredients: product.ingredients,
            shelf_life: product.shelfLife,
            storage_instructions: product.storageInstructions,
            allergen_info: product.allergenInfo || null,
            is_vegetarian: product.isVegetarian,
            is_bestseller: product.isBestseller,
            is_featured: product.isFeatured,
            is_published: product.isPublished !== undefined ? product.isPublished : true,
            is_available: product.isAvailable !== undefined ? product.isAvailable : true,
            tags: product.tags || [],
            rating: product.rating,
            review_count: product.reviewCount,
            images: product.images,
            nutritional_info: product.nutritionalInfo || {}
          });

        if (prodErr) throw prodErr;

        if (product.variants && product.variants.length > 0) {
          const variantsToInsert = product.variants.map(v => ({
            id: v.id,
            product_id: product.id,
            weight: v.weight,
            weight_in_grams: v.weightInGrams,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock,
            sku: v.sku || null,
            is_default: Boolean(v.isDefault)
          }));

          await supabase.from('product_variants').insert(variantsToInsert);
        }

        localDbState.products.unshift(product);
        persistLocalDatabase();
        return product;
      } catch (err) {
        console.error('[Supabase] addProduct failed, saving locally:', err);
      }
    }

    localDbState.products.unshift(product);
    persistLocalDatabase();
    return product;
  },

  updateProduct: async (product: Product): Promise<Product> => {
    if (supabase) {
      try {
        await supabase
          .from('products')
          .update({
            name: product.name,
            hindi_name: product.hindiName || null,
            category: product.category,
            sub_category: product.subCategory || null,
            short_description: product.shortDescription,
            description: product.description,
            ingredients: product.ingredients,
            shelf_life: product.shelfLife,
            storage_instructions: product.storageInstructions,
            allergen_info: product.allergenInfo || null,
            is_vegetarian: product.isVegetarian,
            is_bestseller: product.isBestseller,
            is_featured: product.isFeatured,
            is_published: product.isPublished !== undefined ? product.isPublished : true,
            is_available: product.isAvailable !== undefined ? product.isAvailable : true,
            tags: product.tags || [],
            images: product.images,
            updated_at: new Date().toISOString()
          })
          .eq('id', product.id);

        if (product.variants) {
          for (const v of product.variants) {
            await supabase
              .from('product_variants')
              .upsert({
                id: v.id,
                product_id: product.id,
                weight: v.weight,
                weight_in_grams: v.weightInGrams,
                price: v.price,
                mrp: v.mrp,
                stock: v.stock,
                sku: v.sku || null,
                is_default: Boolean(v.isDefault)
              });
          }
        }
      } catch (err) {
        console.error('[Supabase] updateProduct error:', err);
      }
    }

    localDbState.products = localDbState.products.map(p => p.id === product.id ? product : p);
    persistLocalDatabase();
    return product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.error('[Supabase] deleteProduct error:', err);
      }
    }
    localDbState.products = localDbState.products.filter(p => p.id !== id);
    persistLocalDatabase();
  },

  // ==========================================
  // ORDERS
  // ==========================================
  getOrders: async (status?: string): Promise<Order[]> => {
    if (supabase) {
      try {
        let query = supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (status) {
          query = query.eq('status', status);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map(o => formatOrder(o, o.order_items));
        }
      } catch (err) {
        console.error('[Supabase] getOrders error:', err);
      }
    }

    let orders = localDbState.orders;
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    return orders;
  },

  getOrderByIdOrNumber: async (identifier: string): Promise<Order | null> => {
    if (supabase) {
      try {
        const clean = identifier.trim().toUpperCase();
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .or(`order_number.ilike.${clean},id.eq.${identifier}`)
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return formatOrder(data, data.order_items);
        }
      } catch (err) {
        console.error('[Supabase] getOrderByIdOrNumber error:', err);
      }
    }

    const clean = identifier.trim().toUpperCase();
    const found = localDbState.orders.find(o => o.id.toUpperCase() === clean || o.orderNumber.toUpperCase() === clean);
    return found || null;
  },

  addOrder: async (order: Order): Promise<Order> => {
    if (supabase) {
      try {
        // Find or create customer
        let customerId: string | null = null;
        if (order.customer.phone) {
          const { data: existingCust } = await supabase
            .from('customers')
            .select('id')
            .eq('phone', order.customer.phone)
            .maybeSingle();

          if (existingCust) {
            customerId = existingCust.id;
          } else {
            const { data: newCust } = await supabase
              .from('customers')
              .insert({
                full_name: order.customer.fullName,
                phone: order.customer.phone,
                email: order.customer.email || null,
                role: 'customer'
              })
              .select('id')
              .maybeSingle();
            if (newCust) customerId = newCust.id;
          }
        }

        // 1. Insert order record
        const { error: orderErr } = await supabase
          .from('orders')
          .insert({
            id: order.id,
            order_number: order.orderNumber,
            customer_id: customerId,
            customer_name: order.customer.fullName,
            customer_email: order.customer.email,
            customer_phone: order.customer.phone,
            shipping_address: order.customer,
            subtotal: order.subtotal,
            discount: order.discount,
            shipping_fee: order.shippingFee,
            total: order.total,
            coupon_applied: order.couponCode || null,
            status: order.status,
            payment_method: order.paymentMethod,
            payment_status: order.paymentStatus,
            razorpay_payment_id: order.razorpayPaymentId || null,
            tracking_number: order.trackingNumber || null,
            courier_partner: order.courierPartner || null,
            status_timeline: order.statusTimeline,
            created_at: order.createdAt
          });

        if (orderErr) throw orderErr;

        // 2. Insert order items
        if (order.items && order.items.length > 0) {
          const itemsToInsert = order.items.map(item => ({
            id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            order_id: order.id,
            product_id: item.productId,
            variant_id: item.variantId,
            product_name: item.productName,
            weight: item.weight,
            unit_price: item.price,
            quantity: item.quantity,
            total_price: item.total,
            image_url: item.image
          }));

          await supabase.from('order_items').insert(itemsToInsert);
        }

        // 3. Deduct stock from product_variants in Supabase
        for (const item of order.items) {
          const { data: variant } = await supabase
            .from('product_variants')
            .select('stock')
            .eq('id', item.variantId)
            .maybeSingle();

          if (variant) {
            const newStock = Math.max(0, variant.stock - item.quantity);
            await supabase
              .from('product_variants')
              .update({ stock: newStock })
              .eq('id', item.variantId);
          }
        }

        // 4. Increment coupon usage
        if (order.couponCode) {
          const { data: c } = await supabase
            .from('coupons')
            .select('usage_count')
            .eq('code', order.couponCode)
            .maybeSingle();

          if (c) {
            await supabase
              .from('coupons')
              .update({ usage_count: (c.usage_count || 0) + 1 })
              .eq('code', order.couponCode);
          }
        }
      } catch (err) {
        console.error('[Supabase] addOrder error, ensuring local persistence:', err);
      }
    }

    // Always update local cache & deduct stock
    localDbState.orders.unshift(order);
    for (const item of order.items) {
      const prod = localDbState.products.find(p => p.id === item.productId);
      if (prod) {
        const variant = prod.variants.find(v => v.id === item.variantId || v.weight === item.weight);
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
        }
      }
    }
    persistLocalDatabase();
    return order;
  },

  updateOrderStatus: async (
    idOrNumber: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierPartner?: string
  ): Promise<Order | null> => {
    const existing = await db.getOrderByIdOrNumber(idOrNumber);
    if (!existing) return null;

    const newTimeline = [
      ...existing.statusTimeline,
      {
        status,
        timestamp: new Date().toISOString(),
        notes: `Order status updated to ${status}${trackingNumber ? ` via ${courierPartner || 'Courier'} (${trackingNumber})` : ''}`
      }
    ];

    if (supabase) {
      try {
        await supabase
          .from('orders')
          .update({
            status,
            tracking_number: trackingNumber || existing.trackingNumber || null,
            courier_partner: courierPartner || existing.courierPartner || null,
            status_timeline: newTimeline,
            updated_at: new Date().toISOString()
          })
          .or(`order_number.ilike.${idOrNumber},id.eq.${idOrNumber}`);
      } catch (err) {
        console.error('[Supabase] updateOrderStatus error:', err);
      }
    }

    existing.status = status;
    if (trackingNumber) existing.trackingNumber = trackingNumber;
    if (courierPartner) existing.courierPartner = courierPartner;
    existing.statusTimeline = newTimeline;
    persistLocalDatabase();
    return existing;
  },

  // ==========================================
  // COUPONS
  // ==========================================
  getCoupons: async (): Promise<Coupon[]> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(c => ({
            code: c.code,
            description: c.description,
            discountType: c.discount_type as 'percentage' | 'fixed',
            discountValue: Number(c.discount_value),
            minOrderAmount: Number(c.min_order_amount || 0),
            maxDiscount: c.max_discount ? Number(c.max_discount) : undefined,
            isActive: Boolean(c.is_active),
            expiryDate: c.expires_at || undefined
          }));
        }
      } catch (err) {
        console.error('[Supabase] getCoupons error:', err);
      }
    }
    return localDbState.coupons;
  },

  getCouponByCode: async (code: string): Promise<Coupon | null> => {
    const clean = code.trim().toUpperCase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .ilike('code', clean)
          .maybeSingle();

        if (!error && data) {
          return {
            code: data.code,
            description: data.description,
            discountType: data.discount_type as 'percentage' | 'fixed',
            discountValue: Number(data.discount_value),
            minOrderAmount: Number(data.min_order_amount || 0),
            maxDiscount: data.max_discount ? Number(data.max_discount) : undefined,
            isActive: Boolean(data.is_active),
            expiryDate: data.expires_at || undefined
          };
        }
      } catch (err) {
        console.error('[Supabase] getCouponByCode error:', err);
      }
    }

    const found = localDbState.coupons.find(c => c.code.toUpperCase() === clean);
    return found || null;
  },

  addCoupon: async (coupon: Coupon): Promise<Coupon> => {
    if (supabase) {
      try {
        await supabase.from('coupons').insert({
          code: coupon.code.toUpperCase(),
          description: coupon.description,
          discount_type: coupon.discountType,
          discount_value: coupon.discountValue,
          min_order_amount: coupon.minOrderAmount,
          max_discount: coupon.maxDiscount || null,
          is_active: coupon.isActive,
          expires_at: coupon.expiryDate || null
        });
      } catch (err) {
        console.error('[Supabase] addCoupon error:', err);
      }
    }
    localDbState.coupons.unshift(coupon);
    persistLocalDatabase();
    return coupon;
  },

  toggleCouponStatus: async (code: string): Promise<Coupon | null> => {
    const existing = await db.getCouponByCode(code);
    if (!existing) return null;

    const newStatus = !existing.isActive;
    if (supabase) {
      try {
        await supabase
          .from('coupons')
          .update({ is_active: newStatus })
          .ilike('code', code.trim());
      } catch (err) {
        console.error('[Supabase] toggleCouponStatus error:', err);
      }
    }

    existing.isActive = newStatus;
    persistLocalDatabase();
    return existing;
  },

  deleteCoupon: async (code: string): Promise<void> => {
    if (supabase) {
      try {
        await supabase.from('coupons').delete().ilike('code', code.trim());
      } catch (err) {
        console.error('[Supabase] deleteCoupon error:', err);
      }
    }
    localDbState.coupons = localDbState.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    persistLocalDatabase();
  },

  // ==========================================
  // STORE SETTINGS
  // ==========================================
  getSettings: async (): Promise<StoreSettings> => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (!error && data) {
          return {
            storeName: data.store_name,
            tagline: data.tagline,
            announcementBar: data.announcement_bar,
            phone: data.phone,
            whatsapp: data.whatsapp || data.phone,
            email: data.email,
            address: data.address,
            city: data.city || 'Agra',
            state: data.state || 'Uttar Pradesh',
            pincode: data.pincode || '282001',
            standardShippingFee: Number(data.standard_shipping_fee || 80),
            freeShippingThreshold: Number(data.free_shipping_threshold || 799),
            isCodEnabled: Boolean(data.is_cod_enabled),
            codFee: Number(data.cod_fee || 40),
            razorpayKeyId: data.razorpay_key_id || undefined
          };
        }
      } catch (err) {
        console.error('[Supabase] getSettings error:', err);
      }
    }
    return localDbState.settings;
  },

  updateSettings: async (newSettings: StoreSettings): Promise<StoreSettings> => {
    if (supabase) {
      try {
        await supabase
          .from('store_settings')
          .upsert({
            id: 1,
            store_name: newSettings.storeName,
            tagline: newSettings.tagline,
            announcement_bar: newSettings.announcementBar,
            phone: newSettings.phone,
            whatsapp: newSettings.whatsapp,
            email: newSettings.email,
            address: newSettings.address,
            city: newSettings.city,
            state: newSettings.state,
            pincode: newSettings.pincode,
            standard_shipping_fee: newSettings.standardShippingFee,
            free_shipping_threshold: newSettings.freeShippingThreshold,
            is_cod_enabled: newSettings.isCodEnabled,
            cod_fee: newSettings.codFee,
            razorpay_key_id: newSettings.razorpayKeyId || null,
            updated_at: new Date().toISOString()
          });
      } catch (err) {
        console.error('[Supabase] updateSettings error:', err);
      }
    }

    localDbState.settings = { ...localDbState.settings, ...newSettings };
    persistLocalDatabase();
    return localDbState.settings;
  },

  // ==========================================
  // REVIEWS
  // ==========================================
  getReviews: async (productId?: string): Promise<Review[]> => {
    if (supabase) {
      try {
        let query = supabase
          .from('reviews')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (productId) {
          query = query.eq('product_id', productId);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(r => ({
            id: r.id,
            productId: r.product_id,
            productName: r.product_name,
            customerName: r.customer_name,
            customerCity: r.customer_city || undefined,
            rating: Number(r.rating),
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
            verifiedPurchase: Boolean(r.verified_purchase)
          }));
        }
      } catch (err) {
        console.error('[Supabase] getReviews error:', err);
      }
    }

    if (productId) {
      return localDbState.reviews.filter(r => r.productId === productId);
    }
    return localDbState.reviews;
  },

  addReview: async (review: Review): Promise<Review> => {
    if (supabase) {
      try {
        await supabase.from('reviews').insert({
          id: review.id,
          product_id: review.productId,
          product_name: review.productName,
          customer_name: review.customerName,
          customer_city: review.customerCity || null,
          rating: review.rating,
          comment: review.comment,
          verified_purchase: review.verifiedPurchase,
          is_approved: true
        });
      } catch (err) {
        console.error('[Supabase] addReview error:', err);
      }
    }

    localDbState.reviews.unshift(review);
    persistLocalDatabase();
    return review;
  }
};
