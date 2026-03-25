// Wallet Module Types

export interface WalletChannel {
  in: number;
  out: number;
  deposit: number;
  refund: number;
  net: number;
}

export interface WalletBalance {
  CASH: WalletChannel;
  CASHLESS: WalletChannel;
  EDC: WalletChannel;
}

export interface WalletBalanceParams {
  start_date?: string;
  end_date?: string;
}

// CONFIRMED from GET /wallet/history
export interface WalletHistoryItem {
  id: string;
  store_id: string;
  shift_id: string | null;
  order_id: string | null;
  admin_id: string;
  wallet_type: WalletType;
  type: WalletTransactionType;
  amount: string;
  note: string | null;
  edc_bank: string | null;
  edc_ref_number: string | null;
  cashless_provider: string | null;
  cashless_ref: string | null;
  createdAt: string;
  updatedAt: string;
  admin: {
    full_name: string;
  };
}

export interface WalletHistoryResponse {
  total: number;
  page: number;
  totalPages: number;
  data: WalletHistoryItem[];
}

export interface WalletHistoryParams {
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

export type WalletType = "CASH" | "CASHLESS" | "EDC";
export type WalletTransactionType = "IN" | "OUT" | "DEPOSIT";

export interface CreateWalletTransactionRequest {
  wallet_type: WalletType;
  type: WalletTransactionType;
  amount: number;
  note?: string;
  cashless_provider?: string;
  cashless_ref?: string;
  edc_bank?: string;
  edc_ref_number?: string;
}

// CONFIRMED from GET /wallet/shift
// WalletShiftTransaction = WalletHistoryItem tanpa embed admin{}
export interface WalletShiftTransaction {
  id: string;
  store_id: string;
  shift_id: string;
  order_id: string | null;
  admin_id: string;
  wallet_type: WalletType;
  type: WalletTransactionType;
  amount: string;
  note: string | null;
  edc_bank: string | null;
  edc_ref_number: string | null;
  cashless_provider: string | null;
  cashless_ref: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WalletShiftSummary {
  shift_id: string;
  shift_number: number;
  summary: {
    CASH: WalletChannel;
    CASHLESS: WalletChannel;
    EDC: WalletChannel;
  };
  transactions: WalletShiftTransaction[];
}
