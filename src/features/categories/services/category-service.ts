import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Category, CreateCategoryRequest } from "../types";

export const categoryService = {
  async create(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<ApiResponse<Category>>(
      ENDPOINTS.CATEGORIES.CREATE,
      data
    );
    return response.data.data;
  },
};
