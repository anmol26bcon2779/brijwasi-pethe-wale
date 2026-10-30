import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/common/ProductCard';
import { GoldDivider } from '../components/common/MughalArch';

export const ShopPage: React.FC = () => {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(1200);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        const minPrice = Math.min(...p.variants.map((v) => v.price));
        if (minPrice > priceRange) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const minPriceA = Math.min(...a.variants.map((v) => v.price));
        const minPriceB = Math.min(...b.variants.map((v) => v.price));
        if (sortBy === 'price-asc') return minPriceA - minPriceB;
        if (sortBy === 'price-desc') return minPriceB - minPriceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [products, selectedCategory, priceRange, sortBy]);

  const categories = [
    { id: 'all', label: 'All Delicacies' },
    { id: 'petha', label: 'Agra Petha' },
    { id: 'namkeen', label: 'Agra Namkeen' },
    { id: 'gift-boxes', label: 'Royal Gift Boxes' },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-14 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Traditional Confectionery
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Shop Authentic Agra Delicacies
          </h1>
          <GoldDivider />
          <p className="text-xs sm:text-sm text-stone-600">
            Freshly prepared every morning in Agra using century-old culinary techniques and pure ingredients.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-gold/30 shadow-card mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-brand-navy text-white shadow-xs border border-brand-gold'
                      : 'bg-brand-cream/60 text-stone-700 hover:bg-brand-cream border border-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort & Price Filter */}
            <div className="flex flex-wrap items-center justify-end gap-4 w-full lg:w-auto">
              
              {/* Price slider */}
              <div className="flex items-center gap-2 text-xs text-stone-600">
                <span>Max Price:</span>
                <span className="font-bold text-brand-magenta">₹{priceRange}</span>
                <input
                  type="range"
                  min="100"
                  max="1200"
                  step="50"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-brand-magenta cursor-pointer"
                />
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-stone-800 focus:outline-none focus:border-brand-magenta"
                >
                  <option value="featured">Featured / Bestsellers</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>

            </div>

          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6 px-1">
          <span>Showing <strong>{filteredProducts.length}</strong> authentic products</span>
          <span>Pan-India Safe Temperature Packaged Dispatches</span>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <h3 className="font-serif text-lg font-bold text-brand-navy mb-2">No products match your filters</h3>
            <p className="text-xs text-stone-500 mb-4">Try adjusting your price filter or selecting another category.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceRange(1200);
              }}
              className="bg-brand-navy text-white text-xs px-4 py-2 rounded-lg font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
