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
  },

  // Categories
  CATEGORIES: {
    LIST: "/categories",
    CREATE: "/categories",
    UPDATE: (id: string | number) => `/categories/${id}`,
    DELETE: (id: string | number) => `/categories/${id}`,
  },

  // Customers
  CUSTOMERS: {
    LIST: "/customers",
    DETAIL: (id: string | number) => `/customers/${id}`,
    UPDATE: (id: string | number) => `/customers/${id}`,
    DELETE: (id: string | number) => `/customers/${id}`,
    REVIEWS: "/customers/reviews",
    CREATE_REVIEW: (id: string | number) => `/customers/${id}/reviews`,
    TOGGLE_REVIEW: (id: string | number) => `/customers/reviews/${id}/toggle`,
    BULK_TARGETS: "/customers/bulk-targets",
    BULK_MESSAGE: "/customers/bulk-message",
  },


  // Reports
  REPORTS: {
    SUMMARY: "/reports/summary",
    ORDERS: "/reports/orders",
    PRODUCTS: "/reports/products",
    SHIFTS: "/reports/shifts",
    SUMMARY_EXPORT: "/reports/summary/export",
    ORDERS_EXPORT: "/reports/orders/export",
    PRODUCTS_EXPORT: "/reports/products/export",
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

  // Pre-orders
  PREORDERS: {
    SLOTS: "/preorders/slots",
    LIST: "/preorders",
    CREATE: "/preorders/",
    CREATE_POS: "/preorders/pos",
  },

  // Stores
  STORES: {
    ONBOARDING: "/stores/onboarding",
    MY: "/stores/my",       // GET & PUT /stores/my (confirmed dari cURL BE)
    FEES: "/stores/my/fees",
    CREATE: "/stores/create",
  },

  // Orders
  ORDERS: {
    LIST: "/orders",
    DETAIL: (id: string | number) => `/orders/${id}`,
    CHECKOUT: "/orders/checkout",  // alias: POST /orders juga diterima BE
    CHECKOUT_ALIAS: "/orders",     // ← N6: alias endpoint, payload sama dengan /orders/checkout
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
    END: "/shift/end",
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
    PUBLIC_VALIDATE: "/vouchers/public/validate",   // ← customer-facing, tidak butuh Bearer admin
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
    SCAN: (storeId: string, tableId: string) => `/tables/scan/${storeId}/${tableId}`,  // ← 2 param
    AREAS: "/tables/areas",
    AREA_DETAIL: (id: string | number) => `/tables/areas/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    READ: (id: string | number) => `/notifications/${id}/read`,
    READ_ALL: "/notifications/read-all",
  },

  // Wallet
  WALLET: {
    BALANCE: "/wallet/balance",
    HISTORY: "/wallet/history",
    SHIFT_SUMMARY: (shiftId: string) => `/wallet/shift/${shiftId}`,   // ← ID wajib ada di path
    TRANSACTIONS: "/wallet/transactions",         // GET — daftar semua transaksi wallet
    CREATE_TRANSACTION: "/wallet/transactions",   // POST — catat transaksi baru (confirmed BE)
  },

  // Biteship Delivery
  BITESHIP: {
    AREAS: "/biteship/areas",
    RATES: "/biteship/rates/courier",
    ORDER_CREATE: "/biteship/order/create",                               // ← bukan /biteship/orders
    ORDER_DETAIL: (id: string) => `/biteship/orders/${id}`,              // ⚠️ belum confirmed di cURL
    TRACKING: (waybillId: string) => `/biteship/order/tracking/${waybillId}`,  // ← bukan /biteship/trackings/
    CANCEL_REASONS: "/biteship/order/cancel/reason",
    CANCEL_ORDER: (orderId: string) => `/biteship/order/cancel/${orderId}`,
  },

  // Dashboard
  DASHBOARD: {
    TODAY_SUMMARY: "/dashboard",
    SALES_CHART: "/dashboard/sales-chart",
    TOP_PRODUCTS: "/dashboard/top-products",
  },

  // Staff Management
  STAFF: {
    LIST: "/staff",
    ALL: "/staff/all",
    CREATE: "/staff",
    UPDATE: (id: string | number) => `/staff/${id}`,
    DELETE: (id: string | number) => `/staff/${id}`,
    ROLES: "/staff/roles",
  },
} as const;
