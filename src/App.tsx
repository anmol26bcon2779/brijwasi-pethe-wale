import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { PethaPage } from './pages/PethaPage';
import { NamkeenPage } from './pages/NamkeenPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutPage } from './pages/AboutPage';
import { HeritagePage } from './pages/HeritagePage';
import { ContactPage } from './pages/ContactPage';
import { ShippingPolicyPage, RefundPolicyPage, PrivacyPolicyPage } from './pages/PolicyPages';
import { AccountPage } from './pages/AccountPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-brand-ivory text-brand-brown selection:bg-brand-magenta selection:text-white font-sans">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <SearchModal />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/petha" element={<PethaPage />} />
          <Route path="/namkeen" element={<NamkeenPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/heritage" element={<HeritagePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<AccountPage />} />
          
          {/* Policy Pages */}
          <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <AuthProvider>
            <AppLayout />
          </AuthProvider>
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  );
};

export default App;
