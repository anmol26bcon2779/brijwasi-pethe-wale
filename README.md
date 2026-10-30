# 👑 Brijwasi Pethe Wale — Premium E-Commerce Platform

Production-ready, full-stack Indian sweets and artisanal namkeen e-commerce website built for **Brijwasi Pethe Wale**, bringing the authentic taste of Agra to homes across India.

---

## 🌐 Live URLs & Repositories
- **GitHub Repository**: [https://github.com/anmol26bcon2779/brijwasi-pethe-wale](https://github.com/anmol26bcon2779/brijwasi-pethe-wale)
- **GitHub Pages Deployment**: [https://anmol26bcon2779.github.io/brijwasi-pethe-wale/](https://anmol26bcon2779.github.io/brijwasi-pethe-wale/)
- **Vercel Deployment Claim Link**: [https://vercel.com/claim-deployment?code=e0a51e41-2e6a-472d-a031-9771f8e98323](https://vercel.com/claim-deployment?code=e0a51e41-2e6a-472d-a031-9771f8e98323)
- **Local Dev Server**: `http://localhost:5173/`
- **Backend API Server**: `http://localhost:5000/api`

---

## ⚡ 1. Vercel Deployment Setup

The repository is pre-configured for one-click deployment on **Vercel** with zero configuration required.

### Step-by-Step Vercel Connection:
1. Go to **[vercel.com/new](https://vercel.com/new)**.
2. Select **Import Git Repository** and choose `anmol26bcon2779/brijwasi-pethe-wale`.
3. Vercel automatically detects the framework presets from [`vercel.json`](./vercel.json):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add the keys listed below.
5. Click **Deploy**. Vercel will build and deploy the application with serverless API functions and automatic SPA route rewrites!
6. Every time changes are pushed to the `main` branch, Vercel will automatically trigger a new deployment.

---

## 🔑 2. Environment Variables Checklist

Configure these variables in your Vercel Project Dashboard (**Settings** &rarr; **Environment Variables**):

| Variable Name | Required For | Recommended Value / Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend & Backend | Your Supabase Project URL (`https://xyz.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend Client | Your Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend Server | Secure service role key for admin operations |
| `RAZORPAY_KEY_ID` | Payment Gateway | Live/Test Razorpay Key ID (`rzp_live_...` or `rzp_test_...`) |
| `RAZORPAY_KEY_SECRET` | Payment Gateway | Private Razorpay Key Secret (kept strictly on server) |
| `VITE_RAZORPAY_KEY_ID` | Frontend Checkout | Matches `RAZORPAY_KEY_ID` for browser checkout modal |
| `ADMIN_PASSWORD` | Admin Security | Secret master passkey for `/admin` (Default: `brijwasi@admin`) |

> **Security Guarantee:** Secret keys like `RAZORPAY_KEY_SECRET` and `SUPABASE_SERVICE_ROLE_KEY` are only accessible to serverless backend functions (`/api/*`) and are never exposed in browser bundles.

---

## 🗄️ 3. Supabase Database Configuration Guide

1. Create a project at **[supabase.com](https://supabase.com)**.
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) in this repository and execute the script.
4. This will create all 10 relational tables:
   - `categories`, `products`, `product_variants`, `customers`, `addresses`, `orders`, `order_items`, `coupons`, `reviews`, `store_settings`.
5. Row Level Security (RLS) is automatically enabled with strict customer privacy and admin management privileges.

---

## 🌐 4. Custom Domain Connection & HTTPS Setup

To connect your purchased domain (e.g. `brijwasipethewale.com`):
1. In your Vercel Project Dashboard, go to **Settings &rarr; Domains**.
2. Add both:
   - `brijwasipethewale.com`
   - `www.brijwasipethewale.com`
3. Configure your domain registrar's DNS settings:
   - **Apex domain (`brijwasipethewale.com`)**: Add an **A Record** pointing to `76.76.21.21`.
   - **Subdomain (`www.brijwasipethewale.com`)**: Add a **CNAME Record** pointing to `cname.vercel-dns.com`.
4. Vercel automatically provisions free **SSL Certificates (HTTPS)** and configures a 308 permanent redirect from `www` to the root domain (or vice-versa).

---

## 🏗️ 5. Production Features & Verification Checklist

- [x] **Regal Agra Heritage UI**: Royal Magenta (`#C21870`), Antique Gold (`#D6A64A`), Deep Brown (`#321A16`), Royal Navy (`#071B32`), Cream & Ivory.
- [x] **Brand Asset Integrity**: Uploaded brand logo preserved with original aspect ratio and peacock feather motif.
- [x] **15 Full Pages & Routes**: Home, Shop, Petha, Namkeen, Product Detail, Cart, Checkout, Order Confirmation, Order Tracking, About, Heritage, Contact, Shipping Policy, Refund Policy, Privacy Policy, My Account.
- [x] **Dynamic Variants & Pricing**: Real calculations across 250g, 500g, 1kg pack sizes.
- [x] **Full E-Commerce Cart & Checkout**: Coupon codes (`AGRA10`, `BRIJWASI100`), free shipping threshold, address validation.
- [x] **Dual Payment Gateway**: Cash on Delivery (COD) and Razorpay online checkout with server-side signature verification.
- [x] **Order Tracking Stepper**: Confirmed &rarr; Processing &rarr; Packed &rarr; Shipped &rarr; Delivered.
- [x] **Protected Admin Portal (`/admin`)**: Add/edit/delete products, price and stock controls, order status management, coupon creation, and store settings.
- [x] **SPA Route Rewrites on Vercel**: [`vercel.json`](./vercel.json) prevents 404 errors on browser page reloads.
- [x] **Zero Localhost-Only Dependencies**: Uses environment variable fallbacks and relative `/api` paths in production.
