import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { Order, OrderStatus } from '../../src/types/index.js';

const router = Router();

// GET /api/orders (Admin: get all orders)
router.get('/', (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let list = db.getOrders();
    if (status) {
      list = list.filter(o => o.status === status);
    }
    res.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/orders/:identifier (Track order or invoice)
router.get('/:identifier', (req: Request, res: Response) => {
  try {
    const identifier = Array.isArray(req.params.identifier) ? req.params.identifier[0] : req.params.identifier;
    const order = db.getOrderByIdOrNumber(identifier);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders (Customer creates order)
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      customer,
      items,
      paymentMethod,
      couponCode,
      razorpayPaymentId
    } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.addressLine1 || !customer.city || !customer.pincode) {
      return res.status(400).json({ success: false, message: 'Complete customer delivery details are required' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    const settings = db.getSettings();

    // Calculate subtotal from products
    let subtotal = 0;
    const verifiedItems = items.map((item: any) => {
      const prod = db.getProductBySlugOrId(item.productId);
      const variant = prod?.variants.find(v => v.id === item.variantId || v.weight === item.weight) || prod?.variants[0];
      const unitPrice = variant ? variant.price : Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      const total = unitPrice * qty;
      subtotal += total;

      return {
        productId: prod ? prod.id : item.productId,
        variantId: variant ? variant.id : (item.variantId || 'v1'),
        productName: prod ? prod.name : item.productName,
        weight: variant ? variant.weight : item.weight,
        price: unitPrice,
        quantity: qty,
        total,
        image: prod && prod.images.length > 0 ? prod.images[0] : (item.image || '/brijwasi-logo.jpg')
      };
    });

    // Calculate discount if coupon provided
    let discount = 0;
    if (couponCode) {
      const coupon = db.getCouponByCode(couponCode);
      if (coupon && coupon.isActive && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    // Shipping fee
    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : settings.standardShippingFee;
    const finalTotal = Math.max(0, subtotal - discount + shippingFee);

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `BPW-${new Date().getFullYear()}-${randomDigits}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: verifiedItems,
      customer,
      subtotal,
      discount,
      shippingFee,
      total: finalTotal,
      couponCode: discount > 0 ? couponCode : undefined,
      status: 'Confirmed',
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'Razorpay' ? 'Paid' : 'Pending',
      razorpayPaymentId,
      statusTimeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          notes: `Order placed via ${paymentMethod === 'Razorpay' ? 'Online Payment (Razorpay)' : 'Cash on Delivery'}.`
        }
      ],
      createdAt: new Date().toISOString()
    };

    const saved = db.addOrder(newOrder);
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/orders/:identifier/status (Admin updates status)
router.patch('/:identifier/status', (req: Request, res: Response) => {
  try {
    const { status, trackingNumber, courierPartner } = req.body;
    const validStatuses: OrderStatus[] = [
      'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const identifier = Array.isArray(req.params.identifier) ? req.params.identifier[0] : req.params.identifier;
    const updated = db.updateOrderStatus(
      identifier,
      status,
      trackingNumber,
      courierPartner
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
