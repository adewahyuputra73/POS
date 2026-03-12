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

// NOTE: WalletHistoryItem fields are guessed — adjust when actual response is known
export interface WalletHistoryItem {
  id: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
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

// NOTE: WalletShiftSummary fields are guessed — adjust when actual response is known
export interface WalletShiftSummary {
  id: string;
  shift_id: string;
  total_cash: number;
  total_cashless: number;
  total_edc: number;
  created_at: string;
}
