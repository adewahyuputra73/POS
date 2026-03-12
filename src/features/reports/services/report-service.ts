import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  ReportOrdersParams,
  ReportOrdersResponse,
  ReportProductsParams,
  ReportProductsResponse,
  ReportShiftsParams,
  ReportShiftsResponse,
  ReportSummary,
  ReportSummaryParams,
  ReportSummaryExportParams,
  ReportOrdersExportParams,
  ReportProductsExportParams,
} from "../types";

export const reportService = {
  async summary(params: ReportSummaryParams): Promise<ReportSummary> {
    const response = await apiClient.get<ApiResponse<ReportSummary>>(
      ENDPOINTS.REPORTS.SUMMARY,
      { params }
    );
    return response.data.data;
  },

  async orders(params: ReportOrdersParams): Promise<ReportOrdersResponse> {
    const response = await apiClient.get<ApiResponse<ReportOrdersResponse>>(
      ENDPOINTS.REPORTS.ORDERS,
      { params }
    );
    return response.data.data;
  },

  async products(params: ReportProductsParams): Promise<ReportProductsResponse> {
    const response = await apiClient.get<ApiResponse<ReportProductsResponse>>(
      ENDPOINTS.REPORTS.PRODUCTS,
      { params }
    );
    return response.data.data;
  },

  async shifts(params: ReportShiftsParams): Promise<ReportShiftsResponse> {
    const response = await apiClient.get<ApiResponse<ReportShiftsResponse>>(
      ENDPOINTS.REPORTS.SHIFTS,
      { params }
    );
    return response.data.data;
  },

  async summaryExport(params: ReportSummaryExportParams): Promise<Blob> {
    const response = await apiClient.get(
      ENDPOINTS.REPORTS.SUMMARY_EXPORT,
      { params, responseType: "blob" }
    );
    return response.data;
  },

  async ordersExport(params: ReportOrdersExportParams): Promise<Blob> {
    const response = await apiClient.get(
      ENDPOINTS.REPORTS.ORDERS_EXPORT,
      { params, responseType: "blob" }
    );
    return response.data;
  },

  async productsExport(params: ReportProductsExportParams): Promise<Blob> {
    const response = await apiClient.get(
      ENDPOINTS.REPORTS.PRODUCTS_EXPORT,
      { params, responseType: "blob" }
    );
    return response.data;
  },
};
