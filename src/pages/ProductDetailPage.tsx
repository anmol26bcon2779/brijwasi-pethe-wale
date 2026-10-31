import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Minus, 
  Plus, 
  Info, 
  Calendar, 
  Box, 
  ArrowLeft,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { ProductVariant, Review } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { VegBadge, GoldDivider } from '../components/common/MughalArch';
import { ProductGallery } from '../components/product/ProductGallery';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { products, getProductBySlug, getProductReviews, addReview, setIsCartOpen, togglePublishProduct } = useStore();
  const { addToCart } = useCart();

  const product = getProductBySlug(slug || '');

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedImage(product.images[0]);
      const def = product.variants.find((v) => v.isDefault) || product.variants[0];
      setSelectedVariant(def);
      setQuantity(1);
    }
  }, [slug, product]);

  if (!product || !selectedVariant) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-brand-ivory">
        <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">Delicacy Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">The sweet or namkeen you are searching for is not available or has been updated.</p>
        <Link
          to="/shop"
          className="bg-brand-navy text-white text-xs font-semibold px-6 py-2.5 rounded-full"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Non-admins cannot see draft products
  if (product.isPublished === false && !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-brand-ivory">
        <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">Delicacy In Kitchen Preparation</h2>
        <p className="text-sm text-stone-500 mb-6">This traditional recipe is currently being handcrafted in our kitchens and will be available soon.</p>
        <Link
          to="/shop"
          className="bg-brand-navy hover:bg-brand-magenta text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors"
        >
          Explore Available Agra Delicacies
        </Link>
      </div>
    );
  }

  const reviews = getProductReviews(product.id);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, selectedVariant, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !commentInput.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      customerName: reviewerName,
      customerCity: reviewerCity || 'Verified Patron',
      rating: ratingInput,
      comment: commentInput,
      verifiedPurchase: true
    });

    setReviewSubmitted(true);
    setReviewerName('');
    setReviewerCity('');
    setCommentInput('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 2000);
  };

  const isOutOfStock = selectedVariant.stock <= 0;
  const isLowStock = selectedVariant.stock > 0 && selectedVariant.stock <= 10;
  const discountPercent = Math.round(
    ((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100
  );

  return (
    <div className="min-h-screen bg-brand-ivory py-8 sm:py-12 animate-fadeIn">
      {/* Admin Draft Banner */}
      {product.isPublished === false && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="bg-amber-400 text-stone-900 px-4 py-2.5 rounded-2xl text-xs font-semibold flex flex-wrap items-center justify-between gap-2 shadow-xs border border-amber-500">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-stone-950 shrink-0" />
              <span>
                <strong>Admin Live Preview Mode:</strong> This delicacy is saved as a <strong>Draft</strong> and is hidden from customers.
              </span>
            </div>
            <button
              onClick={() => togglePublishProduct(product.id, true)}
              className="bg-brand-navy hover:bg-stone-900 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Publish Delicacy Now 🟢
            </button>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <Link to="/" className="hover:text-brand-magenta">Home</Link>
          <span>/</span>
          <Link to={`/${product.category}`} className="hover:text-brand-magenta capitalize">
            {product.category === 'petha' ? 'Agra Petha' : product.category === 'namkeen' ? 'Agra Namkeen' : 'Gift Boxes'}
          </Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold truncate">{product.name}</span>
        </div>

        {/* Product Main Showcase */}
        <div className="bg-white rounded-3xl border border-brand-gold/40 shadow-card overflow-hidden p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Gallery (Left: 6 Cols) */}
            <div className="lg:col-span-6">
              <ProductGallery
                images={product.images}
                productName={product.name}
                isBestseller={product.isBestseller}
              />
            </div>

            {/* Info & Purchase Area (Right: 6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs uppercase font-bold tracking-widest text-brand-gold-dark">
                    Authentic Agra Specialty
                  </span>
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-stone-400">({product.reviewCount} verified reviews)</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl font-bold text-brand-navy">
                  {product.name}
                </h1>
                {product.hindiName && (
                  <span className="font-serif text-lg text-brand-magenta font-semibold block mt-1">
                    {product.hindiName}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Weight variant options */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700 mb-2">
                  <span>Choose Pack Size / Weight:</span>
                  <span className="text-brand-magenta font-bold">{selectedVariant.weight}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => {
                    const active = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                          active
                            ? 'bg-brand-navy text-brand-cream border-brand-gold shadow-md'
                            : 'bg-stone-50 text-stone-700 hover:bg-brand-cream border-stone-200'
                        }`}
                      >
                        {v.weight}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price & Stock status */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-serif text-3xl font-bold text-brand-navy">
                  ₹{selectedVariant.price}
                </span>
                {selectedVariant.mrp > selectedVariant.price && (
                  <>
                    <span className="text-base text-stone-400 line-through">
                      ₹{selectedVariant.mrp}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Save {discountPercent}%
                    </span>
                  </>
                )}
                <div className="ml-auto">
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      Only {selectedVariant.stock} packs left
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      In Stock • Dispatches in 24 hrs
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-600">Quantity:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-stone-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                    className={`py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : addedNotice
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-brand-navy hover:bg-brand-navy-light text-white shadow-md'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Bag!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isOutOfStock}
                    onClick={handleBuyNow}
                    className={`py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${
                      isOutOfStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-brand-magenta to-brand-magenta-dark hover:brightness-110 active:scale-98 text-white shadow-royal'
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-200 text-center text-[11px] text-stone-600">
                <div className="p-2 bg-stone-50 rounded-lg">
                  <Truck className="w-4 h-4 text-brand-magenta mx-auto mb-1" />
                  <span>Pan-India Shipping</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-brand-magenta mx-auto mb-1" />
                  <span>Pure Desi Ghee</span>
                </div>
                <div className="p-2 bg-stone-50 rounded-lg">
                  <Box className="w-4 h-4 text-brand-magenta mx-auto mb-1" />
                  <span>Fresh Sealed Box</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Food Specifications */}
        <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 sm:p-10 mb-12">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-navy mb-6 flex items-center gap-2">
            <Info className="w-5 h-5 text-brand-gold-dark" /> Food Information & Heritage Craft
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
            
            {/* Ingredients */}
            <div className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-gold/20">
              <span className="font-bold text-brand-navy block mb-2">Ingredients Used:</span>
              <ul className="list-disc list-inside space-y-1 text-stone-600">
                {product.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Shelf life & storage */}
            <div className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-3">
              <div>
                <span className="font-bold text-brand-navy block mb-1">Shelf Life:</span>
                <p className="text-stone-600">{product.shelfLife}</p>
              </div>
              <div>
                <span className="font-bold text-brand-navy block mb-1">Storage Instructions:</span>
                <p className="text-stone-600">{product.storageInstructions}</p>
              </div>
            </div>

            {/* Allergens & Nutrition */}
            <div className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-gold/20 space-y-3">
              <div>
                <span className="font-bold text-brand-navy block mb-1">Dietary & Allergen Info:</span>
                <p className="text-stone-600">{product.allergenInfo || 'Pure Vegetarian recipe.'}</p>
              </div>
              {product.nutritionalInfo && (
                <div>
                  <span className="font-bold text-brand-navy block mb-1">Approximate Nutrition (per 100g):</span>
                  <p className="text-stone-600">
                    Energy: {product.nutritionalInfo.calories} | Carbs: {product.nutritionalInfo.carbohydrates}
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Customer Reviews & Form */}
        <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 sm:p-10 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-stone-200 pb-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-brand-navy">Customer Reviews</h3>
              <p className="text-xs text-stone-500 mt-1">Verified reviews for {product.name}</p>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-brand-navy hover:bg-brand-magenta text-white text-xs font-bold px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{showReviewForm ? 'Close Form' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Review Submission Form */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="bg-brand-cream/40 p-6 rounded-2xl border border-brand-gold/30 mb-8 max-w-xl space-y-4">
              <h4 className="font-serif text-base font-bold text-brand-navy">Share Your Experience</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Ananya Gupta"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-magenta"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your City</label>
                  <input
                    type="text"
                    value={reviewerCity}
                    onChange={(e) => setReviewerCity(e.target.value)}
                    placeholder="e.g. Pune, Maharashtra"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-magenta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= ratingInput
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-stone-200 text-stone-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Review *</label>
                <textarea
                  required
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Tell others how it tasted, packaging freshness, sweetness balance..."
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-brand-magenta"
                />
              </div>

              {reviewSubmitted ? (
                <div className="p-3 bg-emerald-100 text-emerald-800 text-xs rounded-lg font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" /> Thank you! Your review has been added.
                </div>
              ) : (
                <button
                  type="submit"
                  className="bg-brand-magenta text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-royal hover:brightness-110 transition-all"
                >
                  Submit Genuine Review
                </button>
              )}
            </form>
          )}

          {/* Existing Reviews */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No reviews yet for this product. Be the first to review!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-brand-navy">{rev.customerName}</span>
                      {rev.customerCity && <span className="text-[11px] text-stone-500">• {rev.customerCity}</span>}
                    </div>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed pt-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Delicacies */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase">
                Pair with Perfection
              </span>
              <h3 className="font-serif text-2xl font-bold text-brand-navy mt-1">
                You May Also Relish
              </h3>
              <GoldDivider />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
