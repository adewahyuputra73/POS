import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Outlet, CreateOutletRequest, UpdateOutletRequest } from "../types";

export const outletService = {
  async list(): Promise<Outlet[]> {
    const response = await apiClient.get<ApiResponse<Outlet[]>>(
      ENDPOINTS.OUTLETS.LIST
    );
    return response.data.data;
  },

  async detail(id: string | number): Promise<Outlet> {
    const response = await apiClient.get<ApiResponse<Outlet>>(
      ENDPOINTS.OUTLETS.DETAIL(id)
    );
    return response.data.data;
  },

  async update(id: string | number, data: UpdateOutletRequest): Promise<Outlet> {
    const response = await apiClient.put<ApiResponse<Outlet>>(
      ENDPOINTS.OUTLETS.UPDATE(id),
      data
    );
    return response.data.data;
  },

  async toggleStatus(id: string | number): Promise<Outlet> {
    const response = await apiClient.patch<ApiResponse<Outlet>>(
      ENDPOINTS.OUTLETS.TOGGLE_STATUS(id)
    );
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.OUTLETS.DELETE(id));
  },

  async create(data: CreateOutletRequest): Promise<Outlet> {
    const response = await apiClient.post<ApiResponse<Outlet>>(
      ENDPOINTS.OUTLETS.CREATE,
      data
    );
    return response.data.data;
  },
};
