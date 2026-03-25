import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types";

export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.CATEGORIES.LIST
    );
    const payload = response.data.data;
    // Handle both: flat array OR nested { categories: [] }
    return Array.isArray(payload) ? payload : (payload?.categories ?? []);
  },

  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.CREATE,
      data
    );
    return response.data.data;
  },

  async update(id: string | number, data: UpdateCategoryRequest): Promise<Category> {
    const response = await apiClient.put<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.UPDATE(id),
      data
    );
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.CATEGORIES.DELETE(id));
  },
};
