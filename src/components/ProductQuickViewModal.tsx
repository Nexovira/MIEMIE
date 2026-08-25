import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Tag, 
  Ruler, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Share2,
  Instagram,
  Copy,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';

import { Product } from '../types';

interface ProductQuickViewModalProps {
  product?: Product | null;
  onClose?: () => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({ 
  product: propProduct, 
  onClose: propOnClose 
}) => {
  const { 
    quickViewProduct: storeProduct, 
    setQuickViewProduct, 
    toggleSaveProduct, 
    isSaved, 
    openWhatsApp, 
    siteContent,
    setIsSavedDrawerOpen 
  } = useStore();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedIgCaption, setCopiedIgCaption] = useState(false);

  const activeProduct = propProduct !== undefined ? propProduct : storeProduct;

  if (!activeProduct) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    }
    setQuickViewProduct(null);
  };

  const images = (Array.isArray(activeProduct.images) && activeProduct.images.length > 0)
    ? activeProduct.images 
    : (activeProduct.coverImage ? [activeProduct.coverImage] : []);

  const saved = isSaved(activeProduct.id);

  const handleNextImage = () => {
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Generate shareable link
  const getProductShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#product-${activeProduct.id}`;
  };

  // 1. Share via WhatsApp
  const handleShareWhatsApp = () => {
    const url = getProductShareUrl();
    const message = `👗 *Thrift With Miemie - Handpicked Find*\n\nCheck out this rare vintage piece: *${activeProduct.name}*\n💰 Price: ₦${activeProduct.price.toLocaleString()}\n🏷️ Size: ${activeProduct.size} | Condition: ${activeProduct.condition}\n\n👉 View piece & claim before it's gone:\n${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // 2. Share via Instagram (Native Share or Story Caption Copy + IG Open)
  const handleShareInstagram = async () => {
    const url = getProductShareUrl();
    const igHandle = siteContent?.instagramHandle ? siteContent.instagramHandle.replace('@', '') : 'thrift_with_miemie_';
    const caption = `✨ Rare Thrift Find from @${igHandle}!\n"${activeProduct.name}"\nSize: ${activeProduct.size} · Price: ₦${activeProduct.price.toLocaleString()}\n\nClaim yours: ${url}\n#ThriftWithMiemie #LagosThrift #VintageStyle`;

    // If mobile browser supports native Web Share (allows choosing Instagram directly)
    if (navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `Thrift With Miemie: ${activeProduct.name}`,
          text: caption,
          url: url,
        });
        return;
      } catch (err) {
        // user cancelled or fallback
      }
    }

    // Fallback: Copy Instagram caption to clipboard and navigate to Instagram profile/feed
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedIgCaption(true);
      setTimeout(() => setCopiedIgCaption(false), 4000);
      window.open(`https://instagram.com/${igHandle}`, '_blank', 'noopener,noreferrer');
    } catch {
      window.open(`https://instagram.com/${igHandle}`, '_blank', 'noopener,noreferrer');
    }
  };

  // 3. Copy direct link
  const handleCopyLink = async () => {
    const url = getProductShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1611]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative bg-[#FBF9F5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E7E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 text-[#1E1611] hover:bg-[#1E1611] hover:text-white transition-all shadow-md cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Interactive Image Gallery */}
        <div className="md:w-1/2 bg-[#F0ECE4] relative flex flex-col justify-between p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#E7E2D8]">
          
          {/* Main Stage Image */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-inner bg-stone-200">
            <img
              src={images[activeImageIndex] || activeProduct.coverImage}
              alt={activeProduct.name}
              className="w-full h-full object-cover"
            />

            {/* Prev/Next Gallery arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#1E1611] shadow-md transition-all cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#1E1611] shadow-md transition-all cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Status Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white shadow-xs ${
                activeProduct.status === 'available' ? 'bg-[#0F823B]' :
                activeProduct.status === 'reserved' ? 'bg-[#D97706]' : 'bg-stone-700'
              }`}>
                {activeProduct.status === 'available' ? '● Available to claim' : activeProduct.status}
              </span>
              {activeProduct.newArrival && (
                <span className="bg-[#D95A2B] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">
                  Fresh Drop
                </span>
              )}
            </div>

            {/* In-Modal Wishlist Quick Toggle */}
            <button
              onClick={() => toggleSaveProduct(activeProduct.id)}
              className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-md cursor-pointer ${
                saved 
                  ? 'bg-[#D95A2B] text-white' 
                  : 'bg-white/85 text-[#1E1611] hover:bg-white hover:text-[#D95A2B]'
              }`}
              title={saved ? "Saved in wishlist" : "Save to wishlist"}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#D95A2B] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: Product Story, Measurements, Social Share & WhatsApp Claim CTA */}
        <div className="md:w-1/2 p-5 sm:p-7 overflow-y-auto flex flex-col justify-between space-y-5">
          
          <div className="space-y-4">
            
            {/* Category & Tags */}
            <div className="flex items-center justify-between text-xs text-[#7A6E65]">
              <span className="uppercase font-bold tracking-widest text-[#D95A2B]">
                {activeProduct.category ? activeProduct.category.replace('-', ' ') : 'Thrift Piece'}
              </span>
              <span className="bg-[#EFECE4] text-[#1E1611] font-semibold px-2.5 py-1 rounded-md font-mono text-[11px]">
                Ref: {activeProduct.id}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E1611] leading-tight">
              {activeProduct.name}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 bg-[#F4EFE6] p-3.5 rounded-2xl border border-[#E7E2D8]">
              <span className="font-display text-2xl sm:text-3xl font-black text-[#1E1611]">
                ₦{activeProduct.price ? activeProduct.price.toLocaleString() : '0'}
              </span>
              {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                <span className="text-sm text-[#9E948B] line-through">
                  ₦{activeProduct.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-[#0F823B] bg-[#E8F8EE] px-2.5 py-1 rounded-full ml-auto">
                Handpicked 1-of-1
              </span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#E7E2D8]">
                <span className="text-[#7A6E65] block font-medium">Tag Size</span>
                <strong className="text-[#1E1611] text-sm">{activeProduct.size}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E7E2D8]">
                <span className="text-[#7A6E65] block font-medium">Color Tone</span>
                <strong className="text-[#1E1611] text-sm">{activeProduct.colour || 'Vintage Tone'}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E7E2D8] col-span-2">
                <span className="text-[#7A6E65] block font-medium">Condition Rating</span>
                <strong className="text-[#D95A2B] text-xs font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {activeProduct.condition} · Steam-Cleaned & Sanitized
                </strong>
              </div>
            </div>

            {/* Measurements */}
            {activeProduct.measurements && (
              <div className="p-3 bg-[#FFEFEA] rounded-xl border border-[#FCD5C8] text-xs space-y-1">
                <div className="flex items-center gap-1 text-[#D95A2B] font-bold">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Exact Measurements:</span>
                </div>
                <p className="text-[#5A4E45] font-medium">{activeProduct.measurements}</p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1 text-xs sm:text-sm text-[#5A4E45] leading-relaxed">
              <p>{activeProduct.description}</p>
            </div>

            {/* Tags */}
            {Array.isArray(activeProduct.tags) && activeProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeProduct.tags.map((t, idx) => (
                  <span key={idx} className="bg-[#EFECE4] text-[#5A4E45] text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* SOCIAL SHARE SECTION (WhatsApp & Instagram & Copy Link) */}
            <div className="pt-3 border-t border-[#E7E2D8] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#3E2F26]">
                <span className="flex items-center gap-1.5 text-[#D95A2B]">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share this piece:</span>
                </span>
                {copiedShareLink && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3 h-3" /> Link copied to clipboard!
                  </span>
                )}
                {copiedIgCaption && (
                  <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3 h-3" /> Instagram caption copied!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* 1. Share on WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#0F823B] border border-[#25D366]/30 font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Share item to WhatsApp friends or status"
                >
                  <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                  <span>WhatsApp</span>
                </button>

                {/* 2. Share on Instagram */}
                <button
                  type="button"
                  onClick={handleShareInstagram}
                  className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-amber-500/20 text-[#9E2A2B] border border-pink-300 font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Share to Instagram story or DM"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </button>

                {/* 3. Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-white hover:bg-stone-100 text-[#1E1611] border border-[#DCD5C9] font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Copy direct product link"
                >
                  {copiedShareLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                  <span>{copiedShareLink ? 'Copied' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Action Section */}
          <div className="pt-4 border-t border-[#E7E2D8] space-y-3">
            
            <div className="flex items-center gap-2">
              {/* WhatsApp Claim */}
              {activeProduct.status === 'available' ? (
                <button
                  onClick={() => {
                    openWhatsApp(activeProduct);
                    handleClose();
                  }}
                  className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-black text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-[#0A2E14]" />
                  <span>Claim This Piece on WhatsApp</span>
                </button>
              ) : activeProduct.status === 'reserved' ? (
                <button
                  onClick={() => {
                    openWhatsApp(activeProduct, `Hi Miemie! I saw that "${activeProduct.name}" is currently reserved. Please notify me if the buyer fails to pay!`);
                    handleClose();
                  }}
                  className="flex-1 bg-[#D97706] hover:bg-[#B45309] text-white font-black text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Join Backup List on WhatsApp</span>
                </button>
              ) : (
                <div className="flex-1 bg-stone-200 text-stone-600 font-bold text-sm py-3.5 px-5 rounded-2xl text-center">
                  This Piece Has Been Sold Out
                </div>
              )}

              {/* Wishlist toggle button with text/state */}
              <button
                onClick={() => {
                  toggleSaveProduct(activeProduct.id);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  saved 
                    ? 'bg-[#FFEFEA] border-[#D95A2B] text-[#D95A2B]' 
                    : 'bg-white border-[#E7E2D8] text-[#1E1611] hover:bg-[#EFECE4]'
                }`}
                title={saved ? "Saved in wishlist (Click to remove)" : "Save to wishlist"}
              >
                <Heart className={`w-5 h-5 ${saved ? 'fill-[#D95A2B]' : ''}`} />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="flex items-center justify-between text-[11px] text-[#7A6E65] pt-1">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-[#D95A2B]" /> Lagos & Nationwide Delivery
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3 h-3 text-[#D95A2B]" /> 14-Day Stockpiling Available
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

