import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Order, CheckoutRequest } from "../types";

export const orderService = {
  async checkout(data: CheckoutRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      ENDPOINTS.ORDERS.CHECKOUT,
      data
    );
    return response.data.data;
  },
};
