import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  Lock, 
  EyeOff, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Database
} from 'lucide-react';

interface AdminOverviewProps {
  onAddNewProduct: () => void;
  onEditProduct: (p: Product) => void;
  onSwitchTab: (tab: 'products' | 'content' | 'settings') => void;
  onExitAdmin: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onAddNewProduct,
  onEditProduct,
  onSwitchTab,
  onExitAdmin
}) => {
  const { products, isFirestoreLive, seedFirestoreData } = useStore();

  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'available').length;
  const reservedProducts = products.filter(p => p.status === 'reserved').length;
  const soldProducts = products.filter(p => p.status === 'sold').length;
  const hiddenProducts = products.filter(p => p.status === 'hidden').length;
  const featuredProducts = products.filter(p => p.featured).length;

  const totalCatalogValue = products
    .filter(p => p.status === 'available' || p.status === 'reserved')
    .reduce((sum, p) => sum + p.price, 0);

  const recentProducts = [...products].slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Quick Actions */}
      <div className="bg-[#1E1611] text-[#FBF9F5] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#D95A2B] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              BUSINESS COCKPIT
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isFirestoreLive ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
            }`}>
              <Database className="w-3 h-3" />
              {isFirestoreLive ? 'Cloud Firestore Connected' : 'Local / Offline Sync Active'}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome back, Miemie 👋
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
            Manage your curated thrift drops, adjust prices in Naira, toggle piece availability, and update your Egbeda delivery info in real-time.
          </p>
        </div>

        {/* Quick Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onAddNewProduct}
            className="bg-[#D95A2B] hover:bg-[#b84218] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece</span>
          </button>

          <button
            onClick={() => onSwitchTab('content')}
            className="bg-[#3E2F26] hover:bg-[#4E3B30] text-stone-200 font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#D95A2B]" />
            <span>Edit Site Copy</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Value */}
        <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider">Active Inventory Value</span>
            <TrendingUp className="w-4 h-4 text-[#D95A2B]" />
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-[#1E1611]">
            ₦{totalCatalogValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#7A6E65] block">
            {availableProducts} available · {reservedProducts} on hold
          </span>
        </div>

        {/* Available Products */}
        <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider">Available Finds</span>
            <CheckCircle2 className="w-4 h-4 text-[#0F823B]" />
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-[#0F823B]">
            {availableProducts}
          </div>
          <span className="text-[11px] text-[#7A6E65] block">
            Ready to claim on WhatsApp
          </span>
        </div>

        {/* Reserved (Hold) Products */}
        <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider">Reserved / Stockpiling</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-[#D97706]">
            {reservedProducts}
          </div>
          <span className="text-[11px] text-[#7A6E65] block">
            Awaiting transfer / delivery
          </span>
        </div>

        {/* Sold Products */}
        <div className="bg-[#FBF9F5] p-5 rounded-2xl border border-[#E7E2D8] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider">Sold Out</span>
            <Lock className="w-4 h-4 text-[#78350F]" />
          </div>
          <div className="font-display text-2xl sm:text-3xl font-black text-[#78350F]">
            {soldProducts}
          </div>
          <span className="text-[11px] text-[#7A6E65] block">
            Successfully claimed
          </span>
        </div>

      </div>

      {/* Recent Uploads Table / Card Section */}
      <div className="bg-[#FBF9F5] rounded-3xl border border-[#E7E2D8] p-5 sm:p-7 shadow-2xs space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#1E1611]">
              Recent Drop Uploads
            </h2>
            <p className="text-xs text-[#7A6E65]">
              Quickly preview or modify your most recently listed pieces
            </p>
          </div>

          <button
            onClick={() => onSwitchTab('products')}
            className="text-xs font-bold text-[#D95A2B] hover:underline"
          >
            View All ({totalProducts}) →
          </button>
        </div>

        {/* List of recent items */}
        <div className="divide-y divide-[#E7E2D8]">
          {recentProducts.map((p) => (
            <div key={p.id} className="py-3.5 flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="w-12 h-14 rounded-xl object-cover bg-stone-200 shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-display text-xs sm:text-sm font-bold text-[#1E1611] truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#7A6E65] mt-0.5">
                    <span className="capitalize">{p.category.replace('-', ' ')}</span>
                    <span>•</span>
                    <span>Size: {p.size}</span>
                    <span>•</span>
                    <strong className="text-[#1E1611]">₦{p.price.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Status Badge & Edit */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                  p.status === 'available' ? 'bg-[#E8F8EE] text-[#0F823B]' :
                  p.status === 'reserved' ? 'bg-[#FEF3C7] text-[#D97706]' :
                  p.status === 'sold' ? 'bg-[#EFECE4] text-[#78350F]' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {p.status}
                </span>

                <button
                  onClick={() => onEditProduct(p)}
                  className="p-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE5DC] text-[#1E1611] text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#D95A2B]" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
