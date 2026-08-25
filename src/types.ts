export type ProductCategory = 
  | 'all'
  | 'dresses'
  | 'denim'
  | 'tops-everyday'
  | 'babywear'
  | 'wholesale'
  | 'vintage-outerwear'
  | 'accessories';

export type ProductStatus = 'available' | 'reserved' | 'sold' | 'hidden';

export type ProductCondition = 
  | 'Grade A+ (Like New)'
  | 'Grade A (Gently Worn)'
  | 'Vintage Pristine'
  | 'Brand Sample'
  | 'Wholesale Bale';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'dresses' | 'denim' | 'tops-everyday' | 'babywear' | 'wholesale' | 'vintage-outerwear' | 'accessories';
  price: number;
  currency: 'NGN' | 'USD';
  originalPrice?: number;
  size: string;
  colour: string;
  condition: ProductCondition;
  description: string;
  measurements?: string;
  images: string[];
  coverImage: string;
  status: ProductStatus;
  featured: boolean;
  newArrival: boolean;
  wholesaleAvailable: boolean;
  wholesalePrice?: number;
  tags: string[];
  whatsappMessage?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface SiteContent {
  id: string;
  heroHeadline: string;
  heroSubtext: string;
  heroBadge: string;
  heroImages: string[];
  whatsappNumber: string;
  instagramHandle: string;
  businessLocation: string;
  deliveryLagos: string;
  deliveryInterstate: string;
  pickupAddress: string;
  stockpilingPolicy: string;
  paymentInstructions: string;
  returnPolicy: string;
  ownerStoryTitle: string;
  ownerStoryText: string;
  ownerImageUrl: string;
  wholesaleDescription: string;
  announcementText: string;
  showAnnouncement: boolean;
  updatedAt: string;
}

export interface FilterState {
  category: ProductCategory;
  searchQuery: string;
  status: 'all' | 'available' | 'reserved' | 'sold';
  size: string;
  priceRange: [number, number];
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'featured';
  onlyWholesale: boolean;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
  displayName?: string;
}
