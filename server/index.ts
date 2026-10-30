import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import couponsRouter from './routes/coupons.js';
import reviewsRouter from './routes/reviews.js';
import settingsRouter from './routes/settings.js';
import paymentRouter from './routes/payment.js';
import authRouter from './routes/auth.js';
import { supabase, db } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static assets (like uploaded logo and public files)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Request Logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/auth', authRouter);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    database: supabase ? 'supabase-connected' : 'local-fallback',
    store: 'Brijwasi Pethe Wale Backend API',
    location: 'Agra, Uttar Pradesh',
    timestamp: new Date().toISOString()
  });
});

// Live Supabase Status Verification (Never exposes secrets)
app.get('/api/supabase-status', async (_req, res) => {
  try {
    const isConfigured = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
    if (!supabase) {
      return res.json({
        connected: false,
        configured: isConfigured,
        message: 'Supabase client is operating in fallback mode. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel.',
        variablesDetected: {
          SUPABASE_URL: Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
          SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
          NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY)
        }
      });
    }

    const [prodCheck, orderCheck, couponCheck, settingsCheck] = await Promise.allSettled([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('orders').select('id', { count: 'exact', head: true }),
      supabase.from('coupons').select('id', { count: 'exact', head: true }),
      supabase.from('store_settings').select('id', { count: 'exact', head: true })
    ]);

    res.json({
      connected: true,
      configured: true,
      database: 'Supabase PostgreSQL (Live)',
      authMode: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role (Admin Backend)' : 'anon (Public)',
      tables: {
        products: prodCheck.status === 'fulfilled' ? prodCheck.value.count : 'Error',
        orders: orderCheck.status === 'fulfilled' ? orderCheck.value.count : 'Error',
        coupons: couponCheck.status === 'fulfilled' ? couponCheck.value.count : 'Error',
        store_settings: settingsCheck.status === 'fulfilled' ? settingsCheck.value.count : 'Error'
      },
      status: 'operational',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// One-Click Database Migration Endpoint for Supabase
app.all('/api/migrate-products', async (_req, res) => {
  try {
    const result = await db.seedInitialData();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend build if dist exists in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// Fallback Route Handler
app.use((req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: 'Brijwasi Pethe Wale API Server is running.',
      health: '/api/health',
      products: '/api/products',
      orders: '/api/orders'
    });
  }
});

// Start Server if not in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`👑 Brijwasi Pethe Wale API Backend Server`);
    console.log(`📍 Origin: Agra Heritage Mithai & Namkeen`);
    console.log(`🚀 Live Port: http://localhost:${PORT}`);
    console.log(`⚡ API Health: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

export default app;
