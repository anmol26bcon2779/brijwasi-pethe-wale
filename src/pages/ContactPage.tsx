import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  Gift, 
  Building 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GoldDivider } from '../components/common/MughalArch';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Corporate Gifting',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Corporate Gifting',
        message: ''
      });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-brand-ivory py-12 sm:py-16 animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase">
            We Are Here to Serve You
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-navy mt-1">
            Contact Brijwasi Pethe Wale
          </h1>
          <GoldDivider />
          <p className="text-sm text-stone-600 leading-relaxed">
            Have questions regarding bulk gifting, custom wedding boxes, or order shipping? Reach out to our team in Agra.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Store Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-gold/40 shadow-card space-y-6">
              <h2 className="font-serif text-xl font-bold text-brand-navy flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-magenta" /> Flagship Store in Agra
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <p className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-brand-gold-dark shrink-0 mt-1" />
                  <span>
                    {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                  </span>
                </p>

                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-gold-dark shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-brand-magenta font-semibold">
                    {settings.phone}
                  </a>
                </p>

                <p className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand-gold-dark shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-brand-magenta font-semibold">
                    {settings.email}
                  </a>
                </p>

                <p className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-gold-dark shrink-0" />
                  <span>Open Daily: 8:00 AM – 10:00 PM IST</span>
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=Hello%20Brijwasi%20Pethe%20Wale`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Corporate & Wedding Gifting Box */}
            <div className="bg-brand-navy text-brand-cream p-6 rounded-3xl border border-brand-gold/60 shadow-royal space-y-3">
              <div className="flex items-center gap-2 text-brand-gold font-serif font-bold text-base">
                <Gift className="w-5 h-5" /> Corporate & Wedding Gifting
              </div>
              <p className="text-xs text-brand-cream/80 leading-relaxed">
                Planning bulk orders for Diwali, corporate hampers, or wedding mithai boxes? We customize velvet-embossed gift boxes with custom company branding and personalized cards.
              </p>
            </div>

          </div>

          {/* Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-brand-gold/40 shadow-card">
              <h2 className="font-serif text-2xl font-bold text-brand-navy mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Fill out the form below and our Agra team will respond within 2-4 business hours.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-lg font-bold">Message Received with Thanks!</h3>
                  <p className="text-xs text-emerald-700">
                    Our team in Agra will get in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Anand Mehra"
                        className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. anand@company.com"
                        className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Inquiry Purpose *</label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                      >
                        <option value="Corporate Gifting">Corporate Bulk Gifting</option>
                        <option value="Wedding Orders">Wedding Mithai Hampers</option>
                        <option value="Order Status Enquiry">Order Status / Delivery Enquiry</option>
                        <option value="General Question">General Feedback or Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Message or Requirements *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share number of gift boxes required, expected delivery dates, or specific questions..."
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-navy hover:bg-brand-magenta text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
