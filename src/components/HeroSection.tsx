import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowDownRight, MessageCircle, Sparkles, ShieldCheck, MapPin, Tag } from 'lucide-react';

interface HeroSectionProps {
  onExploreDrops?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreDrops }) => {
  const { siteContent, openWhatsApp } = useStore();

  const handleExploreClick = () => {
    if (onExploreDrops) {
      onExploreDrops();
      return;
    }
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 bg-[#FBF9F5] border-b border-[#E7E2D8]">
      {/* Background subtle ambient elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F3ECE2] rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F5E6DD] rounded-full blur-3xl -z-10 opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tag & Location Pill */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#EFE9DF] text-[#1E1611] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#DCD5C9]">
            <MapPin className="w-3.5 h-3.5 text-[#D95A2B]" />
            <span>Egbeda, Lagos State</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-[#FFEFEA] text-[#D95A2B] text-xs font-bold px-3 py-1.5 rounded-full border border-[#FCD5C8]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Grade A Thrift</span>
          </div>
        </div>

        {/* Main Grid: Editorial Typography + Layered Imagery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Bold Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            
            <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#1E1611] tracking-tight leading-[1.08] uppercase break-words">
              {siteContent.heroHeadline || "THE BEST FINDS ARE NEVER ON THE FRONT RACK."}
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-[#5A4E45] font-normal leading-relaxed max-w-2xl">
              {siteContent.heroSubtext || "Discover affordable thrift fashion, babywear, and wholesale gems selected for people who want style with personality."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full max-w-md sm:max-w-none">
              
              <button
                id="hero-explore-btn"
                onClick={handleExploreClick}
                className="bg-[#1E1611] hover:bg-[#3E2F26] text-white font-bold text-sm sm:text-base px-5 sm:px-7 py-3.5 sm:py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] group cursor-pointer min-h-[48px]"
              >
                <span>Discover latest drop</span>
                <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#D95A2B] group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                id="hero-whatsapp-btn"
                onClick={() => openWhatsApp(undefined, 'Hi Miemie! I am ready to explore the latest thrift collection on WhatsApp.')}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-extrabold text-sm sm:text-base px-5 sm:px-6 py-3.5 sm:py-4 rounded-full flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer min-h-[48px]"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-[#0A2E14]" />
                <span>Shop on WhatsApp</span>
              </button>

            </div>

            {/* Small Trust Line */}
            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#7A6E65] font-medium border-t border-[#E7E2D8]/70">
              <ShieldCheck className="w-4 h-4 text-[#D95A2B] shrink-0" />
              <span>Curated in Lagos · Personal and wholesale orders available · Sanitized & measured</span>
            </div>

          </div>

          {/* Right Column: Editorial Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-xl border border-[#E7E2D8] bg-[#EFECE4]">
                <img
                  src={siteContent.heroImages?.[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"}
                  alt="Thrift With Miemie Curated Piece"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block bg-[#D95A2B] text-[10px] font-black uppercase px-2.5 py-1 rounded-sm mb-1.5 tracking-widest">
                    HANDPICKED 1-OF-1
                  </span>
                  <p className="font-display text-lg font-bold">Vintage Silk & Streetwear Drops</p>
                  <p className="text-xs text-stone-200">Starting from ₦4,500 · Steam Sanitized</p>
                </div>
              </div>

              {/* Floating Secondary Thumbnail (Layered editorial style) */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-[#FBF9F5] p-3 rounded-2xl shadow-xl border border-[#E7E2D8] max-w-xs animate-in fade-in duration-500">
                <img
                  src={siteContent.heroImages?.[1] || "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80"}
                  alt="Denim detail"
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#D95A2B] uppercase tracking-wider">
                    <Tag className="w-3 h-3" /> Grade A Quality
                  </div>
                  <p className="text-xs font-bold text-[#1E1611] leading-tight">No fake stock. Real finds.</p>
                  <p className="text-[11px] text-[#7A6E65]">Dispatching daily in Lagos</p>
                </div>
              </div>

              {/* Floating Badge on Top Right */}
              <div className="absolute -top-4 -right-4 bg-[#1E1611] text-[#FBF9F5] text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-[#3E2F26] hidden sm:block">
                ⚡ Egbeda Express Dispatch
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
