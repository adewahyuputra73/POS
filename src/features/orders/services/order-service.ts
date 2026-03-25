import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Order, OrderSummaryCards, CheckoutRequest, PayOrderRequest, UpdateOrderStatusRequest, VoidOrderRequest, OrderListParams } from "../types";

export const orderService = {
  async list(params?: OrderListParams): Promise<Order[]> {
    const response = await apiClient.get<ApiResponse<any>>(ENDPOINTS.ORDERS.LIST, { params });
    const payload = response.data.data;
    return Array.isArray(payload) ? payload : (payload?.orders ?? payload?.data ?? []);
  },

  async detail(id: string | number): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      ENDPOINTS.ORDERS.DETAIL(id)
    );
    return response.data.data;
  },

  async checkout(data: CheckoutRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      ENDPOINTS.ORDERS.CHECKOUT,
      data
    );
    return response.data.data;
  },

  async pay(id: string | number, data: PayOrderRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.ORDERS.PAY(id), data);
  },

  async updateStatus(id: string | number, data: UpdateOrderStatusRequest): Promise<void> {
    await apiClient.patch(ENDPOINTS.ORDERS.STATUS(id), data);
  },

  async void(id: string | number, data: VoidOrderRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.ORDERS.VOID(id), data);
  },

  async summaryCards(): Promise<OrderSummaryCards> {
    const response = await apiClient.get<ApiResponse<OrderSummaryCards>>(
      ENDPOINTS.ORDERS.SUMMARY_CARDS
    );
    return response.data.data;
  },
};
