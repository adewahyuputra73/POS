import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  ShiftStatus,
  ShiftPreviewEnd,
  ShiftDetail,
  ShiftHistoryItem,
  StartShiftRequest,
  EndShiftRequest,
  ShiftHistoryParams,
} from "../types";

export const shiftService = {
  async start(data: StartShiftRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.SHIFT.START, data);
  },

  async status(): Promise<ShiftStatus> {
    const response = await apiClient.get<ApiResponse<ShiftStatus>>(
      ENDPOINTS.SHIFT.STATUS
    );
    return response.data.data;
  },

  async previewEnd(): Promise<ShiftPreviewEnd> {
    const response = await apiClient.get<ApiResponse<ShiftPreviewEnd>>(
      ENDPOINTS.SHIFT.PREVIEW_END
    );
    return response.data.data;
  },

  async end(data: EndShiftRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.SHIFT.END, data);
  },

  async detail(id: string | number): Promise<ShiftDetail> {
    const response = await apiClient.get<ApiResponse<ShiftDetail>>(
      ENDPOINTS.SHIFT.DETAIL(id)
    );
    return response.data.data;
  },

  async history(params?: ShiftHistoryParams): Promise<ShiftHistoryItem[]> {
    const response = await apiClient.get<ApiResponse<ShiftHistoryItem[]>>(
      ENDPOINTS.SHIFT.HISTORY,
      { params }
    );
    return response.data.data;
  },
};
