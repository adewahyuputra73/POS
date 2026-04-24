import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Outlet, CreateOutletRequest, UpdateOutletRequest } from "../types";

/** BE bisa return latitude/longitude sebagai string — pastikan selalu number */
function mapOutlet(raw: any): Outlet {
  return {
    ...raw,
    latitude: raw.latitude != null && raw.latitude !== "" ? Number(raw.latitude) : null,
    longitude: raw.longitude != null && raw.longitude !== "" ? Number(raw.longitude) : null,
  };
}

export const outletService = {
  async list(): Promise<Outlet[]> {
    const response = await apiClient.get<ApiResponse<any[]>>(
      ENDPOINTS.OUTLETS.LIST
    );
    return (response.data.data ?? []).map(mapOutlet);
  },

  async detail(id: string | number): Promise<Outlet> {
    const response = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.OUTLETS.DETAIL(id)
    );
    return mapOutlet(response.data.data);
  },

  async update(id: string | number, data: UpdateOutletRequest): Promise<Outlet> {
    const response = await apiClient.put<ApiResponse<any>>(
      ENDPOINTS.OUTLETS.UPDATE(id),
      data
    );
    return mapOutlet(response.data.data);
  },

  async toggleStatus(id: string | number): Promise<Outlet> {
    const response = await apiClient.patch<ApiResponse<any>>(
      ENDPOINTS.OUTLETS.TOGGLE_STATUS(id)
    );
    return mapOutlet(response.data.data);
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.OUTLETS.DELETE(id));
  },

  async create(data: CreateOutletRequest): Promise<Outlet> {
    const response = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.OUTLETS.CREATE,
      data
    );
    return mapOutlet(response.data.data);
  },
};
