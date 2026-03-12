// NOTE: DashboardTodaySummary fields are guessed — adjust when actual response is known
export interface DashboardTodaySummary {
  total_sales: number;
  total_transactions: number;
  total_items_sold: number;
  average_transaction: number;
}

export type SalesChartPeriod = "weekly" | "monthly" | "yearly";

export interface SalesChartParams {
  period: SalesChartPeriod;
}

// NOTE: SalesChartDataPoint fields are guessed — adjust when actual response is known
export interface SalesChartDataPoint {
  label: string;
  value: number;
}

// NOTE: SalesChartResponse fields are guessed — adjust when actual response is known
export interface SalesChartResponse {
  period: string;
  data: SalesChartDataPoint[];
}

export interface TopProductsParams {
  limit?: number;
}

// NOTE: TopProductItem fields are guessed — adjust when actual response is known
export interface TopProductItem {
  id: string;
  product_name: string;
  qty_sold: number;
  total_sales: number;
}
