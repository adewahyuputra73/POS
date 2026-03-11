import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Role, CreateRoleRequest, UpdateRoleRequest, AssignRoleRequest } from "../types";

export const roleService = {
  async list(): Promise<Role[]> {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      ENDPOINTS.ROLES.LIST
    );
    return response.data.data;
  },

  async create(data: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post<ApiResponse<Role>>(
      ENDPOINTS.ROLES.CREATE,
      data
    );
    return response.data.data;
  },

  async update(id: string | number, data: UpdateRoleRequest): Promise<Role> {
    const response = await apiClient.put<ApiResponse<Role>>(
      ENDPOINTS.ROLES.UPDATE(id),
      data
    );
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.ROLES.DELETE(id));
  },

  async assign(data: AssignRoleRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.ROLES.ASSIGN, data);
  },

  async remove(data: AssignRoleRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.ROLES.REMOVE, data);
  },

  async detail(id: string | number): Promise<Role> {
    const response = await apiClient.get<ApiResponse<Role>>(
      ENDPOINTS.ROLES.DETAIL(id)
    );
    return response.data.data;
  },
};
