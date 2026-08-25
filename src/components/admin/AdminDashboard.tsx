import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminProductList } from './AdminProductList';
import { AdminProductModal } from './AdminProductModal';
import { AdminSiteContent } from './AdminSiteContent';
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
  Plus
} from 'lucide-react';

interface AdminDashboardProps {
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExitAdmin }) => {
  const { currentUser, logout } = useAuth();
  const { seedFirestoreData, isFirestoreLive, loading } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'content'>('overview');
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
    <div className="min-h-screen bg-[#F4EFE6] text-[#1E1611] flex flex-col">
      
      {/* Admin Top Navigation Bar */}
      <header className="bg-[#1E1611] text-[#FBF9F5] sticky top-0 z-30 border-b border-[#3E2F26] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#D95A2B] text-white flex items-center justify-center font-bold">
                M
              </div>
              <div className="text-left">
                <span className="font-display font-extrabold text-sm sm:text-base tracking-wider block text-white">
                  THRIFT WITH MIEMIE
                </span>
                <span className="text-[10px] text-[#D95A2B] font-bold uppercase tracking-widest block">
                  ADMIN COCKPIT
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#2A2019] p-1.5 rounded-2xl border border-[#3E2F26]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog & Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-[#1E1611] text-[#D95A2B] shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site Copy & Policies</span>
            </button>
          </nav>

          {/* Right Action Icons (Exit to store & Logout) */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Seed / Reset Firestore */}
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-[#D95A2B] bg-[#2A2019] px-3 py-1.5 rounded-xl border border-[#3E2F26] transition-colors"
              title="Seed initial Lagos catalog to Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              <span>{seeding ? 'Syncing...' : 'Seed Catalog'}</span>
            </button>

            {/* Back to Live Store */}
            <button
              onClick={onExitAdmin}
              className="bg-[#2A2019] hover:bg-[#3E2F26] text-stone-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#D95A2B]" />
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 hover:text-white transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-[#3E2F26]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg ${
              activeTab === 'overview' ? 'text-[#D95A2B] bg-[#2A2019]' : 'text-stone-400'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg ${
              activeTab === 'products' ? 'text-[#D95A2B] bg-[#2A2019]' : 'text-stone-400'
            }`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg ${
              activeTab === 'content' ? 'text-[#D95A2B] bg-[#2A2019]' : 'text-stone-400'
            }`}
          >
            Site Settings
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {seedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Sample Lagos curated thrift catalog seeded successfully into Firestore!</span>
          </div>
        )}

        {activeTab === 'overview' && (
          <AdminOverview
            onAddNewProduct={handleAddNew}
            onEditProduct={handleEdit}
            onSwitchTab={setActiveTab}
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
