import { Product, Variant, Category, Tax, ServiceFee } from './types';

// Mock Categories
export const mockCategories: Category[] = [
  { id: 1, name: 'Makanan', description: 'Kategori makanan utama', productCount: 15, isActive: true },
  { id: 2, name: 'Minuman', description: 'Kategori minuman', productCount: 12, isActive: true },
  { id: 3, name: 'Snack', description: 'Kategori camilan', productCount: 8, isActive: true },
  { id: 4, name: 'Dessert', description: 'Kategori makanan penutup', productCount: 5, isActive: true },
  { id: 5, name: 'Paket', description: 'Paket hemat', productCount: 3, isActive: false },
];

// Mock Taxes
export const mockTaxes: Tax[] = [
  { id: 1, name: 'PPN 11%', percentage: 11 },
  { id: 2, name: 'PB1 10%', percentage: 10 },
];

// Mock Service Fees
export const mockServiceFees: ServiceFee[] = [
  { id: 1, name: 'Service Charge 5%', amount: 5, isPercentage: true },
  { id: 2, name: 'Biaya Kemasan', amount: 2000, isPercentage: false },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
    price: 35000,
    comparePrice: 40000,
    categoryId: 1,
    categoryName: 'Makanan',
    isActive: true,
    barcode: '8991234567890',
    sku: 'NSG-001',
    useStock: true,
    stockQuantity: 50,
    stockLimit: 10,
    taxId: 1,
    serviceFeeId: undefined,
    takeawayFee: 2000,
    useDimension: false,
    images: [
      { id: 1, url: '/images/products/nasi-goreng.jpg', isPrimary: true },
    ],
    channelPrices: [
      { channel: 'pos', price: 35000 },
      { channel: 'gofood', price: 38000 },
      { channel: 'grabfood', price: 38000 },
      { channel: 'shopeefood', price: 37000 },
    ],
    variantIds: [1, 2],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: 2,
    name: 'Mie Goreng Seafood',
    description: 'Mie goreng dengan udang, cumi, dan sayuran',
    price: 38000,
    categoryId: 1,
    categoryName: 'Makanan',
    isActive: true,
    sku: 'MIG-002',
    useStock: true,
    stockQuantity: 35,
    stockLimit: 5,
    taxId: 1,
    useDimension: false,
    images: [
      { id: 2, url: '/images/products/mie-goreng.jpg', isPrimary: true },
    ],
    channelPrices: [
      { channel: 'pos', price: 38000 },
      { channel: 'gofood', price: 42000 },
      { channel: 'grabfood', price: 42000 },
    ],
    variantIds: [1],
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: 3,
    name: 'Es Teh Manis',
    description: 'Teh manis dingin segar',
    price: 8000,
    categoryId: 2,
    categoryName: 'Minuman',
    isActive: true,
    sku: 'ETM-001',
    useStock: false,
    useDimension: false,
    images: [
      { id: 3, url: '/images/products/es-teh.jpg', isPrimary: true },
    ],
    channelPrices: [
      { channel: 'pos', price: 8000 },
      { channel: 'gofood', price: 10000 },
      { channel: 'grabfood', price: 10000 },
    ],
    variantIds: [3],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 4,
    name: 'Ayam Bakar Madu',
    description: 'Ayam bakar dengan saus madu special',
    price: 45000,
    comparePrice: 50000,
    categoryId: 1,
    categoryName: 'Makanan',
    isActive: true,
    sku: 'ABM-001',
    useStock: true,
    stockQuantity: 20,
    stockLimit: 5,
    taxId: 1,
    serviceFeeId: 1,
    useDimension: false,
    images: [
      { id: 4, url: '/images/products/ayam-bakar.jpg', isPrimary: true },
    ],
    channelPrices: [
      { channel: 'pos', price: 45000 },
      { channel: 'gofood', price: 50000 },
      { channel: 'grabfood', price: 50000 },
    ],
    variantIds: [1],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-22T16:00:00Z',
  },
  {
    id: 5,
    name: 'Es Jeruk Segar',
    description: 'Jus jeruk segar dengan es',
    price: 12000,
    categoryId: 2,
    categoryName: 'Minuman',
    isActive: true,
    sku: 'EJS-001',
    useStock: false,
    useDimension: false,
    images: [],
    channelPrices: [
      { channel: 'pos', price: 12000 },
      { channel: 'gofood', price: 15000 },
    ],
    variantIds: [3],
    createdAt: '2024-01-11T09:00:00Z',
    updatedAt: '2024-01-11T09:00:00Z',
  },
  {
    id: 6,
    name: 'Cappuccino',
    description: 'Kopi cappuccino dengan foam lembut',
    price: 25000,
    categoryId: 2,
    categoryName: 'Minuman',
    isActive: false,
    sku: 'CAP-001',
    useStock: false,
    useDimension: false,
    images: [
      { id: 5, url: '/images/products/cappuccino.jpg', isPrimary: true },
    ],
    channelPrices: [
      { channel: 'pos', price: 25000 },
    ],
    variantIds: [3, 4],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-25T09:00:00Z',
  },
  {
    id: 7,
    name: 'Kentang Goreng',
    description: 'French fries crispy',
    price: 18000,
    categoryId: 3,
    categoryName: 'Snack',
    isActive: true,
    sku: 'KTG-001',
    useStock: true,
    stockQuantity: 0,
    stockLimit: 10,
    useDimension: false,
    images: [
      { id: 6, url: '/images/products/kentang-goreng.jpg', isPrimary: true },
    ],
    channelPrices: [
      { channel: 'pos', price: 18000 },
      { channel: 'gofood', price: 22000 },
    ],
    variantIds: [],
    createdAt: '2024-01-14T11:00:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
  },
  {
    id: 8,
    name: 'Brownies Coklat',
    description: 'Brownies coklat lembut dengan topping',
    price: 22000,
    categoryId: 4,
    categoryName: 'Dessert',
    isActive: false,
    sku: 'BRW-001',
    useStock: true,
    stockQuantity: 15,
    stockLimit: 5,
    useDimension: false,
    images: [],
    channelPrices: [
      { channel: 'pos', price: 22000 },
    ],
    variantIds: [],
    createdAt: '2024-01-13T14:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
];

