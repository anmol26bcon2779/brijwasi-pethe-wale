import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { GoldDivider } from '../common/MughalArch';

export const SpecialPethaSection: React.FC = () => {
  const { products } = useStore();
  const pethaProducts = products.filter((p) => p.category === 'petha').slice(0, 8);

  return (
    <section className="py-16 sm:py-20 bg-brand-ivory relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> From Classic to Contemporary
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-navy mt-1">
            Our Special Petha Collection
          </h2>
          <GoldDivider />
          <p className="text-sm text-stone-600">
            From imperial Kesar Angoori and Damascus Rose Gulab Laddu to artisan Belgian Chocolate and Mango infusions — discover Agra's most diverse petha craft.
          </p>
        </div>

        {/* Dynamic Petha Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pethaProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/petha"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-navy hover:bg-brand-magenta text-white text-xs font-bold tracking-wide transition-all shadow-md group"
          >
            <span>Explore All Agra Petha Varieties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};
