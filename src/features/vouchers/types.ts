// Voucher Module Types

export type DiscountType = "PERCENTAGE" | "FIXED";

// Status BE: "active" = sedang berjalan, "upcoming" = belum mulai, "ended" = sudah berakhir
// Page juga menghitung status lokal dari valid_from/valid_until sebagai fallback
export type VoucherStatus = "active" | "upcoming" | "ended";

export interface Voucher {
  id: string;
  code: string;
  name: string;
  discount_type: DiscountType;
  discount_value: number;
  max_discount: number | null;
  min_purchase: number | null;
  quota: number;
  used: number;
  valid_from: string;   // ISO datetime
  valid_until: string;  // ISO datetime
  // BE mungkin return status langsung — jika tidak ada, UI hitung dari valid_from/valid_until
  status?: VoucherStatus;
  created_at: string;
  updated_at: string;
}

// status filter untuk BE query param — sesuai nilai yang BE terima
export interface VoucherListParams {
  status?: VoucherStatus | "all";
}

export interface ValidateVoucherRequest {
  code: string;
  subtotal: number;
}

export interface ValidateVoucherResponse {
  valid: boolean;
  // Hanya ada saat valid = true — BE tidak kirim kalau voucher tidak berlaku
  discount_amount?: number;
  voucher_name?: string;
  // Pesan dari BE — biasanya error reason saat valid = false, atau keterangan saat valid = true
  message?: string;
}

export interface CreateVoucherRequest {
  code: string;
  name: string;
  discount_type: DiscountType;
  discount_value: number;
  max_discount?: number;
  min_purchase?: number;
  quota: number;
  valid_from: string;
  valid_until: string;
}

export type UpdateVoucherRequest = Partial<CreateVoucherRequest>;
