import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, TrendingUp, Sparkles, Check, MessageCircle, ShieldAlert } from 'lucide-react';

interface WholesaleTier {
  title: string;
  pieces: string;
  price: number;
  estResale: string;
  profit: string;
  popular?: boolean;
  description: string;
  includes: string[];
}

const wholesaleBundles: WholesaleTier[] = [
  {
    title: 'Instagram Reseller Starter Pack',
    pieces: '20 Handpicked Pieces',
    price: 65000,
    estResale: '₦120,000 - ₦150,000',
    profit: 'Up to 130% ROI',
    description: 'Perfect for student vendors or new Instagram thrift pages. Curated mixture of trendy tops, casual dresses, and vintage bottoms.',
    includes: [
      '8 Statement & Midi Dresses',
      '6 Vintage Mesh & Y2K Tops',
      '6 Denim Jeans & Cargo Shorts',
      'High-resolution photo pack for your feed',
      'Tips on pricing & staging'
    ]
  },
  {
    title: 'Grade A Statement Dresses Bale',
    pieces: '30 Premium Pieces',
    price: 95000,
    estResale: '₦180,000 - ₦240,000',
    profit: 'High Margin Bestseller',
    popular: true,
    description: 'Our most requested bundle. 100% Grade A silks, cocktail dresses, slip gowns, and summer sundresses with zero flaws.',
    includes: [
      '30 Curated Grade A Dresses (UK 8 - 16)',
      'Steam sanitized & ready to photograph',
      'No rags, no stained pieces guarantee',
      'Lagos dispatch or interstate park delivery'
    ]
  },
  {
    title: 'Organic Cotton Babywear Bale',
    pieces: '50 Infant/Toddler Pieces',
    price: 75000,
    estResale: '₦140,000 - ₦175,000',
    profit: 'Fast Daily Turnover',
    description: 'High demand baby clothing pack containing rompers, sets, sleepsuits, and dungarees (0-36 months). Mothers buy repeatedly.',
    includes: [
      '50 Cotton Onesies & 2-Piece Sets',
      'Sanitized and graded for soft skin',
      'Mixed boys, girls, and unisex neutrals',
      'Waterproof packaging for interstate waybill'
    ]
  }
];

export const WholesaleSection: React.FC = () => {
  const { siteContent, openWhatsApp } = useStore();

  return (
    <section id="wholesale-section" className="py-16 md:py-24 bg-[#FBF9F5] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 bg-[#FFEFEA] text-[#D95A2B] text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3">
            <Package className="w-3.5 h-3.5" />
            <span>WHOLESALE & RESELLER HUB</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1611] tracking-tight uppercase leading-tight">
            YOUR NEXT COLLECTION COULD START HERE.
          </h2>

          <p className="text-base text-[#5A4E45] mt-3 leading-relaxed">
            {siteContent.wholesaleDescription || 
              "Thinking of starting your own thrift boutique or campus side-hustle? Skip the uncertainty of blind bales. We curate premium Grade A starter bundles with zero rags and guaranteed high resale profit."
            }
          </p>
        </div>

        {/* Bundle Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wholesaleBundles.map((bundle, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all ${
                bundle.popular
                  ? 'bg-[#1E1611] text-[#FBF9F5] shadow-xl border-2 border-[#D95A2B] scale-100 md:-translate-y-2'
                  : 'bg-[#F4EFE6] text-[#1E1611] border border-[#E7E2D8] shadow-2xs hover:border-[#D95A2B]'
              }`}
            >
              {bundle.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D95A2B] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  MOST POPULAR RESELLER PACK
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase tracking-wider ${bundle.popular ? 'text-[#D95A2B]' : 'text-[#7A6E65]'}`}>
                    {bundle.pieces}
                  </span>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    bundle.popular ? 'bg-[#3E2F26] text-emerald-300' : 'bg-[#E8F8EE] text-[#0F823B]'
                  }`}>
                    {bundle.profit}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold leading-snug mb-3">
                  {bundle.title}
                </h3>

                <p className={`text-xs leading-relaxed mb-5 ${bundle.popular ? 'text-stone-300' : 'text-[#5A4E45]'}`}>
                  {bundle.description}
                </p>

                {/* Price */}
                <div className={`p-4 rounded-2xl mb-5 ${bundle.popular ? 'bg-[#2A2019]' : 'bg-[#FBF9F5] border border-[#E7E2D8]'}`}>
                  <span className={`text-[10px] block font-semibold ${bundle.popular ? 'text-stone-400' : 'text-[#7A6E65]'}`}>
                    Wholesale Price:
                  </span>
                  <div className="font-display text-2xl sm:text-3xl font-black">
                    ₦{bundle.price.toLocaleString()}
                  </div>
                  <div className={`text-xs mt-1 font-medium ${bundle.popular ? 'text-amber-300' : 'text-[#D95A2B]'}`}>
                    Est. Resale: {bundle.estResale}
                  </div>
                </div>

                {/* What's included */}
                <div className="space-y-2.5 mb-6 text-xs">
                  {bundle.includes.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${bundle.popular ? 'text-[#D95A2B]' : 'text-[#0F823B]'}`} />
                      <span className={bundle.popular ? 'text-stone-200' : 'text-[#3E2F26]'}>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => openWhatsApp(undefined, `Hi Miemie! I want to order the wholesale "${bundle.title}" (₦${bundle.price.toLocaleString()}). Can we discuss video preview and delivery to my state?`)}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  bundle.popular
                    ? 'bg-[#25D366] text-[#0A2E14] hover:bg-[#20bd5a] shadow-md active:scale-98'
                    : 'bg-[#1E1611] text-white hover:bg-[#3E2F26]'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Inquire Wholesale on WhatsApp</span>
              </button>

            </div>
          ))}
        </div>

        {/* Wholesale Advisory Note */}
        <div className="mt-10 p-5 rounded-2xl bg-[#FFEFEA] border border-[#FCD5C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-[#D95A2B] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#1E1611]">Need a Custom Wholesale Bale Size or Video Call Inspection?</h4>
              <p className="text-xs text-[#5A4E45]">
                We allow video walkthroughs for wholesale buyers before parcel dispatch from our Egbeda store.
              </p>
            </div>
          </div>

          <button
            onClick={() => openWhatsApp(undefined, "Hi Miemie! I'd like to book a wholesale consultation or request a custom bale quote.")}
            className="whitespace-nowrap px-4 py-2 bg-[#D95A2B] hover:bg-[#b84218] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Request Custom Bale
          </button>
        </div>

      </div>
    </section>
  );
};
