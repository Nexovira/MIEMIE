import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Search,
  Sparkles,
  Package,
  Layers,
  HelpCircle,
  Truck
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminView: boolean;
  onExitAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminView, onExitAdmin }) => {
  const { siteContent, savedProductIds, setIsSavedDrawerOpen, openWhatsApp, setFilter } = useStore();
  const { isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string, categoryFilter?: string) => {
    setMobileMenuOpen(false);
    if (isAdminView) {
      onExitAdmin();
    }
    if (categoryFilter) {
      setFilter(prev => ({ ...prev, category: categoryFilter as any }));
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#FBF9F5]/90 backdrop-blur-md shadow-xs border-b border-[#E7E2D8]' 
        : 'bg-[#FBF9F5] border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 md:h-20">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#1E1611] hover:bg-[#EFECE4] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <button
              onClick={() => handleNavClick('product-catalog')}
              className="p-2 rounded-lg text-[#1E1611] hover:bg-[#EFECE4] transition-colors md:hidden"
              aria-label="Search items"
            >
              <Search className="w-5 h-5 text-[#3E2F26]" />
            </button>
          </div>

          {/* Brand Wordmark */}
          <div className="flex items-center">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); if (isAdminView) onExitAdmin(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group flex flex-col items-center sm:items-start"
            >
              <span className="font-display font-black text-lg sm:text-2xl md:text-3xl tracking-wider text-[#1E1611] group-hover:text-[#D95A2B] transition-colors leading-none">
                THRIFT WITH MIEMIE
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#7A6E65] uppercase font-bold mt-1">
                EGBEDA · LAGOS
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#3E2F26]">
            <button 
              onClick={() => handleNavClick('product-catalog')}
              className="hover:text-[#D95A2B] transition-colors cursor-pointer py-1"
            >
              New Drops
            </button>
            <button 
              onClick={() => handleNavClick('category-discovery')}
              className="hover:text-[#D95A2B] transition-colors cursor-pointer py-1"
            >
              Categories
            </button>
            <button 
              onClick={() => handleNavClick('wholesale-section')}
              className="flex items-center gap-1 text-[#D95A2B] font-semibold hover:text-[#b84218] transition-colors cursor-pointer py-1"
            >
              <Package className="w-3.5 h-3.5" />
              Wholesale Bales
            </button>
            <button 
              onClick={() => handleNavClick('how-to-order')}
              className="hover:text-[#D95A2B] transition-colors cursor-pointer py-1"
            >
              How It Works
            </button>
            <button 
              onClick={() => handleNavClick('trust-faq')}
              className="hover:text-[#D95A2B] transition-colors cursor-pointer py-1"
            >
              Delivery & Stockpiling
            </button>
            <button 
              onClick={() => handleNavClick('owner-story')}
              className="hover:text-[#D95A2B] transition-colors cursor-pointer py-1"
            >
              About Miemie
            </button>
          </nav>

          {/* Right Action Icons & WhatsApp Button */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            
            {/* Wishlist / Saved Items */}
            <button
              id="saved-items-btn"
              onClick={() => setIsSavedDrawerOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-[#EFECE4] text-[#1E1611] transition-colors cursor-pointer"
              title="Saved Items"
              aria-label={`Saved items (${savedProductIds.length})`}
            >
              <Heart className="w-5 h-5" />
              {savedProductIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D95A2B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {savedProductIds.length}
                </span>
              )}
            </button>

            {/* Admin Switcher */}
            <button
              id="admin-dashboard-btn"
              onClick={isAdminView ? onExitAdmin : onOpenAdmin}
              className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold ${
                isAdminView 
                  ? 'bg-[#1E1611] text-white hover:bg-[#3E2F26]' 
                  : 'text-[#7A6E65] hover:text-[#1E1611] hover:bg-[#EFECE4]'
              }`}
              title={isAdminView ? "Back to Store" : "Owner Admin Dashboard"}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline">{isAdminView ? "View Store" : (isAdmin ? "Admin (Live)" : "Owner Login")}</span>
            </button>

            {/* Primary WhatsApp CTA */}
            <button
              id="header-whatsapp-cta"
              onClick={() => openWhatsApp(undefined, 'Hi Miemie! I am on your website and want to chat about claiming thrift pieces.')}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-[#0A2E14]" />
              <span className="hidden sm:inline">Shop on WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 md:top-20 bg-[#FBF9F5] border-b border-[#E7E2D8] shadow-xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('product-catalog')}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F4EFE6] text-[#1E1611] text-left"
            >
              <Sparkles className="w-4 h-4 text-[#D95A2B]" />
              <span>Fresh Drops</span>
            </button>
            <button
              onClick={() => handleNavClick('category-discovery')}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F4EFE6] text-[#1E1611] text-left"
            >
              <Layers className="w-4 h-4 text-[#3E2F26]" />
              <span>Categories</span>
            </button>
            <button
              onClick={() => handleNavClick('wholesale-section')}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#FFEFEA] text-[#D95A2B] font-semibold text-left col-span-2"
            >
              <Package className="w-4 h-4 text-[#D95A2B]" />
              <span>Wholesale Bales (Start Your Thrift Hustle)</span>
            </button>
            <button
              onClick={() => handleNavClick('how-to-order')}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F4EFE6] text-[#1E1611] text-left"
            >
              <HelpCircle className="w-4 h-4 text-[#3E2F26]" />
              <span>How To Order</span>
            </button>
            <button
              onClick={() => handleNavClick('trust-faq')}
              className="flex items-center gap-2 p-3 rounded-xl bg-[#F4EFE6] text-[#1E1611] text-left"
            >
              <Truck className="w-4 h-4 text-[#3E2F26]" />
              <span>Delivery & Hold</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#E7E2D8] flex items-center justify-between text-xs text-[#7A6E65]">
            <span>📍 Egbeda, Alimosho, Lagos</span>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="text-[#D95A2B] font-semibold hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Owner Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
