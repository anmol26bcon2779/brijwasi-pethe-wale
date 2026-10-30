import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Heart, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { GoldDivider, VegBadge } from '../components/common/MughalArch';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Handcrafted in Agra
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy mt-1">
            About Brijwasi Pethe Wale
          </h1>
          <GoldDivider />
          <p className="text-sm text-stone-600 leading-relaxed">
            Preserving the golden culinary heritage of Agra through ancestral recipes, uncompromising purity, and artisanal craft.
          </p>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-3xl border border-brand-gold/40 shadow-card p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-navy mb-4">
                Born in the Heart of Agra
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                Located right near the historic Eastern Gate of the immortal Taj Mahal, <strong>Brijwasi Pethe Wale</strong> was founded with a singular mission: to bring the genuine, unadulterated royal sweetness of authentic Agra Petha and artisanal namkeen to families across India.
              </p>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
                While commercial sweet shops moved towards synthetic glucose and artificial flavourings, we continue the sacred craft of using 100% farm-grown Ash Gourd (Winter Melon), genuine Kashmiri Saffron, and pure cow desi ghee.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <VegBadge />
                <span className="text-xs font-bold text-brand-gold-dark">
                  100% Pure Vegetarian Certified Kitchen
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-brand-gold/40 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
                alt="Agra Sweets Heritage"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 4 Pillars of Brijwasi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-card text-center">
            <Award className="w-10 h-10 text-brand-gold mx-auto mb-3" />
            <h3 className="font-serif text-base font-bold text-brand-navy mb-2">Ancestral Halwai Craft</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every batch is supervised by master halwais with over 35 years of dedication in traditional sugar crystallization and spice blending.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-card text-center">
            <ShieldCheck className="w-10 h-10 text-brand-magenta mx-auto mb-3" />
            <h3 className="font-serif text-base font-bold text-brand-navy mb-2">Purity Without Compromise</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Zero harmful chemicals or artificial stabilizers. Made with genuine Kewra floral water, fragrant cardamom pods, and original saffron.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-card text-center">
            <Heart className="w-10 h-10 text-brand-navy mx-auto mb-3" />
            <h3 className="font-serif text-base font-bold text-brand-navy mb-2">Delivered Fresh Nationwide</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Air-sealed moisture lock barrier packing ensures your sweets arrive with the same juicy sweetness as if purchased directly at our Agra counter.
            </p>
          </div>
        </div>

        {/* Store Location Card */}
        <div className="bg-brand-navy text-brand-cream rounded-3xl border-2 border-brand-gold p-8 text-center space-y-4 shadow-royal">
          <MapPin className="w-8 h-8 text-brand-gold mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-brand-gold-light">
            Visit Us in Agra
          </h3>
          <p className="text-xs sm:text-sm text-brand-cream/80 max-w-lg mx-auto">
            When you visit Agra to witness the Taj Mahal, stop by our flagship store for fresh warm samples and authentic Braj hospitality.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-block bg-brand-magenta hover:bg-brand-magenta-dark text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md"
            >
              Get Directions & Contact Info
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
