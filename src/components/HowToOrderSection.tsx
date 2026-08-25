import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, MessageSquare, CreditCard, PackageCheck, ArrowRight } from 'lucide-react';

export const HowToOrderSection: React.FC = () => {
  const { openWhatsApp } = useStore();

  const steps = [
    {
      num: '01',
      title: 'Find a Piece',
      desc: 'Browse our fresh rack above. Spot a 1-of-1 vintage dress, denim, or babywear bundle you love.',
      icon: Search
    },
    {
      num: '02',
      title: 'Send Name or Screenshot',
      desc: 'Tap the "Claim on WhatsApp" button or send a quick screenshot directly to Miemie\'s official line.',
      icon: MessageSquare
    },
    {
      num: '03',
      title: 'Confirm & Transfer',
      desc: 'Verify size measurements, provide your delivery address or choose Egbeda pickup, and make instant bank transfer.',
      icon: CreditCard
    },
    {
      num: '04',
      title: 'Receive or Stockpile',
      desc: 'Get fast same-day Lagos dispatch, nationwide waybill, or ask to stockpile for up to 14 days to combine drops!',
      icon: PackageCheck
    }
  ];

  return (
    <section id="how-to-order" className="py-16 md:py-24 bg-[#F4EFE6] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl text-center mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D95A2B]">
            SIMPLE 4-STEP SHOPPING
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1611] tracking-tight uppercase">
            HOW TO CLAIM YOUR FINDS
          </h2>
          <p className="text-sm sm:text-base text-[#5A4E45]">
            Because our thrift pieces are rare 1-of-1 items, ordering happens quickly and smoothly via WhatsApp.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#FBF9F5] rounded-3xl p-6 sm:p-7 border border-[#E7E2D8] shadow-2xs hover:border-[#D95A2B] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-display text-3xl font-black text-[#DCD5C9]">
                      {step.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#1E1611] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#7A6E65] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E7E2D8] flex items-center gap-1.5 text-[11px] font-bold text-[#D95A2B]">
                  <span>Step {idx + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => openWhatsApp(undefined, 'Hi Miemie! I have a question about how to order and pay for a piece.')}
            className="inline-flex items-center gap-2 bg-[#1E1611] hover:bg-[#3E2F26] text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all cursor-pointer shadow-sm"
          >
            <span>Have a Question? Ask on WhatsApp</span>
            <ArrowRight className="w-4 h-4 text-[#D95A2B]" />
          </button>
        </div>

      </div>
    </section>
  );
};
