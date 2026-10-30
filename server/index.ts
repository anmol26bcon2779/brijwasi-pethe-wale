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
    store: 'Brijwasi Pethe Wale Backend API',
    location: 'Agra, Uttar Pradesh',
    timestamp: new Date().toISOString()
  });
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
