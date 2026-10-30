import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Truck, 
  MessageCircle, 
  Printer, 
  ShoppingBag, 
  MapPin, 
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { GoldDivider } from '../components/common/MughalArch';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { getOrderByIdOrNumber, settings } = useStore();

  const order = getOrderByIdOrNumber(orderNumber || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire festive confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="min-h-[60vh] bg-brand-ivory flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">Order Not Found</h2>
        <p className="text-sm text-stone-500 mb-4">We could not retrieve order details for #{orderNumber}.</p>
        <Link to="/" className="bg-brand-navy text-white text-xs px-5 py-2.5 rounded-full font-bold">
          Go to Home
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Brijwasi Pethe Wale, I have placed order #${order.orderNumber} for total ₹${order.total}. Please confirm dispatch timeline.`
  );

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-16 animate-fadeIn print:bg-white print:py-2">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Celebration Header */}
        <div className="text-center mb-8 print:mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 border-2 border-emerald-300 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Dhanyawad! Your Agra Sweets Are Being Prepared
          </h1>
          <GoldDivider />
          <p className="text-xs sm:text-sm text-stone-600">
            A confirmation receipt has been generated. Your authentic delicacies will be fresh-packed and dispatched from Agra.
          </p>
        </div>

        {/* Invoice / Order Details Card */}
        <div className="bg-white rounded-3xl border border-brand-gold/40 shadow-card p-6 sm:p-8 space-y-6 print:border-none print:shadow-none">
          
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Order Number</span>
              <p className="font-mono text-lg sm:text-xl font-bold text-brand-magenta">
                {order.orderNumber}
              </p>
            </div>
            <div className="sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Order Date</span>
              <p className="text-xs sm:text-sm font-semibold text-brand-navy">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Delivery Address & Payment Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-700 pb-4 border-b border-stone-200">
            <div>
              <span className="font-bold text-brand-navy block mb-1 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold-dark" /> Delivery Destination:
              </span>
              <p className="font-semibold text-stone-900">{order.customer.fullName}</p>
              <p>{order.customer.addressLine1}</p>
              <p>{order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
              <p className="mt-1">Mobile: <strong>{order.customer.phone}</strong></p>
              <p>Email: {order.customer.email}</p>
            </div>

            <div>
              <span className="font-bold text-brand-navy block mb-1 text-sm">
                Payment & Fulfillment:
              </span>
              <p>Payment Method: <strong className="text-brand-magenta">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}</strong></p>
              <p>Payment Status: <strong className={order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>{order.paymentStatus}</strong></p>
              <p className="mt-1">Order Status: <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">{order.status}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-navy mb-3">Items Ordered:</h3>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-brand-navy text-sm">{item.productName}</p>
                      <span className="text-stone-500">{item.weight} × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-stone-800 text-sm">
                    ₹{item.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-800">₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({order.couponCode})</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-brand-navy pt-2 border-t border-stone-200">
              <span>Total Amount</span>
              <span className="font-serif text-xl text-brand-magenta">₹{order.total}</span>
            </div>
          </div>

          {/* Action Buttons (Hidden when printing) */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap gap-3 print:hidden">
            <Link
              to={`/track-order?id=${order.orderNumber}`}
              className="flex-1 py-3 px-4 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Truck className="w-4 h-4" />
              <span>Track Order Live</span>
            </Link>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order Support on WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

        </div>

        <div className="text-center mt-6 print:hidden">
          <Link
            to="/shop"
            className="text-xs font-semibold text-brand-magenta hover:underline inline-flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping More Agra Sweets
          </Link>
        </div>

      </div>
    </div>
  );
};
