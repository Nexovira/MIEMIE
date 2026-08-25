import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, ProductStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Filter, 
  AlertTriangle,
  Layers,
  ArrowUpDown,
  X,
  Radio
} from 'lucide-react';

interface AdminProductListProps {
  onAddNewProduct: () => void;
  onEditProduct: (p: Product) => void;
}

export const AdminProductList: React.FC<AdminProductListProps> = ({
  onAddNewProduct,
  onEditProduct
}) => {
  const { products, updateProduct, deleteProduct } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'order'>('order');
  
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = typeof p.name === 'string' && p.name.toLowerCase().includes(q);
        const matchSize = typeof p.size === 'string' && p.size.toLowerCase().includes(q);
        const matchCat = typeof p.category === 'string' && p.category.toLowerCase().includes(q);
        const matchTags = Array.isArray(p.tags) && p.tags.some(t => typeof t === 'string' && t.toLowerCase().includes(q));
        if (!matchName && !matchSize && !matchCat && !matchTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return (a.displayOrder || 99) - (b.displayOrder || 99);
    });
  }, [products, search, selectedCategory, selectedStatus, sortBy]);

  const handleStatusChange = async (productId: string, newStatus: ProductStatus) => {
    await updateProduct(productId, { status: newStatus });
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-black text-[#1E1611] tracking-tight">
              Inventory & Catalog
            </h2>
            <span className="bg-[#FFEFEA] text-[#D95A2B] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              {filteredProducts.length} Pieces
            </span>
          </div>
          <p className="text-xs text-[#7A6E65]">
            Manage items, edit measurements, adjust prices, and toggle instant availability.
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="bg-[#D95A2B] hover:bg-[#b84218] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Thrift Item</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FBF9F5] p-3.5 sm:p-5 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A6E65] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pieces, sizes, tags..."
              className="w-full pl-10 pr-8 py-2.5 bg-white rounded-xl text-xs sm:text-sm text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] min-h-[40px]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2.5 bg-white rounded-xl text-xs sm:text-sm font-medium text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] min-h-[40px] cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            <option value="dresses">Statement Dresses</option>
            <option value="denim">Denim & Shorts</option>
            <option value="tops-everyday">Everyday Tops</option>
            <option value="babywear">Babywear & Kids</option>
            <option value="wholesale">Wholesale Bundles</option>
            <option value="vintage-outerwear">Blazers & Outerwear</option>
            <option value="accessories">Accessories</option>
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2.5 bg-white rounded-xl text-xs sm:text-sm font-medium text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] min-h-[40px] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="available">🟢 Available for Claim</option>
            <option value="reserved">🟡 Reserved / Stockpile</option>
            <option value="sold">🔴 Sold Out</option>
            <option value="hidden">⚪ Hidden from Public</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full p-2.5 bg-white rounded-xl text-xs sm:text-sm font-medium text-[#1E1611] border border-[#DCD5C9] focus:outline-hidden focus:border-[#D95A2B] min-h-[40px] cursor-pointer"
          >
            <option value="order">Display Order (Curated)</option>
            <option value="newest">Newest Added First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

        </div>
      </div>

      {/* Products Table (Desktop & Tablet) & Cards (Mobile) */}
      <div className="bg-[#FBF9F5] rounded-3xl border border-[#E7E2D8] shadow-2xs overflow-hidden">
        
        {/* Desktop Table View (md and above) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4EFE6] text-[#7A6E65] uppercase tracking-wider font-bold border-b border-[#E7E2D8]">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Size & Condition</th>
                <th className="py-3.5 px-4">Price (₦)</th>
                <th className="py-3.5 px-4">Live Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E2D8]">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF6EF] transition-colors">
                  
                  {/* Item Image & Title */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.coverImage}
                        alt={p.name}
                        className="w-12 h-14 rounded-xl object-cover bg-stone-200 shrink-0 border border-[#E7E2D8]"
                      />
                      <div className="min-w-0 max-w-xs">
                        <div className="font-display font-bold text-sm text-[#1E1611] truncate">
                          {p.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#7A6E65] mt-0.5 flex-wrap">
                          <span>Ref: {p.id}</span>
                          {p.featured && <span className="text-[#D95A2B] font-bold">★ Featured</span>}
                          {p.newArrival && <span className="text-emerald-700 font-bold">✨ New</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 font-semibold text-[#5A4E45] capitalize">
                    {p.category.replace('-', ' ')}
                  </td>

                  {/* Size & Condition */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#1E1611]">{p.size}</div>
                    <span className="text-[11px] text-[#7A6E65]">{p.condition}</span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-display font-black text-sm text-[#1E1611]">
                    ₦{p.price.toLocaleString()}
                  </td>

                  {/* Fast Status Switcher */}
                  <td className="py-3.5 px-4">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-hidden cursor-pointer ${
                        p.status === 'available' ? 'bg-[#E8F8EE] text-[#0F823B] border-emerald-300' :
                        p.status === 'reserved' ? 'bg-[#FEF3C7] text-[#D97706] border-amber-300' :
                        p.status === 'sold' ? 'bg-[#EFECE4] text-[#78350F] border-stone-300' :
                        'bg-stone-100 text-stone-600 border-stone-300'
                      }`}
                    >
                      <option value="available">🟢 Available</option>
                      <option value="reserved">🟡 Reserved</option>
                      <option value="sold">🔴 Sold Out</option>
                      <option value="hidden">⚪ Hidden</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEditProduct(p)}
                        className="p-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE5DC] text-[#1E1611] transition-colors cursor-pointer border border-[#E7E2D8]"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4 text-[#D95A2B]" />
                      </button>
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer border border-red-200"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< md) */}
        <div className="md:hidden divide-y divide-[#E7E2D8] p-3.5 space-y-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="pt-4 first:pt-0 flex flex-col gap-3">
              
              <div className="flex items-start gap-3">
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="w-18 h-22 rounded-2xl object-cover bg-stone-200 shrink-0 border border-[#E7E2D8]"
                />
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#7A6E65]">
                    <span className="uppercase text-[#D95A2B] font-black">{p.category.replace('-', ' ')}</span>
                    <span className="font-bold bg-[#F4EFE6] px-1.5 py-0.5 rounded text-[#1E1611]">{p.size}</span>
                  </div>
                  
                  <h4 className="font-display text-sm font-extrabold text-[#1E1611] leading-tight">
                    {p.name}
                  </h4>
                  
                  <div className="font-display text-base font-black text-[#1E1611]">
                    ₦{p.price.toLocaleString()}
                  </div>

                  <div className="text-[11px] text-[#7A6E65]">
                    {p.condition}
                  </div>
                </div>
              </div>

              {/* Status & Actions Bar */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <select
                  value={p.status}
                  onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                  className={`text-xs font-bold px-2.5 py-2 rounded-xl border flex-1 min-h-[40px] cursor-pointer ${
                    p.status === 'available' ? 'bg-[#E8F8EE] text-[#0F823B] border-emerald-300' :
                    p.status === 'reserved' ? 'bg-[#FEF3C7] text-[#D97706] border-amber-300' :
                    p.status === 'sold' ? 'bg-[#EFECE4] text-[#78350F] border-stone-300' :
                    'bg-stone-100 text-stone-600 border-stone-300'
                  }`}
                >
                  <option value="available">🟢 Available</option>
                  <option value="reserved">🟡 Reserved</option>
                  <option value="sold">🔴 Sold Out</option>
                  <option value="hidden">⚪ Hidden</option>
                </select>

                <button
                  onClick={() => onEditProduct(p)}
                  className="px-3 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE5DC] text-[#1E1611] text-xs font-bold flex items-center gap-1 min-h-[40px] border border-[#E7E2D8] cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#D95A2B]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setProductToDelete(p)}
                  className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 min-h-[40px] min-w-[40px] flex items-center justify-center border border-red-200 cursor-pointer"
                  title="Delete piece"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-display text-base font-bold text-[#1E1611]">No products match your filters</h3>
            <p className="text-xs text-[#7A6E65]">Try changing your search terms or filter selection.</p>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1611]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FBF9F5] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-[#E7E2D8] space-y-4 text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#1E1611]">Delete This Thrift Piece?</h3>
            <p className="text-xs text-[#7A6E65]">
              Are you sure you want to remove <strong>"{productToDelete.name}"</strong>? This will remove it from the public rack.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2.5 bg-white border border-[#DCD5C9] rounded-xl text-xs font-bold text-[#5A4E45] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

