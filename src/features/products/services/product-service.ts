import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Product, ChannelPrice, CreateProductRequest, UpdateProductRequest, UpdateStockRequest, UpdatePriceRequest, BulkDeleteRequest, BulkStatusRequest, StockHistory, ProductListParams } from "../types";

export const productService = {
  async list(params?: ProductListParams): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(
      ENDPOINTS.PRODUCTS.LIST,
      { params }
    );
    return response.data.data;
  },

  async detail(id: string | number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return response.data.data;
  },

  async create(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.CREATE,
      data
    );
    return response.data.data;
  },

  async toggleStatus(id: string | number): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id)
    );
    return response.data.data;
  },

  async update(id: string | number, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.UPDATE(id),
      data
    );
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  },

  async updateStock(id: string | number, data: UpdateStockRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.STOCK(id),
      data
    );
    return response.data.data;
  },

  async stockHistory(id: string | number): Promise<StockHistory[]> {
    const response = await apiClient.get<ApiResponse<StockHistory[]>>(
      ENDPOINTS.PRODUCTS.STOCK_HISTORY(id)
    );
    return response.data.data;
  },

  async prices(id: string | number): Promise<ChannelPrice[]> {
    const response = await apiClient.get<ApiResponse<ChannelPrice[]>>(
      ENDPOINTS.PRODUCTS.PRICES(id)
    );
    return response.data.data;
  },

  async updatePrice(id: string | number, data: UpdatePriceRequest): Promise<Product> {
    const response = await apiClient.put<ApiResponse<Product>>(
      ENDPOINTS.PRODUCTS.PRICES(id),
      data
    );
    return response.data.data;
  },

  async bulkDelete(data: BulkDeleteRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.PRODUCTS.BULK_DELETE, data);
  },

  async bulkStatus(data: BulkStatusRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.PRODUCTS.BULK_STATUS, data);
  },
};
