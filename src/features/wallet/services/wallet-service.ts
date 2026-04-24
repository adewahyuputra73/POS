import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  CreateWalletTransactionRequest,
  WalletBalance,
  WalletBalanceParams,
  WalletHistoryParams,
  WalletHistoryResponse,
  WalletShiftSummary,
  WalletHistoryItem,
} from "../types";

export const walletService = {
  async balance(params?: WalletBalanceParams): Promise<WalletBalance> {
    const response = await apiClient.get<ApiResponse<WalletBalance>>(
      ENDPOINTS.WALLET.BALANCE,
      { params }
    );
    return response.data.data;
  },

  async history(params?: WalletHistoryParams): Promise<WalletHistoryResponse> {
    const response = await apiClient.get<ApiResponse<WalletHistoryResponse>>(
      ENDPOINTS.WALLET.HISTORY,
      { params }
    );
    return response.data.data;
  },

  /** GET /wallet/transactions — daftar semua transaksi wallet (berbeda dari /wallet/history) */
  async transactions(params?: WalletHistoryParams): Promise<WalletHistoryItem[]> {
    const response = await apiClient.get<ApiResponse<WalletHistoryItem[]>>(
      ENDPOINTS.WALLET.TRANSACTIONS,
      { params }
    );
    return response.data.data;
  },

  /**
   * POST /wallet/transactions — catat transaksi manual (pengeluaran / kas masuk).
   * ⚠️ Konfirmasi BE: pastikan endpoint ini menerima POST, bukan endpoint lain.
   */
  async createTransaction(data: CreateWalletTransactionRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.WALLET.CREATE_TRANSACTION, data);
  },

  // GET /wallet/shift/{shift_id} — ringkasan wallet per shift
  async shiftSummary(shiftId: string): Promise<WalletShiftSummary> {
    const response = await apiClient.get<ApiResponse<WalletShiftSummary>>(
      ENDPOINTS.WALLET.SHIFT_SUMMARY(shiftId)
    );
    return response.data.data;
  },
};
