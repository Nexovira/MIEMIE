import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { 
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
  Truck,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminView?: boolean;
  onExitAdmin?: () => void;
  onOpenSaved?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, isAdminView = false, onExitAdmin = () => {}, onOpenSaved }) => {
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

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleOpenSavedDrawer = () => {
    setIsSavedDrawerOpen(true);
    if (onOpenSaved) onOpenSaved();
  };

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
    <>
      <header 
        className={`sticky top-0 z-40 w-full max-w-full overflow-x-hidden transition-all duration-200 ${
          isScrolled 
            ? 'bg-[#FBF9F5]/95 backdrop-blur-md shadow-xs border-b border-[#E7E2D8]' 
            : 'bg-[#FBF9F5] border-b border-[#E7E2D8]/60'
        }`}
        style={{
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
          boxSizing: 'border-box'
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-2">
            
            {/* Left: Mobile Hamburger Button (< 1024px / lg:hidden) */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(true)}
                className="w-11 h-11 flex items-center justify-center rounded-xl text-[#1E1611] hover:bg-[#EFECE4] active:bg-[#E2DDD2] transition-colors -ml-1.5 cursor-pointer"
                aria-label="Open navigation menu"
                type="button"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Center / Left: Brand Wordmark (Responsive logo with bounded max-width) */}
            <div className="flex items-center justify-center sm:justify-start min-w-0 flex-1 lg:flex-initial">
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (isAdminView) onExitAdmin(); 
                  window.scrollTo({ top: 0, behavior: 'smooth' }); 
                }}
                className="group flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 max-w-[200px] xs:max-w-[240px] sm:max-w-none"
              >
                <span className="font-display font-black text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-[#1E1611] group-hover:text-[#D95A2B] transition-colors leading-tight truncate w-full">
                  THRIFT WITH MIEMIE
                </span>
                <span className="text-[8px] xs:text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-[#7A6E65] uppercase font-bold mt-0.5 whitespace-nowrap">
                  EGBEDA · LAGOS
                </span>
              </a>
            </div>

            {/* Desktop Navigation Links (>= 1024px / hidden lg:flex) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-[#3E2F26]">
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

            {/* Right: Actions (Wishlist & Compact WhatsApp on mobile; full actions on desktop) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              
              {/* Wishlist / Saved Items */}
              <button
                id="saved-items-btn"
                onClick={handleOpenSavedDrawer}
                className="relative w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#EFECE4] text-[#1E1611] transition-colors cursor-pointer"
                title="Saved Pieces"
                aria-label={`Saved pieces (${savedProductIds.length})`}
                type="button"
              >
                <Heart className={`w-5 h-5 ${savedProductIds.length > 0 ? 'text-[#D95A2B] fill-[#D95A2B]' : ''}`} />
                {savedProductIds.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-[#D95A2B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {savedProductIds.length}
                  </span>
                )}
              </button>

              {/* Admin Switcher (Desktop only or accessible in mobile menu) */}
              <button
                id="admin-dashboard-btn"
                onClick={isAdminView ? onExitAdmin : onOpenAdmin}
                className={`hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-full transition-colors items-center gap-1.5 text-xs font-semibold ${
                  isAdminView 
                    ? 'bg-[#1E1611] text-white hover:bg-[#3E2F26]' 
                    : 'text-[#7A6E65] hover:text-[#1E1611] hover:bg-[#EFECE4]'
                }`}
                title={isAdminView ? "Back to Store" : "Owner Admin Dashboard"}
                type="button"
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden md:inline">{isAdminView ? "View Store" : (isAdmin ? "Admin Portal" : "Owner Login")}</span>
              </button>

              {/* Compact Responsive WhatsApp Button */}
              <button
                id="header-whatsapp-cta"
                onClick={() => openWhatsApp(undefined, 'Hi Miemie! I am on your website and want to chat about claiming thrift pieces.')}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer min-h-[38px]"
                aria-label="Shop on WhatsApp"
                type="button"
              >
                <MessageCircle className="w-4 h-4 fill-[#0A2E14] shrink-0" />
                <span className="hidden sm:inline">Shop on WhatsApp</span>
                <span className="sm:hidden text-[11px] font-extrabold pr-0.5">Chat</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Drawer Panel */}
          <div 
            className="fixed inset-y-0 left-0 max-w-[320px] xs:max-w-[340px] w-[85vw] bg-[#FBF9F5] shadow-2xl flex flex-col justify-between border-r border-[#E7E2D8] animate-in slide-in-from-left duration-250 z-10"
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              paddingLeft: 'env(safe-area-inset-left, 0px)'
            }}
          >
            {/* Drawer Header with Close Button */}
            <div className="p-4 border-b border-[#E7E2D8] flex items-center justify-between bg-[#F4EFE6]">
              <div>
                <span className="font-display font-black text-base text-[#1E1611] tracking-tight block">
                  THRIFT WITH MIEMIE
                </span>
                <span className="text-[9px] text-[#7A6E65] font-bold tracking-widest uppercase">
                  EGBEDA, LAGOS
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#1E1611] hover:bg-[#EAE5DC] active:bg-[#DCD5C9] transition-colors cursor-pointer"
                aria-label="Close navigation menu"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              
              {/* Admin & Owner Dashboard Access Button in Hamburger Menu */}
              <button
                id="mobile-drawer-admin-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdminView) onExitAdmin();
                  else onOpenAdmin();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl font-bold text-sm transition-all min-h-[52px] cursor-pointer shadow-xs border ${
                  isAdminView
                    ? 'bg-[#1E1611] text-white border-[#3E2F26]'
                    : isAdmin
                    ? 'bg-gradient-to-r from-[#1E1611] to-[#2E2018] text-white border-[#3E2F26]'
                    : 'bg-[#1E1611] text-white hover:bg-[#2A2019] border-[#3E2F26]'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#D95A2B] text-white flex items-center justify-center shadow-xs shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-black uppercase tracking-wider text-white">
                      {isAdminView ? "Return to Store" : "Admin Dashboard"}
                    </span>
                    <span className="block text-[10px] text-stone-300 font-normal">
                      {isAdmin ? "Inventory, Prices & Site Copy" : "Owner & Team Login"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isAdmin ? (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold uppercase">
                      Online
                    </span>
                  ) : (
                    <span className="text-[9px] bg-white/10 text-stone-300 px-1.5 py-0.5 rounded-full font-bold uppercase">
                      Admin
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>

              <div className="h-px bg-[#E7E2D8] my-2" />

              {/* Fresh Drops Link */}
              <button
                onClick={() => handleNavClick('product-catalog')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6] text-[#1E1611] font-semibold text-sm hover:bg-[#EAE5DC] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#D95A2B]" />
                  <span>New Drops Catalogue</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
              </button>

              {/* Categories */}
              <button
                onClick={() => handleNavClick('category-discovery')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6] text-[#1E1611] font-semibold text-sm hover:bg-[#EAE5DC] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#3E2F26]" />
                  <span>Shop by Category</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
              </button>

              {/* Saved Pieces Item */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenSavedDrawer();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#FFEFEA] text-[#D95A2B] font-bold text-sm hover:bg-[#FCD5C8] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer border border-[#FCD5C8]"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-4 h-4 fill-[#D95A2B]" />
                  <span>My Saved Pieces</span>
                </span>
                <span className="bg-[#D95A2B] text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {savedProductIds.length}
                </span>
              </button>

              {/* Wholesale Bales */}
              <button
                onClick={() => handleNavClick('wholesale-section')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6] text-[#1E1611] font-semibold text-sm hover:bg-[#EAE5DC] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#D95A2B]" />
                  <span>Wholesale Bales (Resellers)</span>
                </span>
                <span className="text-[10px] bg-[#D95A2B] text-white px-2 py-0.5 rounded-full font-bold uppercase">
                  Hot
                </span>
              </button>

              {/* How It Works */}
              <button
                onClick={() => handleNavClick('how-to-order')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6] text-[#1E1611] font-semibold text-sm hover:bg-[#EAE5DC] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-[#3E2F26]" />
                  <span>How It Works</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
              </button>

              {/* Delivery & Stockpiling */}
              <button
                onClick={() => handleNavClick('trust-faq')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6] text-[#1E1611] font-semibold text-sm hover:bg-[#EAE5DC] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-[#3E2F26]" />
                  <span>Delivery & 14-Day Hold</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
              </button>

              {/* About Miemie */}
              <button
                onClick={() => handleNavClick('owner-story')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#F4EFE6] text-[#1E1611] font-semibold text-sm hover:bg-[#EAE5DC] active:scale-[0.99] transition-all min-h-[48px] cursor-pointer"
                type="button"
              >
                <span className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#3E2F26]" />
                  <span>About Miemie (Curator)</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#7A6E65]" />
              </button>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E7E2D8] bg-[#F4EFE6] space-y-3">
              
              {/* WhatsApp Quick CTA in menu */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWhatsApp(undefined, 'Hi Miemie! I am on your website and want to chat about claiming thrift pieces.');
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-black text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer min-h-[44px]"
                type="button"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>

              {/* Location and Owner Portal */}
              <div className="flex items-center justify-between text-[11px] text-[#7A6E65] pt-1">
                <span>📍 Egbeda, Lagos</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isAdminView) onExitAdmin();
                    else onOpenAdmin();
                  }}
                  className="text-[#D95A2B] font-bold hover:underline flex items-center gap-1 cursor-pointer py-1"
                  type="button"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAdminView ? "View Store" : "Owner Portal"}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

