export type Status = 'ACTIVE' | 'INACTIVE';

export interface MasterCategory {
  id: string;
  name: string;
  icon?: string; // URL or icon name
  productsCount: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface MasterVariantOption {
  id: string;
  name: string;
  priceAdjustment: number;
  isDefault?: boolean;
  productId?: string; // If optionSource is 'menu_book'
}

export interface MasterVariant {
  id: string;
  name: string; // Group name, e.g., "Size", "Sugar Level"
  type: 'SINGLE' | 'MULTIPLE'; // Radio vs Checkbox
  options: MasterVariantOption[];
  isMandatory: boolean;
  minSelection?: number;
  maxSelection?: number;
  // New fields for Master Variant specific logic
  optionSource?: 'custom' | 'menu_book';
  appliedProductCount?: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface MasterProduct {
  id: string;
  // General
  name: string;
  description?: string;
  categoryId: string;
  image?: string;
  
  // Pricing
  basePrice: number;
  costPrice?: number; // HPP / Harga Modal for Gross Profit calculation
  channelPrices?: {
    goFood?: number;
    grabFood?: number;
    shopeeFood?: number;
    [key: string]: number | undefined;
  };
  
  // Inventory
  sku?: string;
  trackStock: boolean;
  minStock?: number;
  stock?: number;
  
  // Attributes
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  hasTax: boolean;
  hasServiceFee: boolean;
  
  // Relations
  variantIds: string[]; // IDs of MasterVariants attached
  outletIds?: string[]; // IDs of outlets where this product is available
  
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export interface MasterProductFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
  categoryId?: string;
}

export interface MasterVariantFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
}

export interface Outlet {
  id: string;
  name: string;
  address?: string;
  isActive?: boolean;
}
