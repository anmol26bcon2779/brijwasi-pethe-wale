import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { useCart } from '../../context/CartContext';
import { VegBadge } from './MughalArch';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  // Default variant or first variant
  const defaultVar = product.variants.find((v) => v.isDefault) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVar);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 10;
  const isOutOfStock = selectedVariant.stock <= 0;
  const discountPercent = Math.round(
    ((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100
  );

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-brand-gold/30 hover:border-brand-gold shadow-card hover:shadow-royal transition-all duration-300 flex flex-col justify-between">
      {/* Top badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5">
          <VegBadge />
          {product.isBestseller && (
            <span className="bg-brand-magenta text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}
        </div>
        {discountPercent > 0 && (
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Image container */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-4/3 overflow-hidden bg-brand-cream/40">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Category */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-brand-gold-dark font-medium uppercase tracking-wider text-[10px]">
              {product.category === 'petha' ? 'Agra Petha' : product.category === 'namkeen' ? 'Agra Namkeen' : 'Royal Gift'}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="font-semibold text-[11px]">{product.rating}</span>
              <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-magenta transition-colors line-clamp-1">
              {product.name}
            </h3>
            {product.hindiName && (
              <span className="text-xs text-brand-gold-dark font-serif block -mt-0.5 mb-1.5">
                {product.hindiName}
              </span>
            )}
          </Link>

          <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        <div>
          {/* Weight selector pills */}
          <div className="mb-3">
            <div className="text-[11px] font-semibold text-stone-500 mb-1.5 flex items-center justify-between">
              <span>Select Pack Size:</span>
              <span className="text-brand-magenta font-medium">{selectedVariant.weight}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant.id === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-navy text-brand-cream border border-brand-gold shadow-xs'
                        : 'bg-brand-cream/60 text-stone-700 hover:bg-brand-cream border border-stone-200'
                    }`}
                  >
                    {variant.weight}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price & Stock info */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-serif text-xl font-bold text-brand-navy">
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.mrp > selectedVariant.price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{selectedVariant.mrp}
              </span>
            )}
            {isLowStock && (
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-1.5 py-0.5 rounded ml-auto">
                Only {selectedVariant.stock} left
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${
              isOutOfStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : addedAnimation
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-gradient-to-r from-brand-magenta to-brand-magenta-dark text-white hover:brightness-110 active:scale-98 shadow-royal'
            }`}
          >
            {isOutOfStock ? (
              <span>Out of Stock</span>
            ) : addedAnimation ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
