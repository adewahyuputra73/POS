import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type {
  MarkAllReadResponse,
  NotificationListParams,
  NotificationListResponse,
} from "../types";

export const notificationService = {
  async list(params?: NotificationListParams): Promise<NotificationListResponse> {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>(
      ENDPOINTS.NOTIFICATIONS.LIST,
      { params }
    );
    return response.data.data;
  },

  async markAsRead(id: string | number): Promise<void> {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS.READ(id));
  },

  async markAllAsRead(): Promise<MarkAllReadResponse> {
    const response = await apiClient.patch<ApiResponse<MarkAllReadResponse>>(
      ENDPOINTS.NOTIFICATIONS.READ_ALL
    );
    return response.data.data;
  },
};
