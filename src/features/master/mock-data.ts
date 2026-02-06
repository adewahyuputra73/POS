import { 
  MasterProduct, 
  MasterVariant, 
  MasterCategory, 
  Outlet,
  MasterProductFilters,
  MasterVariantFilters,
  MasterCategoryFilters,
} from './types';

// === OUTLETS ===
export const mockOutlets: Outlet[] = [
  { id: 1, name: 'Outlet Pusat', address: 'Jl. Sudirman No. 1, Jakarta', isActive: true },
  { id: 2, name: 'Outlet Bandung', address: 'Jl. Asia Afrika No. 10, Bandung', isActive: true },
  { id: 3, name: 'Outlet Surabaya', address: 'Jl. Tunjungan No. 5, Surabaya', isActive: true },
  { id: 4, name: 'Outlet Yogyakarta', address: 'Jl. Malioboro No. 20, Yogyakarta', isActive: false },
];

// === MASTER PRODUK ===
export const mockMasterProducts: MasterProduct[] = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam, dan sayuran',
    isActive: true,
    imageUrl: '/images/nasi-goreng.jpg',
    basePrice: 35000,
    prices: { default: 35000, gofood: 38000, grabfood: 38000, shopeefood: 37000 },
    outletIds: [1, 2, 3],
    categoryIds: [1],
    variantIds: [1, 2],
    settings: {
      useDimension: false,
      useStockLimit: true,
      useTax: true,
      useServiceFee: true,
      useTakeawayFee: true,
    },
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-02-01T14:30:00Z',
  },
  {
    id: 2,
    name: 'Mie Goreng Seafood',
    description: 'Mie goreng dengan udang, cumi, dan sayuran segar',
    isActive: true,
    basePrice: 40000,
    prices: { default: 40000, gofood: 43000, grabfood: 43000 },
    outletIds: [1, 2],
    categoryIds: [1],
    variantIds: [1],
    settings: {
      useDimension: false,
      useStockLimit: true,
      useTax: true,
      useServiceFee: false,
      useTakeawayFee: true,
    },
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-01-28T11:20:00Z',
  },
  {
    id: 3,
    name: 'Es Kopi Susu',
    description: 'Kopi espresso dengan susu segar dan es',
    isActive: true,
    basePrice: 22000,
    prices: { default: 22000, gofood: 25000, grabfood: 25000, shopeefood: 24000 },
    outletIds: [1, 2, 3, 4],
    categoryIds: [2],
    variantIds: [3],
    settings: {
      useDimension: false,
      useStockLimit: false,
      useTax: true,
      useServiceFee: false,
      useTakeawayFee: false,
    },
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-01-20T16:45:00Z',
  },
  {
    id: 4,
    name: 'Ayam Geprek',
    description: 'Ayam crispy dengan sambal geprek pedas',
    isActive: false,
    basePrice: 28000,
    prices: { default: 28000, gofood: 31000 },
    outletIds: [1],
    categoryIds: [1],
    variantIds: [2],
    settings: {
      useDimension: false,
      useStockLimit: true,
      useTax: true,
      useServiceFee: true,
      useTakeawayFee: true,
    },
    createdAt: '2026-01-18T14:00:00Z',
    updatedAt: '2026-01-25T10:00:00Z',
  },
];

