import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Product, CreateProductRequest } from "../types";

export const productService = {
  async create(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.CREATE,
      data
    );
    return response.data.data;
  },
};
