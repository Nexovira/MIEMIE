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
  PackageCheck
} from 'lucide-react';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, toggleSaveProduct, isSaved, openWhatsApp } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!quickViewProduct) return null;

  const images = quickViewProduct.images?.length > 0 
    ? quickViewProduct.images 
    : [quickViewProduct.coverImage];

  const saved = isSaved(quickViewProduct.id);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1611]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative bg-[#FBF9F5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E7E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
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
              src={images[activeImageIndex] || quickViewProduct.coverImage}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
            />

            {/* Prev/Next Gallery arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#1E1611] shadow-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#1E1611] shadow-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Status Overlay */}
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white shadow-xs ${
                quickViewProduct.status === 'available' ? 'bg-[#0F823B]' :
                quickViewProduct.status === 'reserved' ? 'bg-[#D97706]' : 'bg-stone-700'
              }`}>
                {quickViewProduct.status === 'available' ? '● Available to claim' : quickViewProduct.status}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-[#D95A2B] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right: Product Story, Measurements & WhatsApp Claim CTA */}
        <div className="md:w-1/2 p-5 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            
            {/* Category & Tags */}
            <div className="flex items-center justify-between text-xs text-[#7A6E65]">
              <span className="uppercase font-bold tracking-widest text-[#D95A2B]">
                {quickViewProduct.category.replace('-', ' ')}
              </span>
              <span className="bg-[#EFECE4] text-[#1E1611] font-semibold px-2.5 py-1 rounded-md">
                Ref: {quickViewProduct.id}
              </span>
            </div>

            {/* Product Title */}
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E1611] leading-tight">
              {quickViewProduct.name}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 bg-[#F4EFE6] p-3.5 rounded-2xl border border-[#E7E2D8]">
              <span className="font-display text-2xl sm:text-3xl font-black text-[#1E1611]">
                ₦{quickViewProduct.price.toLocaleString()}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-[#9E948B] line-through">
                  ₦{quickViewProduct.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-[#0F823B] bg-[#E8F8EE] px-2 py-0.5 rounded-sm ml-auto">
                Handpicked Thrift
              </span>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-[#E7E2D8]">
                <span className="text-[#7A6E65] block font-medium">Tag Size</span>
                <strong className="text-[#1E1611] text-sm">{quickViewProduct.size}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E7E2D8]">
                <span className="text-[#7A6E65] block font-medium">Color Tone</span>
                <strong className="text-[#1E1611] text-sm">{quickViewProduct.colour || 'Vintage Tone'}</strong>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-[#E7E2D8] col-span-2">
                <span className="text-[#7A6E65] block font-medium">Condition Rating</span>
                <strong className="text-[#D95A2B] text-xs font-bold flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {quickViewProduct.condition} · Sanitized & Inspected
                </strong>
              </div>
            </div>

            {/* Measurements */}
            {quickViewProduct.measurements && (
              <div className="p-3 bg-[#FFEFEA] rounded-xl border border-[#FCD5C8] text-xs space-y-1">
                <div className="flex items-center gap-1 text-[#D95A2B] font-bold">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Exact Measurements:</span>
                </div>
                <p className="text-[#5A4E45] font-medium">{quickViewProduct.measurements}</p>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1 text-xs sm:text-sm text-[#5A4E45] leading-relaxed">
              <p>{quickViewProduct.description}</p>
            </div>

            {/* Tags */}
            {quickViewProduct.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickViewProduct.tags.map((t, idx) => (
                  <span key={idx} className="bg-[#EFECE4] text-[#5A4E45] text-[11px] font-medium px-2.5 py-0.5 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* Bottom Action Section */}
          <div className="pt-4 border-t border-[#E7E2D8] space-y-3">
            
            <div className="flex items-center gap-2">
              {/* WhatsApp Claim */}
              <button
                onClick={() => {
                  openWhatsApp(quickViewProduct);
                  setQuickViewProduct(null);
                }}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-black text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-[#0A2E14]" />
                <span>Claim This Piece on WhatsApp</span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleSaveProduct(quickViewProduct.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  saved 
                    ? 'bg-[#FFEFEA] border-[#D95A2B] text-[#D95A2B]' 
                    : 'bg-white border-[#E7E2D8] text-[#1E1611] hover:bg-[#EFECE4]'
                }`}
                title={saved ? "Saved" : "Save for later"}
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
