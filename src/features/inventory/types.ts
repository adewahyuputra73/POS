// Inventory Module Types

// === KONVERSI UNIT ===
export type UnitRole = 'base' | 'transfer' | 'purchase';

export interface UnitDetail {
  id: number;
  name: string;
  conversionValue: number;
  perUom: string; // reference to another unit name
  role: UnitRole;
}

export interface UnitConversion {
  id: number;
  name: string;
  units: UnitDetail[];
  linkedMaterialCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UnitConversionFormData {
  name: string;
  units: Omit<UnitDetail, 'id'>[];
}

export interface UnitConversionFilters {
  search: string;
}

// === INVENTORY KATEGORI ===
export interface InventoryCategory {
  id: number;
  name: string;
  isDefault: boolean; // "Tanpa Kategori" = true
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCategoryFormData {
  name: string;
}

// === BAHAN DASAR ===
export type MaterialType = 'raw' | 'semi_finished';
export type StockStatus = 'available' | 'low' | 'empty';

export interface RawMaterial {
  id: number;
  name: string;
  type: MaterialType;
  categoryId: number;
  categoryName: string;
  unitConversionId: number;
  unitConversionName: string;
  baseUnit: string;
  currentStock: number;
  stockValue: number; // stok × harga
  stockLimit: number; // batas bawah
  estimatedProduction?: number;
  status: StockStatus;
  hpp: number; // for semi-finished: calculated from recipe
  createdAt: string;
  updatedAt: string;
}

export interface RawMaterialFormData {
  name: string;
  type: MaterialType;
  categoryId: number;
  unitConversionId: number;
  estimatedProduction?: number;
  stockLimit?: number;
}

export interface RawMaterialFilters {
  type: MaterialType;
  search: string;
  categoryId: number | 'all';
  stockStatus: StockStatus | 'all';
}

// === STOCK LOG ===
export type StockMutationType = 'addition' | 'reduction' | 'sale' | 'opname';

export interface StockLog {
  id: number;
  materialId: number;
  description: string;
  notes: string;
  purchasePrice: number;
  quantity: number;
  newStock: number;
  stockValue: number;
  mutationType: StockMutationType;
  supplierId?: number;
  supplierName?: string;
  createdAt: string;
  userName: string;
}

export interface AddStockData {
  quantity: number;
  price: number;
  supplierId: number;
  unit: string;
  notes: string;
}

export interface ReduceStockData {
  quantity: number;
  unit: string;
  notes: string;
}

// === RECIPE (for semi-finished materials) ===
export interface RecipeIngredient {
  id: number;
  materialId: number;
  materialName: string;
  materialType: MaterialType;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Recipe {
  id: number;
  targetId: number; // product or variant id
  targetName: string;
  targetType: 'menu' | 'variant';
  categoryName?: string;
  ingredients: RecipeIngredient[];
  totalHpp: number;
  ingredientCount: number;
  status: 'active' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFilters {
  type: 'menu' | 'variant';
  search: string;
}

// === SUPPLIER ===
export interface Supplier {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  location?: { lat: number; lng: number };
  paymentTerm?: string; // tempo pembayaran
  paymentType?: 'cash' | 'transfer';
  materialCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierFormData {
  name: string;
  phone?: string;
  address?: string;
  paymentTerm?: string;
  paymentType?: 'cash' | 'transfer';
}

export interface SupplierFilters {
  search: string;
}

export interface SupplierMaterial {
  id: number;
  supplierId: number;
  materialId: number;
  materialName: string;
  categoryName: string;
  purchaseQty: number;
  purchaseUnit: string;
  pricePerUnit: number;
  minOrder?: number;
  mov?: number; // minimum order value
  leadTime?: string;
  isPrimary: boolean;
  includePpn: boolean;
}

export interface SupplierMaterialFormData {
  materialId: number;
  purchaseQty: number;
  purchaseUnit: string;
  pricePerUnit: number;
  minOrder?: number;
  mov?: number;
  leadTime?: string;
  isPrimary: boolean;
  includePpn: boolean;
}

// === ARUS STOK (STOCK FLOW) ===
export type StockFlowType = 'pembelian' | 'pengeluaran' | 'stok_opname' | 'transfer' | 'purchase_order';
export type StockFlowStatus = 'selesai' | 'diminta' | 'dikirim';
export type ExpenseReason = 'rusak' | 'hilang' | 'kadaluarsa' | 'uji_coba' | 'sampling' | 'lainnya';
export type TransferType = 'pengiriman' | 'permintaan';

export interface StockFlowRecord {
  id: number;
  type: StockFlowType;
  referenceNumber: string;
  outletOrSupplier: string; // supplier name for purchase, outlet name for transfer
  totalItems: number;
  totalPrice: number | null; // null for pengeluaran
  status: StockFlowStatus;
  createdBy: string;
  createdAt: string;
}

export interface StockFlowFilters {
  type: StockFlowType | 'all';
  search: string;
  dateRange?: { start: string; end: string };
}

// -- Pembelian (Purchase)
export interface PurchaseMaterialItem {
  materialId: number;
  materialName: string;
  categoryName: string;
  purchaseQty: number;
  purchaseUnit: string;
  totalPrice: number;
  currentStock: number;
  baseUnit: string;
}

export interface PurchaseFormData {
  supplierId: number;
  items: PurchaseMaterialItem[];
}

// -- Pengeluaran (Expense)
export interface ExpenseItem {
  materialId: number;
  materialName: string;
  currentStock: number;
  qty: number;
  unit: string;
  reason: ExpenseReason | '';
}

export interface ExpenseFormData {
  items: ExpenseItem[];
}

// -- Stok Opname
export interface OpnameItem {
  materialId: number;
  materialName: string;
  categoryName: string;
  type: MaterialType;
  currentStock: number;
  newStock: number;
  unit: string;
  difference: number; // calculated: newStock - currentStock
  adjustmentValue: number; // calculated: difference * avgCost
}

export interface OpnameFormData {
  items: OpnameItem[];
}

// -- Transfer
export interface TransferItem {
  materialId: number;
  materialName: string;
  type: MaterialType;
  categoryName: string;
  currentStock: number;
  transferQty: number;
  unit: string;
  transferPrice: number;
}

export interface TransferFormData {
  transactionType: TransferType;
  outletToId: number;
  outletToName: string;
  items: TransferItem[];
}

// -- Purchase Order
export interface POItem {
  materialId: number;
  materialName: string;
  categoryName: string;
  qtyRequested: number;
  priceRequested: number;
  qtyReceived: number;
  priceReceived: number;
  qtyRejected: number;
  rejectReason: string;
  unit: string;
}

export interface PurchaseOrderData {
  supplierId: number;
  supplierName: string;
  deliveryDate: string;
  items: POItem[];
}

// -- PO Multi-Supplier
export interface POMultiItem {
  materialId: number;
  materialName: string;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
}

export interface POMultiFormData {
  deliveryDate: string;
  items: POMultiItem[];
}

// -- Stock Flow Detail (for detail view)
export interface StockFlowDetailItem {
  id: number;
  materialId: number;
  materialName: string;
  categoryName: string;
  materialType: MaterialType;
  qty: number;
  unit: string;
  price: number;
  reason?: string;
  finalStock?: number;
}

export interface StockFlowDetailRecord extends StockFlowRecord {
  supplierName?: string;
  outletFrom?: string;
  outletTo?: string;
  deliveryDate?: string;
  items: StockFlowDetailItem[];
}
