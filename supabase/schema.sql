-- ==============================================================================
-- Brijwasi Pethe Wale — Complete Production Database Schema & RLS Policies
-- Compatibility: Express Backend, React Frontend, Supabase PostgreSQL
-- Non-Destructive: Safe to run on new or existing Supabase instances
-- ==============================================================================

-- 1. Enable Cryptographic & UUID Extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. CATEGORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. PRODUCTS TABLE
-- Compatible with Product interface in src/types/index.ts
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    hindi_name TEXT,
    category TEXT NOT NULL, -- 'petha' | 'namkeen' | 'gift-boxes'
    sub_category TEXT,       -- 'traditional' | 'flavoured' | 'premium' | 'dry' | 'syrup'
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    ingredients TEXT[] NOT NULL DEFAULT '{}',
    shelf_life TEXT NOT NULL,
    storage_instructions TEXT NOT NULL,
    allergen_info TEXT,
    is_vegetarian BOOLEAN DEFAULT true NOT NULL,
    is_bestseller BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    images TEXT[] NOT NULL DEFAULT '{}',
    nutritional_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. PRODUCT VARIANTS TABLE
-- Compatible with ProductVariant interface (weight, price, mrp, stock)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    weight TEXT NOT NULL,            -- e.g. "250g", "500g", "1kg"
    weight_in_grams INT NOT NULL,     -- e.g. 250, 500, 1000
    price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 50,
    sku TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. CUSTOMERS TABLE
-- Tracks registered customers and admin roles
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    auth_user_id UUID,
    email TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. ORDERS TABLE
-- Tracks all customer orders, payment, shipping address, and tracking status
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_number TEXT UNIQUE NOT NULL, -- e.g. "BPW-2026-490212"
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    coupon_applied TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'Razorpay', 'Card', 'UPI')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    tracking_number TEXT,
    courier_partner TEXT,
    status_timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. ORDER ITEMS TABLE
-- Individual items inside each order
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id TEXT,
    product_name TEXT NOT NULL,
    weight TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT
);

-- ==============================================================================
-- 8. COUPONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true NOT NULL,
    expires_at TIMESTAMPTZ,
    usage_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. REVIEWS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_city TEXT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 10. STORE SETTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_settings (
    id INT PRIMARY KEY DEFAULT 1,
    store_name TEXT NOT NULL DEFAULT 'Brijwasi Pethe Wale',
    tagline TEXT NOT NULL DEFAULT 'Experience the Royal Sweetness of Agra',
    announcement_bar TEXT NOT NULL DEFAULT '✨ Authentic Taste of Agra | Traditional Sweets Delivered Fresh Across India | Free Shipping Above ₹799',
    phone TEXT NOT NULL DEFAULT '+91 98970 23456',
    whatsapp TEXT NOT NULL DEFAULT '+91 98970 23456',
    email TEXT NOT NULL DEFAULT 'care@brijwasipethewale.com',
    address TEXT NOT NULL DEFAULT 'Shop No. 14, Eastern Gate Market, Near Taj Mahal, Fatehabad Road',
    city TEXT NOT NULL DEFAULT 'Agra',
    state TEXT NOT NULL DEFAULT 'Uttar Pradesh',
    pincode TEXT NOT NULL DEFAULT '282001',
    standard_shipping_fee NUMERIC(10, 2) DEFAULT 80,
    free_shipping_threshold NUMERIC(10, 2) DEFAULT 799,
    is_cod_enabled BOOLEAN DEFAULT true,
    cod_fee NUMERIC(10, 2) DEFAULT 40,
    razorpay_key_id TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 11. INITIAL SEED DATA (SAFE IDEMPOTENT INSERTS)
-- ==============================================================================

-- Store Settings Seed
INSERT INTO public.store_settings (id, store_name, tagline, announcement_bar, phone, whatsapp, email, address, city, state, pincode, standard_shipping_fee, free_shipping_threshold, is_cod_enabled, cod_fee)
VALUES (
    1,
    'Brijwasi Pethe Wale',
    'Experience the Royal Sweetness of Agra',
    '✨ Authentic Taste of Agra | Traditional Sweets Delivered Fresh Across India | Free Shipping Above ₹799',
    '+91 98970 23456',
    '+91 98970 23456',
    'care@brijwasipethewale.com',
    'Shop No. 14, Eastern Gate Market, Near Taj Mahal, Fatehabad Road',
    'Agra',
    'Uttar Pradesh',
    '282001',
    80,
    799,
    true,
    40
)
ON CONFLICT (id) DO NOTHING;

-- Initial Categories
INSERT INTO public.categories (slug, name, description, display_order)
VALUES 
    ('petha', 'Agra Petha Collection', 'Traditional ash gourd delicacies cooked to perfection in fragrant syrups and royal flavours.', 1),
    ('namkeen', 'Artisanal Agra Namkeen', 'Crisp, spicy, and authentic savory namkeens including famous Agra Dalmoth.', 2),
    ('gift-boxes', 'Royal Gift Boxes', 'Handcrafted festive assorted mithai boxes packed in royal Mughal presentation.', 3)
ON CONFLICT (slug) DO NOTHING;

-- Initial Coupons
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount, is_active)
VALUES 
    ('AGRA10', 'Flat 10% off on authentic Agra delicacies above ₹499', 'percentage', 10, 499, true),
    ('ROYAL50', 'Flat ₹50 instant discount on royal orders above ₹699', 'fixed', 50, 699, true),
    ('FESTIVE15', 'Festive Celebration 15% discount on orders above ₹999', 'percentage', 15, 999, true)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Helper block to safely create policies without errors if they already exist
DO $$
BEGIN
    -- Public Read Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view categories') THEN
        CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view products') THEN
        CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view product variants') THEN
        CREATE POLICY "Public can view product variants" ON public.product_variants FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view active coupons') THEN
        CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view approved reviews') THEN
        CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view store settings') THEN
        CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (true);
    END IF;

    -- Order creation & tracking policies for customers
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create orders') THEN
        CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can track own orders by order number or email') THEN
        CREATE POLICY "Customers can track own orders by order number or email" ON public.orders FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can insert order items') THEN
        CREATE POLICY "Anyone can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view order items') THEN
        CREATE POLICY "Public can view order items" ON public.order_items FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Customers can submit reviews') THEN
        CREATE POLICY "Customers can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);
    END IF;
END $$;
