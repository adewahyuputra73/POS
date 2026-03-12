// Voucher Module Types

export type DiscountType = "PERCENTAGE" | "FIXED";

// NOTE: Voucher fields are guessed — adjust when actual response is known
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
  valid_from: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

export interface VoucherListParams {
  status?: "active" | "expired" | "all";
}

export interface ValidateVoucherRequest {
  code: string;
  subtotal: number;
}

// NOTE: ValidateVoucherResponse fields are guessed — adjust when actual response is known
export interface ValidateVoucherResponse {
  valid: boolean;
  discount_amount: number;
  voucher_name: string;
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
