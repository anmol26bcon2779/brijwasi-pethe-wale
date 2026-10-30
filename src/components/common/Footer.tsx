import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Heart, 
  ShieldCheck, 
  Award, 
  Clock 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GoldDivider, VegBadge } from './MughalArch';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-brand-brown text-brand-cream relative pt-16 pb-8 border-t-2 border-brand-gold overflow-hidden">
      {/* Subtle royal pattern backdrop */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D6A64A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Heritage */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-1.5 bg-white rounded-xl border border-brand-gold/60 shadow-md">
                <img
                  src="/brijwasi-logo.jpg"
                  alt="Brijwasi Pethe Wale"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <span className="block font-serif text-xl font-bold text-brand-gold-light">
                  Brijwasi Pethe Wale
                </span>
                <span className="text-[11px] uppercase tracking-widest text-brand-cream/70 font-medium">
                  Agra Heritage Mithai
                </span>
              </div>
            </div>

            <p className="text-sm text-brand-cream/80 leading-relaxed mb-4">
              Crafting authentic Agra Petha and artisanal namkeen through ancestral royal recipes since generations. Savor the purity of fresh winter melon and pure desi ghee.
            </p>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-brand-navy/60 border border-brand-gold/30">
              <VegBadge />
              <span className="text-xs font-medium text-brand-gold-light">
                100% Pure Vegetarian & FSSAI Certified
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-brand-gold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4" /> Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream/80">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-brand-gold transition-colors">All Delicacies</Link>
              </li>
              <li>
                <Link to="/petha" className="hover:text-brand-gold transition-colors">Agra Petha Collection</Link>
              </li>
              <li>
                <Link to="/namkeen" className="hover:text-brand-gold transition-colors">Traditional Agra Namkeen</Link>
              </li>
              <li>
                <Link to="/heritage" className="hover:text-brand-gold transition-colors">Our Agra Heritage</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors">About Brijwasi</Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-brand-gold transition-colors">Track Existing Order</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h4 className="font-serif text-lg font-bold text-brand-gold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream/80">
              <li>
                <Link to="/shipping-policy" className="hover:text-brand-gold transition-colors">Shipping & Delivery Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-brand-gold transition-colors">Return & Refund Policy</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-gold transition-colors">Corporate & Wedding Gifting</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-gold transition-colors text-xs text-brand-gold/60">Admin Portal</Link>
              </li>
            </ul>

            <div className="mt-5 p-3 rounded-xl bg-brand-cream/5 border border-brand-gold/20 text-xs text-brand-cream/70 space-y-1">
              <div className="flex items-center gap-1.5 text-brand-gold">
                <Clock className="w-3.5 h-3.5" /> Working Hours
              </div>
              <p>Mon - Sun: 8:00 AM - 10:00 PM IST</p>
            </div>
          </div>

          {/* Column 4: Store Contact Details (Dynamic from settings) */}
          <div>
            <h4 className="font-serif text-lg font-bold text-brand-gold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Agra Flagship Store
            </h4>
            <div className="space-y-3 text-sm text-brand-cream/85">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-1" />
                <span>{settings.address}, {settings.city}, {settings.state} - {settings.pincode}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-brand-gold transition-colors">
                  {settings.phone}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-brand-gold transition-colors">
                  {settings.email}
                </a>
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Brijwasi%20Pethe%20Wale,%20I%20have%20an%20enquiry%20regarding%20Agra%20sweets`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>

        <GoldDivider className="opacity-40" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-brand-cream/60 gap-4 pt-2">
          <p>© {new Date().getFullYear()} {settings.storeName}. All Rights Reserved. Crafted with pride in Agra.</p>
          <div className="flex items-center gap-1 text-brand-gold-light">
            <span>Made with authentic tradition</span>
            <Heart className="w-3.5 h-3.5 text-brand-magenta fill-brand-magenta inline" />
            <span>for lovers of Indian mithai</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
