import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  Customer,
  CustomerDetail,
  CustomerListResponse,
  Review,
  CreateReviewRequest,
  ReviewListParams,
  BulkTarget,
  SendBulkMessageRequest,
  UpdateCustomerRequest,
} from "../types";

export const customerService = {
  async list(): Promise<CustomerListResponse> {
    const response = await apiClient.get<ApiResponse<CustomerListResponse>>(
      ENDPOINTS.CUSTOMERS.LIST
    );
    return response.data.data;
  },

  async detail(id: string | number): Promise<CustomerDetail> {
    const response = await apiClient.get<ApiResponse<CustomerDetail>>(
      ENDPOINTS.CUSTOMERS.DETAIL(id)
    );
    return response.data.data;
  },

  // PUT /customers/{id} — update data customer (nama, dll)
  async update(id: string | number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      ENDPOINTS.CUSTOMERS.UPDATE(id),
      data
    );
    return response.data.data;
  },

  // DELETE /customers/{id}
  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.CUSTOMERS.DELETE(id));
  },

  async reviews(params?: ReviewListParams): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.CUSTOMERS.REVIEWS,
      { params }
    );
    const payload = response.data.data;
    return Array.isArray(payload) ? payload : (payload?.data ?? []);
  },

  async createReview(customerId: string | number, data: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      ENDPOINTS.CUSTOMERS.CREATE_REVIEW(customerId),
      data
    );
    return response.data.data;
  },

  async toggleReview(reviewId: string | number): Promise<void> {
    await apiClient.patch(ENDPOINTS.CUSTOMERS.TOGGLE_REVIEW(reviewId));
  },

  async bulkTargets(): Promise<BulkTarget[]> {
    const response = await apiClient.get<ApiResponse<BulkTarget[]>>(
      ENDPOINTS.CUSTOMERS.BULK_TARGETS
    );
    return response.data.data;
  },

  async sendBulkMessage(data: SendBulkMessageRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.CUSTOMERS.BULK_MESSAGE, data);
  },
};
