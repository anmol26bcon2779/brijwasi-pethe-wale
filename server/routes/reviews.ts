import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { Review } from '../../src/types/index.js';

const router = Router();

// GET /api/reviews?productId=...
router.get('/', async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const reviews = await db.getReviews(productId ? String(productId) : undefined);
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reviews (Customer submits review)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { productId, productName, customerName, customerCity, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, customer name, rating, and comment are required' });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      productName: productName || 'Agra Delicacy',
      customerName,
      customerCity: customerCity || 'Verified Patron',
      rating: Number(rating),
      comment,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      verifiedPurchase: true
    };

    const saved = await db.addReview(newReview);
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
