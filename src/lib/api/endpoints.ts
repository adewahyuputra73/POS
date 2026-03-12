// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    UPDATE_PIN: "/auth/update-pin",
    FORGOT_PASSWORD_REQUEST: "/auth/forgot-password/request",
    FORGOT_PASSWORD_VERIFY_OTP: "/auth/forgot-password/verify-otp",
    FORGOT_PASSWORD_RESET: "/auth/forgot-password/reset",
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string | number) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: string | number) => `/products/${id}`,
    DELETE: (id: string | number) => `/products/${id}`,
    TOGGLE_STATUS: (id: string | number) => `/products/${id}/status`,
    STOCK: (id: string | number) => `/products/${id}/stock`,
    STOCK_HISTORY: (id: string | number) => `/products/${id}/stock/history`,
    PRICES: (id: string | number) => `/products/${id}/prices`,
    BULK_DELETE: "/products/bulk/delete",
    BULK_STATUS: "/products/bulk/status",
    CATEGORIES: "/products/categories",
  },

  // Transactions
  TRANSACTIONS: {
    LIST: "/transactions",
    DETAIL: (id: string | number) => `/transactions/${id}`,
    CREATE: "/transactions",
    VOID: (id: string | number) => `/transactions/${id}/void`,
  },

  // Customers
  CUSTOMERS: {
    LIST: "/customers",
    DETAIL: (id: string | number) => `/customers/${id}`,
    CREATE: "/customers",
    UPDATE: (id: string | number) => `/customers/${id}`,
    DELETE: (id: string | number) => `/customers/${id}`,
  },

  // Categories
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    UPDATE: (id: string | number) => `/categories/${id}`,
    DELETE: (id: string | number) => `/categories/${id}`,
  },

  // Reports
  REPORTS: {
    SALES: "/reports/sales",
    PRODUCTS: "/reports/products",
    CUSTOMERS: "/reports/customers",
    EXPORT: "/reports/export",
  },

  // Settings
  SETTINGS: {
    PROFILE: "/settings/profile",
    STORE: "/settings/store",
    USERS: "/settings/users",
    USER_DETAIL: (id: string | number) => `/settings/users/${id}`,
  },

  // Outlets
  OUTLETS: {
    LIST: "/outlets",
    DETAIL: (id: string | number) => `/outlets/${id}`,
    CREATE: "/outlets",
    UPDATE: (id: string | number) => `/outlets/${id}`,
    TOGGLE_STATUS: (id: string | number) => `/outlets/${id}/status`,
    DELETE: (id: string | number) => `/outlets/${id}`,
  },

  // Stores
  STORES: {
    ONBOARDING: "/stores/onboarding",
    MY: "/stores/my",
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string | number) => `/orders/${id}`,
    CHECKOUT: "/orders/checkout",
    PAY: (id: string | number) => `/orders/${id}/pay`,
    STATUS: (id: string | number) => `/orders/${id}/status`,
    VOID: (id: string | number) => `/orders/${id}/void`,
    SUMMARY_CARDS: "/orders/summary-cards",
  },

  // Inventory
  INVENTORY: {
    IN: "/inventory/in",
    HISTORY: "/inventory/history",
  },

  // Roles
  ROLES: {
    LIST: "/roles",
    DETAIL: (id: string | number) => `/roles/${id}`,
    CREATE: "/roles",
    UPDATE: (id: string | number) => `/roles/${id}`,
    DELETE: (id: string | number) => `/roles/${id}`,
    ASSIGN: "/roles/assign",
    REMOVE: "/roles/remove",
  },

  // Shift
  SHIFT: {
    START: "/shift/start",
    STATUS: "/shift/status",
    PREVIEW_END: "/shift/preview-end",
    END: "/shift/end",
    DETAIL: (id: string | number) => `/shift/${id}/detail`,
    HISTORY: "/shift/history",
  },

  // Vouchers
  VOUCHERS: {
    LIST: "/vouchers",
    DETAIL: (id: string | number) => `/vouchers/${id}`,
    CREATE: "/vouchers",
    UPDATE: (id: string | number) => `/vouchers/${id}`,
    DELETE: (id: string | number) => `/vouchers/${id}`,
    TERMINATE: (id: string | number) => `/vouchers/${id}/terminate`,
    VALIDATE: "/vouchers/validate",
  },

  // Tables
  TABLES: {
    LIST: "/tables",
    DETAIL: (id: string | number) => `/tables/${id}`,
    CREATE: "/tables",
    UPDATE: (id: string | number) => `/tables/${id}`,
    DELETE: (id: string | number) => `/tables/${id}`,
    STATUS: (id: string | number) => `/tables/${id}/status`,
    REGENERATE_QR: (id: string | number) => `/tables/${id}/regenerate-qr`,
    SUMMARY: "/tables/summary",
    SCAN: (id: string | number) => `/tables/scan/${id}`,
    AREAS: "/tables/areas",
    AREA_DETAIL: (id: string | number) => `/tables/areas/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    READ: (id: string | number) => `/notifications/${id}/read`,
    READ_ALL: "/notifications/read-all",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_TRANSACTIONS: "/dashboard/recent-transactions",
    TOP_PRODUCTS: "/dashboard/top-products",
  },
} as const;
