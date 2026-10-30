import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Crown, History } from 'lucide-react';
import { GoldDivider } from '../common/MughalArch';

export const HeritageStorySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-brand-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heritage Imagery with Mughal frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-gold p-2 bg-brand-cream">
              <div className="relative rounded-2xl overflow-hidden aspect-4/5">
                <img
                  src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80"
                  alt="Agra Heritage Architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-brand-gold/60 text-brand-brown">
                  <div className="flex items-center gap-2 text-brand-magenta font-serif font-bold text-sm mb-1">
                    <Crown className="w-4 h-4 text-brand-gold-dark" /> The Imperial Kitchens of Agra
                  </div>
                  <p className="text-xs text-stone-600">
                    Originated during the Mughal era to provide instant energy and pure hydration to the master artisans building the Taj Mahal.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Story */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-magenta/10 border border-brand-magenta/30 text-brand-magenta text-xs font-semibold tracking-wider uppercase">
              <History className="w-3.5 h-3.5" />
              <span>Ancestral Roots Since Centuries</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
              More Than a Sweet, <br />
              <span className="text-brand-magenta">It’s a Living Tradition.</span>
            </h2>

            <GoldDivider className="justify-center lg:justify-start" />

            <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed font-light">
              <p>
                Legend holds that when over twenty thousand craftsmen and stonecutters toiled day and night creating the iconic <strong>Taj Mahal</strong>, Emperor Shah Jahan summoned royal confectioners to invent a sweet that was completely pure, light on digestion, instantly revitalizing, and devoid of heavy fats.
              </p>
              <p>
                The master sweet-makers turned to sacred <em>Kushmanda</em> (Winter Melon or Ash Gourd). Through slow, meticulous simmering in clarified saffron and rose-infused syrup, the humble vegetable transformed into glowing, crystalline pearls — thus giving birth to the world-renowned <strong>Agra Petha</strong>.
              </p>
              <p>
                At <strong>Brijwasi Pethe Wale</strong>, we continue this sacred legacy without shortcuts. No chemical additives, no artificial syrups. Just authentic craftsmanship handed down through generations of proud Agra halwais.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/heritage"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-navy hover:bg-brand-magenta text-white text-xs font-bold tracking-wide transition-all shadow-md group"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Heritage Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-stone-300 hover:border-brand-magenta text-stone-700 hover:text-brand-magenta text-xs font-semibold tracking-wide transition-all"
              >
                <span>About Our Agra Store</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
