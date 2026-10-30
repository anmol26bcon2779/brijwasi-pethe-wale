import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GoldDivider } from '../common/MughalArch';

export const CategorySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-brand-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase">
            Curated Agra Specialties
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-navy mt-1">
            Shop by Royal Category
          </h2>
          <GoldDivider />
          <p className="text-sm text-stone-600">
            Handcrafted with age-old recipes, premium ingredients, and authentic Braj heritage.
          </p>
        </div>

        {/* 2 Prominent Category Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Petha Collection */}
          <div className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-royal border-2 border-brand-gold/40 hover:border-brand-gold transition-all duration-300 bg-white flex flex-col justify-between">
            <div className="relative aspect-16/10 overflow-hidden bg-brand-navy">
              <img
                src="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1000&q=80"
                alt="Agra Petha Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-brand-magenta/90 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                Agra Icon
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy group-hover:text-brand-magenta transition-colors mb-2">
                  Agra Petha Collection
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  The legendary sweet that defines Agra. Simmered from selected ash gourd into juicy Angoori pearls, fragrant Kesar slices, Banarasi Paan rolls, and Belgian chocolate delights.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-brand-brown font-medium mb-6">
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Traditional Agra Petha
                  </span>
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Flavoured Petha
                  </span>
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Premium Royal Petha
                  </span>
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Festive Gift Boxes
                  </span>
                </div>
              </div>

              <Link
                to="/petha"
                className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-magenta text-white font-semibold text-sm transition-colors group-hover:shadow-md"
              >
                <span>Explore Full Petha Range</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Namkeen Collection */}
          <div className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-royal border-2 border-brand-gold/40 hover:border-brand-gold transition-all duration-300 bg-white flex flex-col justify-between">
            <div className="relative aspect-16/10 overflow-hidden bg-brand-navy">
              <img
                src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1000&q=80"
                alt="Agra Namkeen Collection"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
              <div className="absolute top-4 left-4 bg-brand-gold-dark text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                Savory Heritage
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between bg-white">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-navy group-hover:text-brand-magenta transition-colors mb-2">
                  Agra Namkeen Collection
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Crisp, savory snacks prepared in pure desi ghee with fragrant Hathras heeng. Featuring our world-famous Agra Dalmoth, Shahi dry fruit mixture, and zesty sev.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-brand-brown font-medium mb-6">
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Traditional Dalmoth
                  </span>
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Shahi Royal Mixtures
                  </span>
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Spicy Crispy Snacks
                  </span>
                  <span className="flex items-center gap-1.5 bg-brand-cream/60 p-2 rounded-lg border border-brand-gold/20">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" /> Premium Heeng Sev
                  </span>
                </div>
              </div>

              <Link
                to="/namkeen"
                className="inline-flex items-center justify-between w-full px-5 py-3 rounded-xl bg-brand-navy hover:bg-brand-magenta text-white font-semibold text-sm transition-colors group-hover:shadow-md"
              >
                <span>Explore Full Namkeen Range</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
