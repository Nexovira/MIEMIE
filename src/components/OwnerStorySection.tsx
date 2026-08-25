import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, MapPin, CheckCircle, Heart, MessageCircle } from 'lucide-react';

export const OwnerStorySection: React.FC = () => {
  const { siteContent, openWhatsApp } = useStore();

  return (
    <section id="owner-story" className="py-16 md:py-24 bg-[#F4EFE6] border-b border-[#E7E2D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Owner Portrait & Editorial Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              
              {/* Outer frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E7E2D8] aspect-[4/5] bg-stone-300">
                <img
                  src={siteContent.ownerImageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                  alt="Miemie - Curator & Founder of Thrift With Miemie"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <div className="inline-flex items-center gap-1 bg-[#D95A2B] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
                    FOUNDER & CHIEF CURATOR
                  </div>
                  <h3 className="font-display text-xl font-bold">Miemie</h3>
                  <p className="text-xs text-stone-200">Thrifting from Egbeda with Love & An Eye for Quality</p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -right-5 bg-[#1E1611] text-[#FBF9F5] p-4 rounded-2xl shadow-xl border border-[#3E2F26] hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#D95A2B] flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#D95A2B] tracking-wider">Handpicked Standard</div>
                  <div className="text-xs font-bold">100% Inspected & Sanitized</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Narrative Story */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 bg-[#E6DFD3] text-[#1E1611] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#D95A2B]" />
              <span>Egbeda, Lagos Roots</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1611] leading-tight tracking-tight uppercase">
              {siteContent.ownerStoryTitle || "THE EYE BEHIND THE FIND."}
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5A4E45] leading-relaxed">
              <p>
                {siteContent.ownerStoryText || 
                  "Thrift With Miemie was born out of a deep passion for discovering unique, high-fashion pieces buried inside premium overseas bales. In a world full of cookie-cutter fast fashion, we believe your personal style should turn heads without draining your bank account."
                }
              </p>
              <p>
                Every single dress, pair of denim, or babywear pack is hand-selected at dawn, steam-cleaned, individually checked for tears, and measured precisely so you get the exact fit you expect.
              </p>
            </div>

            {/* Guarantees Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D95A2B] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#1E1611]">
                  Authentic Vintage & Grade A Quality only
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D95A2B] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#1E1611]">
                  Accurate waist, bust & length measurements
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D95A2B] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#1E1611]">
                  Prompt dispatch via trusted dispatch riders
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#D95A2B] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#1E1611]">
                  Stockpile for 14 days to save delivery fees
                </span>
              </div>
            </div>

            {/* Owner WhatsApp Action */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openWhatsApp(undefined, "Hi Miemie! I read your story on the website and I'd love to ask about your curation process or upcoming drops.")}
                className="bg-[#1E1611] hover:bg-[#3E2F26] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-full flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Message Miemie Directly</span>
              </button>

              <span className="text-xs text-[#7A6E65]">
                Replies typically within minutes on WhatsApp
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
