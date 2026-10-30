import React, { useEffect } from 'react';
import { GoldDivider } from '../components/common/MughalArch';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useStore();
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <Truck className="w-10 h-10 text-brand-magenta mx-auto mb-2" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Shipping & Delivery Policy
          </h1>
          <GoldDivider />
          <p className="text-xs text-stone-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-6 sm:p-10 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">1. Pan-India Delivery Network</h2>
            <p>
              Brijwasi Pethe Wale partners with tier-1 express courier partners including Blue Dart, Delhivery, and DTDC to provide air and surface express delivery across 19,000+ PIN codes across India.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">2. Processing & Dispatch Times</h2>
            <p>
              All sweets are prepared fresh in our Agra kitchen. Orders placed before 1:00 PM IST are dispatched on the same business day. Orders placed after 1:00 PM are dispatched the next working morning.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">3. Transit Time Estimates</h2>
            <ul className="list-disc list-inside space-y-1 mt-2 text-stone-600">
              <li><strong>Delhi NCR, Western UP, Haryana, Rajasthan:</strong> 1 - 2 Business Days</li>
              <li><strong>Metro Cities (Mumbai, Bengaluru, Kolkata, Hyderabad, Chennai):</strong> 2 - 3 Business Days</li>
              <li><strong>Rest of India:</strong> 3 - 5 Business Days</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">4. Shipping Charges & Free Shipping</h2>
            <p>
              We offer <strong>FREE shipping on all orders above ₹{settings.freeShippingThreshold}</strong>. For orders below this threshold, a flat nominal delivery charge of ₹{settings.standardShippingFee} applies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">5. Moisture-Proof Food-Safe Packaging</h2>
            <p>
              Our petha is packed in sealed, food-grade airtight containers designed to preserve moisture and freshness during transit.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <RotateCcw className="w-10 h-10 text-brand-magenta mx-auto mb-2" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Return & Refund Policy
          </h1>
          <GoldDivider />
          <p className="text-xs text-stone-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-6 sm:p-10 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">1. Perishable Food Goods</h2>
            <p>
              Because our sweets and namkeen are perishable food items prepared with zero artificial chemical preservatives, we do not accept general returns once a package has been dispatched and delivered.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">2. Damaged or Tampered Shipments</h2>
            <p>
              If your package arrives physically crushed, leaking, or with broken seals:
            </p>
            <ol className="list-decimal list-inside space-y-1 mt-2 text-stone-600">
              <li>Take clear photographs/video of the outer box and inner contents.</li>
              <li>Notify us via WhatsApp or email within 24 hours of delivery.</li>
              <li>Our team will arrange an immediate free fresh replacement or process a full 100% refund.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">3. Refund Processing Timeline</h2>
            <p>
              Approved refunds will be credited back to your original source of payment (UPI/Card/Bank) within 3 to 5 business days. For COD orders, refund is transferred directly to your UPI ID or bank account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center">
          <ShieldCheck className="w-10 h-10 text-brand-magenta mx-auto mb-2" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy">
            Privacy Policy
          </h1>
          <GoldDivider />
          <p className="text-xs text-stone-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-card p-6 sm:p-10 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-6">
          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">1. Information We Collect</h2>
            <p>
              We collect your name, mobile number, delivery address, and email solely to process your order, communicate dispatch status, and provide customer support.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">2. Payment Security</h2>
            <p>
              Brijwasi Pethe Wale never stores your debit card, credit card, CVV, or banking passwords. All online payments are securely processed by Razorpay using bank-grade 256-bit encryption and PCI-DSS compliance.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-bold text-brand-navy mb-2">3. No Third-Party Selling</h2>
            <p>
              We strictly respect your privacy. We never sell, rent, or lease your personal contact information to any third-party marketing companies.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
