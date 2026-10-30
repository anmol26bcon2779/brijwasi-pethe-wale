import React, { useEffect } from 'react';
import { Crown, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
import { GoldDivider } from '../components/common/MughalArch';

export const HeritagePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Crown className="w-3.5 h-3.5" /> 350+ Years of Culinary History
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy mt-1">
            More Than a Sweet, It’s a Tradition.
          </h1>
          <GoldDivider />
          <p className="text-sm text-stone-600 leading-relaxed">
            The extraordinary tale of how a sacred Ayurvedic vegetable became India’s most iconic royal delicacy.
          </p>
        </div>

        {/* Narrative Article */}
        <div className="bg-white rounded-3xl border border-brand-gold/40 shadow-card p-6 sm:p-12 space-y-8 text-stone-700 leading-relaxed text-sm sm:text-base">
          
          <div className="relative aspect-16/9 rounded-2xl overflow-hidden border border-brand-gold/30 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80"
              alt="The Taj Mahal and Agra Heritage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs sm:text-sm font-serif italic">
                The grand city of Agra: Cradle of Mughal architecture and imperial culinary arts.
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-navy mb-3">
              1. The Imperial Decree of Shah Jahan
            </h2>
            <p className="mb-4">
              During the mid-17th century, under the reign of Mughal Emperor Shah Jahan, more than 20,000 master stonemasons, marble artisans, and labourers worked tirelessly on the banks of the Yamuna River to build the eternal monument of love: the <strong>Taj Mahal</strong>.
            </p>
            <p>
              The grueling work under the blazing sun of Uttar Pradesh left the workers exhausted. The royal court was tasked with a unique challenge: concoct a sweet that would restore instant stamina, keep the body naturally cool, remain fresh in extreme weather without refrigeration, and be 100% vegetarian and pure.
            </p>
          </div>

          <div className="p-6 bg-brand-cream/50 rounded-2xl border-l-4 border-brand-magenta italic text-brand-brown">
            “The royal royal confectioners turned to Ash Gourd — known in ancient Sanskrit as Kushmanda — renowned in Ayurveda for its calming, neuro-protective, and cooling properties.”
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-navy mb-3">
              2. The Alchemy of Crystallization
            </h2>
            <p className="mb-4">
              Unlike milk-based mithai (khoya and mawa) that spoil in a few days, Petha relies entirely on the natural fiber of winter melon and the preservative power of concentrated pure sugar nectar.
            </p>
            <p>
              The process begins by peeling thick-rinded, mature ash gourds. The pulp is meticulously pricked with brass needles, steeped in purified lime water to firm the crystalline structure, rinsed seven times, and then simmered in a delicate syrup kissed with Kashmiri saffron and kewra water until each cube glistens like uncut crystal.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-navy mb-3">
              3. The Living Legacy of Brijwasi Pethe Wale
            </h2>
            <p className="mb-4">
              As decades passed, Agra became universally inseparable from its petha and ghee-roasted Dalmoth. At <strong>Brijwasi Pethe Wale</strong>, we consider ourselves custodians of this sweet heritage.
            </p>
            <p>
              Whether it is the miniature translucent globes of <em>Angoori Petha</em>, the rich aroma of <em>Shahi Kesar Petha</em>, or our artisanal <em>Banarasi Paan Petha</em>, every box dispatched from our Agra store carries the royal fragrance and authentic soul of the city of the Taj.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
