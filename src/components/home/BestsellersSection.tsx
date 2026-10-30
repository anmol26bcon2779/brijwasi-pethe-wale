import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { GoldDivider } from '../common/MughalArch';

export const BestsellersSection: React.FC = () => {
  const { products } = useStore();
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-brand-cream/30 border-y border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-center md:text-left">
            <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Treasured Customer Favorites
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-navy mt-1">
              Agra Bestsellers
            </h2>
            <GoldDivider className="justify-center md:justify-start my-3" />
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              The crown jewels of Brijwasi Pethe Wale, beloved by thousands across India.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-gold text-brand-navy hover:text-white hover:bg-brand-magenta text-xs font-bold tracking-wide transition-all shadow-2xs group shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
