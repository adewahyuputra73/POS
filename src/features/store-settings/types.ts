// Store Settings feature types

export interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  cover_image?: string;
  tax_id?: string; // NPWP
  business_type: BusinessType;
  currency: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type BusinessType = "restaurant" | "cafe" | "retail" | "fnb" | "other";

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  restaurant: "Restoran",
  cafe: "Kafe",
  retail: "Retail",
  fnb: "F&B",
  other: "Lainnya",
};

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
