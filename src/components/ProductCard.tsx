import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Sparkles, 
  Tag, 
  Check, 
  Clock, 
  Lock,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { toggleSaveProduct, isSaved, setQuickViewProduct, openWhatsApp } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const saved = isSaved(product.id);

  const handleOpenQuickView = () => {
    if (onQuickView) {
      onQuickView(product);
    } else {
      setQuickViewProduct(product);
    }
  };

  // Status color badges
  const getStatusBadge = () => {
    switch (product.status) {
      case 'available':
        return (
          <span className="bg-[#0F823B] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
            Available
          </span>
        );
      case 'reserved':
        return (
          <span className="bg-[#D97706] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <Clock className="w-3 h-3" />
            Reserved (Hold)
          </span>
        );
      case 'sold':
        return (
          <span className="bg-[#78350F] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 opacity-90">
            <Lock className="w-3 h-3" />
            Sold Out
          </span>
        );
      default:
        return null;
    }
  };

  const imageSrc = isHovered && product.images && product.images.length > 1 
    ? product.images[1] 
    : (product.coverImage || (product.images && product.images[0]) || '');

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col rounded-2xl bg-[#FBF9F5] border border-[#E7E2D8] hover:border-[#D95A2B] hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F0ECE4]">
        <img
          src={imageSrc}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            product.status === 'sold' ? 'grayscale-40 opacity-80' : 'group-hover:scale-105'
          }`}
          loading="lazy"
        />

        {/* Top Badges & Actions Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex flex-col gap-1 items-start">
            {getStatusBadge()}
            {product.newArrival && product.status === 'available' && (
              <span className="bg-[#D95A2B] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                New Drop
              </span>
            )}
            {product.wholesaleAvailable && (
              <span className="bg-[#1E1611] text-[#FBF9F5] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Wholesale Available
              </span>
            )}
          </div>

          {/* Wishlist / Save Button (Interactive) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProduct(product.id);
            }}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
              saved 
                ? 'bg-[#D95A2B] text-white shadow-md' 
                : 'bg-white/80 text-[#1E1611] hover:bg-white hover:text-[#D95A2B]'
            }`}
            title={saved ? "Remove from saved" : "Save piece"}
            aria-label={saved ? "Remove from saved" : "Save piece"}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Quick View Button on Hover (Desktop) / Always Tap on Mobile */}
        <button
          onClick={handleOpenQuickView}
          className="absolute inset-x-3 bottom-3 bg-[#1E1611]/90 hover:bg-[#1E1611] text-white text-xs font-bold py-2.5 px-4 rounded-xl backdrop-blur-xs flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md cursor-pointer z-10"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View & Details</span>
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3">
        
        {/* Category & Condition Tags */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#7A6E65]">
            <span className="uppercase tracking-wider text-[#D95A2B]">{product.category.replace('-', ' ')}</span>
            <span className="bg-[#EFECE4] text-[#3E2F26] px-2 py-0.5 rounded-md font-medium">
              Size: {product.size}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={handleOpenQuickView}
            className="font-display text-sm sm:text-base font-bold text-[#1E1611] leading-snug line-clamp-2 hover:text-[#D95A2B] transition-colors cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Condition note */}
          <div className="flex items-center gap-1.5 text-xs text-[#5A4E45]">
            <Tag className="w-3 h-3 text-[#D95A2B] shrink-0" />
            <span className="truncate">{product.condition}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E7E2D8] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-base sm:text-lg font-extrabold text-[#1E1611]">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#9E948B] line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#7A6E65] block">
              {product.currency === 'NGN' ? 'Nigerian Naira' : 'USD'}
            </span>
          </div>

          {/* Direct WhatsApp Claim Button */}
          {product.status === 'available' ? (
            <button
              onClick={() => openWhatsApp(product)}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] text-xs font-extrabold py-2 px-3 sm:px-3.5 rounded-xl flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              title="Claim on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#0A2E14]" />
              <span className="hidden sm:inline">Claim</span>
              <span className="sm:hidden">Buy</span>
            </button>
          ) : product.status === 'reserved' ? (
            <button
              onClick={() => openWhatsApp(product, `Hi Miemie! I saw "${product.name}" is currently reserved. Can I be first on the backup list if payment is not completed?`)}
              className="bg-[#FFEFEA] hover:bg-[#FCD5C8] text-[#D95A2B] text-xs font-bold py-2 px-2.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              title="Join backup claim list"
            >
              <Clock className="w-3 h-3" />
              <span>Backup</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-[#7A6E65] bg-[#EFECE4] py-1.5 px-2.5 rounded-lg">
              Sold Out
            </span>
          )}

        </div>

      </div>
    </div>
  );
};
