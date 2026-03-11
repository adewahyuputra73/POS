// API Endpoints
export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string | number) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id: string | number) => `/products/${id}`,
    DELETE: (id: string | number) => `/products/${id}`,
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
    CREATE: "/categories",
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
    CREATE: "/outlets",
  },

  // Stores
  STORES: {
    ONBOARDING: "/stores/onboarding",
  },

  // Orders
  ORDERS: {
    CHECKOUT: "/orders/checkout",
  },

  // Dashboard
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_TRANSACTIONS: "/dashboard/recent-transactions",
    TOP_PRODUCTS: "/dashboard/top-products",
  },
} as const;
