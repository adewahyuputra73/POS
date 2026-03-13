import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  ShiftStatus,
  ShiftHistoryResponse,
  StartShiftRequest,
  EndShiftRequest,
  ShiftHistoryParams,
} from "../types";

export const shiftService = {
  async start(data: StartShiftRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.SHIFT.START, data);
  },

  async status(): Promise<ShiftStatus | null> {
    const response = await apiClient.get<ApiResponse<ShiftStatus | null>>(
      ENDPOINTS.SHIFT.STATUS
    );
    return response.data.data;
  },

  async end(data: EndShiftRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.SHIFT.END, data);
  },

  async history(params?: ShiftHistoryParams): Promise<ShiftHistoryResponse> {
    const response = await apiClient.get<ApiResponse<ShiftHistoryResponse>>(
      ENDPOINTS.SHIFT.HISTORY,
      { params }
    );
    return response.data.data;
  },
};
