import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GoldDivider } from '../../components/common/MughalArch';

export const AdminLogin: React.FC = () => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);
  const { loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAsAdmin(passkey);
    if (success) {
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-brand-ivory rounded-3xl border-2 border-brand-gold shadow-2xl p-8">
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-magenta/15 border border-brand-gold/40 flex items-center justify-center text-brand-magenta mx-auto mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-brand-gold-dark">
            Authorized Personnel Only
          </span>
          <h1 className="font-serif text-2xl font-bold text-brand-navy mt-1">
            Brijwasi Admin Portal
          </h1>
          <GoldDivider />
          <p className="text-xs text-stone-600">
            Secure management portal for store inventory, customer orders, and dispatch tracking.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Invalid administrative passkey. Try <strong>brijwasi@admin</strong> or <strong>agra2026</strong>.</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Store Master Passkey
            </label>
            <input
              type="password"
              required
              value={passkey}
              onChange={(e) => {
                setPasskey(e.target.value);
                setError(false);
              }}
              placeholder="Enter secure admin passkey"
              className="w-full p-3 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta text-sm font-mono"
            />
          </div>

          <div className="p-3 bg-brand-cream/60 rounded-xl border border-brand-gold/30 text-[11px] text-stone-600">
            <strong>Default Demo Credentials:</strong>
            <p className="font-mono mt-0.5 text-brand-magenta font-semibold">Passkey: brijwasi@admin</p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-magenta hover:bg-brand-magenta-dark text-white font-bold rounded-xl shadow-royal transition-all flex items-center justify-center gap-2"
          >
            <span>Unlock Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-200 text-center">
          <Link
            to="/"
            className="text-xs text-stone-500 hover:text-brand-magenta inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Storefront
          </Link>
        </div>

      </div>
    </div>
  );
};
