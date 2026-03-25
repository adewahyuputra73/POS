// Notifications Module Types

// CONFIRMED from GET /notifications
export interface Notification {
  id: string;
  store_id: string;
  admin_id: string | null;
  type: string;
  title: string;
  body: string;
  data: Record<string, string> | null;
  is_read: boolean;
  read_at: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unread_count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NotificationListParams {
  unread?: boolean;
  page?: number;
  limit?: number;
}

export interface MarkAllReadResponse {
  updated: number;
}
