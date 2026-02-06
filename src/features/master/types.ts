// Master Module Types

// === OUTLET ===
export interface Outlet {
  id: number;
  name: string;
  address: string;
  isActive: boolean;
}

// === MASTER PRODUK ===
export interface MasterProduct {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  imageUrl?: string;
  basePrice: number;
  comparePriceclassName?: number; // harga coret
  prices: {
    default: number;
    gofood?: number;
    grabfood?: number;
    shopeefood?: number;
  };
  outletIds: number[];
  categoryIds: number[];
  variantIds: number[];
  settings: {
    useDimension: boolean;
    useStockLimit: boolean;
    useTax: boolean;
    useServiceFee: boolean;
    useTakeawayFee: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MasterProductFormData {
  name: string;
  description?: string;
  isActive: boolean;
  images: File[];
  basePrice: number;
  comparePrice?: number;
  gofoodPrice?: number;
  grabfoodPrice?: number;
  shopeefoodPrice?: number;
  outletIds: number[];
  categoryIds: number[];
  variantIds: number[];
  useDimension: boolean;
  useStockLimit: boolean;
  useTax: boolean;
  useServiceFee: boolean;
  useTakeawayFee: boolean;
}

export interface MasterProductFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
}

// === MASTER VARIAN ===
export interface MasterVariant {
  id: number;
  name: string;
  isRequired: boolean;
  maxOptions?: number; // null = unlimited
  optionSource: 'custom' | 'product'; 
  options: MasterVariantOption[];
  isActive: boolean;
  appliedProductCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MasterVariantOption {
  id: number;
  name: string;
  price: number;
  channelPrices?: {
    gofood?: number;
    grabfood?: number;
    shopeefood?: number;
  };
  stockLimit?: number;
  isActive: boolean;
  sourceProductId?: number; // if from product
}

export interface MasterVariantFormData {
  name: string;
  isRequired: boolean;
  maxOptions?: number;
  optionSource: 'custom' | 'product';
  options: Omit<MasterVariantOption, 'id'>[];
  isActive: boolean;
}

export interface MasterVariantFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
}

// === MASTER KATEGORI ===
export interface MasterCategory {
  id: number;
  name: string;
  isActive: boolean;
  productCount: number;
  productIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface MasterCategoryFormData {
  name: string;
  isActive: boolean;
  productIds: number[];
}

export interface MasterCategoryFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
}

// === IMPORT TYPES ===
export interface ImportFromOutletData {
  outletId: number;
  selectedIds: number[];
}
