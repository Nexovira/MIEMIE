import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, SiteContent, FilterState } from '../types';
import { initialProducts, initialSiteContent } from '../data/initialData';
import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from '../lib/firebase';

interface StoreContextType {
  products: Product[];
  siteContent: SiteContent;
  loading: boolean;
  isFirestoreLive: boolean;
  savedProductIds: string[];
  toggleSaveProduct: (id: string) => void;
  isSaved: (id: string) => boolean;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSavedDrawerOpen: boolean;
  setIsSavedDrawerOpen: (open: boolean) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<string>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateSiteContent: (updates: Partial<SiteContent>) => Promise<void>;
  seedFirestoreData: () => Promise<void>;
  openWhatsApp: (product?: Product, customMessage?: string) => void;
}

const defaultFilter: FilterState = {
  category: 'all',
  searchQuery: '',
  status: 'all',
  size: '',
  priceRange: [0, 200000],
  sortBy: 'newest',
  onlyWholesale: false,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirestoreLive, setIsFirestoreLive] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState<boolean>(false);

  // Saved/Wishlist state
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('twm_saved_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('twm_saved_items', JSON.stringify(savedProductIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedProductIds]);

  const toggleSaveProduct = (id: string) => {
    setSavedProductIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isSaved = (id: string) => savedProductIds.includes(id);

  const resetFilters = () => setFilter(defaultFilter);

  // Sync Products & Site Content from Firestore with real-time listener
  useEffect(() => {
    let unsubscribeProducts = () => {};
    let unsubscribeContent = () => {};

    try {
      const productsRef = collection(db, 'products');
      unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            fetchedProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
          });
          // Sort by displayOrder or newest
          fetchedProducts.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
          setProducts(fetchedProducts);
          setIsFirestoreLive(true);
        } else {
          // If Firestore is empty, we keep local initial products and flag
          setIsFirestoreLive(false);
        }
        setLoading(false);
      }, (error) => {
        console.warn('Firestore products listener fallback to initial catalog:', error);
        setLoading(false);
      });

      const contentDocRef = doc(db, 'siteContent', 'homepage');
      unsubscribeContent = onSnapshot(contentDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setSiteContent({ id: docSnap.id, ...docSnap.data() } as SiteContent);
        }
      }, (err) => {
        console.warn('Firestore content listener error:', err);
      });
    } catch (err) {
      console.warn('Firebase init listener error:', err);
      setLoading(false);
    }

    return () => {
      unsubscribeProducts();
      unsubscribeContent();
    };
  }, []);

  // WhatsApp Helper
  const openWhatsApp = (product?: Product, customMessage?: string) => {
    const rawNumber = (siteContent.whatsappNumber || '2348148809211').replace(/\D/g, '');
    let text = '';

    if (customMessage) {
      text = customMessage;
    } else if (product) {
      text = product.whatsappMessage || 
        `Hi Thrift With Miemie! I saw "${product.name}" (₦${product.price.toLocaleString()}) on your website. Is it still available to claim?`;
    } else {
      text = `Hi Thrift With Miemie! I'm browsing your online store from Lagos and I'd like to make an inquiry about your latest thrift fashion drop.`;
    }

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${rawNumber}?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Add Product
  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>): Promise<string> => {
    const newId = `twm-${Date.now()}`;
    const newProduct: Product = {
      ...prodData,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'products', newId), newProduct);
      setIsFirestoreLive(true);
    } catch (err) {
      console.warn('Writing to local state due to Firestore permissions:', err);
    }
    
    // Update local state optimistically
    setProducts(prev => [newProduct, ...prev]);
    return newId;
  };

  // Update Product
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    const updatedAt = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt };

    try {
      await updateDoc(doc(db, 'products', id), cleanUpdates);
    } catch (err) {
      console.warn('Firestore update failed, applying locally:', err);
    }

    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...cleanUpdates } : p)));
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(prev => prev ? { ...prev, ...cleanUpdates } : null);
    }
  };

  // Delete Product
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.warn('Firestore delete failed, removing locally:', err);
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(null);
    }
  };

  // Update Site Content
  const updateSiteContent = async (updates: Partial<SiteContent>): Promise<void> => {
    const updated: SiteContent = {
      ...siteContent,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'siteContent', 'homepage'), updated);
    } catch (err) {
      console.warn('Firestore content update failed, saving locally:', err);
    }

    setSiteContent(updated);
  };

  // Seed initial high quality data into Firestore
  const seedFirestoreData = async (): Promise<void> => {
    try {
      setLoading(true);
      // Seed products
      for (const prod of initialProducts) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      // Seed site content
      await setDoc(doc(db, 'siteContent', 'homepage'), initialSiteContent);
      setIsFirestoreLive(true);
      setProducts(initialProducts);
      setSiteContent(initialSiteContent);
    } catch (err) {
      console.error('Error seeding data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      siteContent,
      loading,
      isFirestoreLive,
      savedProductIds,
      toggleSaveProduct,
      isSaved,
      filter,
      setFilter,
      resetFilters,
      quickViewProduct,
      setQuickViewProduct,
      isSavedDrawerOpen,
      setIsSavedDrawerOpen,
      addProduct,
      updateProduct,
      deleteProduct,
      updateSiteContent,
      seedFirestoreData,
      openWhatsApp
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
