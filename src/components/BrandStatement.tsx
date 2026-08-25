import React from 'react';
import { Sparkles, HeartHandshake, CheckCircle2, RefreshCw } from 'lucide-react';

export const BrandStatement: React.FC = () => {
  return (
    <section className="py-14 md:py-20 bg-[#F4EFE6] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto text-center space-y-5">
          
          <div className="inline-flex items-center gap-2 bg-[#E6DFD3] text-[#1E1611] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#D95A2B]" />
            <span>Our Philosophy</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1611] leading-tight tracking-tight uppercase">
            “NOT EVERYTHING BEAUTIFUL COMES WITH A BIG PRICE TAG.”
          </h2>

          <p className="text-base sm:text-lg text-[#5A4E45] font-normal leading-relaxed max-w-2xl mx-auto">
            At Thrift With Miemie, we believe fashion should be an exciting treasure hunt, not a financial burden. 
            We unearth distinctive pre-loved gems, steam-sanitize each piece, and bring runway-grade silhouettes right to your wardrobe without the luxury markup.
          </p>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            
            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#FFEFEA] flex items-center justify-center text-[#D95A2B] mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1E1611] mb-1">Hand-Inspected Grade A</h3>
              <p className="text-xs text-[#7A6E65] leading-relaxed">
                Zero tears, zero stained rags. Every thrift piece passes our strict stitch-by-stitch inspection in Egbeda before listing.
              </p>
            </div>

            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#EFECE4] flex items-center justify-center text-[#1E1611] mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1E1611] mb-1">One-Of-A-Kind Finds</h3>
              <p className="text-xs text-[#7A6E65] leading-relaxed">
                Why blend in with fast fashion duplicates? Own 1-of-1 vintage silks, rare 90s denims, and unique silhouettes nobody else has.
              </p>
            </div>

            <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#E8F8EE] flex items-center justify-center text-[#0F823B] mb-3">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-bold text-[#1E1611] mb-1">14-Day Stockpiling</h3>
              <p className="text-xs text-[#7A6E65] leading-relaxed">
                Buy items as they drop over 2 weeks. Hold your stash with us and combine everything into one single Lagos or interstate waybill!
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
