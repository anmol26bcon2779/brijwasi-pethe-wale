import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Package, 
  PackageCheck, 
  MapPin, 
  AlertCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OrderStatus } from '../types';
import { GoldDivider } from '../components/common/MughalArch';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [orderQuery, setOrderQuery] = useState(initialId);
  const { getOrderByIdOrNumber, settings } = useStore();
  const [currentOrder, setCurrentOrder] = useState(() => getOrderByIdOrNumber(initialId));
  const [searched, setSearched] = useState(Boolean(initialId));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialId) {
      const found = getOrderByIdOrNumber(initialId);
      setCurrentOrder(found);
      setSearched(true);
    }
  }, [initialId, getOrderByIdOrNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    const found = getOrderByIdOrNumber(orderQuery);
    setCurrentOrder(found);
    setSearched(true);
  };

  const statusSteps: OrderStatus[] = [
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Delivered'
  ];

  const getStepStatus = (step: OrderStatus) => {
    if (!currentOrder) return 'pending';
    if (currentOrder.status === 'Cancelled') return 'cancelled';

    const orderIndex = statusSteps.indexOf(currentOrder.status);
    const stepIndex = statusSteps.indexOf(step);

    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-brand-ivory py-10 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-brand-magenta font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Pan-India Express Tracking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-navy mt-1">
            Track Your Agra Delicacies
          </h1>
          <GoldDivider />
          <p className="text-xs sm:text-sm text-stone-600">
            Enter your Order Number (e.g. BPW-2026-XXXXX) provided at checkout or in your invoice.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-gold/40 shadow-card mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. BPW-2026-123456)"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-brand-magenta uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-3 px-7 bg-brand-navy hover:bg-brand-magenta text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
            >
              Track Status
            </button>
          </form>
        </div>

        {/* Order Details Found */}
        {searched && currentOrder && (
          <div className="bg-white rounded-3xl border border-brand-gold/30 shadow-card p-6 sm:p-8 space-y-8 animate-fadeIn">
            
            {/* Top overview */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold">Tracking Order</span>
                <h2 className="font-mono text-xl font-bold text-brand-magenta">{currentOrder.orderNumber}</h2>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-cream border border-brand-gold/40 text-brand-navy">
                  Current Status: <strong className="text-brand-magenta">{currentOrder.status}</strong>
                </span>
                {currentOrder.trackingNumber && (
                  <p className="text-xs text-stone-600 mt-1">
                    Courier: <strong>{currentOrder.courierPartner || 'Bluedart Express'}</strong> • Waybill: <span className="font-mono">{currentOrder.trackingNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Status Stepper */}
            <div>
              <h3 className="font-serif text-sm font-bold text-brand-navy mb-6">Delivery Progress</h3>
              
              <div className="grid grid-cols-5 gap-2 text-center relative">
                {statusSteps.map((step, idx) => {
                  const state = getStepStatus(step);
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors mb-2 z-10 ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : state === 'current'
                            ? 'bg-brand-magenta text-white ring-4 ring-brand-magenta/20 shadow-md'
                            : 'bg-stone-100 text-stone-400 border border-stone-200'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : state === 'current' ? (
                          <Clock className="w-5 h-5 animate-spin" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={`text-[11px] font-semibold ${state === 'current' ? 'text-brand-magenta' : 'text-stone-600'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline Notes */}
            <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
              <h4 className="font-bold text-xs text-brand-navy uppercase tracking-wider mb-3">Order Activity Log</h4>
              <div className="space-y-3">
                {currentOrder.statusTimeline.map((tl, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold text-stone-800">{tl.status}</span>
                      <p className="text-stone-600">{tl.notes}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0">
                      {new Date(tl.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between text-xs text-stone-600 gap-4">
              <div>
                <span className="font-bold text-brand-navy block mb-0.5">Shipping Destination:</span>
                <p>{currentOrder.customer.fullName}, {currentOrder.customer.addressLine1}</p>
                <p>{currentOrder.customer.city}, {currentOrder.customer.state} - {currentOrder.customer.pincode}</p>
              </div>
              <div className="sm:text-right">
                <span className="font-bold text-brand-navy block mb-0.5">Order Total:</span>
                <span className="font-serif text-base font-bold text-brand-magenta">₹{currentOrder.total}</span>
                <p className="text-stone-400">Payment: {currentOrder.paymentMethod}</p>
              </div>
            </div>

          </div>
        )}

        {/* Not Found Screen */}
        {searched && !currentOrder && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-card">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto mb-2" />
            <h3 className="font-serif text-lg font-bold text-brand-navy mb-1">No Order Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-5">
              We couldn't find an order matching "{orderQuery}". Please verify your order number in your confirmation email or invoice.
            </p>
            <div className="text-xs text-stone-600">
              Need assistance? Call our Agra store care team at{' '}
              <a href={`tel:${settings.phone}`} className="font-bold text-brand-magenta underline">
                {settings.phone}
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
