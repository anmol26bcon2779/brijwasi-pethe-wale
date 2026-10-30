import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { Coupon } from '../../src/types/index.js';

const router = Router();

// GET /api/coupons
router.get('/', (_req: Request, res: Response) => {
  try {
    const coupons = db.getCoupons();
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coupons/validate
router.post('/validate', (req: Request, res: Response) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const coupon = db.getCouponByCode(code);
    if (!coupon) {
      return res.status(404).json({ success: false, valid: false, message: 'Invalid coupon code' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, valid: false, message: 'Coupon is expired or inactive' });
    }

    const orderAmount = Number(subtotal || 0);
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required for coupon ${coupon.code}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((orderAmount * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      valid: true,
      discount,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/coupons (Admin create)
router.post('/', (req: Request, res: Response) => {
  try {
    const { code, description, discountType, discountValue, minOrderAmount, maxDiscount } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ success: false, message: 'Code and discount value are required' });
    }

    const existing = db.getCouponByCode(code);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon with this code already exists' });
    }

    const newCoupon: Coupon = {
      code: code.trim().toUpperCase(),
      description: description || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} discount`,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      isActive: true
    };

    const created = db.addCoupon(newCoupon);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/coupons/:code/toggle
router.patch('/:code/toggle', (req: Request, res: Response) => {
  try {
    const updated = db.toggleCouponStatus(req.params.code);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/coupons/:code
router.delete('/:code', (req: Request, res: Response) => {
  try {
    db.deleteCoupon(req.params.code);
    res.json({ success: true, message: `Coupon ${req.params.code} deleted` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
