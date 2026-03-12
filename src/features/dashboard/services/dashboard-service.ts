import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  DashboardTodaySummary,
  SalesChartParams,
  SalesChartResponse,
  TopProductsParams,
  TopProductItem,
} from "../types";

export const dashboardService = {
  async todaySummary(): Promise<DashboardTodaySummary> {
    const response = await apiClient.get<ApiResponse<DashboardTodaySummary>>(
      ENDPOINTS.DASHBOARD.TODAY_SUMMARY
    );
    return response.data.data;
  },

  async salesChart(params: SalesChartParams): Promise<SalesChartResponse> {
    const response = await apiClient.get<ApiResponse<SalesChartResponse>>(
      ENDPOINTS.DASHBOARD.SALES_CHART,
      { params }
    );
    return response.data.data;
  },

  async topProducts(params?: TopProductsParams): Promise<TopProductItem[]> {
    const response = await apiClient.get<ApiResponse<TopProductItem[]>>(
      ENDPOINTS.DASHBOARD.TOP_PRODUCTS,
      { params }
    );
    return response.data.data;
  },
};
