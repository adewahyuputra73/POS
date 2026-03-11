export const APP_NAME = "Fere POS";
export const APP_DESCRIPTION = "Point of Sale Admin Dashboard";

// API Configuration
export const API_BASE_URL = "https://qa-api.ferecorps.com/api/fereapps/v1";
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Date formats
export const DATE_FORMAT = "dd/MM/yyyy";
export const DATETIME_FORMAT = "dd/MM/yyyy HH:mm";
export const TIME_FORMAT = "HH:mm";

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
  THEME: "theme",
  SIDEBAR_COLLAPSED: "sidebar_collapsed",
} as const;

// Status colors
export const STATUS_COLORS = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  default: "bg-gray-100 text-gray-800",
} as const;

// Order status
export const ORDER_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: "cash",
  CARD: "card",
  QRIS: "qris",
  TRANSFER: "transfer",
} as const;
