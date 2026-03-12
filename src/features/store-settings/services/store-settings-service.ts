import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { StoreInfo, UpdateStoreRequest, StoreOnboardingRequest } from "../types";

export const storeSettingsService = {
  async my(): Promise<StoreInfo> {
    const response = await apiClient.get<ApiResponse<StoreInfo>>(
      ENDPOINTS.STORES.MY
    );
    return response.data.data;
  },

  async update(data: UpdateStoreRequest): Promise<StoreInfo> {
    const response = await apiClient.put<ApiResponse<StoreInfo>>(
      ENDPOINTS.STORES.MY,
      data
    );
    return response.data.data;
  },

  async onboarding(data: StoreOnboardingRequest): Promise<StoreInfo> {
    const response = await apiClient.post<ApiResponse<StoreInfo>>(
      ENDPOINTS.STORES.ONBOARDING,
      data
    );
    return response.data.data;
  },
};
