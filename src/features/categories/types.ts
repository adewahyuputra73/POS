// Category Types

export interface Category {
  id: string;
  store_id: string;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}

export interface CategoryFormData {
  name: string;
  is_active: boolean;
  productIds: string[];
}

export interface CategoryFilters {
  status: 'all' | 'active' | 'inactive';
  search: string;
}

// For product picker in category modal
export interface ProductForPicker {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  categoryName?: string;
  isActive: boolean;
}
