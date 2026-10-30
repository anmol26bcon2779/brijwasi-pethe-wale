import React, { useEffect } from 'react';
import { Award, Sparkles, Flame } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { GoldDivider, VegBadge } from '../components/common/MughalArch';

export const NamkeenPage: React.FC = () => {
  const { products } = useStore();
  const namkeenList = products.filter((p) => p.category === 'namkeen');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-14 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner for Namkeen */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-navy border-2 border-brand-gold p-8 sm:p-12 mb-12 text-brand-cream text-center shadow-royal">
          <div 
            className="absolute inset-0 opacity-15 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold-dark text-white text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Famous Savory Delicacies of Agra
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-gold-light">
              Traditional Agra Namkeen
            </h1>
            <GoldDivider />
            <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed font-light">
              Crispy, spiced delicacies roasted in pure desi ghee and seasoned with Hathras asafoetida. Home to the legendary Agra Dalmoth, crunch-loaded Shahi dry fruit mixture, and royal spiced snacks.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-brand-gold pt-2">
              <span className="flex items-center gap-1.5"><VegBadge /> 100% Pure Vegetarian</span>
              <span>•</span>
              <span>Prepared in Pure Desi Ghee</span>
              <span>•</span>
              <span>Zero Trans-fats</span>
            </div>
          </div>
        </div>

        {/* Variety Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 text-center">
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Agra Dalmoth</span>
            <span className="text-[11px] text-stone-500">Moth dal, cashews & sev</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Shahi Mixture</span>
            <span className="text-[11px] text-stone-500">Loaded dry fruits & nuts</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Mathura Heeng Sev</span>
            <span className="text-[11px] text-stone-500">Pure Hathras asafoetida</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Navratan Mixture</span>
            <span className="text-[11px] text-stone-500">9 royal crunchy elements</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {namkeenList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
};
