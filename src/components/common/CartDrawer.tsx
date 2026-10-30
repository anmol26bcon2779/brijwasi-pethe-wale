import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    amountNeededForFreeShipping
  } = useCart();

  const { isCartOpen, setIsCartOpen, settings } = useStore();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / settings.freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-brand-navy/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-ivory border-l border-brand-gold/40 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-brand-gold/20 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-magenta" />
              <h2 className="font-serif text-lg font-bold text-brand-navy">Your Sweet Bag</h2>
              <span className="bg-brand-cream text-brand-magenta text-xs font-bold px-2 py-0.5 rounded-full border border-brand-gold/30">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-500 hover:text-brand-magenta hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping bar */}
          <div className="bg-brand-cream/80 px-4 py-2.5 border-b border-brand-gold/20 text-xs">
            <div className="flex items-center gap-2 mb-1.5 font-medium text-brand-brown">
              <Truck className="w-4 h-4 text-brand-magenta shrink-0" />
              {amountNeededForFreeShipping > 0 ? (
                <span>Add <strong className="text-brand-magenta">₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Pan-India Delivery!</strong></span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You have unlocked FREE Express Delivery!
                </span>
              )}
            </div>
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-gold to-brand-magenta transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <div className="w-16 h-16 rounded-full bg-brand-cream flex items-center justify-center mb-3 text-brand-gold-dark">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-navy mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mb-5 max-w-xs">
                  Discover our freshly simmered royal Agra Pethas and crunchy ghee-roasted Dalmoth.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-brand-magenta text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-royal hover:brightness-110 transition-all"
                >
                  Explore Agra Delicacies
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex gap-3 items-center"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-brand-navy truncate">
                      {item.product.name}
                    </h4>
                    <span className="inline-block text-[11px] font-medium text-brand-gold-dark bg-brand-cream px-1.5 py-0.2 rounded mt-0.5">
                      Pack: {item.selectedVariant.weight}
                    </span>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-serif text-sm font-bold text-brand-magenta">
                        ₹{item.selectedVariant.price * item.quantity}
                      </span>
                      
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-brand-gold/30 bg-white space-y-3">
              
              {/* Promo Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-2 rounded-lg text-xs">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{discount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-500 hover:text-red-600 font-bold ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. AGRA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-brand-magenta uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p className={`text-[11px] mt-1 flex items-center gap-1 ${couponFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                    {couponFeedback.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-800">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700 uppercase">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-navy pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-serif text-lg text-brand-magenta">₹{total}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-brand-magenta to-brand-magenta-dark hover:brightness-110 active:scale-98 text-white rounded-xl font-bold text-sm tracking-wide shadow-royal flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
