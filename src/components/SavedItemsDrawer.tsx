import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, MessageCircle, Heart, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface SavedItemsDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onQuickView?: (product: Product) => void;
}

export const SavedItemsDrawer: React.FC<SavedItemsDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  onQuickView: propOnQuickView
}) => {
  const { 
    savedProductIds, 
    products, 
    toggleSaveProduct, 
    isSavedDrawerOpen: storeIsOpen, 
    setIsSavedDrawerOpen, 
    setQuickViewProduct,
    openWhatsApp 
  } = useStore();

  const isActuallyOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActuallyOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActuallyOpen]);

  if (!isActuallyOpen) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    }
    setIsSavedDrawerOpen(false);
  };

  const handleItemClick = (p: Product) => {
    if (propOnQuickView) {
      propOnQuickView(p);
    } else {
      setQuickViewProduct(p);
    }
    handleClose();
  };

  const handleExploreDrops = () => {
    handleClose();
    setTimeout(() => {
      const catalog = document.getElementById('product-catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const savedProducts = (products || []).filter(p => p && (savedProductIds || []).includes(p.id));
  const totalPrice = savedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleClaimAllOnWhatsApp = () => {
    if (savedProducts.length === 0) return;
    const itemsList = savedProducts.map(p => `• ${p.name} (Ref: #${p.id} | Size: ${p.size}) - ₦${p.price.toLocaleString()}`).join('\n');
    const message = `Hi Miemie! I have saved these ${savedProducts.length} items on your website:\n\n${itemsList}\n\n*Total:* ₦${totalPrice.toLocaleString()}\n\nAre these still available so I can make transfer and claim them?`;
    openWhatsApp(undefined, message);
    handleClose();
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all items from your saved wishlist?')) {
      savedProducts.forEach(p => toggleSaveProduct(p.id));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-[#1E1611]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      
      <div className="bg-[#FBF9F5] w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#E7E2D8] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D8] flex items-center justify-between bg-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D95A2B] fill-[#D95A2B]" />
            <h2 className="font-display text-lg font-extrabold text-[#1E1611]">
              Saved Wishlist ({savedProducts.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {savedProducts.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] font-bold text-[#7A6E65] hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-stone-200 cursor-pointer"
                title="Clear all saved pieces"
              >
                Clear all
              </button>
            )}

            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-[#EAE5DC] text-[#1E1611] transition-colors cursor-pointer"
              aria-label="Close saved drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {savedProducts.length > 0 ? (
            savedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E7E2D8] shadow-2xs hover:border-[#D95A2B] transition-all group"
              >
                <div 
                  className="relative w-18 h-22 rounded-xl overflow-hidden bg-stone-200 shrink-0 cursor-pointer"
                  onClick={() => handleItemClick(product)}
                >
                  <img
                    src={product.coverImage || (product.images && product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.status === 'available' && (
                    <span className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-[#7A6E65] mb-0.5">
                    <span className="font-semibold uppercase text-[#D95A2B] text-[10px]">{product.category.replace('-', ' ')} · Size {product.size}</span>
                    <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                      product.status === 'available' ? 'bg-[#E8F8EE] text-[#0F823B]' : 'bg-[#FFEFEA] text-[#D95A2B]'
                    }`}>
                      {product.status}
                    </span>
                  </div>

                  <h3 
                    onClick={() => handleItemClick(product)}
                    className="font-display text-xs sm:text-sm font-bold text-[#1E1611] truncate cursor-pointer hover:text-[#D95A2B]"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-display text-sm sm:text-base font-black text-[#1E1611]">
                      ₦{product.price.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {product.status === 'available' && (
                        <button
                          type="button"
                          onClick={() => {
                            openWhatsApp(product);
                            handleClose();
                          }}
                          className="bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] text-[11px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Claim this specific piece on WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 fill-[#0A2E14]" />
                          <span>Claim</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleSaveProduct(product.id)}
                        className="text-[#7A6E65] hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-base font-bold text-[#1E1611]">Your saved rack is empty</h3>
                <p className="text-xs text-[#7A6E65] max-w-xs mx-auto">
                  Tap the heart icon on any vintage piece in the catalog to save it here before another buyer claims it.
                </p>
              </div>
              
              <button
                type="button"
                onClick={handleExploreDrops}
                className="mt-4 inline-flex items-center gap-2 bg-[#1E1611] hover:bg-[#3E2F26] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D95A2B]" />
                <span>Explore Live Drops</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout via WhatsApp */}
        {savedProducts.length > 0 && (
          <div className="p-5 border-t border-[#E7E2D8] bg-[#F4EFE6] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5A4E45] font-medium">Subtotal ({savedProducts.length} items):</span>
              <span className="font-display text-xl font-black text-[#1E1611]">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>

            <p className="text-[11px] text-[#7A6E65] leading-tight flex items-center gap-1.5">
              <span>💡</span>
              <span><strong>Stockpiling available:</strong> Hold your saved pieces for up to 14 days and pay only 1 delivery fee!</span>
            </p>

            <button
              onClick={handleClaimAllOnWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-black text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-[#0A2E14]" />
              <span>Claim All {savedProducts.length} Pieces on WhatsApp</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
