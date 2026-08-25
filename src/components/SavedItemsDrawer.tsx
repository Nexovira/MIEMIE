import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, MessageCircle, Heart, ArrowRight } from 'lucide-react';
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

  const savedProducts = (products || []).filter(p => p && (savedProductIds || []).includes(p.id));
  const totalPrice = savedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

  const handleClaimAllOnWhatsApp = () => {
    if (savedProducts.length === 0) return;
    const itemsList = savedProducts.map(p => `• ${p.name} (Size: ${p.size}) - ₦${p.price.toLocaleString()}`).join('\n');
    const message = `Hi Miemie! I have saved these ${savedProducts.length} items from your website:\n\n${itemsList}\n\nTotal: ₦${totalPrice.toLocaleString()}\n\nAre they still available so I can make payment and claim them?`;
    openWhatsApp(undefined, message);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1E1611]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      
      <div className="bg-[#FBF9F5] w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-[#E7E2D8] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E7E2D8] flex items-center justify-between bg-[#F4EFE6]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D95A2B] fill-[#D95A2B]" />
            <h2 className="font-display text-lg font-extrabold text-[#1E1611]">
              Saved Pieces ({savedProducts.length})
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-[#EAE5DC] text-[#1E1611] transition-colors"
            aria-label="Close saved drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedProducts.length > 0 ? (
            savedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E7E2D8] shadow-2xs hover:border-[#D95A2B] transition-colors"
              >
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-16 h-20 rounded-xl object-cover bg-stone-200 shrink-0 cursor-pointer"
                  onClick={() => handleItemClick(product)}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] text-[#7A6E65]">
                    <span className="font-semibold">{product.size}</span>
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

                  <div className="flex items-center justify-between mt-1">
                    <span className="font-display text-sm font-black text-[#1E1611]">
                      ₦{product.price.toLocaleString()}
                    </span>

                    <button
                      onClick={() => toggleSaveProduct(product.id)}
                      className="text-[#7A6E65] hover:text-[#D95A2B] p-1 text-xs"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1E1611]">Your saved rack is empty</h3>
              <p className="text-xs text-[#7A6E65] max-w-xs mx-auto">
                Tap the heart icon on any thrift piece to save it here before it gets claimed by someone else.
              </p>
            </div>
          )}
        </div>

        {/* Footer Checkout via WhatsApp */}
        {savedProducts.length > 0 && (
          <div className="p-5 border-t border-[#E7E2D8] bg-[#F4EFE6] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5A4E45] font-medium">Subtotal ({savedProducts.length} items):</span>
              <span className="font-display text-lg font-black text-[#1E1611]">
                ₦{totalPrice.toLocaleString()}
              </span>
            </div>

            <p className="text-[11px] text-[#7A6E65] leading-tight">
              💡 Tip: You can request to <strong>Stockpile</strong> these items for up to 14 days and pay only one delivery fee!
            </p>

            <button
              onClick={handleClaimAllOnWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-black text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-[#0A2E14]" />
              <span>Claim All {savedProducts.length} Items on WhatsApp</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
