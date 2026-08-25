import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Product } from './types';

// Storefront Components
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BrandStatement } from './components/BrandStatement';
import { CategoryRail } from './components/CategoryRail';
import { ProductGrid } from './components/ProductGrid';
import { WholesaleSection } from './components/WholesaleSection';
import { HowToOrderSection } from './components/HowToOrderSection';
import { TrustAndFaqSection } from './components/TrustAndFaqSection';
import { OwnerStorySection } from './components/OwnerStorySection';
import { InstagramCommunitySection } from './components/InstagramCommunitySection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { BottomMobileNav } from './components/BottomMobileNav';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { SavedItemsDrawer } from './components/SavedItemsDrawer';

// Admin Components
import { AdminAuth } from './components/admin/AdminAuth';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    isSavedDrawerOpen, 
    setIsSavedDrawerOpen,
    products 
  } = useStore();
  
  const [view, setView] = useState<'store' | 'admin'>('store');

  // Check URL hash for direct #admin navigation or shared #product-{id} links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setView('admin');
      } else if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const target = products.find(p => p.id === prodId);
        if (target) {
          setQuickViewProduct(target);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [products, setQuickViewProduct]);

  const handleOpenAdmin = () => {
    setView('admin');
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitAdmin = () => {
    setView('store');
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin View if requested
  if (view === 'admin') {
    if (!currentUser) {
      return <AdminAuth onBackToStore={handleExitAdmin} />;
    }
    return <AdminDashboard onExitAdmin={handleExitAdmin} />;
  }

  // Render Public Fashion Storefront
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1E1611] flex flex-col font-sans selection:bg-[#FFEFEA] selection:text-[#D95A2B]">
      
      {/* Primary Sticky Editorial Navbar */}
      <Navbar
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Storefront Body with safe bottom padding for fixed mobile nav */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden pb-[calc(88px+env(safe-area-inset-bottom,0px))] md:pb-0">
        
        {/* Editorial Hero */}
        <HeroSection onExploreDrops={() => {
          const el = document.getElementById('product-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} />

        {/* Brand Statement Banner */}
        <BrandStatement />

        {/* Category Discovery Navigation */}
        <CategoryRail />

        {/* Live Product Drops Grid */}
        <ProductGrid onQuickView={(prod) => setQuickViewProduct(prod)} />

        {/* Wholesale & Reseller Starter Bales */}
        <WholesaleSection />

        {/* How to Claim in 4 Steps */}
        <HowToOrderSection />

        {/* Delivery, Pickup in Egbeda & Stockpiling Trust Accordion */}
        <TrustAndFaqSection />

        {/* About Miemie ("The Eye Behind The Find") */}
        <OwnerStorySection />

        {/* Instagram Gang & Styling Inspiration */}
        <InstagramCommunitySection />

        {/* Final Conversion WhatsApp CTA */}
        <FinalCtaSection />

      </main>

      {/* Storefront Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Mobile Bottom Sticky Navigation */}
      <BottomMobileNav onOpenSaved={() => setIsSavedDrawerOpen(true)} />

      {/* Interactive Modals and Drawers */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => {
            setQuickViewProduct(null);
            if (window.location.hash.startsWith('#product-')) {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }}
        />
      )}

      <SavedItemsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainAppContent />
      </StoreProvider>
    </AuthProvider>
  );
}
