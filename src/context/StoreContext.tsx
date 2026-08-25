import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, SiteContent, FilterState, AdminUser } from '../types';
import { initialProducts, initialSiteContent } from '../data/initialData';
import { 
  db, 
  auth,
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from '../lib/firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

interface StoreContextType {
  products: Product[];
  siteContent: SiteContent;
  admins: AdminUser[];
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
  addAdminUser: (adminData: Omit<AdminUser, 'createdAt'>) => Promise<void>;
  deleteAdminUser: (uid: string) => Promise<void>;
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

const initialAdmins: AdminUser[] = [
  {
    uid: 'owner-miemie',
    email: 'owner@thriftwithmiemie.com',
    role: 'superadmin',
    displayName: 'Miemie (Founder)',
    createdAt: new Date().toISOString(),
    notes: 'Primary Store Administrator'
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
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

  // Sync Products, Site Content & Admin accounts from Firestore with real-time onSnapshot listeners
  useEffect(() => {
    let unsubscribeProducts = () => {};
    let unsubscribeContent = () => {};
    let unsubscribeAdmins = () => {};

    try {
      // 1. Live Products Listener
      const productsRef = collection(db, 'products');
      unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            fetchedProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
          });
          fetchedProducts.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
          setProducts(fetchedProducts);
          setIsFirestoreLive(true);
        } else {
          setIsFirestoreLive(false);
        }
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
        setLoading(false);
      });

      // 2. Live Site Content Listener (Owner Photo, Bio, Policies, Announcements)
      const contentDocRef = doc(db, 'siteContent', 'homepage');
      unsubscribeContent = onSnapshot(contentDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteContent(prev => ({
            ...prev,
            ...data,
            id: docSnap.id
          } as SiteContent));
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'siteContent/homepage');
      });

      // 3. Live Admins Listener
      const adminsRef = collection(db, 'admins');
      unsubscribeAdmins = onSnapshot(adminsRef, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedAdmins: AdminUser[] = [];
          snapshot.forEach((docSnap) => {
            fetchedAdmins.push({ uid: docSnap.id, ...docSnap.data() } as AdminUser);
          });
          setAdmins(fetchedAdmins);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'admins');
      });
    } catch (err) {
      console.warn('Firebase init listener error:', err);
      setLoading(false);
    }

    return () => {
      unsubscribeProducts();
      unsubscribeContent();
      unsubscribeAdmins();
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

  // Add Product with Live Sync
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
      handleFirestoreError(err, OperationType.WRITE, `products/${newId}`);
    }
    
    setProducts(prev => [newProduct, ...prev]);
    return newId;
  };

  // Update Product with Live Sync
  const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
    const updatedAt = new Date().toISOString();
    const cleanUpdates = { ...updates, updatedAt };

    try {
      await updateDoc(doc(db, 'products', id), cleanUpdates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }

    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...cleanUpdates } : p)));
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(prev => prev ? { ...prev, ...cleanUpdates } : null);
    }
  };

  // Delete Product with Live Sync
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }

    setProducts(prev => prev.filter(p => p.id !== id));
    if (quickViewProduct?.id === id) {
      setQuickViewProduct(null);
    }
  };

  // Update Site Content (Owner Photo, Bio, Rates, Announcements) with Real Live Sync
  const updateSiteContent = async (updates: Partial<SiteContent>): Promise<void> => {
    const updated: SiteContent = {
      ...siteContent,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'siteContent', 'homepage'), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteContent/homepage');
    }

    setSiteContent(updated);
  };

  // Add New Admin User with Live Sync
  const addAdminUser = async (adminData: Omit<AdminUser, 'createdAt'>): Promise<void> => {
    const newAdmin: AdminUser = {
      ...adminData,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'admins', adminData.uid), newAdmin);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `admins/${adminData.uid}`);
    }

    setAdmins(prev => {
      const exists = prev.some(a => a.uid === adminData.uid || a.email.toLowerCase() === adminData.email.toLowerCase());
      if (exists) {
        return prev.map(a => a.uid === adminData.uid ? newAdmin : a);
      }
      return [...prev, newAdmin];
    });
  };

  // Delete Admin User
  const deleteAdminUser = async (uid: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'admins', uid));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `admins/${uid}`);
    }

    setAdmins(prev => prev.filter(a => a.uid !== uid));
  };

  // Seed initial high quality data into Firestore
  const seedFirestoreData = async (): Promise<void> => {
    try {
      setLoading(true);
      for (const prod of initialProducts) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
      await setDoc(doc(db, 'siteContent', 'homepage'), initialSiteContent);
      await setDoc(doc(db, 'admins', 'owner-miemie'), initialAdmins[0]);
      setIsFirestoreLive(true);
      setProducts(initialProducts);
      setSiteContent(initialSiteContent);
      setAdmins(initialAdmins);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      siteContent,
      admins,
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
      addAdminUser,
      deleteAdminUser,
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
