import {
  UnitConversion,
  UnitConversionFilters,
  InventoryCategory,
  RawMaterial,
  RawMaterialFilters,
  StockLog,
  Supplier,
  SupplierFilters,
  SupplierMaterial,
  Recipe,
  RecipeFilters,
  RecipeIngredient,
} from './types';

// === INVENTORY CATEGORIES ===
export const mockInventoryCategories: InventoryCategory[] = [
  { id: 0, name: 'Tanpa Kategori', isDefault: true, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' },
  { id: 1, name: 'Bahan Kering', isDefault: false, createdAt: '2026-01-05T08:00:00Z', updatedAt: '2026-01-20T10:00:00Z' },
  { id: 2, name: 'Bahan Basah', isDefault: false, createdAt: '2026-01-05T08:30:00Z', updatedAt: '2026-01-18T14:00:00Z' },
  { id: 3, name: 'Bumbu & Rempah', isDefault: false, createdAt: '2026-01-06T09:00:00Z', updatedAt: '2026-01-22T11:00:00Z' },
  { id: 4, name: 'Minuman', isDefault: false, createdAt: '2026-01-07T10:00:00Z', updatedAt: '2026-01-25T09:00:00Z' },
  { id: 5, name: 'Kemasan', isDefault: false, createdAt: '2026-01-08T11:00:00Z', updatedAt: '2026-01-23T16:00:00Z' },
];

// === UNIT CONVERSIONS ===
export const mockUnitConversions: UnitConversion[] = [
  {
    id: 1,
    name: 'Satuan Berat',
    units: [
      { id: 1, name: 'gram', conversionValue: 1, perUom: 'gram', role: 'base' },
      { id: 2, name: 'kg', conversionValue: 1000, perUom: 'gram', role: 'transfer' },
      { id: 3, name: 'karung (25kg)', conversionValue: 25000, perUom: 'gram', role: 'purchase' },
    ],
    linkedMaterialCount: 8,
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 2,
    name: 'Satuan Cairan',
    units: [
      { id: 4, name: 'ml', conversionValue: 1, perUom: 'ml', role: 'base' },
      { id: 5, name: 'liter', conversionValue: 1000, perUom: 'ml', role: 'transfer' },
      { id: 6, name: 'galon (19L)', conversionValue: 19000, perUom: 'ml', role: 'purchase' },
    ],
    linkedMaterialCount: 5,
    createdAt: '2026-01-06T09:00:00Z',
    updatedAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 3,
    name: 'Satuan Butir',
    units: [
      { id: 7, name: 'butir', conversionValue: 1, perUom: 'butir', role: 'base' },
      { id: 8, name: 'tray (30 butir)', conversionValue: 30, perUom: 'butir', role: 'purchase' },
    ],
    linkedMaterialCount: 2,
    createdAt: '2026-01-08T11:00:00Z',
    updatedAt: '2026-01-22T09:00:00Z',
  },
  {
    id: 4,
    name: 'Satuan Lembar',
    units: [
      { id: 9, name: 'lembar', conversionValue: 1, perUom: 'lembar', role: 'base' },
      { id: 10, name: 'rim (500 lbr)', conversionValue: 500, perUom: 'lembar', role: 'purchase' },
    ],
    linkedMaterialCount: 1,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-20T11:00:00Z',
  },
];

// === RAW MATERIALS ===
export const mockRawMaterials: RawMaterial[] = [
  // Raw (Mentah)
  {
    id: 1, name: 'Beras Premium', type: 'raw', categoryId: 1, categoryName: 'Bahan Kering',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 50000, stockValue: 600000, stockLimit: 10000, status: 'available',
    hpp: 12, createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 2, name: 'Minyak Goreng', type: 'raw', categoryId: 2, categoryName: 'Bahan Basah',
    unitConversionId: 2, unitConversionName: 'Satuan Cairan', baseUnit: 'ml',
    currentStock: 15000, stockValue: 225000, stockLimit: 5000, status: 'available',
    hpp: 15, createdAt: '2026-01-10T08:30:00Z', updatedAt: '2026-01-30T14:00:00Z',
  },
  {
    id: 3, name: 'Telur Ayam', type: 'raw', categoryId: 2, categoryName: 'Bahan Basah',
    unitConversionId: 3, unitConversionName: 'Satuan Butir', baseUnit: 'butir',
    currentStock: 45, stockValue: 112500, stockLimit: 30, status: 'available',
    hpp: 2500, createdAt: '2026-01-12T09:00:00Z', updatedAt: '2026-02-02T08:00:00Z',
  },
  {
    id: 4, name: 'Gula Pasir', type: 'raw', categoryId: 1, categoryName: 'Bahan Kering',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 8000, stockValue: 96000, stockLimit: 10000, status: 'low',
    hpp: 12, createdAt: '2026-01-11T10:00:00Z', updatedAt: '2026-01-28T11:00:00Z',
  },
  {
    id: 5, name: 'Kopi Arabica', type: 'raw', categoryId: 4, categoryName: 'Minuman',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 0, stockValue: 0, stockLimit: 2000, status: 'empty',
    hpp: 150, createdAt: '2026-01-15T09:00:00Z', updatedAt: '2026-02-01T16:00:00Z',
  },
  {
    id: 6, name: 'Bawang Merah', type: 'raw', categoryId: 3, categoryName: 'Bumbu & Rempah',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 3000, stockValue: 105000, stockLimit: 2000, status: 'available',
    hpp: 35, createdAt: '2026-01-13T11:00:00Z', updatedAt: '2026-01-29T10:00:00Z',
  },
  {
    id: 7, name: 'Bawang Putih', type: 'raw', categoryId: 3, categoryName: 'Bumbu & Rempah',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 2500, stockValue: 75000, stockLimit: 2000, status: 'available',
    hpp: 30, createdAt: '2026-01-13T11:30:00Z', updatedAt: '2026-01-28T14:00:00Z',
  },
  {
    id: 8, name: 'Cabai Merah', type: 'raw', categoryId: 3, categoryName: 'Bumbu & Rempah',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 1500, stockValue: 112500, stockLimit: 2000, status: 'low',
    hpp: 75, createdAt: '2026-01-14T08:00:00Z', updatedAt: '2026-01-31T09:00:00Z',
  },
  {
    id: 9, name: 'Susu UHT', type: 'raw', categoryId: 4, categoryName: 'Minuman',
    unitConversionId: 2, unitConversionName: 'Satuan Cairan', baseUnit: 'ml',
    currentStock: 12000, stockValue: 180000, stockLimit: 5000, status: 'available',
    hpp: 15, createdAt: '2026-01-16T10:00:00Z', updatedAt: '2026-02-01T12:00:00Z',
  },
  // Setengah Jadi
  {
    id: 10, name: 'Bumbu Nasi Goreng', type: 'semi_finished', categoryId: 3, categoryName: 'Bumbu & Rempah',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 2000, stockValue: 150000, stockLimit: 500, estimatedProduction: 50,
    status: 'available', hpp: 75,
    createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 11, name: 'Sambal Geprek', type: 'semi_finished', categoryId: 3, categoryName: 'Bumbu & Rempah',
    unitConversionId: 1, unitConversionName: 'Satuan Berat', baseUnit: 'gram',
    currentStock: 800, stockValue: 96000, stockLimit: 500, estimatedProduction: 30,
    status: 'available', hpp: 120,
    createdAt: '2026-01-19T09:00:00Z', updatedAt: '2026-02-02T10:00:00Z',
  },
  {
    id: 12, name: 'Sirup Gula', type: 'semi_finished', categoryId: 4, categoryName: 'Minuman',
    unitConversionId: 2, unitConversionName: 'Satuan Cairan', baseUnit: 'ml',
    currentStock: 3000, stockValue: 45000, stockLimit: 1000, estimatedProduction: 100,
    status: 'available', hpp: 15,
    createdAt: '2026-01-20T11:00:00Z', updatedAt: '2026-01-30T15:00:00Z',
  },
];

// === STOCK LOGS ===
export const mockStockLogs: StockLog[] = [
  {
    id: 1, materialId: 1, description: 'Penambahan Stok', notes: 'Pembelian rutin',
    purchasePrice: 12000, quantity: 25000, newStock: 50000, stockValue: 600000,
    mutationType: 'addition', supplierId: 1, supplierName: 'UD Makmur Jaya',
    createdAt: '2026-02-01T10:00:00Z', userName: 'Admin',
  },
  {
    id: 2, materialId: 1, description: 'Pemakaian Penjualan', notes: 'Order #1234',
    purchasePrice: 0, quantity: -500, newStock: 49500, stockValue: 594000,
    mutationType: 'sale', createdAt: '2026-02-01T12:30:00Z', userName: 'System',
  },
  {
    id: 3, materialId: 1, description: 'Pengurangan Manual', notes: 'Bahan rusak',
    purchasePrice: 0, quantity: -200, newStock: 49300, stockValue: 591600,
    mutationType: 'reduction', createdAt: '2026-02-01T14:00:00Z', userName: 'Admin',
  },
  {
    id: 4, materialId: 4, description: 'Penambahan Stok', notes: 'Restock gula',
    purchasePrice: 14000, quantity: 5000, newStock: 8000, stockValue: 96000,
    mutationType: 'addition', supplierId: 2, supplierName: 'Toko Sumber Rasa',
    createdAt: '2026-01-28T11:00:00Z', userName: 'Admin',
  },
  {
    id: 5, materialId: 5, description: 'Pemakaian Penjualan', notes: 'Order #1240',
    purchasePrice: 0, quantity: -100, newStock: 0, stockValue: 0,
    mutationType: 'sale', createdAt: '2026-02-01T16:00:00Z', userName: 'System',
  },
];

// === SUPPLIERS ===
export const mockSuppliers: Supplier[] = [
  {
    id: 1, name: 'UD Makmur Jaya', phone: '08123456789', address: 'Jl. Pasar Baru No. 15, Jakarta',
    paymentTerm: '14 hari', paymentType: 'transfer', materialCount: 5,
    createdAt: '2026-01-05T08:00:00Z', updatedAt: '2026-01-28T10:00:00Z',
  },
  {
    id: 2, name: 'Toko Sumber Rasa', phone: '08198765432', address: 'Jl. Raya Bogor No. 88',
    paymentTerm: '7 hari', paymentType: 'cash', materialCount: 3,
    createdAt: '2026-01-06T09:00:00Z', updatedAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 3, name: 'CV Bumi Lestari', phone: '02198765432', address: 'Jl. Industri Raya No. 22, Tangerang',
    paymentTerm: '30 hari', paymentType: 'transfer', materialCount: 4,
    createdAt: '2026-01-08T10:00:00Z', updatedAt: '2026-01-30T09:00:00Z',
  },
  {
    id: 4, name: 'PT Kopi Nusantara', phone: '08112233445', address: 'Jl. Kopi No. 7, Lampung',
    paymentTerm: '21 hari', paymentType: 'transfer', materialCount: 2,
    createdAt: '2026-01-10T11:00:00Z', updatedAt: '2026-01-22T16:00:00Z',
  },
];

// === SUPPLIER MATERIALS ===
export const mockSupplierMaterials: SupplierMaterial[] = [
  {
    id: 1, supplierId: 1, materialId: 1, materialName: 'Beras Premium', categoryName: 'Bahan Kering',
    purchaseQty: 25, purchaseUnit: 'kg', pricePerUnit: 12000,
    minOrder: 5, isPrimary: true, includePpn: false,
  },
  {
    id: 2, supplierId: 1, materialId: 2, materialName: 'Minyak Goreng', categoryName: 'Bahan Basah',
    purchaseQty: 1, purchaseUnit: 'liter', pricePerUnit: 15000,
    minOrder: 5, isPrimary: true, includePpn: false,
  },
  {
    id: 3, supplierId: 1, materialId: 3, materialName: 'Telur Ayam', categoryName: 'Bahan Basah',
    purchaseQty: 30, purchaseUnit: 'tray (30 butir)', pricePerUnit: 75000,
    minOrder: 1, isPrimary: false, includePpn: false,
  },
  {
    id: 4, supplierId: 2, materialId: 4, materialName: 'Gula Pasir', categoryName: 'Bahan Kering',
    purchaseQty: 1, purchaseUnit: 'kg', pricePerUnit: 14000,
    minOrder: 5, isPrimary: true, includePpn: false,
  },
  {
    id: 5, supplierId: 4, materialId: 5, materialName: 'Kopi Arabica', categoryName: 'Minuman',
    purchaseQty: 1, purchaseUnit: 'kg', pricePerUnit: 150000,
    minOrder: 1, isPrimary: true, includePpn: true,
  },
];

// === RECIPES ===
export const mockRecipes: Recipe[] = [
  {
    id: 1, targetId: 1, targetName: 'Nasi Goreng Spesial', targetType: 'menu',
    categoryName: 'Makanan Utama',
    ingredients: [
      { id: 1, materialId: 1, materialName: 'Beras Premium', materialType: 'raw', quantity: 200, unit: 'gram', pricePerUnit: 12, totalPrice: 2400 },
      { id: 2, materialId: 2, materialName: 'Minyak Goreng', materialType: 'raw', quantity: 30, unit: 'ml', pricePerUnit: 15, totalPrice: 450 },
      { id: 3, materialId: 3, materialName: 'Telur Ayam', materialType: 'raw', quantity: 2, unit: 'butir', pricePerUnit: 2500, totalPrice: 5000 },
      { id: 4, materialId: 10, materialName: 'Bumbu Nasi Goreng', materialType: 'semi_finished', quantity: 50, unit: 'gram', pricePerUnit: 75, totalPrice: 3750 },
    ],
    totalHpp: 11600, ingredientCount: 4, status: 'active',
    createdAt: '2026-01-18T10:00:00Z', updatedAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 2, targetId: 4, targetName: 'Ayam Geprek', targetType: 'menu',
    categoryName: 'Makanan Utama',
    ingredients: [
      { id: 5, materialId: 2, materialName: 'Minyak Goreng', materialType: 'raw', quantity: 200, unit: 'ml', pricePerUnit: 15, totalPrice: 3000 },
      { id: 6, materialId: 11, materialName: 'Sambal Geprek', materialType: 'semi_finished', quantity: 50, unit: 'gram', pricePerUnit: 120, totalPrice: 6000 },
    ],
    totalHpp: 9000, ingredientCount: 2, status: 'active',
    createdAt: '2026-01-20T08:00:00Z', updatedAt: '2026-01-30T12:00:00Z',
  },
  {
    id: 3, targetId: 3, targetName: 'Es Kopi Susu', targetType: 'menu',
    categoryName: 'Minuman',
    ingredients: [
      { id: 7, materialId: 5, materialName: 'Kopi Arabica', materialType: 'raw', quantity: 20, unit: 'gram', pricePerUnit: 150, totalPrice: 3000 },
      { id: 8, materialId: 9, materialName: 'Susu UHT', materialType: 'raw', quantity: 150, unit: 'ml', pricePerUnit: 15, totalPrice: 2250 },
      { id: 9, materialId: 12, materialName: 'Sirup Gula', materialType: 'semi_finished', quantity: 30, unit: 'ml', pricePerUnit: 15, totalPrice: 450 },
    ],
    totalHpp: 5700, ingredientCount: 3, status: 'active',
    createdAt: '2026-01-22T11:00:00Z', updatedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 4, targetId: 2, targetName: 'Mie Goreng Seafood', targetType: 'menu',
    categoryName: 'Makanan Utama',
    ingredients: [],
    totalHpp: 0, ingredientCount: 0, status: 'draft',
    createdAt: '2026-01-25T10:00:00Z', updatedAt: '2026-01-25T10:00:00Z',
  },
];

// === FILTER FUNCTIONS ===
export function filterUnitConversions(
  conversions: UnitConversion[],
  filters: UnitConversionFilters
): UnitConversion[] {
  return conversions.filter((c) => {
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(s)) return false;
    }
    return true;
  });
}

