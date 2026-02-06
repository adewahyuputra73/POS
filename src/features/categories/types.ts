// Category Types

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  outletId: number;
}

export interface CategoryFormData {
  name: string;
  isActive: boolean;
  productIds: number[];
}

export interface CategoryFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
}

// For product picker in category modal
export interface ProductForPicker {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
  isActive: boolean;
}
