import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Grid, MessageCircle, Package, Bookmark } from 'lucide-react';

interface BottomMobileNavProps {
  onOpenSaved: () => void;
}

export const BottomMobileNav: React.FC<BottomMobileNavProps> = ({ onOpenSaved }) => {
  const { savedItems, openWhatsApp } = useStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1E1611]/95 backdrop-blur-md border-t border-[#3E2F26] px-3 py-2 text-[#FBF9F5]">
      <div className="flex items-center justify-around">
        
        {/* Drops / Catalog */}
        <button
          onClick={() => scrollTo('product-catalog')}
          className="flex flex-col items-center gap-0.5 text-stone-300 hover:text-white p-1"
        >
          <Grid className="w-5 h-5 text-[#D95A2B]" />
          <span className="text-[10px] font-bold">Drops</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => scrollTo('category-discovery')}
          className="flex flex-col items-center gap-0.5 text-stone-300 hover:text-white p-1"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Categories</span>
        </button>

        {/* Center Giant WhatsApp Claim */}
        <button
          onClick={() => openWhatsApp(undefined, 'Hi Miemie! I am browsing the website and would like to claim an item.')}
          className="relative -top-3 w-12 h-12 rounded-full bg-[#25D366] text-[#0A2E14] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="WhatsApp Miemie"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>

        {/* Wholesale */}
        <button
          onClick={() => scrollTo('wholesale-section')}
          className="flex flex-col items-center gap-0.5 text-stone-300 hover:text-white p-1"
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-medium">Wholesale</span>
        </button>

        {/* Saved Items / Bag */}
        <button
          onClick={onOpenSaved}
          className="relative flex flex-col items-center gap-0.5 text-stone-300 hover:text-white p-1"
        >
          <Bookmark className="w-5 h-5" />
          <span className="text-[10px] font-medium">Saved</span>
          {savedItems.length > 0 && (
            <span className="absolute -top-1 right-1 w-4 h-4 rounded-full bg-[#D95A2B] text-white text-[9px] font-bold flex items-center justify-center">
              {savedItems.length}
            </span>
          )}
        </button>

      </div>
    </div>
  );
};
