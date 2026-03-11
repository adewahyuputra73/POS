import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Outlet, CreateOutletRequest } from "../types";

export const outletService = {
  async create(data: CreateOutletRequest): Promise<Outlet> {
    const response = await apiClient.post<ApiResponse<Outlet>>(
      ENDPOINTS.OUTLETS.CREATE,
      data
    );
    return response.data.data;
  },
};
