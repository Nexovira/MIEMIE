import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  tag?: string;
}

const categories: CategoryItem[] = [
  {
    id: 'dresses',
    name: 'Statement Dresses',
    subtitle: 'Silks, slips, maxis & evening picks',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    tag: 'Popular'
  },
  {
    id: 'denim',
    name: 'Denim & Shorts',
    subtitle: 'Rigid 90s mom jeans, cargos & cutoffs',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tops-everyday',
    name: 'Everyday Fashion',
    subtitle: 'Y2K mesh, knit tops & corset styles',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'babywear',
    name: 'Babywear & Kids',
    subtitle: 'Ultra-soft cotton rompers & bundles',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80',
    tag: 'Grade A+ Gentle'
  },
  {
    id: 'wholesale',
    name: 'Wholesale Bundles',
    subtitle: '20-50pc starter bales for vendors',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    tag: 'Reseller Hub'
  },
  {
    id: 'vintage-outerwear',
    name: 'Blazers & Outerwear',
    subtitle: 'Oversized silhouettes & vintage coats',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80'
  }
];

export const CategoryRail: React.FC = () => {
  const { setFilter, products } = useStore();

  const handleSelectCategory = (catId: string) => {
    setFilter(prev => ({ ...prev, category: catId as any }));
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="category-discovery" className="py-14 md:py-20 bg-[#FBF9F5] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D95A2B] block mb-2">
              CURATED COLLECTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#1E1611] tracking-tight uppercase">
              EXPLORE BY CATEGORY
            </h2>
          </div>
          <p className="text-sm text-[#7A6E65] max-w-md">
            Every category is refreshed weekly with handpicked single pieces and commercial bales ready to ship across Nigeria.
          </p>
        </div>

        {/* Categories Grid (Swipeable / responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.id && p.status !== 'hidden').length;

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#F4EFE6] border border-[#E7E2D8] text-left hover:border-[#D95A2B] hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE5DC]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  
                  {cat.tag && (
                    <span className="absolute top-2.5 left-2.5 bg-[#D95A2B] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                      {cat.tag}
                    </span>
                  )}

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] font-semibold opacity-90 block">
                      {count > 0 ? `${count} available` : 'Curated Finds'}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-bold leading-tight group-hover:text-[#FFEFEA] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Footer preview */}
                <div className="p-2.5 flex items-center justify-between text-[11px] font-medium text-[#7A6E65] bg-[#FBF9F5] border-t border-[#E7E2D8]">
                  <span className="truncate pr-1">{cat.subtitle}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D95A2B] shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
