import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { GoldDivider, VegBadge } from '../components/common/MughalArch';

export const PethaPage: React.FC = () => {
  const { products } = useStore();
  const pethaList = products.filter((p) => p.category === 'petha');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-14 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner for Petha */}
        <div className="relative rounded-3xl overflow-hidden bg-brand-navy border-2 border-brand-gold p-8 sm:p-12 mb-12 text-brand-cream text-center shadow-royal">
          <div 
            className="absolute inset-0 opacity-15 bg-cover bg-center"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-magenta/80 text-white text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Iconic GI Protected Agra Heritage
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-gold-light">
              The Royal Agra Petha Collection
            </h1>
            <GoldDivider />
            <p className="text-xs sm:text-sm text-brand-cream/90 leading-relaxed font-light">
              Known as the world’s purest naturally crystallized sweet. Carved from ripe white ash gourd (winter melon), slow simmered in fragrant saffron, rose, and cardamom nectar without artificial chemicals.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-brand-gold pt-2">
              <span className="flex items-center gap-1.5"><VegBadge /> 100% Pure Vegetarian</span>
              <span>•</span>
              <span>Made with Saffron & Kewra</span>
              <span>•</span>
              <span>Dispatched Fresh from Agra Daily</span>
            </div>
          </div>
        </div>

        {/* Variety Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 text-center">
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Angoori Petha</span>
            <span className="text-[11px] text-stone-500">Tender grape-sized pearls</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Kesar Angoori</span>
            <span className="text-[11px] text-stone-500">Kashmiri saffron infused</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Banarasi Paan</span>
            <span className="text-[11px] text-stone-500">Gulkand & almond filled</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-brand-gold/30 shadow-2xs">
            <span className="font-serif text-base font-bold text-brand-navy block">Belgian Cocoa</span>
            <span className="text-[11px] text-stone-500">Modern gourmet fusion</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pethaList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
};
