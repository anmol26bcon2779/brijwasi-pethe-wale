import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  Eye
} from 'lucide-react';
import { VegBadge } from '../common/MughalArch';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  isBestseller?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  isBestseller = false
}) => {
  // Ensure we have a valid list with at least the fallback logo if empty
  const validImages = images && images.length > 0 ? images : ['/brijwasi-logo.jpg'];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fullscreen Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Desktop Hover Zoom Coordinates
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Touch Swipe State for Mobile
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Reset to first image if images array changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, validImages.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
    setIsZoomed(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setIsZoomed(false);
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeThreshold = 40; // minimum pixels to trigger swipe

    if (Math.abs(swipeDistance) > minSwipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped Left -> Next Image
        handleNext();
      } else {
        // Swiped Right -> Previous Image
        handlePrev();
      }
    }
  };

  // Desktop Mouse Hover Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const currentImageUrl = validImages[currentIndex] || '/brijwasi-logo.jpg';

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Showcase */}
      <div 
        className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-brand-cream/30 border border-brand-gold/40 shadow-card cursor-crosshair"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Main Product Image with Zoom Lens on Desktop Hover */}
        <div className="w-full h-full overflow-hidden">
          <img
            src={currentImageUrl}
            alt={`${productName} view ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
            style={
              isHovering
                ? {
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transform: 'scale(1.7)'
                  }
                : { transform: 'scale(1)' }
            }
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/brijwasi-logo.jpg';
            }}
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
          <VegBadge />
          {isBestseller && (
            <span className="bg-brand-magenta text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-royal flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Royal Bestseller
            </span>
          )}
        </div>

        {/* Image Counter & Fullscreen Trigger */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 pointer-events-none">
          <span className="bg-brand-navy/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
            {currentIndex + 1} / {validImages.length}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="pointer-events-auto p-2 bg-white/90 hover:bg-white text-brand-navy rounded-full shadow-md transition-all hover:scale-105"
            title="Click for full-screen zoom gallery"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Previous / Next Arrow Controls (Visible on hover & touch) */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-brand-navy shadow-md transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-brand-navy shadow-md transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
              aria-label="Next Image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden absolute bottom-3 left-3 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full pointer-events-none backdrop-blur-xs">
          Swipe to view
        </div>
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-brand-gold/30">
          {validImages.map((img, idx) => {
            const isSelected = currentIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-brand-magenta ring-2 ring-brand-magenta/30 shadow-md scale-102'
                    : 'border-stone-200 opacity-60 hover:opacity-100 hover:border-brand-gold'
                }`}
              >
                <img
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/brijwasi-logo.jpg';
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-brand-magenta/10 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between text-white z-20" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="font-serif font-bold text-sm sm:text-base text-brand-gold">
                {productName}
              </span>
              <span className="text-xs text-stone-400">
                ({currentIndex + 1} of {validImages.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 bg-white/10 hover:bg-red-600/80 text-white rounded-full transition-all"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Centered Large Image Stage */}
          <div 
            className="flex-1 flex items-center justify-center relative overflow-hidden py-4"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`transition-all duration-300 ${isZoomed ? 'cursor-zoom-out scale-175' : 'cursor-zoom-in'}`}>
              <img
                src={currentImageUrl}
                alt={`${productName} full view`}
                onClick={() => setIsZoomed(!isZoomed)}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/brijwasi-logo.jpg';
                }}
              />
            </div>

            {/* Prev / Next Buttons */}
            {validImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all hover:scale-110 z-20"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white transition-all hover:scale-110 z-20"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails Navigation */}
          <div 
            className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {validImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsZoomed(false);
                }}
                className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx
                    ? 'border-brand-magenta scale-105 shadow-md'
                    : 'border-white/20 opacity-50 hover:opacity-90'
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/brijwasi-logo.jpg';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
