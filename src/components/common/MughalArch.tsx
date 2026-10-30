import React from 'react';

export const GoldDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 my-6 ${className}`}>
    <div className="h-[1px] w-16 md:w-24 bg-gradient-to-r from-transparent via-brand-gold to-brand-gold-dark opacity-60" />
    <div className="flex items-center gap-1.5 text-brand-gold">
      <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold inline-block" />
      <span className="w-2.5 h-2.5 rotate-45 border border-brand-gold inline-block" />
      <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold inline-block" />
    </div>
    <div className="h-[1px] w-16 md:w-24 bg-gradient-to-l from-transparent via-brand-gold to-brand-gold-dark opacity-60" />
  </div>
);

export const MughalArchFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`relative p-1 rounded-2xl bg-gradient-to-b from-brand-gold via-brand-gold-light to-brand-gold-dark shadow-royal ${className}`}>
    <div className="bg-brand-ivory rounded-[14px] p-6 h-full border border-brand-gold/30 relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-brand-gold/60" />
      <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-brand-gold/60" />
      <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-brand-gold/60" />
      <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-brand-gold/60" />
      {children}
    </div>
  </div>
);

export const VegBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    title="100% Pure Vegetarian"
    className={`inline-flex items-center justify-center w-5 h-5 rounded border border-green-600 bg-white shadow-xs ${className}`}
  >
    <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
  </span>
);
