import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { GoldDivider } from '../components/common/MughalArch';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    amountNeededForFreeShipping
  } = useCart();

  const { settings } = useStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponCode('');
  };

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / settings.freeShippingThreshold) * 100)
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-brand-ivory flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-cream border border-brand-gold/40 flex items-center justify-center text-brand-gold-dark mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-stone-500 mb-6 max-w-md">
          Explore Agra's most celebrated sweets and savory namkeen crafted with royal culinary heritage.
        </p>
        <Link
          to="/shop"
          className="bg-brand-navy hover:bg-brand-magenta text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-royal transition-all"
        >
          Discover Agra Delicacies
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-14 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/shop" className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-brand-magenta mb-3 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Your Shopping Bag
          </h1>
          <GoldDivider className="justify-start my-3" />
        </div>

        {/* Free Shipping Progress banner */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-gold/30 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs mb-2 gap-2">
            <span className="flex items-center gap-2 font-medium text-stone-700">
              <Truck className="w-4 h-4 text-brand-magenta shrink-0" />
              {amountNeededForFreeShipping > 0 ? (
                <span>Add <strong className="text-brand-magenta">₹{amountNeededForFreeShipping}</strong> more to get <strong>FREE Express Pan-India Delivery!</strong></span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Congratulations! You have unlocked FREE Express Delivery
                </span>
              )}
            </span>
            <span className="text-stone-400 font-semibold">{progressPercent}% Unlocked</span>
          </div>
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-gold to-brand-magenta transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Items (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden">
              <div className="p-4 sm:p-6 divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.slug}`} className="font-serif text-base font-bold text-brand-navy hover:text-brand-magenta transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-brand-gold-dark font-medium block mt-0.5">
                        Pack Size: {item.selectedVariant.weight}
                      </span>
                      <span className="text-xs text-stone-500 block">
                        ₹{item.selectedVariant.price} per pack
                      </span>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-serif text-base font-bold text-brand-magenta min-w-[70px] text-right">
                        ₹{item.selectedVariant.price * item.quantity}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        title="Remove delicacy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-stone-500 hover:text-red-600 font-medium transition-colors"
                >
                  Clear Bag
                </button>
                <span className="text-stone-500">
                  Total items: <strong>{cart.reduce((s, i) => s + i.quantity, 0)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Coupon Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-card">
              <h3 className="font-serif text-sm font-bold text-brand-navy mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-gold-dark" /> Apply Discount Coupon
              </h3>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <div>
                    <span className="font-bold">{appliedCoupon.code}</span>
                    <span className="block text-[11px] text-emerald-700">₹{discount} discount applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-500 hover:text-red-600 font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. AGRA10, FESTIVE20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-brand-magenta uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] flex items-center gap-1 ${couponMsg.success ? 'text-emerald-700' : 'text-red-600'}`}>
                      {couponMsg.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {couponMsg.text}
                    </p>
                  )}
                </form>
              )}

              {/* Sample coupons tip */}
              <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
                <span>Available Codes: </span>
                <span className="font-mono font-semibold text-brand-magenta">AGRA10</span> (10% off),{' '}
                <span className="font-mono font-semibold text-brand-magenta">BRIJWASI100</span> (₹100 off above ₹699)
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-brand-gold/30 shadow-card space-y-3">
              <h3 className="font-serif text-base font-bold text-brand-navy pb-2 border-b border-stone-200">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping & Packaging</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-sm text-brand-navy block">Grand Total</span>
                  <span className="text-[10px] text-stone-400">Inclusive of all taxes</span>
                </div>
                <span className="font-serif text-2xl font-bold text-brand-magenta">
                  ₹{total}
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 bg-gradient-to-r from-brand-magenta to-brand-magenta-dark hover:brightness-110 active:scale-98 text-white rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-royal flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Safe & Secure Indian Payment Gateways</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
