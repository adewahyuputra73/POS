import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  Customer,
  CustomerDetail,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Review,
  CreateReviewRequest,
  ReviewListParams,
  BulkTarget,
  SendBulkMessageRequest,
} from "../types";

export const customerService = {
  async list(): Promise<Customer[]> {
    const response = await apiClient.get<ApiResponse<Customer[]>>(
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

  async create(data: CreateCustomerRequest): Promise<Customer> {
    const response = await apiClient.post<ApiResponse<Customer>>(
      ENDPOINTS.CUSTOMERS.CREATE,
      data
    );
    return response.data.data;
  },

  async update(id: string | number, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await apiClient.put<ApiResponse<Customer>>(
      ENDPOINTS.CUSTOMERS.UPDATE(id),
      data
    );
    return response.data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.CUSTOMERS.DELETE(id));
  },

  async reviews(params?: ReviewListParams): Promise<Review[]> {
    const response = await apiClient.get<ApiResponse<Review[]>>(
      ENDPOINTS.CUSTOMERS.REVIEWS,
      { params }
    );
    return response.data.data;
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
