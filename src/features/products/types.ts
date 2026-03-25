// Product Types
export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ChannelPrice {
  channel: 'pos' | 'gofood' | 'grabfood' | 'shopeefood';
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  categoryId?: string;
  categoryName?: string;
  isActive: boolean;
  barcode?: string;
  sku?: string;
  useStock: boolean;
  stockQuantity?: number;
  stockLimit?: number;
  taxId?: number;
  serviceFeeId?: number;
  takeawayFee?: number;
  useDimension: boolean;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  images: ProductImage[];
  channelPrices: ChannelPrice[];
  variantIds: number[];
  createdAt: string;
  updatedAt: string;
}

// Variant Types
export type VariantSourceType = 'custom' | 'product';

export interface VariantOption {
  id: number;
  name: string;
  price: number;
  channelPrices?: ChannelPrice[];
  useStock: boolean;
  stockQuantity?: number;
  isActive: boolean;
  sourceProductId?: string; // Only for 'product' sourceType
}

export interface Variant {
  id: number;
  name: string;
  isRequired: boolean;
  maxOptions?: number; // undefined means unlimited
  sourceType: VariantSourceType;
  options: VariantOption[];
  appliedProductCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  isActive: boolean;
}

// Tax & Service Fee Types
export interface Tax {
  id: number;
  name: string;
  percentage: number;
}

export interface ServiceFee {
  id: number;
  name: string;
  amount: number;
  isPercentage: boolean;
}

export interface ProductPriceRequest {
  channel: string;
  price: number;
  compare_price?: number | null;
}

// API Request Types
export interface CreateProductRequest {
  name: string;
  price?: number;
  prices?: ProductPriceRequest[];
  unit?: string;
  category_id?: string;
  is_active?: boolean;
  stock_type: "LIMITED" | "UNLIMITED";
  stock_qty?: number;
  stock_limit?: number;
  description?: string;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  prices?: ProductPriceRequest[];
  unit?: string;
  category_id?: string;
  is_active?: boolean;
  stock_type?: "LIMITED" | "UNLIMITED";
  stock_qty?: number;
  stock_limit?: number;
  description?: string;
}

export interface UpdateStockRequest {
  qty: number;
  note?: string;
}

export interface UpdatePriceRequest {
  channel: string;
  price: number;
}

export interface BulkDeleteRequest {
  ids: string[];
}

export interface BulkStatusRequest {
  ids: string[];
  is_active: boolean;
}

export interface StockHistory {
  id: string;
  qty: number;
  note: string;
  created_at: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
}

// Filter Types
export type ProductStatusFilter = 'all' | 'active' | 'inactive';

export interface ProductFilters {
  status: ProductStatusFilter;
  search: string;
  categoryId?: string;
}

export interface VariantFilters {
  search: string;
  isRequired?: boolean;
}

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  comparePrice: number;
  categoryId: string | null;
  isActive: boolean;
  barcode: string;
  sku: string;
  useStock: boolean;
  stockQuantity: number;
  stockLimit: number;
  taxId: number | null;
  serviceFeeId: number | null;
  takeawayFee: number;
  useDimension: boolean;
  weight: number;
  length: number;
  width: number;
  height: number;
  images: File[];
  channelPrices: {
    gofood: number;
    grabfood: number;
    shopeefood: number;
  };
  variantIds: number[];
}

export interface VariantFormData {
  name: string;
  isRequired: boolean;
  maxOptions: number | null;
  sourceType: VariantSourceType;
  options: VariantOptionFormData[];
}

export interface VariantOptionFormData {
  id?: number;
  name: string;
  price: number;
  channelPrices: {
    gofood: number;
    grabfood: number;
    shopeefood: number;
  };
  useStock: boolean;
  stockQuantity: number;
  isActive: boolean;
  sourceProductId?: string;
}
