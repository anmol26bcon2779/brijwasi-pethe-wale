import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Package, 
  Truck, 
  Clock, 
  LogOut, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { GoldDivider } from '../components/common/MughalArch';

export const AccountPage: React.FC = () => {
  const { user, loginCustomer, logoutCustomer, isAdmin } = useAuth();
  const { orders } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    loginCustomer(name, email, phone);
  };

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-cream border border-brand-gold/40 flex items-center justify-center text-brand-magenta mx-auto mb-3">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-navy">
            {user ? `Namaste, ${user.name}` : 'My Account'}
          </h1>
          <GoldDivider />
          <p className="text-xs sm:text-sm text-stone-600">
            View your order history, track ongoing deliveries, and manage your account.
          </p>
        </div>

        {/* Customer Not Logged In */}
        {!user ? (
          <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/40 shadow-card">
            <h2 className="font-serif text-xl font-bold text-brand-navy mb-4">
              Sign In to Your Account
            </h2>
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. radhika@gmail.com"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-magenta text-white font-bold rounded-xl transition-all shadow-md"
              >
                Access Account & Orders
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
              Are you a store manager?{' '}
              <Link to="/admin" className="text-brand-magenta font-semibold hover:underline">
                Admin Dashboard Portal
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* User Profile Card */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-navy">{user.name}</h3>
                <p className="text-xs text-stone-500">{user.email} {user.phone && `• ${user.phone}`}</p>
                <span className="inline-block mt-2 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  Active Customer Account
                </span>
              </div>
              <div className="flex gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-brand-magenta text-white text-xs font-semibold rounded-xl"
                  >
                    Go to Admin
                  </Link>
                )}
                <button
                  onClick={logoutCustomer}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>

            {/* Orders History */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-card">
              <h3 className="font-serif text-xl font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-magenta" /> Recent Orders & Dispatches
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-8 text-stone-500">
                  <p className="text-xs mb-3">You haven't placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="bg-brand-navy text-white text-xs font-semibold px-5 py-2.5 rounded-full inline-block"
                  >
                    Explore Agra Sweets
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-stone-200 hover:border-brand-gold transition-all bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-brand-magenta">
                            {order.orderNumber}
                          </span>
                          <span className="text-[10px] bg-brand-cream border border-brand-gold/40 text-brand-navy font-semibold px-2 py-0.5 rounded">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}{' '}
                          • {order.items.length} {order.items.length === 1 ? 'item' : 'items'} •{' '}
                          <strong className="text-stone-800">₹{order.total}</strong> ({order.paymentMethod})
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          to={`/track-order?id=${order.orderNumber}`}
                          className="flex-1 sm:flex-none px-4 py-2 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" /> Track
                        </Link>
                        <Link
                          to={`/order-confirmation/${order.orderNumber}`}
                          className="px-3 py-2 border border-stone-300 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                        >
                          Invoice
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
