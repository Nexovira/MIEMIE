import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminProductList } from './AdminProductList';
import { AdminProductModal } from './AdminProductModal';
import { AdminSiteContent } from './AdminSiteContent';
import { AdminAccounts } from './AdminAccounts';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Database,
  RefreshCw,
  Plus,
  Users,
  Radio,
  Store,
  ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { currentUser, logout } = useAuth();
  const { seedFirestoreData, isFirestoreLive, loading, products } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'content' | 'accounts'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct(prod);
    setModalOpen(true);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedSuccess(false);
    try {
      await seedFirestoreData();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1E1611] flex flex-col w-full max-w-full overflow-x-hidden font-sans">
      
      {/* Admin Top Navigation Bar */}
      <header 
        className="bg-[#1E1611] text-[#FBF9F5] sticky top-0 z-40 border-b border-[#3E2F26] w-full max-w-full shadow-lg"
        style={{
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)'
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 gap-2 sm:gap-4">
            
            {/* Logo & Portal Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={onExitAdmin}
                className="flex items-center gap-2.5 group text-left cursor-pointer min-w-0"
                title="Back to Storefront"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#D95A2B] to-[#b84218] text-white flex items-center justify-center font-black text-sm sm:text-base shadow-sm shrink-0">
                  M
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-black text-xs sm:text-sm md:text-base tracking-wider text-white truncate">
                      THRIFT WITH MIEMIE
                    </span>
                    <span className="hidden xs:inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                      <Radio className="w-2 h-2 animate-pulse" />
                      LIVE
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-[#D95A2B] font-bold uppercase tracking-widest block truncate">
                    BUSINESS COCKPIT
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop / Tablet Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#2A2019] p-1.5 rounded-2xl border border-[#3E2F26]/80">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Inventory ({products?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('content')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'content'
                    ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Storefront Copy</span>
              </button>

              <button
                onClick={() => setActiveTab('accounts')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'accounts'
                    ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Team Access</span>
              </button>
            </nav>

            {/* Right Action Icons (Add Product, View Store, Logout) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Quick Add Piece (Desktop) */}
              <button
                onClick={handleAddNew}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#D95A2B] hover:bg-[#b84218] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Piece</span>
              </button>

              {/* Back to Live Store */}
              <button
                onClick={onExitAdmin}
                className="bg-[#2A2019] hover:bg-[#3E2F26] text-stone-200 text-xs font-bold px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-[#3E2F26]"
                title="Return to Public Storefront"
              >
                <Store className="w-3.5 h-3.5 text-[#D95A2B]" />
                <span className="hidden sm:inline">Storefront</span>
                <span className="sm:hidden text-[11px]">Store</span>
              </button>

              {/* Logout */}
              <button
                onClick={logout}
                className="p-2 sm:p-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer border border-red-900/40"
                title="Sign Out of Admin"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Sub-Navigation Segments (< 768px) */}
        <div className="md:hidden border-t border-[#3E2F26] bg-[#17110D] px-2 py-1.5">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all ${
                activeTab === 'overview' 
                  ? 'text-[#D95A2B] bg-[#2A2019] font-black' 
                  : 'text-stone-400 font-medium hover:text-stone-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight truncate w-full">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all ${
                activeTab === 'products' 
                  ? 'text-[#D95A2B] bg-[#2A2019] font-black' 
                  : 'text-stone-400 font-medium hover:text-stone-200'
              }`}
            >
              <Package className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight truncate w-full">Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all ${
                activeTab === 'content' 
                  ? 'text-[#D95A2B] bg-[#2A2019] font-black' 
                  : 'text-stone-400 font-medium hover:text-stone-200'
              }`}
            >
              <Settings className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight truncate w-full">Copy</span>
            </button>

            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all ${
                activeTab === 'accounts' 
                  ? 'text-[#D95A2B] bg-[#2A2019] font-black' 
                  : 'text-stone-400 font-medium hover:text-stone-200'
              }`}
            >
              <Users className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight truncate w-full">Admins</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
        
        {seedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Sample Lagos curated thrift catalog seeded successfully into Firestore!</span>
          </div>
        )}

        {activeTab === 'overview' && (
          <AdminOverview
            onAddNewProduct={handleAddNew}
            onEditProduct={handleEdit}
            onSwitchTab={(tab) => setActiveTab(tab as any)}
            onExitAdmin={onExitAdmin}
          />
        )}

        {activeTab === 'products' && (
          <AdminProductList
            onAddNewProduct={handleAddNew}
            onEditProduct={handleEdit}
          />
        )}

        {activeTab === 'content' && (
          <AdminSiteContent />
        )}

        {activeTab === 'accounts' && (
          <AdminAccounts />
        )}

      </main>

      {/* Product Add / Edit Modal */}
      {modalOpen && (
        <AdminProductModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSaved={() => setModalOpen(false)}
        />
      )}

    </div>
  );
};


