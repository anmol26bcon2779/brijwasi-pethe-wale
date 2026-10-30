import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';
import { GoldDivider } from '../common/MughalArch';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative bg-brand-navy overflow-hidden text-brand-cream min-h-[580px] lg:min-h-[660px] flex items-center border-b-2 border-brand-gold">
      {/* Background with Taj Mahal silhouette / Mughal arches subtle pattern */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-luminosity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/95 to-brand-navy/80" />
      
      {/* Radial Gold Lighting Accent */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-magenta/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Heritage Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-brand-gold-light text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Ancestral Sweets Heritage of Agra</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
              Experience the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-amber-200">
                Royal Sweetness
              </span>{' '}
              of Agra
            </h1>

            <p className="text-base sm:text-lg text-brand-cream/90 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              From the timeless taste of authentic Agra Petha to delicious traditional namkeen, discover flavours crafted with tradition. Freshly prepared with winter melon, pure saffron, and royal recipes.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/petha"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-magenta to-brand-magenta-dark hover:brightness-110 active:scale-98 text-white font-bold text-sm tracking-wide shadow-royal flex items-center justify-center gap-2.5 transition-all group"
              >
                <span>Explore Petha</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/namkeen"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-transparent hover:bg-brand-gold/15 text-brand-gold-light hover:text-white border border-brand-gold/60 font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all"
              >
                <span>Shop Namkeen</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-brand-gold/20 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold text-brand-gold block">100%</span>
                <span className="text-[11px] text-brand-cream/70">Pure Vegetarian</span>
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold text-brand-gold block">Pan-India</span>
                <span className="text-[11px] text-brand-cream/70">Express Delivery</span>
              </div>
              <div>
                <span className="font-serif text-lg sm:text-xl font-bold text-brand-gold block">Authentic</span>
                <span className="text-[11px] text-brand-cream/70">Agra Craftsmanship</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual with Mughal Arch Frame */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Mughal decorative gold frame */}
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-gold via-brand-magenta to-brand-gold rounded-3xl blur-xs opacity-75 animate-pulse" />
              
              <div className="relative rounded-2xl overflow-hidden bg-brand-brown border-2 border-brand-gold/80 shadow-2xl p-2">
                {/* Traditional Arch shape on image */}
                <div className="relative rounded-xl overflow-hidden aspect-4/5 bg-stone-900">
                  <img
                    src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=900&q=80"
                    alt="Authentic Agra Petha Brijwasi Pethe Wale"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-transparent to-transparent" />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-brand-navy/85 backdrop-blur-md border border-brand-gold/50 text-left">
                    <div className="flex items-center gap-2 text-brand-gold text-xs font-semibold mb-1">
                      <Award className="w-4 h-4" /> Original Agra Angoori Petha
                    </div>
                    <p className="text-[11px] text-brand-cream/80">
                      Tender grape-shaped winter melon simmered in saffron elixir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
