-- ==============================================================================
-- Brijwasi Pethe Wale - Supabase Initial Seed Data
-- Run this in your Supabase SQL Editor after running schema.sql
-- ==============================================================================

-- 1. SEED STORE SETTINGS
INSERT INTO public.store_settings (id, store_name, tagline, announcement_bar, phone, email, address, standard_shipping_fee, free_shipping_threshold, is_cod_enabled, cod_fee)
VALUES (
    1,
    'Brijwasi Pethe Wale',
    'Experience the Royal Sweetness of Agra',
    '✨ Authentic Taste of Agra | Traditional Sweets Delivered Fresh Across India | Free Shipping Above ₹799',
    '+91 98970 23456',
    'care@brijwasipethewale.com',
    'Shop No. 14, Eastern Gate Market, Near Taj Mahal, Fatehabad Road, Agra, UP - 282001',
    80,
    799,
    true,
    40
) ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    tagline = EXCLUDED.tagline,
    announcement_bar = EXCLUDED.announcement_bar;

-- 2. SEED CATEGORIES
INSERT INTO public.categories (slug, name, description, display_order)
VALUES 
    ('petha', 'Agra Petha Collection', 'Traditional ash gourd delicacies cooked to perfection in fragrant syrups.', 1),
    ('namkeen', 'Artisanal Agra Namkeen', 'Crisp, spicy, and authentic savory namkeens and Agra Dalmoth.', 2)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED INITIAL COUPONS
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_amount, is_active)
VALUES 
    ('AGRA10', 'Flat 10% off on authentic Agra delicacies above ₹499', 'percentage', 10, 499, true),
    ('ROYAL50', 'Flat ₹50 instant discount on royal orders above ₹699', 'fixed', 50, 699, true),
    ('FESTIVE15', 'Festive Celebration 15% discount on orders above ₹999', 'percentage', 15, 999, true)
ON CONFLICT (code) DO NOTHING;
