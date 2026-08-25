import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Filter, 
  Layers, 
  Tag, 
  Package, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';

interface ProductGridProps {
  onQuickView?: (p: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onQuickView }) => {
  const { products, filter, setFilter, resetFilters, loading, openWhatsApp } = useStore();

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Hide hidden products from public catalogue
      if (prod.status === 'hidden') return false;

      // Category filter
      if (filter.category !== 'all' && prod.category !== filter.category) {
        return false;
      }

      // Status filter
      if (filter.status !== 'all' && prod.status !== filter.status) {
        return false;
      }

      // Wholesale only filter
      if (filter.onlyWholesale && !prod.wholesaleAvailable && prod.category !== 'wholesale') {
        return false;
      }

      // Size filter
      if (filter.size && !prod.size.toLowerCase().includes(filter.size.toLowerCase())) {
        return false;
      }

      // Search query (matches name, description, category, tags, condition)
      if (filter.searchQuery.trim()) {
        const query = filter.searchQuery.toLowerCase();
        const matchName = typeof prod.name === 'string' && prod.name.toLowerCase().includes(query);
        const matchDesc = typeof prod.description === 'string' && prod.description.toLowerCase().includes(query);
        const matchCat = typeof prod.category === 'string' && prod.category.toLowerCase().includes(query);
        const matchTags = Array.isArray(prod.tags) && prod.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(query));
        const matchColour = typeof prod.colour === 'string' && prod.colour.toLowerCase().includes(query);
        const matchSize = typeof prod.size === 'string' && prod.size.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat && !matchTags && !matchColour && !matchSize) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filter.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filter.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filter.sortBy === 'featured') {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      return (a.displayOrder || 99) - (b.displayOrder || 99);
    });
  }, [products, filter]);

  // Categories list for pills
  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'denim', label: 'Denim & Jeans' },
    { id: 'tops-everyday', label: 'Tops & Mesh' },
    { id: 'babywear', label: 'Babywear' },
    { id: 'wholesale', label: 'Wholesale Bales' },
    { id: 'vintage-outerwear', label: 'Blazers' },
  ];

  const hasActiveFilters = 
    filter.category !== 'all' || 
    filter.status !== 'all' || 
    filter.searchQuery !== '' || 
    filter.size !== '' || 
    filter.onlyWholesale ||
    filter.sortBy !== 'newest';

  return (
    <section id="product-catalog" className="py-16 md:py-24 bg-[#FBF9F5] border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D95A2B] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WEEKLY DROP CATALOGUE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-[#1E1611] tracking-tight uppercase">
              FRESH FROM THE RACK
            </h2>
          </div>
          
          <p className="text-sm text-[#7A6E65] max-w-md">
            Limited 1-of-1 pieces. Once a piece is claimed and paid for, it will be marked reserved or sold. Claim your size immediately!
          </p>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-[#F4EFE6] p-4 sm:p-5 rounded-2xl border border-[#E7E2D8] mb-8 space-y-4 shadow-2xs">
          
          {/* Row 1: Search + Quick Status Pills + Sort */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-0 w-full">
              <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search vintage silk, mom jeans, size UK 10, babywear..."
                className="w-full pl-10 pr-9 py-2.5 bg-[#FBF9F5] rounded-xl text-xs sm:text-sm text-[#1E1611] placeholder:text-[#9E948B] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] focus:ring-1 focus:ring-[#D95A2B] transition-all"
              />
              {filter.searchQuery && (
                <button 
                  onClick={() => setFilter(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6E65] hover:text-[#1E1611] p-1"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Availability Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full lg:w-auto shrink-0">
              <span className="text-xs font-semibold text-[#7A6E65] mr-1 hidden sm:inline">Status:</span>
              {(['all', 'available', 'reserved', 'sold'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(prev => ({ ...prev, status }))}
                  className={`text-xs font-bold px-3 py-2 rounded-xl transition-all capitalize whitespace-nowrap cursor-pointer shrink-0 min-h-[38px] ${
                    filter.status === status
                      ? 'bg-[#1E1611] text-white shadow-xs'
                      : 'bg-[#FBF9F5] text-[#5A4E45] hover:bg-[#EAE5DC] border border-[#DCD5C9]'
                  }`}
                  type="button"
                >
                  {status === 'all' ? 'All Pieces' : status}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-[#7A6E65] whitespace-nowrap hidden sm:inline">Sort:</span>
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full lg:w-auto bg-[#FBF9F5] text-xs font-semibold text-[#1E1611] px-3.5 py-2.5 rounded-xl border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] cursor-pointer min-h-[38px]"
              >
                <option value="newest">Latest Unpacked</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="featured">Featured Picks First</option>
              </select>
            </div>

          </div>

          {/* Row 2: Category Filter Horizontal Rail */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            {categories.map((cat) => {
              const active = filter.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilter(prev => ({ ...prev, category: cat.id as any }))}
                  className={`text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#D95A2B] text-white shadow-xs'
                      : 'bg-[#FBF9F5] text-[#3E2F26] hover:bg-[#EAE5DC] border border-[#DCD5C9]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}

            {/* Wholesale Filter Toggle */}
            <button
              onClick={() => setFilter(prev => ({ ...prev, onlyWholesale: !prev.onlyWholesale }))}
              className={`text-xs font-bold px-3.5 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                filter.onlyWholesale
                  ? 'bg-[#1E1611] text-white'
                  : 'bg-[#FFEFEA] text-[#D95A2B] hover:bg-[#FCD5C8] border border-[#FCD5C8]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Wholesale Only</span>
            </button>

            {/* Reset Filters button if any active */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-[#D95A2B] hover:underline whitespace-nowrap ml-auto flex items-center gap-1 px-2 py-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset filters
              </button>
            )}
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#7A6E65] font-medium">
          <span>
            Showing <strong className="text-[#1E1611]">{filteredProducts.length}</strong> items in this drop
          </span>
          <span className="hidden sm:inline">
            📍 Physical Pickup available at Egbeda, Lagos
          </span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="bg-[#F4EFE6] rounded-3xl p-10 sm:p-16 text-center border border-[#E7E2D8] max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center mx-auto">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#1E1611]">
              No exact match in current rack
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6E65] max-w-md mx-auto">
              Can't find your specific size or style? Send us a reference photo on WhatsApp and Miemie will handpick it from the next sunrise bale!
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#1E1611] text-white text-xs font-bold rounded-full hover:bg-[#3E2F26] transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
              <button
                onClick={() => openWhatsApp(undefined, `Hi Miemie! I searched your website for "${filter.searchQuery || filter.category}" and wanted to ask if you have any unlisted pieces in stock.`)}
                className="px-5 py-2.5 bg-[#25D366] text-[#0A2E14] text-xs font-black rounded-full hover:bg-[#20bd5a] transition-colors cursor-pointer"
              >
                Request custom find on WhatsApp
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
