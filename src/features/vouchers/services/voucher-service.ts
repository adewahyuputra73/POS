import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Voucher, CreateVoucherRequest, UpdateVoucherRequest, VoucherListParams, ValidateVoucherRequest, ValidateVoucherResponse } from "../types";

export const voucherService = {
  async list(params?: VoucherListParams): Promise<Voucher[]> {
    const response = await apiClient.get<ApiResponse<Voucher[]>>(
      ENDPOINTS.VOUCHERS.LIST,
      { params }
    );
    return response.data.data;
  },

  async detail(id: string | number): Promise<Voucher> {
    const response = await apiClient.get<ApiResponse<Voucher>>(
      ENDPOINTS.VOUCHERS.DETAIL(id)
    );
    return response.data.data;
  },

  async create(data: CreateVoucherRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.VOUCHERS.CREATE, data);
  },

  async update(id: string | number, data: UpdateVoucherRequest): Promise<void> {
    await apiClient.put(ENDPOINTS.VOUCHERS.UPDATE(id), data);
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.VOUCHERS.DELETE(id));
  },

  async terminate(id: string | number): Promise<void> {
    await apiClient.post(ENDPOINTS.VOUCHERS.TERMINATE(id));
  },

  async validate(data: ValidateVoucherRequest): Promise<ValidateVoucherResponse> {
    const response = await apiClient.post<ApiResponse<ValidateVoucherResponse>>(
      ENDPOINTS.VOUCHERS.VALIDATE,
      data
    );
    return response.data.data;
  },
};
