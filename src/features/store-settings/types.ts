// Store Settings feature types

// Tipe penjualan produk di toko (level toko, bukan per produk)
// UNIT  = dijual per satuan (pcs/item)
// WEIGHT = ditimbang (kg) saat checkout
export type StoreProductType = "UNIT" | "WEIGHT";

export interface StoreOwner {
  id: string;
  full_name: string;
  phone_number: string;
}

export interface StoreInfo {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner?: StoreOwner;
  // Nomor WhatsApp khusus untuk notifikasi pesanan ke customer
  notification_phone?: string | null;
  // Biteship area ID untuk origin pengiriman
  area_id?: string | null;
  // Tax & service charge (may be present in BE response)
  is_tax_enabled?: boolean;
  tax_name?: string;
  tax_rate?: number;
  is_tax_inclusive?: boolean;
  is_service_charge_enabled?: boolean;
  service_charge_rate?: number;
  // Tipe penjualan produk untuk toko ini (UNIT/WEIGHT) — dipilih saat onboarding
  product_type?: StoreProductType;
}

export interface UpdateStoreRequest {
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  notification_phone?: string | null;
  product_type?: StoreProductType;
}

export interface CreateStoreRequest {
  ownerId: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  product_type?: StoreProductType;
}

export interface StoreOnboardingRequest {
  name: string;
  address: string;
  phone: string;
  product_type?: StoreProductType;
}

export type FeeType = "percentage" | "nominal";

export interface StoreFees {
  tax_is_active: boolean;
  service_fee_is_active: boolean;
  service_fee_type: FeeType;
  service_fee_percentage: number;
  additional_fee_is_active: boolean;
  additional_fee_name: string;
  additional_fee_type: FeeType;
  additional_fee_nominal: number;
}

export interface OperatingHours {
  day: DayOfWeek;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export interface TaxSettings {
  is_tax_enabled: boolean;
  tax_name: string;
  tax_rate: number; // percentage
  is_tax_inclusive: boolean;
  tax_id_number: string; // NPWP
  is_service_charge_enabled: boolean;
  service_charge_rate: number;
}

export interface ReceiptSettings {
  show_logo: boolean;
  show_store_name: boolean;
  show_address: boolean;
  show_phone: boolean;
  show_tax_id: boolean;
  header_text: string;
  footer_text: string;
  show_cashier_name: boolean;
  show_customer_name: boolean;
  paper_size: "58mm" | "80mm";
  auto_print: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: PaymentType;
  is_enabled: boolean;
  icon: string;
  account_name?: string;
  account_number?: string;
  fee_percentage?: number;
  fee_fixed?: number;
}

export type PaymentType = "cash" | "bank_transfer" | "e_wallet" | "qris" | "credit_card" | "debit_card";

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  cash: "Tunai",
  bank_transfer: "Transfer Bank",
  e_wallet: "E-Wallet",
  qris: "QRIS",
  credit_card: "Kartu Kredit",
  debit_card: "Kartu Debit",
};
