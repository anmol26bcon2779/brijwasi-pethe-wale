import React from 'react';
import { Award, Sparkles, PackageCheck, Truck } from 'lucide-react';
import { GoldDivider } from '../common/MughalArch';

export const WhyChooseSection: React.FC = () => {
  const features = [
    {
      icon: Award,
      title: 'Authentic Agra Taste',
      description: 'Crafted right here in Agra within the shadow of the Taj Mahal, preserving the original centuries-old recipe that made Agra petha legendary worldwide.'
    },
    {
      icon: Sparkles,
      title: 'Traditional Flavours',
      description: 'Zero artificial preservatives. Prepared exclusively using farm-fresh ash gourd, original Kashmiri saffron, royal cardamom, and pure kewra floral water.'
    },
    {
      icon: PackageCheck,
      title: 'Premium Packaging',
      description: 'Sealed with food-grade moisture lock barrier and elegant royal gift boxing, ensuring your sweets remain juicy, fresh, and pristine during transit.'
    },
    {
      icon: Truck,
      title: 'Delivery Across India',
      description: 'Express doorstep shipping covering over 19,000+ PIN codes across India. Carefully handled and dispatched in temperature-protected packaging.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-brand-navy text-brand-cream relative overflow-hidden border-y-2 border-brand-gold">
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#D6A64A_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-gold font-semibold text-xs tracking-widest uppercase">
            The Brijwasi Promise of Purity
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white mt-1">
            Why Choose Brijwasi Pethe Wale?
          </h2>
          <GoldDivider />
          <p className="text-sm text-brand-cream/80">
            For generations, our family has dedicated itself to keeping Agra's authentic mithai culture alive and uncompromised.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-brand-navy-light/60 p-6 sm:p-7 rounded-2xl border border-brand-gold/30 hover:border-brand-gold hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-magenta to-brand-gold flex items-center justify-center text-white mb-5 shadow-royal group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-gold-light mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-brand-cream/75 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
