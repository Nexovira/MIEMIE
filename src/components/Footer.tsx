import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, MessageCircle, Instagram, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { siteContent, openWhatsApp, setFilter } = useStore();

  const handleCategoryClick = (cat: string) => {
    setFilter(prev => ({ ...prev, category: cat as any }));
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#18110D] text-[#FBF9F5] pt-16 pb-24 lg:pb-16 border-t border-[#2A2019]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2A2019]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-display font-black text-2xl sm:text-3xl tracking-wider text-white block">
              THRIFT WITH MIEMIE
            </span>
            
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Curated thrift fashion, 90s vintage denim, statement dresses, babywear & wholesale reseller bundles based in Egbeda, Lagos.
            </p>

            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <MapPin className="w-4 h-4 text-[#D95A2B] shrink-0" />
              <span>{siteContent.businessLocation || 'Egbeda, Alimosho, Lagos, Nigeria'}</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => openWhatsApp(undefined, 'Hi Miemie! I am contacting you from the website.')}
                className="w-10 h-10 rounded-full bg-[#2A2019] hover:bg-[#25D366] text-[#25D366] hover:text-[#0A2E14] flex items-center justify-center transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
              </button>
              
              <a
                href={`https://instagram.com/${(siteContent.instagramHandle || 'thriftwithmiemie').replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2A2019] hover:bg-[#D95A2B] text-stone-300 hover:text-white flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D95A2B]">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleNavClick('product-catalog')} className="hover:text-white transition-colors cursor-pointer">
                  Fresh Drops
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('category-discovery')} className="hover:text-white transition-colors cursor-pointer">
                  Shop Categories
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('wholesale-section')} className="hover:text-white transition-colors cursor-pointer">
                  Wholesale Bales
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('how-to-order')} className="hover:text-white transition-colors cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('trust-faq')} className="hover:text-white transition-colors cursor-pointer">
                  Delivery & Policies
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('owner-story')} className="hover:text-white transition-colors cursor-pointer">
                  About Miemie
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D95A2B]">
              Shop Finds
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => handleCategoryClick('dresses')} className="hover:text-white transition-colors cursor-pointer">
                  Statement Dresses
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('denim')} className="hover:text-white transition-colors cursor-pointer">
                  Denim & Cargo Shorts
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('tops-everyday')} className="hover:text-white transition-colors cursor-pointer">
                  Y2K & Mesh Tops
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('babywear')} className="hover:text-white transition-colors cursor-pointer">
                  Babywear & Toddler
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('vintage-outerwear')} className="hover:text-white transition-colors cursor-pointer">
                  Blazers & Coats
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('wholesale')} className="hover:text-white transition-colors cursor-pointer">
                  Reseller Bales
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D95A2B]">
              Business Management
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Authorized admin portal for inventory updates, price adjustments, and content management.
            </p>
            
            <button
              id="footer-admin-btn"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#2A2019] hover:bg-[#D95A2B] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D95A2B] group-hover:text-white" />
              <span>Owner Admin Portal</span>
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} THRIFT WITH MIEMIE. Curated with love in Lagos, Nigeria.</p>
          <p className="flex items-center gap-1">
            <span>The best finds are never on the front rack.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
