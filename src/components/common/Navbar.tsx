import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  Truck, 
  PhoneCall, 
  ShieldCheck, 
  Award, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { itemCount } = useCart();
  const { settings, setIsCartOpen, setIsSearchOpen } = useStore();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Petha Collection', path: '/petha' },
    { label: 'Namkeen', path: '/namkeen' },
    { label: 'Our Heritage', path: '/heritage' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="bg-brand-navy text-brand-cream text-xs py-2 px-4 border-b border-brand-gold/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-[11px] text-brand-gold-light">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-gold" /> Agra's Authentic Heritage Sweets
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> 100% Pure Desi Ghee & Fresh Ash Gourd
            </span>
          </div>

          <div className="mx-auto md:mx-0 text-center font-medium tracking-wide flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse hidden sm:inline" />
            <span>{settings.announcementBar}</span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px]">
            <Link to="/track-order" className="hover:text-brand-gold transition-colors flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-brand-gold" /> Track Order
            </Link>
            <span className="text-white/20">|</span>
            <a 
              href={`tel:${settings.phone}`} 
              className="hover:text-brand-gold transition-colors flex items-center gap-1 text-brand-gold-light font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-gold" /> {settings.phone}
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <nav 
        className={`transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-brand-ivory/95 backdrop-blur-md shadow-md border-brand-gold/40 py-2.5' 
            : 'bg-brand-ivory border-brand-gold/20 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-brand-brown hover:text-brand-magenta hover:bg-brand-cream transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative overflow-hidden rounded-xl border border-brand-gold/40 shadow-xs p-1 bg-white">
                <img
                  src="/brijwasi-logo.jpg"
                  alt="Brijwasi Pethe Wale Logo"
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block text-left">
                <span className="block font-serif text-lg sm:text-xl font-bold tracking-tight text-brand-magenta">
                  Brijwasi Pethe Wale
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-brand-gold-dark">
                  Agra Heritage Mithai
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                      active
                        ? 'text-brand-magenta font-semibold'
                        : 'text-brand-brown hover:text-brand-magenta hover:bg-brand-cream/60'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-brand-gold via-brand-magenta to-brand-gold rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-brand-brown hover:text-brand-magenta hover:bg-brand-cream/80 transition-colors"
                title="Search Sweets & Namkeen"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Track Order link on mobile/tablet */}
              <Link
                to="/track-order"
                className="hidden sm:flex lg:hidden p-2.5 rounded-full text-brand-brown hover:text-brand-magenta hover:bg-brand-cream/80 transition-colors"
                title="Track Your Order"
              >
                <Truck className="w-5 h-5" />
              </Link>

              {/* Account / Admin Link */}
              <Link
                to={isAdmin ? '/admin' : '/account'}
                className="p-2.5 rounded-full text-brand-brown hover:text-brand-magenta hover:bg-brand-cream/80 transition-colors relative"
                title={isAdmin ? 'Admin Dashboard' : 'My Account'}
              >
                <User className="w-5 h-5" />
                {isAdmin && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-gold rounded-full border border-white" />
                )}
              </Link>

              {/* Shopping Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-magenta to-brand-magenta-dark text-white px-3.5 py-2 rounded-full shadow-royal hover:brightness-110 active:scale-95 transition-all"
                aria-label="View Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-brown font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-semibold tracking-wide">
                  Cart ({itemCount})
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-ivory border-t border-brand-gold/30 px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-brand-cream text-brand-magenta font-semibold border-l-4 border-brand-magenta'
                      : 'text-brand-brown hover:bg-brand-cream/50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-brand-gold/20 flex flex-col gap-2 text-sm">
              <Link
                to="/track-order"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-brown hover:bg-brand-cream"
              >
                <Truck className="w-4 h-4 text-brand-gold-dark" /> Track Existing Order
              </Link>
              <Link
                to="/account"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-brown hover:bg-brand-cream"
              >
                <User className="w-4 h-4 text-brand-gold-dark" /> My Account
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-brand-magenta font-semibold bg-brand-magenta/10"
                >
                  <Award className="w-4 h-4 text-brand-magenta" /> Admin Management Portal
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
