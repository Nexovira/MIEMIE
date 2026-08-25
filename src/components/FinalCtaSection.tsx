import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, Sparkles, Send, ArrowRight, HeartHandshake } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const { openWhatsApp } = useStore();

  const quickInquiries = [
    { label: "👗 Women's Fashion", msg: "Hi Miemie! I am looking for women's dresses and tops in my size. What do you have available?" },
    { label: "👶 Babywear & Kids", msg: "Hi Miemie! I'd like to see your available babywear and infant bundles." },
    { label: "📦 Wholesale Bundles", msg: "Hi Miemie! I want to start a thrift business and would like details on wholesale starter bales." },
    { label: "🚚 Delivery Questions", msg: "Hi Miemie! I have a question about delivery rates and timelines to my location." },
    { label: "✨ New Arrivals", msg: "Hi Miemie! Can you send me the freshest unposted finds from today's drop?" },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#1E1611] text-[#FBF9F5] relative overflow-hidden">
      
      {/* Decorative ambient elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D95A2B]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#3E2F26] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#3E2F26] text-[#D95A2B] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#5A4538]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PERSONAL SHOPPER & CURATOR</span>
        </div>

        {/* Headline */}
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-[1.08] max-w-4xl mx-auto">
          YOUR NEXT FAVOURITE PIECE MAY ALREADY BE HERE.
        </h2>

        {/* Supporting text */}
        <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Tell us what you are looking for and we will help you check the latest available finds right from our Egbeda store.
        </p>

        {/* Primary Giant WhatsApp Button */}
        <div className="pt-2">
          <button
            id="final-whatsapp-cta"
            onClick={() => openWhatsApp(undefined, 'Hi Thrift With Miemie! I am on your website and want to start shopping on WhatsApp.')}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-[#0A2E14] font-black text-base sm:text-lg px-9 py-5 rounded-full inline-flex items-center gap-3 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all cursor-pointer"
          >
            <MessageCircle className="w-6 h-6 fill-[#0A2E14]" />
            <span>Start shopping on WhatsApp</span>
            <ArrowRight className="w-5 h-5 text-[#0A2E14]" />
          </button>
        </div>

        {/* Quick Inquiry Buttons */}
        <div className="pt-6">
          <p className="text-xs text-stone-400 uppercase tracking-wider font-semibold mb-3">
            Or choose a quick topic:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
            {quickInquiries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => openWhatsApp(undefined, item.msg)}
                className="bg-[#2A2019] hover:bg-[#3E2F26] text-stone-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full border border-[#4A382D] transition-all hover:border-[#D95A2B] active:scale-95 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
