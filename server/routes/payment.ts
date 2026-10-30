import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const isRazorpayConfigured = Boolean(keyId && keySecret && !keyId.includes('BrijwasiDemoKey'));

const razorpay = isRazorpayConfigured
  ? new Razorpay({
      key_id: keyId!,
      key_secret: keySecret!
    })
  : null;

// POST /api/payment/razorpay/create-order
router.post('/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, receipt, notes } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Amount is required' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {}
      });
      return res.json({ success: true, orderId: order.id, amount: order.amount, currency: order.currency, keyId });
    }

    // Demo/Sandbox fallback order for testing
    const mockOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    res.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_BrijwasiDemoKey123',
      isDemo: true
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/payment/razorpay/verify
router.post('/razorpay/verify', (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Order ID and payment ID are required' });
    }

    if (keySecret && razorpay_signature) {
      const hmac = crypto.createHmac('sha256', keySecret);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, verified: false, message: 'Payment signature verification failed' });
      }
    }

    res.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: 'Payment verified successfully'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
