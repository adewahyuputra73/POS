import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  Table,
  TableListParams,
  TableSummary,
  CreateTableRequest,
  UpdateTableRequest,
  UpdateTableStatusRequest,
  ScanTableResponse,
} from "../types";

export const tableService = {
  // === Areas ===
  async areas(): Promise<Area[]> {
    const response = await apiClient.get<ApiResponse<Area[]>>(
      ENDPOINTS.TABLES.AREAS
    );
    return response.data.data;
  },

  async createArea(data: CreateAreaRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.TABLES.AREAS, data);
  },

  async updateArea(id: string | number, data: UpdateAreaRequest): Promise<void> {
    await apiClient.put(ENDPOINTS.TABLES.AREA_DETAIL(id), data);
  },

  async deleteArea(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.TABLES.AREA_DETAIL(id));
  },

  // === Tables ===
  async list(params?: TableListParams): Promise<Table[]> {
    const response = await apiClient.get<ApiResponse<Table[]>>(
      ENDPOINTS.TABLES.LIST,
      { params }
    );
    return response.data.data;
  },

  async detail(id: string | number): Promise<Table> {
    const response = await apiClient.get<ApiResponse<Table>>(
      ENDPOINTS.TABLES.DETAIL(id)
    );
    return response.data.data;
  },

  async summary(): Promise<TableSummary> {
    const response = await apiClient.get<ApiResponse<TableSummary>>(
      ENDPOINTS.TABLES.SUMMARY
    );
    return response.data.data;
  },

  async create(data: CreateTableRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.TABLES.CREATE, data);
  },

  async update(id: string | number, data: UpdateTableRequest): Promise<void> {
    await apiClient.put(ENDPOINTS.TABLES.UPDATE(id), data);
  },

  async updateStatus(id: string | number, data: UpdateTableStatusRequest): Promise<void> {
    await apiClient.patch(ENDPOINTS.TABLES.STATUS(id), data);
  },

  async regenerateQr(id: string | number): Promise<void> {
    await apiClient.post(ENDPOINTS.TABLES.REGENERATE_QR(id));
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.TABLES.DELETE(id));
  },

  async scan(id: string | number): Promise<ScanTableResponse> {
    const response = await apiClient.get<ApiResponse<ScanTableResponse>>(
      ENDPOINTS.TABLES.SCAN(id)
    );
    return response.data.data;
  },
};
