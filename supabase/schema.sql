-- ==============================================================================
-- Brijwasi Pethe Wale - Production Supabase PostgreSQL Schema & RLS Policies
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    name text not null,
    description text,
    image_url text,
    display_order int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PRODUCTS TABLE
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    name text not null,
    hindi_name text,
    category_id uuid references public.categories(id) on delete set null,
    short_description text not null,
    description text not null,
    ingredients text[] not null default '{}',
    shelf_life text not null,
    storage_instructions text not null,
    allergen_info text,
    is_vegetarian boolean default true,
    is_bestseller boolean default false,
    is_featured boolean default false,
    rating numeric(3, 2) default 4.8,
    review_count int default 0,
    images text[] not null default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCT VARIANTS TABLE
create table if not exists public.product_variants (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade not null,
    weight text not null, -- e.g. "250g", "500g", "1kg"
    weight_in_grams int not null,
    price numeric(10, 2) not null,
    mrp numeric(10, 2) not null,
    stock int not null default 50,
    sku text unique,
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. CUSTOMERS TABLE
create table if not exists public.customers (
    id uuid primary key default uuid_generate_v4(),
    auth_user_id uuid references auth.users(id) on delete cascade,
    email text unique,
    full_name text not null,
    phone text not null,
    role text default 'customer' check (role in ('customer', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ADDRESSES TABLE
create table if not exists public.addresses (
    id uuid primary key default uuid_generate_v4(),
    customer_id uuid references public.customers(id) on delete cascade not null,
    full_name text not null,
    phone text not null,
    address_line1 text not null,
    address_line2 text,
    city text not null,
    state text not null,
    pincode text not null,
    is_default boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDERS TABLE
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    order_number text unique not null,
    customer_id uuid references public.customers(id) on delete set null,
    customer_name text not null,
    customer_email text not null,
    customer_phone text not null,
    shipping_address jsonb not null,
    subtotal numeric(10, 2) not null,
    discount numeric(10, 2) default 0,
    shipping_fee numeric(10, 2) default 0,
    total numeric(10, 2) not null,
    status text not null default 'Pending' check (status in ('Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    payment_method text not null check (payment_method in ('COD', 'Razorpay', 'Card', 'UPI')),
    payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Failed', 'Refunded')),
    razorpay_order_id text,
    razorpay_payment_id text,
    coupon_applied text,
    tracking_number text,
    courier_partner text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete set null,
    variant_id uuid references public.product_variants(id) on delete set null,
    product_name text not null,
    variant_weight text not null,
    unit_price numeric(10, 2) not null,
    quantity int not null,
    total_price numeric(10, 2) not null,
    image_url text
);

-- 8. COUPONS TABLE
create table if not exists public.coupons (
    id uuid primary key default uuid_generate_v4(),
    code text unique not null,
    description text not null,
    discount_type text not null check (discount_type in ('percentage', 'fixed')),
    discount_value numeric(10, 2) not null,
    min_order_amount numeric(10, 2) default 0,
    max_discount numeric(10, 2),
    is_active boolean default true,
    expires_at timestamp with time zone,
    usage_count int default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. REVIEWS TABLE
create table if not exists public.reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade not null,
    customer_name text not null,
    rating int not null check (rating between 1 and 5),
    comment text not null,
    is_verified_purchase boolean default true,
    is_approved boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. STORE SETTINGS TABLE
create table if not exists public.store_settings (
    id int primary key default 1,
    store_name text not null default 'Brijwasi Pethe Wale',
    tagline text not null default 'The Royal Heritage Taste of Agra',
    announcement_bar text not null default '✨ Authentic Agra Petha & Namkeen Delivered Fresh Across India | Free Shipping Above ₹799',
    phone text not null default '+91 98970 00000',
    email text not null default 'orders@brijwasipethewale.com',
    address text not null default 'Shop No. 12, Near Taj Mahal Eastern Gate, Fatehabad Road, Agra, Uttar Pradesh - 282001',
    standard_shipping_fee numeric(10, 2) default 99,
    free_shipping_threshold numeric(10, 2) default 799,
    is_cod_enabled boolean default true,
    cod_fee numeric(10, 2) default 49,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.coupons enable row level security;
alter table public.reviews enable row level security;
alter table public.store_settings enable row level security;

-- Public can view active categories, products, variants, approved reviews, and store settings
create policy "Allow public read access to categories" on public.categories for select using (true);
create policy "Allow public read access to products" on public.products for select using (true);
create policy "Allow public read access to product_variants" on public.product_variants for select using (true);
create policy "Allow public read access to active coupons" on public.coupons for select using (is_active = true);
create policy "Allow public read access to approved reviews" on public.reviews for select using (is_approved = true);
create policy "Allow public read access to store settings" on public.store_settings for select using (true);

-- Customers can view their own orders & insert new orders
create policy "Allow customer to insert order" on public.orders for insert with check (true);
create policy "Allow customer to read own order" on public.orders for select using (
    auth.uid() is null or customer_id in (select id from public.customers where auth_user_id = auth.uid())
);
create policy "Allow order items read for orders" on public.order_items for select using (true);
create policy "Allow order items insert" on public.order_items for insert with check (true);

-- Admin full access policies (checks if user has admin role in customers table or service role)
create policy "Admin full access to categories" on public.categories for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and role = 'admin')
);
create policy "Admin full access to products" on public.products for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and role = 'admin')
);
create policy "Admin full access to variants" on public.product_variants for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and role = 'admin')
);
create policy "Admin full access to orders" on public.orders for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and role = 'admin')
);
create policy "Admin full access to coupons" on public.coupons for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and role = 'admin')
);
create policy "Admin full access to settings" on public.store_settings for all using (
    exists (select 1 from public.customers where auth_user_id = auth.uid() and role = 'admin')
);
