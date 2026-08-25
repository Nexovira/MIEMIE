import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Truck, 
  MapPin, 
  RefreshCw, 
  CreditCard, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  HelpCircle
} from 'lucide-react';

export const TrustAndFaqSection: React.FC = () => {
  const { siteContent } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const faqItems = [
    {
      title: 'Lagos Delivery & Timelines',
      icon: Truck,
      content: siteContent.deliveryLagos || 
        'We offer Same-Day and Next-Day delivery across Lagos using trusted, vetted dispatch riders. Mainland deliveries range from ₦2,500 to ₦3,500, while Island deliveries range from ₦3,500 to ₦5,000 depending on exact address.'
    },
    {
      title: 'Interstate Nationwide Waybill',
      icon: Truck,
      content: siteContent.deliveryInterstate || 
        'We ship to all 36 states in Nigeria via GIG Logistics, Peace Mass Transit, Speedaf, ABC Transport, and Park Waybills. Estimated transit time is 2 to 4 business days with tracking details provided.'
    },
    {
      title: 'Physical Pickup in Egbeda, Lagos',
      icon: MapPin,
      content: siteContent.pickupAddress || 
        'Free pickup is available at Egbeda Junction / Alimosho, Lagos from Monday to Saturday between 10:00 AM and 6:00 PM once your payment is confirmed and package is ready.'
    },
    {
      title: '14-Day Stockpiling (Combine Drops & Save Delivery)',
      icon: RefreshCw,
      content: siteContent.stockpilingPolicy || 
        'Yes! You can stockpile (hold) your claimed items for up to 14 days. Simply pay for each piece to secure it and tell us to hold. When you are ready for dispatch, we pack all your finds together in one single parcel so you pay only one delivery fee.'
    },
    {
      title: 'Payment & Transfer Verification',
      icon: CreditCard,
      content: siteContent.paymentInstructions || 
        'We accept instant Nigerian bank transfers to our official business account. Because thrift items are one-of-a-kind, we hold items for a maximum of 30 minutes until payment confirmation receipt is sent.'
    },
    {
      title: 'Quality Guarantee & Return Policy',
      icon: ShieldCheck,
      content: siteContent.returnPolicy || 
        'We guarantee Grade A quality. Every piece is steam-sanitized, inspected for flaws, and accurately measured. We send detailed video walkthroughs prior to packaging upon request. Due to the 1-of-1 nature of thrift fashion, all sales are final upon delivery confirmation.'
    }
  ];

  return (
    <section id="trust-faq" className="py-16 md:py-24 bg-[#FBF9F5] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#FFEFEA] text-[#D95A2B] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>DELIVERY, POLICIES & TRUST</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1611] tracking-tight uppercase leading-tight">
            EVERYTHING YOU NEED TO KNOW
          </h2>

          <p className="text-base text-[#5A4E45] mt-3">
            Transparent logistics, reliable Lagos dispatch, and flexible stockpiling designed for your peace of mind.
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Quick Highlights & Location Card */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-[#1E1611] text-[#FBF9F5] p-6 rounded-3xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#D95A2B] flex items-center justify-center text-white">
                <MapPin className="w-5 h-5" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#D95A2B] tracking-wider">Physical Hub</span>
                <h3 className="font-display text-xl font-bold mt-1">Egbeda, Lagos State</h3>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  Located in the vibrant fashion district of Alimosho, serving style lovers across Lagos and Nigeria.
                </p>
              </div>

              <div className="pt-2 border-t border-[#3E2F26] text-xs text-stone-400">
                <span>⏰ Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>

            <div className="bg-[#F4EFE6] p-6 rounded-3xl border border-[#E7E2D8] space-y-2">
              <h4 className="font-display text-sm font-bold text-[#1E1611]">
                Need Same-Day Urgent Dispatch?
              </h4>
              <p className="text-xs text-[#5A4E45]">
                Notify Miemie before 12:00 PM on WhatsApp for expedited dispatch rider priority.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Accordion */}
          <div className="lg:col-span-8 space-y-3">
            {faqItems.map((item, idx) => {
              const Icon = item.icon;
              const isOpen = openIndex === idx;

              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E7E2D8] bg-[#FBF9F5] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#F4EFE6] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-display text-sm sm:text-base font-bold text-[#1E1611]">
                        {item.title}
                      </span>
                    </div>

                    <div className="text-[#7A6E65]">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#D95A2B]" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5A4E45] leading-relaxed border-t border-[#E7E2D8]/50 bg-[#FBF9F5] animate-in fade-in duration-150">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
