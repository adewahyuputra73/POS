// CONFIRMED from GET /dashboard
export interface DashboardActiveShift {
  id: string;
  shift_number: number;
  opening_cash: number;
  start_time: string;
  cashier: string;
}

export interface DashboardOrderSummary {
  pending: number;
  processing: number;
  ready: number;
  completed: number;
  cancelled: number;
  total_today: number;
}

export interface DashboardPaymentSummary {
  total_revenue: number;
  total_transactions: number;
  breakdown: {
    CASH: number;
    QRIS: number;
    TRANSFER: number;
    EDC: number;
    OTHER: number;
  };
}

export interface DashboardAlerts {
  pending_orders: number;
  low_stock_products: unknown[];
}

export interface DashboardTodaySummary {
  greeting: string;
  store_name: string;
  active_shift: DashboardActiveShift | null;
  order_summary: DashboardOrderSummary;
  payment_summary: DashboardPaymentSummary;
  alerts: DashboardAlerts;
}

export type SalesChartPeriod = "weekly" | "monthly" | "yearly";

export interface SalesChartParams {
  period: SalesChartPeriod;
}

// CONFIRMED from GET /dashboard/sales-chart
export interface SalesChartDataPoint {
  label: string;
  revenue: number;
  transactions: number;
}

export interface SalesChartResponse {
  period: string;
  data: SalesChartDataPoint[];
}

export interface TopProductsParams {
  limit?: number;
}

// CONFIRMED from GET /dashboard/top-products
export interface TopProductItem {
  product_id: string;
  name: string;
  sku: string | null;
  price: number;
  total_qty: number;
  total_revenue: number;
}