// Mock Variants
export const mockVariants: Variant[] = [
  {
    id: 1,
    name: 'Level Pedas',
    isRequired: false,
    maxOptions: 1,
    sourceType: 'custom',
    options: [
      { id: 1, name: 'Tidak Pedas', price: 0, useStock: false, isActive: true },
      { id: 2, name: 'Pedas Sedang', price: 0, useStock: false, isActive: true },
      { id: 3, name: 'Pedas Banget', price: 2000, useStock: false, isActive: true },
      { id: 4, name: 'Extra Pedas', price: 3000, useStock: false, isActive: false },
    ],
    appliedProductCount: 3,
    isActive: true,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
  },
  {
    id: 2,
    name: 'Topping Tambahan',
    isRequired: false,
    sourceType: 'custom',
    options: [
      { id: 5, name: 'Telur Ceplok', price: 5000, useStock: true, stockQuantity: 30, isActive: true },
      { id: 6, name: 'Telur Dadar', price: 5000, useStock: true, stockQuantity: 25, isActive: true },
      { id: 7, name: 'Ayam Suwir', price: 8000, useStock: true, stockQuantity: 20, isActive: true },
      { id: 8, name: 'Sosis', price: 6000, useStock: true, stockQuantity: 15, isActive: true },
      { id: 9, name: 'Keju', price: 7000, useStock: true, stockQuantity: 10, isActive: true },
    ],
    appliedProductCount: 1,
    isActive: true,
    createdAt: '2024-01-06T09:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: 3,
    name: 'Ukuran Gelas',
    isRequired: true,
    maxOptions: 1,
    sourceType: 'custom',
    options: [
      { id: 10, name: 'Regular', price: 0, useStock: false, isActive: true },
      { id: 11, name: 'Large', price: 5000, useStock: false, isActive: true },
      { id: 12, name: 'Extra Large', price: 8000, useStock: false, isActive: true },
    ],
    appliedProductCount: 3,
    isActive: true,
    createdAt: '2024-01-07T08:00:00Z',
    updatedAt: '2024-01-07T08:00:00Z',
  },
  {
    id: 4,
    name: 'Shot Espresso',
    isRequired: false,
    sourceType: 'product',
    options: [
      { id: 13, name: 'Single Shot', price: 5000, useStock: false, isActive: true, sourceProductId: 101 },
      { id: 14, name: 'Double Shot', price: 10000, useStock: false, isActive: true, sourceProductId: 102 },
    ],
    appliedProductCount: 1,
    isActive: true,
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 5,
    name: 'Paket Combo (Dari Menu)',
    isRequired: false,
    maxOptions: 2,
    sourceType: 'product',
    options: [
      { id: 15, name: 'Es Teh Manis', price: 8000, useStock: false, isActive: true, sourceProductId: 3 },
      { id: 16, name: 'Es Jeruk Segar', price: 12000, useStock: false, isActive: true, sourceProductId: 5 },
      { id: 17, name: 'Kentang Goreng', price: 18000, useStock: true, stockQuantity: 0, isActive: true, sourceProductId: 7 },
    ],
    appliedProductCount: 0,
    isActive: false,
    createdAt: '2024-01-09T11:00:00Z',
    updatedAt: '2024-01-22T15:00:00Z',
  },
];

// Helper functions
export function getProductById(id: number): Product | undefined {
  return mockProducts.find(p => p.id === id);
}

export function getVariantById(id: number): Variant | undefined {
  return mockVariants.find(v => v.id === id);
}

export function getCategoryById(id: number): Category | undefined {
  return mockCategories.find(c => c.id === id);
}

export function filterProducts(
  products: Product[],
  filters: { status: 'all' | 'active' | 'inactive'; search: string; categoryId?: number }
): Product[] {
  return products.filter(p => {
    // Status filter
    if (filters.status === 'active' && !p.isActive) return false;
    if (filters.status === 'inactive' && p.isActive) return false;
    
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!p.name.toLowerCase().includes(search) && 
          !p.sku?.toLowerCase().includes(search) &&
          !p.barcode?.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    // Category filter
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false;
    
    return true;
  });
}

export function filterVariants(
  variants: Variant[],
  filters: { search: string }
): Variant[] {
  return variants.filter(v => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!v.name.toLowerCase().includes(search)) return false;
    }
    return true;
  });
}
