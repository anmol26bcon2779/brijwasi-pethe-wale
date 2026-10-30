import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.hindiName?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(q))
    );
    setResults(filtered);
  }, [query, products]);

  if (!isSearchOpen) return null;

  const quickTags = ['Angoori Petha', 'Kesar Petha', 'Agra Dalmoth', 'Paan Petha', 'Shahi Mixture'];

  const handleSelectProduct = (slug: string) => {
    setIsSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div 
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-brand-navy/70 backdrop-blur-xs transition-opacity" 
      />

      <div className="relative max-w-2xl mx-auto bg-brand-ivory rounded-2xl shadow-2xl border border-brand-gold overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-brand-gold/30 bg-white flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-gold-dark shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search authentic Agra petha, namkeen, dry fruits..."
            className="w-full text-base sm:text-lg bg-transparent text-brand-navy placeholder:text-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-brand-magenta"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 text-stone-600 hover:bg-stone-200"
          >
            ESC
          </button>
        </div>

        {/* Quick Suggestions */}
        {!query && (
          <div className="p-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-gold-dark uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Popular Searches in Agra
            </div>
            <div className="flex flex-wrap gap-2">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="text-xs bg-brand-cream/80 hover:bg-brand-gold/20 text-brand-brown px-3 py-1.5 rounded-full border border-brand-gold/30 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-96 overflow-y-auto p-4 space-y-2">
            {results.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-sm">
                No delicious match found for "{query}". Try searching "Petha" or "Dalmoth".
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="p-3 bg-white hover:bg-brand-cream/40 rounded-xl border border-stone-200 flex items-center gap-4 cursor-pointer transition-colors group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover border border-stone-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-brand-navy group-hover:text-brand-magenta transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-stone-500 truncate">{product.shortDescription}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-sm text-brand-magenta block">
                      ₹{product.variants[0]?.price}
                    </span>
                    <span className="text-[10px] text-stone-400">from {product.variants[0]?.weight}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-brand-magenta transition-colors" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-brand-cream/40 border-t border-brand-gold/20 text-center text-[11px] text-brand-brown/70">
          Showing authentic handmade Agra sweets & namkeen from Brijwasi Pethe Wale
        </div>
      </div>
    </div>
  );
};