export function filterRawMaterials(
  materials: RawMaterial[],
  filters: RawMaterialFilters
): RawMaterial[] {
  return materials.filter((m) => {
    if (m.type !== filters.type) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!m.name.toLowerCase().includes(s)) return false;
    }
    if (filters.categoryId !== 'all' && m.categoryId !== filters.categoryId) return false;
    if (filters.stockStatus !== 'all' && m.status !== filters.stockStatus) return false;
    return true;
  });
}

export function filterSuppliers(
  suppliers: Supplier[],
  filters: SupplierFilters
): Supplier[] {
  return suppliers.filter((s) => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (
        !s.name.toLowerCase().includes(search) &&
        !(s.phone && s.phone.includes(search))
      ) return false;
    }
    return true;
  });
}

export function filterRecipes(
  recipes: Recipe[],
  filters: RecipeFilters
): Recipe[] {
  return recipes.filter((r) => {
    if (r.targetType !== filters.type) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      if (!r.targetName.toLowerCase().includes(s)) return false;
    }
    return true;
  });
}

// === STATS HELPERS ===
export function getRawMaterialStats(materials: RawMaterial[], type: 'raw' | 'semi_finished') {
  const filtered = materials.filter((m) => m.type === type);
  return {
    total: filtered.length,
    available: filtered.filter((m) => m.status === 'available').length,
    low: filtered.filter((m) => m.status === 'low').length,
    empty: filtered.filter((m) => m.status === 'empty').length,
  };
}

export function getStockLogsForMaterial(materialId: number): StockLog[] {
  return mockStockLogs.filter((log) => log.materialId === materialId);
}

export function getSupplierMaterials(supplierId: number): SupplierMaterial[] {
  return mockSupplierMaterials.filter((sm) => sm.supplierId === supplierId);
}
