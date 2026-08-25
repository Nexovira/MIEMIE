import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Layers, Package, MessageCircle } from 'lucide-react';

interface BottomMobileNavProps {
  onOpenSaved?: () => void;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = () => {
  const { openWhatsApp } = useStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 w-full max-w-[100vw] bg-[#1E1611]/98 backdrop-blur-md border-t border-[#3E2F26] text-[#FBF9F5] shadow-lg"
      style={{
        boxSizing: 'border-box',
        paddingLeft: 'max(8px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(8px, env(safe-area-inset-right, 0px))',
        paddingTop: '6px',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div className="flex items-center justify-between w-full">
        
        {/* 1. Explore */}
        <button
          onClick={() => scrollTo('product-catalog')}
          className="flex-1 min-w-0 max-w-[25%] flex flex-col items-center justify-center gap-0.5 text-stone-300 hover:text-white active:text-[#D95A2B] py-1 px-0.5 min-h-[44px] transition-colors cursor-pointer"
          type="button"
        >
          <Sparkles className="w-5 h-5 text-[#D95A2B] shrink-0" />
          <span className="text-[10px] xs:text-[11px] font-bold tracking-tight truncate w-full text-center">
            Explore
          </span>
        </button>

        {/* 2. Categories */}
        <button
          onClick={() => scrollTo('category-discovery')}
          className="flex-1 min-w-0 max-w-[25%] flex flex-col items-center justify-center gap-0.5 text-stone-300 hover:text-white active:text-[#D95A2B] py-1 px-0.5 min-h-[44px] transition-colors cursor-pointer"
          type="button"
        >
          <Layers className="w-5 h-5 text-stone-300 shrink-0" />
          <span className="text-[10px] xs:text-[11px] font-medium tracking-tight truncate w-full text-center">
            Categories
          </span>
        </button>

        {/* 3. Wholesale */}
        <button
          onClick={() => scrollTo('wholesale-section')}
          className="flex-1 min-w-0 max-w-[25%] flex flex-col items-center justify-center gap-0.5 text-stone-300 hover:text-white active:text-[#D95A2B] py-1 px-0.5 min-h-[44px] transition-colors cursor-pointer"
          type="button"
        >
          <Package className="w-5 h-5 text-[#D95A2B] shrink-0" />
          <span className="text-[10px] xs:text-[11px] font-medium tracking-tight truncate w-full text-center">
            Wholesale
          </span>
        </button>

        {/* 4. WhatsApp */}
        <button
          onClick={() => openWhatsApp(undefined, 'Hi Miemie! I am browsing the website and would like to claim an item.')}
          className="flex-1 min-w-0 max-w-[25%] flex flex-col items-center justify-center gap-0.5 text-[#25D366] hover:text-[#42f584] py-1 px-0.5 min-h-[44px] transition-colors cursor-pointer"
          aria-label="WhatsApp Miemie"
          type="button"
        >
          <div className="w-6 h-6 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 fill-current text-[#25D366]" />
          </div>
          <span className="text-[10px] xs:text-[11px] font-bold tracking-tight truncate w-full text-center text-[#25D366]">
            WhatsApp
          </span>
        </button>

      </div>
    </nav>
  );
};

