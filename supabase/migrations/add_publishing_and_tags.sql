-- ==============================================================================
-- Brijwasi Pethe Wale — Supabase Managed Products Schema Migration
-- Idempotent & Non-Destructive: Preserves all existing products, orders & variants
-- ==============================================================================

-- 1. Add publishing, availability, and tag columns to public.products if not existing
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true NOT NULL,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}' NOT NULL;

-- 2. Backfill existing products so they remain fully published and available
UPDATE public.products 
SET 
  is_published = COALESCE(is_published, true),
  is_available = COALESCE(is_available, true),
  tags = COALESCE(tags, '{}');

-- 3. Ensure indexes exist for fast filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_is_bestseller ON public.products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

-- 4. Update RLS policies so public patrons only query published products, while service_role/admins access all
DO $$
BEGIN
    -- Drop old broad select policy if it exists
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view products') THEN
        DROP POLICY "Public can view products" ON public.products;
    END IF;

    -- Create precise policy for published products
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view published products') THEN
        CREATE POLICY "Public can view published products" 
        ON public.products 
        FOR SELECT 
        USING (is_published = true);
    END IF;
END $$;
