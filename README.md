# Brijwasi Pethe Wale — Premium E-Commerce Website

An authentic, production-ready e-commerce platform built for **Brijwasi Pethe Wale**, bringing the royal culinary heritage of Agra to sweet lovers across India.

---

## 👑 Brand Identity & Aesthetic
- **Colors**:
  - Royal Magenta: `#C21870`
  - Antique Gold: `#D6A64A`
  - Deep Brown: `#321A16`
  - Royal Navy: `#071B32`
  - Cream: `#FFF5E6`
  - Ivory: `#FFFDF7`
- **Typography**: Playfair Display, Cormorant Garamond, Inter
- **Inspirations**: Mughal architecture, delicate arches, Taj Mahal heritage, peacock feather emblem

---

## 🏛️ Website Pages & Routes
1. **Home (`/`)**:
   - Announcement Bar with live shipping updates
   - Sticky Royal Navbar with live item counter
   - Hero Section: *"Experience the Royal Sweetness of Agra"*
   - Category Cards: Agra Petha & Traditional Namkeen
   - Bestsellers Section with live interactive variant cards
   - Special Petha Collection: Angoori, Kesar, Paan, Chocolate, Mango, Coconut, Gulab Laddu, Shalimar, Rasbhari
   - Why Choose Brijwasi? 4 feature pillars
   - Heritage Narrative: *"More Than a Sweet, It’s a Tradition"*
   - Verified Customer Testimonials
   - Comprehensive Footer with editable store details
2. **Shop All (`/shop`)**: Filter by category, price slider, sort by popularity/price/rating
3. **Petha Collection (`/petha`)**: Dedicated showcase for Agra pethas
4. **Namkeen Collection (`/namkeen`)**: Dedicated showcase for Dalmoth, Shahi Mixture, Heeng Sev, Navratan
5. **Product Detail (`/product/:slug`)**: High-res gallery, weight selector (250g, 500g, 1kg), price calculator, ingredients, shelf life, storage instructions, 100% Pure Veg badge, nutrition info, Add to Cart, Buy Now, related products, and customer review submission
6. **Cart Drawer & Full Cart (`/cart`)**: Slide-out quick drawer, persistent items, quantity adjust, coupon validator (`AGRA10`, `BRIJWASI100`), free shipping progress bar
7. **Checkout (`/checkout`)**: Full delivery address with PIN validation, Cash on Delivery (COD) and Razorpay online payment integration, unique Order ID generation (`BPW-2026-XXXXX`)
8. **Order Confirmation (`/order-confirmation/:orderNumber`)**: Festive celebration confetti, complete invoice summary, WhatsApp support trigger, printable invoice
9. **Order Tracking (`/track-order`)**: Live stepper (Confirmed &rarr; Processing &rarr; Packed &rarr; Shipped &rarr; Delivered), courier & AWB details, activity history
10. **About Us (`/about`)**: Story of Brijwasi Pethe Wale in Agra
11. **Our Heritage (`/heritage`)**: Mughal imperial culinary roots & Taj Mahal artisans history
12. **Contact Us (`/contact`)**: Store address near Taj Mahal Eastern Gate, phone, email, WhatsApp, and bulk corporate/wedding inquiry form
13. **Policy Pages**:
    - Shipping Policy (`/shipping-policy`)
    - Refund Policy (`/refund-policy`)
    - Privacy Policy (`/privacy-policy`)
14. **Customer Account (`/account`)**: Customer profile, orders history, quick tracking
15. **Admin Dashboard (`/admin`)**:
    - Protected by passkey (`brijwasi@admin` or `agra2026`)
    - Sales KPIs: Total Revenue, Total Orders, Pending Orders, Low-stock alerts
    - Product Management: Add, edit, variant pricing, delete
    - Order Management: Status transitions, courier partner & tracking numbers
    - Discount Coupons: Create codes, set discounts, toggle active
    - Store Settings: Change shipping fee, free shipping threshold, COD toggle, banner announcement

---

## 🗄️ Database & Supabase Schema
The complete production SQL schema with Row Level Security (RLS) policies is located at `supabase/schema.sql`.
Tables:
- `categories`
- `products`
- `product_variants`
- `customers`
- `addresses`
- `orders`
- `order_items`
- `coupons`
- `reviews`
- `store_settings`

---

## 🚀 Running the Project Locally

```bash
# Navigate to project folder
cd brijwasi-pethe-wale

# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🔑 Administrative Access
- URL: `/admin` or `/admin-login`
- Default Passkey: `brijwasi@admin` (or `agra2026`)
