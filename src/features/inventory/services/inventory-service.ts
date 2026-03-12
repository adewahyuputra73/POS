import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { InventoryInRequest, InventoryHistoryParams, StockLog } from "../types";

export const inventoryService = {
  async stockIn(data: InventoryInRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.INVENTORY.IN, data);
  },

  async history(params?: InventoryHistoryParams): Promise<StockLog[]> {
    const response = await apiClient.get<ApiResponse<StockLog[]>>(
      ENDPOINTS.INVENTORY.HISTORY,
      { params }
    );
    return response.data.data;
  },
};
