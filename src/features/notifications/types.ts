// Notifications Module Types

// NOTE: Notification fields are guessed — adjust when actual response is known
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
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
