import { MasterCategory, MasterProduct, MasterVariant, Outlet } from "./types";



export const mockOutlets: Outlet[] = [
  { id: "outlet-1", name: "Cabang Pusat", address: "Jl. Sudirman No. 1", isActive: true },
  { id: "outlet-2", name: "Cabang BSD", address: "BSD City", isActive: true },
];

export const mockMasterCategories: MasterCategory[] = [
  {
    id: "mc-1",
    name: "Minuman",
    icon: "Coffee",
    productsCount: 12,
    status: "ACTIVE",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mc-2",
    name: "Makanan",
    icon: "Utensils",
    productsCount: 8,
    status: "ACTIVE",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mc-3",
    name: "Snack",
    icon: "Cookie",
    productsCount: 5,
    status: "ACTIVE",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

export const mockMasterVariants: MasterVariant[] = [
  {
    id: "mv-1",
    name: "Size",
    type: "SINGLE",
    options: [
      { id: "opt-1", name: "Regular", priceAdjustment: 0, isDefault: true },
      { id: "opt-2", name: "Large", priceAdjustment: 5000 },
    ],
    isMandatory: true,
    optionSource: 'custom',
    appliedProductCount: 5,
    status: "ACTIVE",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mv-2",
    name: "Sugar Level",
    type: "SINGLE",
    options: [
      { id: "opt-3", name: "Normal", priceAdjustment: 0, isDefault: true },
      { id: "opt-4", name: "Less Sugar", priceAdjustment: 0 },
      { id: "opt-5", name: "No Sugar", priceAdjustment: 0 },
    ],
    isMandatory: true,
    optionSource: 'custom',
    appliedProductCount: 8,
    status: "ACTIVE",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mv-3",
    name: "Topping",
    type: "MULTIPLE",
    options: [
      { id: "opt-6", name: "Pearl", priceAdjustment: 3000 },
      { id: "opt-7", name: "Jelly", priceAdjustment: 3000 },
      { id: "opt-8", name: "Pudding", priceAdjustment: 4000 },
    ],
    isMandatory: false,
    maxSelection: 2,
    optionSource: 'menu_book',
    appliedProductCount: 3,
    status: "ACTIVE",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

export const mockMasterProducts: MasterProduct[] = [
  {
    id: "mp-1",
    name: "Kopi Susu Gula Aren",
    categoryId: "mc-1",
    basePrice: 18000,
    channelPrices: {
      goFood: 22000,
      grabFood: 22000,
      shopeeFood: 22000,
    },
    trackStock: true,
    stock: 100,
    sku: "KOPI-AREN-001",
    hasTax: true,
    hasServiceFee: false,
    variantIds: ["mv-1", "mv-2"],
    outletIds: ["outlet-1", "outlet-2"],
    status: "ACTIVE",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "mp-2",
    name: "Nasi Goreng Spesial",
    categoryId: "mc-2",
    basePrice: 25000,
    channelPrices: {
      goFood: 30000,
      grabFood: 30000,
    },
    trackStock: true,
    stock: 50,
    sku: "NASGOR-SP-001",
    hasTax: true,
    hasServiceFee: true,
    variantIds: ["mv-3"], // Maybe extra egg topping?
    outletIds: ["outlet-1"],
    status: "ACTIVE",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const getMasterProductStats = (products: MasterProduct[]) => {
  return {
    total: products.length,
    active: products.filter(p => p.status === 'ACTIVE').length,
    inactive: products.filter(p => p.status === 'INACTIVE').length,
  };
};

export const filterMasterProducts = (products: MasterProduct[], filters: any) => {
  return products.filter(p => {
    if (filters.status !== 'all' && filters.status !== p.status.toLowerCase()) {
      if (filters.status === 'active' && p.status !== 'ACTIVE') return false;
      if (filters.status === 'inactive' && p.status !== 'INACTIVE') return false;
    }
    if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};

export const getMasterVariantStats = (variants: MasterVariant[]) => {
  return {
    total: variants.length,
    active: variants.filter(v => v.status === 'ACTIVE').length,
    inactive: variants.filter(v => v.status === 'INACTIVE').length,
  };
};

export const filterMasterVariants = (variants: MasterVariant[], filters: any) => {
  return variants.filter(v => {
    if (filters.status !== 'all' && filters.status !== v.status.toLowerCase()) {
      if (filters.status === 'active' && v.status !== 'ACTIVE') return false;
      if (filters.status === 'inactive' && v.status !== 'INACTIVE') return false;
    }
    if (filters.search && !v.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};

// Mock Data for "Import from Outlet" simulation
export const mockOutletProducts = [
  { id: "op-1", name: "Es Teh Manis (Lokal)", price: 5000, category: "Minuman", outletId: "outlet-1" },
  { id: "op-2", name: "Tahu Goreng (Lokal)", price: 10000, category: "Snack", outletId: "outlet-1" },
  { id: "op-3", name: "Kopi Hitam (Lokal)", price: 15000, category: "Minuman", outletId: "outlet-2" },
];

export const mockOutletVariants = [
  { id: "ov-1", name: "Level Pedas (Lokal)", options: 3, outletId: "outlet-1" },
  { id: "ov-2", name: "Extra Sauce (Lokal)", options: 2, outletId: "outlet-2" },
];

export const mockOutletCategories = [
  { id: "oc-1", name: "Promo Harian (Lokal)", outletId: "outlet-1" },
  { id: "oc-2", name: "Menu Sarapan (Lokal)", outletId: "outlet-2" },
];
