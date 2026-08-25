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
  Database,
  Layers,
  ArrowUpRight,
  ShoppingBag
} from 'lucide-react';

interface AdminOverviewProps {
  onAddNewProduct: () => void;
  onEditProduct: (p: Product) => void;
  onSwitchTab: (tab: 'products' | 'content' | 'accounts') => void;
  onExitAdmin: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onAddNewProduct,
  onEditProduct,
  onSwitchTab,
  onExitAdmin
}) => {
  const { products, isFirestoreLive, seedFirestoreData } = useStore();

  const totalProducts = products?.length || 0;
  const availableProducts = (products || []).filter(p => p && p.status === 'available').length;
  const reservedProducts = (products || []).filter(p => p && p.status === 'reserved').length;
  const soldProducts = (products || []).filter(p => p && p.status === 'sold').length;
  const hiddenProducts = (products || []).filter(p => p && p.status === 'hidden').length;
  const featuredProducts = (products || []).filter(p => p && p.featured).length;

  const totalCatalogValue = (products || [])
    .filter(p => p && (p.status === 'available' || p.status === 'reserved'))
    .reduce((sum, p) => sum + (p.price || 0), 0);

  const availablePercentage = totalProducts > 0 ? Math.round((availableProducts / totalProducts) * 100) : 0;
  const reservedPercentage = totalProducts > 0 ? Math.round((reservedProducts / totalProducts) * 100) : 0;
  const soldPercentage = totalProducts > 0 ? Math.round((soldProducts / totalProducts) * 100) : 0;

  const recentProducts = [...(products || [])].slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* Top Luxury Executive Cockpit Banner */}
      <div className="bg-[#1E1611] text-[#FBF9F5] rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden border border-[#3E2F26]">
        
        {/* Background decorative watermark */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-5 pointer-events-none select-none font-display font-black text-9xl text-white">
          MIEMIE
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#D95A2B] text-white text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                STORE DASHBOARD
              </span>
              <span className={`text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border ${
                isFirestoreLive 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60' 
                  : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
              }`}>
                <Database className="w-3 h-3 shrink-0" />
                <span>{isFirestoreLive ? 'Cloud Firestore Connected (Real-Time)' : 'Local Sync Storage Active'}</span>
              </span>
            </div>

            <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight text-white">
              Welcome back, Miemie 👋
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              Manage your curated Lagos thrift catalog, update piece availability in real-time, adjust prices in Naira, and manage customer hold orders.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={onAddNewProduct}
              className="bg-[#D95A2B] hover:bg-[#b84218] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Piece</span>
            </button>

            <button
              onClick={() => onSwitchTab('content')}
              className="bg-[#2A2019] hover:bg-[#3E2F26] text-stone-200 font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl flex items-center gap-2 transition-all cursor-pointer border border-[#3E2F26] min-h-[44px]"
            >
              <Edit3 className="w-4 h-4 text-[#D95A2B]" />
              <span>Store Copy</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-3 rounded-2xl flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Live Stock Ratio Breakdown Bar */}
        <div className="mt-6 pt-5 border-t border-[#3E2F26]/80 relative z-10 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-stone-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Available ({availableProducts})</span>
              <span className="text-stone-500">•</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Reserved / Stockpiled ({reservedProducts})</span>
              <span className="text-stone-500">•</span>
              <span className="w-2 h-2 rounded-full bg-stone-400"></span>
              <span>Sold ({soldProducts})</span>
            </span>
            <span className="text-[11px] text-stone-400 font-mono">
              {totalProducts} Total Pieces Listed
            </span>
          </div>

          <div className="h-2 w-full bg-[#140E0A] rounded-full overflow-hidden flex gap-0.5 p-0.5">
            <div 
              style={{ width: `${availablePercentage}%` }} 
              className="bg-emerald-500 rounded-l-full h-full transition-all duration-500" 
              title={`Available: ${availablePercentage}%`}
            />
            <div 
              style={{ width: `${reservedPercentage}%` }} 
              className="bg-amber-500 h-full transition-all duration-500" 
              title={`Reserved: ${reservedPercentage}%`}
            />
            <div 
              style={{ width: `${soldPercentage}%` }} 
              className="bg-stone-500 rounded-r-full h-full transition-all duration-500" 
              title={`Sold: ${soldPercentage}%`}
            />
          </div>
        </div>

      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Total Active Inventory Value */}
        <div className="bg-[#FBF9F5] p-4 sm:p-5 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-2 hover:border-[#D95A2B]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">Rack Value (Active)</span>
            <div className="w-7 h-7 rounded-xl bg-[#FFEFEA] text-[#D95A2B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-xl xs:text-2xl sm:text-3xl font-black text-[#1E1611] tracking-tight">
            ₦{totalCatalogValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#7A6E65] block font-medium">
            {availableProducts} for sale · {reservedProducts} on hold
          </span>
        </div>

        {/* Available Finds */}
        <div className="bg-[#FBF9F5] p-4 sm:p-5 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-2 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">Ready on WhatsApp</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#0F823B] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-xl xs:text-2xl sm:text-3xl font-black text-[#0F823B]">
            {availableProducts}
          </div>
          <span className="text-[11px] text-[#7A6E65] block font-medium">
            Active instant claims
          </span>
        </div>

        {/* Reserved / Stockpiled */}
        <div className="bg-[#FBF9F5] p-4 sm:p-5 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-2 hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">Hold / Stockpiling</span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-xl xs:text-2xl sm:text-3xl font-black text-[#D97706]">
            {reservedProducts}
          </div>
          <span className="text-[11px] text-[#7A6E65] block font-medium">
            14-day hold awaiting waybill
          </span>
        </div>

        {/* Sold Out */}
        <div className="bg-[#FBF9F5] p-4 sm:p-5 rounded-3xl border border-[#E7E2D8] shadow-2xs space-y-2 hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#7A6E65]">
            <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">Sold Pieces</span>
            <div className="w-7 h-7 rounded-xl bg-stone-100 text-[#5A4E45] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display text-xl xs:text-2xl sm:text-3xl font-black text-[#1E1611]">
            {soldProducts}
          </div>
          <span className="text-[11px] text-[#7A6E65] block font-medium">
            Paid & dispatched
          </span>
        </div>

      </div>

      {/* Recent Uploads Table & Quick Actions Section */}
      <div className="bg-[#FBF9F5] rounded-3xl border border-[#E7E2D8] p-4 sm:p-6 md:p-7 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E2D8]">
          <div>
            <h2 className="font-display text-base sm:text-lg font-extrabold text-[#1E1611] tracking-tight">
              Recently Uploaded Drop Items
            </h2>
            <p className="text-xs text-[#7A6E65]">
              Quickly preview, edit details, or change availability of recent pieces
            </p>
          </div>

          <button
            onClick={() => onSwitchTab('products')}
            className="text-xs font-bold text-[#D95A2B] hover:text-[#b84218] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>View Full Inventory ({totalProducts})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of recent items */}
        <div className="divide-y divide-[#E7E2D8]">
          {recentProducts.map((p) => (
            <div key={p.id} className="py-3.5 first:pt-1 last:pb-1 flex items-center justify-between gap-3 sm:gap-4">
              
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img
                  src={p.coverImage}
                  alt={p.name}
                  className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl object-cover bg-stone-200 shrink-0 border border-[#E7E2D8]"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-[#D95A2B] tracking-wider">
                      {p.category.replace('-', ' ')}
                    </span>
                    {p.featured && (
                      <span className="text-[9px] bg-[#FFEFEA] text-[#D95A2B] font-bold px-1.5 py-0.2 rounded-md">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-display text-xs sm:text-sm font-bold text-[#1E1611] truncate mt-0.5">
                    {p.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[11px] text-[#7A6E65] mt-0.5 flex-wrap">
                    <span>Size: {p.size}</span>
                    <span>•</span>
                    <strong className="text-[#1E1611] font-mono">₦{p.price.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Status Badge & Edit Action */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full whitespace-nowrap ${
                  p.status === 'available' ? 'bg-[#E8F8EE] text-[#0F823B] border border-emerald-200' :
                  p.status === 'reserved' ? 'bg-[#FEF3C7] text-[#D97706] border border-amber-200' :
                  p.status === 'sold' ? 'bg-[#EFECE4] text-[#78350F] border border-stone-200' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {p.status}
                </span>

                <button
                  onClick={() => onEditProduct(p)}
                  className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE5DC] active:scale-95 text-[#1E1611] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-[#E7E2D8]"
                  title="Edit details"
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

