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

  async createTransaction(data: CreateWalletTransactionRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.WALLET.TRANSACTIONS, data);
  },

  async shiftSummary(): Promise<WalletShiftSummary> {
    const response = await apiClient.get<ApiResponse<WalletShiftSummary>>(
      ENDPOINTS.WALLET.SHIFT_SUMMARY
    );
    return response.data.data;
  },
};
