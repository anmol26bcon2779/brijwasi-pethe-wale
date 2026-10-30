import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  Truck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Order, PaymentMethod, ShippingAddress, OrderItem } from '../types';
import { initiateRazorpayPayment } from '../lib/razorpay';
import { GoldDivider } from '../components/common/MughalArch';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discount, shippingFee, total, appliedCoupon, clearCart } = useCart();
  const { settings, addOrder } = useStore();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    landmark: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateOrderNumber = () => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    return `BPW-${new Date().getFullYear()}-${randomDigits}`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please fill in all mandatory delivery address fields.');
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, '').slice(-10))) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const orderId = `ord-${Date.now()}`;
    const orderNumber = generateOrderNumber();

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      variantId: item.selectedVariant.id,
      productName: item.product.name,
      weight: item.selectedVariant.weight,
      price: item.selectedVariant.price,
      quantity: item.quantity,
      total: item.selectedVariant.price * item.quantity,
      image: item.product.images[0]
    }));

    // Cash on Delivery
    if (paymentMethod === 'COD') {
      const finalOrder: Order = {
        id: orderId,
        orderNumber,
        items: orderItems,
        customer: formData,
        subtotal,
        discount,
        shippingFee,
        total,
        couponCode: appliedCoupon?.code,
        status: 'Confirmed',
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        statusTimeline: [
          {
            status: 'Confirmed',
            timestamp: new Date().toISOString(),
            notes: 'Order placed successfully via Cash on Delivery.'
          }
        ],
        createdAt: new Date().toISOString()
      };

      try {
        await addOrder(finalOrder);
        clearCart();
        navigate(`/order-confirmation/${orderNumber}`);
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }

    // Razorpay Online Payment Flow
    if (paymentMethod === 'Razorpay') {
      try {
        await initiateRazorpayPayment({
          amount: total,
          orderNumber,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          keyId: settings.razorpayKeyId,
          onSuccess: async (paymentId: string) => {
            const finalOrder: Order = {
              id: orderId,
              orderNumber,
              items: orderItems,
              customer: formData,
              subtotal,
              discount,
              shippingFee,
              total,
              couponCode: appliedCoupon?.code,
              status: 'Confirmed',
              paymentMethod: 'Razorpay',
              paymentStatus: 'Paid',
              razorpayPaymentId: paymentId,
              statusTimeline: [
                {
                  status: 'Confirmed',
                  timestamp: new Date().toISOString(),
                  notes: `Payment verified successfully via Razorpay (ID: ${paymentId})`
                }
              ],
              createdAt: new Date().toISOString()
            };

            await addOrder(finalOrder);
            clearCart();
            navigate(`/order-confirmation/${orderNumber}`);
          },
          onDismiss: () => {
            setIsSubmitting(false);
            setErrorMessage('Payment was cancelled or dismissed. You can try again or choose Cash on Delivery.');
          }
        });
      } catch (err: any) {
        setIsSubmitting(false);
        setErrorMessage(err.message || 'Could not launch Razorpay checkout.');
      }
    }
  };

  const indianStates = [
    'Uttar Pradesh', 'Delhi', 'Haryana', 'Rajasthan', 'Madhya Pradesh',
    'Maharashtra', 'Punjab', 'Gujarat', 'Karnataka', 'Tamil Nadu',
    'Telangana', 'West Bengal', 'Bihar', 'Uttarakhand', 'Jharkhand',
    'Himachal Pradesh', 'Assam', 'Odisha', 'Kerala', 'Goa', 'Chandigarh'
  ];

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-14 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-brand-magenta mb-3 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Checkout & Delivery
          </h1>
          <GoldDivider className="justify-start my-3" />
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Delivery & Payment Details (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Delivery Address Card */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-card">
                <h2 className="font-serif text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-brand-magenta" /> Delivery Address in India
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address (for order tracking & invoice) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      House / Flat No., Building & Street Address *
                    </label>
                    <input
                      type="text"
                      name="addressLine1"
                      required
                      placeholder="e.g. Flat 402, Royal Residency, Sector 15"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Lucknow, Delhi, Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      required
                      placeholder="e.g. 282001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    >
                      {indianStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="e.g. Opposite City Park"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-card">
                <h2 className="font-serif text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-magenta" /> Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* COD */}
                  {settings.isCodEnabled && (
                    <label
                      onClick={() => setPaymentMethod('COD')}
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'COD'
                          ? 'border-brand-magenta bg-brand-cream/40 shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="mt-1 accent-brand-magenta"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-bold text-sm text-brand-navy">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          Pay cash or UPI to the courier upon delivery at your doorstep.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Razorpay Online Payment */}
                  <label
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'Razorpay'
                        ? 'border-brand-magenta bg-brand-cream/40 shadow-xs'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="mt-1 accent-brand-magenta"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-sm text-brand-navy">
                        <CreditCard className="w-4 h-4 text-brand-magenta" />
                        <span>Online Payment (UPI, Cards, NetBanking, Wallets)</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Secured by Razorpay. Pay instantly using Google Pay, PhonePe, Paytm, Credit/Debit cards.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Review & Placement (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-brand-gold/30 shadow-card space-y-4">
                <h3 className="font-serif text-base font-bold text-brand-navy pb-3 border-b border-stone-200">
                  Delicacies in Your Order ({cart.length})
                </h3>

                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800 truncate">{item.product.name}</p>
                        <span className="text-[11px] text-stone-500">
                          {item.selectedVariant.weight} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-stone-800">
                        ₹{item.selectedVariant.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-800">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-brand-navy pt-2 border-t border-stone-200">
                    <span>Total Amount Payable</span>
                    <span className="font-serif text-xl text-brand-magenta">₹{total}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 bg-gradient-to-r from-brand-magenta to-brand-magenta-dark hover:brightness-110 active:scale-98 text-white rounded-xl font-bold text-sm tracking-wide shadow-royal flex items-center justify-center gap-2 transition-all ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span>Processing Your Order...</span>
                  ) : paymentMethod === 'COD' ? (
                    <span>Confirm Order (Cash on Delivery)</span>
                  ) : (
                    <span>Proceed to Secure Pay ₹{total}</span>
                  )}
                </button>

                <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>256-bit Encrypted Checkout</span>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