// === MASTER VARIAN ===
export const mockMasterVariants: MasterVariant[] = [
  {
    id: 1,
    name: 'Ukuran Porsi',
    isRequired: true,
    maxOptions: 1,
    optionSource: 'custom',
    options: [
      { id: 1, name: 'Regular', price: 0, isActive: true },
      { id: 2, name: 'Large', price: 5000, isActive: true },
      { id: 3, name: 'Extra Large', price: 10000, isActive: true },
    ],
    isActive: true,
    appliedProductCount: 8,
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-30T12:00:00Z',
  },
  {
    id: 2,
    name: 'Level Pedas',
    isRequired: false,
    maxOptions: 1,
    optionSource: 'custom',
    options: [
      { id: 4, name: 'Tidak Pedas', price: 0, isActive: true },
      { id: 5, name: 'Pedas', price: 0, isActive: true },
      { id: 6, name: 'Extra Pedas', price: 2000, isActive: true },
    ],
    isActive: true,
    appliedProductCount: 12,
    createdAt: '2026-01-06T09:00:00Z',
    updatedAt: '2026-01-28T15:30:00Z',
  },
  {
    id: 3,
    name: 'Topping Minuman',
    isRequired: false,
    optionSource: 'custom',
    options: [
      { id: 7, name: 'Boba', price: 5000, isActive: true },
      { id: 8, name: 'Jelly', price: 3000, isActive: true },
      { id: 9, name: 'Whipped Cream', price: 4000, isActive: true },
      { id: 10, name: 'Extra Shot', price: 6000, isActive: true },
    ],
    isActive: true,
    appliedProductCount: 5,
    createdAt: '2026-01-08T11:00:00Z',
    updatedAt: '2026-01-22T09:15:00Z',
  },
  {
    id: 4,
    name: 'Pilihan Lauk',
    isRequired: false,
    maxOptions: 3,
    optionSource: 'product',
    options: [
      { id: 11, name: 'Telur Dadar', price: 5000, isActive: true, sourceProductId: 101 },
      { id: 12, name: 'Ayam Goreng', price: 12000, isActive: true, sourceProductId: 102 },
      { id: 13, name: 'Tempe Goreng', price: 4000, isActive: false, sourceProductId: 103 },
    ],
    isActive: false,
    appliedProductCount: 0,
    createdAt: '2026-01-10T14:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
];

// === MASTER KATEGORI ===
export const mockMasterCategories: MasterCategory[] = [
  {
    id: 1,
    name: 'Makanan Utama',
    isActive: true,
    productCount: 15,
    productIds: [1, 2, 4],
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 2,
    name: 'Minuman',
    isActive: true,
    productCount: 10,
    productIds: [3],
    createdAt: '2026-01-01T08:00:00Z',
    updatedAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 3,
    name: 'Snack & Cemilan',
    isActive: true,
    productCount: 8,
    productIds: [],
    createdAt: '2026-01-02T09:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
  {
    id: 4,
    name: 'Dessert',
    isActive: true,
    productCount: 5,
    productIds: [],
    createdAt: '2026-01-03T10:00:00Z',
    updatedAt: '2026-01-18T16:30:00Z',
  },
  {
    id: 5,
    name: 'Promo Bundle',
    isActive: false,
    productCount: 0,
    productIds: [],
    createdAt: '2026-01-05T12:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
];

// === FILTER FUNCTIONS ===
export function filterMasterProducts(
  products: MasterProduct[],
  filters: MasterProductFilters
): MasterProduct[] {
  return products.filter((product) => {
    if (filters.status === 'active' && !product.isActive) return false;
    if (filters.status === 'inactive' && product.isActive) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

export function filterMasterVariants(
  variants: MasterVariant[],
  filters: MasterVariantFilters
): MasterVariant[] {
  return variants.filter((variant) => {
    if (filters.status === 'active' && !variant.isActive) return false;
    if (filters.status === 'inactive' && variant.isActive) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!variant.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

export function filterMasterCategories(
  categories: MasterCategory[],
  filters: MasterCategoryFilters
): MasterCategory[] {
  return categories.filter((category) => {
    if (filters.status === 'active' && !category.isActive) return false;
    if (filters.status === 'inactive' && category.isActive) return false;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!category.name.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

// === STATS HELPERS ===
export function getMasterProductStats(products: MasterProduct[]) {
  return {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    inactive: products.filter((p) => !p.isActive).length,
  };
}

export function getMasterVariantStats(variants: MasterVariant[]) {
  return {
    total: variants.length,
    active: variants.filter((v) => v.isActive).length,
    inactive: variants.filter((v) => !v.isActive).length,
  };
}

export function getMasterCategoryStats(categories: MasterCategory[]) {
  return {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
  };
}
