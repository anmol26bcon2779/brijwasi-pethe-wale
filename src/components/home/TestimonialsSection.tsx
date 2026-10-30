import React from 'react';
import { Star, Quote, CheckCircle, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GoldDivider } from '../common/MughalArch';

export const TestimonialsSection: React.FC = () => {
  const { reviews } = useStore();

  return (
    <section className="py-16 sm:py-20 bg-brand-cream/40 border-t border-brand-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase">
            Voices of Delighted Patrons
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-navy mt-1">
            Words of Love from Across India
          </h2>
          <GoldDivider />
          <p className="text-sm text-stone-600">
            Real customer experiences delivered fresh from our kitchen in Agra to doorsteps nationwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-gold/30 shadow-card flex flex-col justify-between relative group hover:border-brand-gold transition-all"
            >
              <Quote className="w-8 h-8 text-brand-gold/30 absolute top-5 right-5" />

              <div>
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-bold text-brand-navy">
                    {review.customerName}
                  </h4>
                  {review.customerCity && (
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-brand-gold-dark" /> {review.customerCity}
                    </span>
                  )}
                  {review.productName && (
                    <span className="block text-[10px] text-brand-magenta font-medium mt-1">
                      Ordered: {review.productName}
                    </span>
                  )}
                </div>

                {review.verifiedPurchase && (
                  <span
                    title="Verified Buyer"
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium"
                  >
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
