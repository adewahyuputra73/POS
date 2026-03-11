import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { StoreInfo, StoreOnboardingRequest } from "../types";

export const storeSettingsService = {
  async onboarding(data: StoreOnboardingRequest): Promise<StoreInfo> {
    const response = await apiClient.post<ApiResponse<StoreInfo>>(
      ENDPOINTS.STORES.ONBOARDING,
      data
    );
    return response.data.data;
  },
};
