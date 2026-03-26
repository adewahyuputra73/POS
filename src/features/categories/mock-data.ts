import { Category, CategoryFilters, ProductForPicker } from './types';

// Mock categories data
export const mockCategories: Category[] = [
  {
    id: '1',
    store_id: 'store-1',
    name: 'Makanan',
    is_active: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-30T14:30:00Z',
  },
  {
    id: '2',
    store_id: 'store-1',
    name: 'Minuman',
    is_active: true,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-28T09:15:00Z',
  },
  {
    id: '3',
    store_id: 'store-1',
    name: 'Snack',
    is_active: true,
    createdAt: '2026-01-16T11:00:00Z',
    updatedAt: '2026-01-25T16:45:00Z',
  },
  {
    id: '4',
    store_id: 'store-1',
    name: 'Dessert',
    is_active: true,
    createdAt: '2026-01-17T09:00:00Z',
    updatedAt: '2026-01-24T11:20:00Z',
  },
  {
    id: '5',
    store_id: 'store-1',
    name: 'Paket Hemat',
    is_active: false,
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-20T08:00:00Z',
  },
  {
    id: '6',
    store_id: 'store-1',
    name: 'Promo Spesial',
    is_active: false,
    createdAt: '2026-01-19T12:00:00Z',
    updatedAt: '2026-01-19T12:00:00Z',
  },
];

// Products available for picker
export const mockProductsForPicker: ProductForPicker[] = [
  { id: '1', name: 'Nasi Goreng Spesial', price: 35000, categoryName: 'Makanan', isActive: true },
  { id: '2', name: 'Mie Goreng', price: 30000, categoryName: 'Makanan', isActive: true },
  { id: '3', name: 'Ayam Bakar', price: 45000, categoryName: 'Makanan', isActive: true },
  { id: '4', name: 'Es Teh Manis', price: 8000, categoryName: 'Minuman', isActive: true },
  { id: '5', name: 'Es Jeruk', price: 12000, categoryName: 'Minuman', isActive: true },
  { id: '6', name: 'Kopi Susu', price: 18000, categoryName: 'Minuman', isActive: true },
  { id: '7', name: 'Cappuccino', price: 25000, categoryName: 'Minuman', isActive: true },
  { id: '8', name: 'Kentang Goreng', price: 20000, categoryName: 'Snack', isActive: true },
  { id: '9', name: 'Cireng', price: 15000, categoryName: 'Snack', isActive: true },
  { id: '10', name: 'Brownies', price: 22000, categoryName: 'Dessert', isActive: true },
  { id: '11', name: 'Es Krim', price: 15000, categoryName: 'Dessert', isActive: false },
  { id: '12', name: 'Puding', price: 12000, categoryName: 'Dessert', isActive: true },
];

// Filter function
export function filterCategories(
  categories: Category[],
  filters: CategoryFilters
): Category[] {
  return categories.filter((category) => {
    // Status filter
    if (filters.status === 'active' && !category.is_active) return false;
    if (filters.status === 'inactive' && category.is_active) return false;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!category.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

// Get category stats
export function getCategoryStats(categories: Category[]) {
  return {
    total: categories.length,
    active: categories.filter((c) => c.is_active).length,
    inactive: categories.filter((c) => !c.is_active).length,
  };
}
