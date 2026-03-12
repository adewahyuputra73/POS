// Reports Feature Types

// Outlet
export interface Outlet {
  id: string;
  name: string;
}

// Date Range
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ====================================
// Sales Summary Types (Ringkasan Penjualan)
// ====================================

export interface SalesSummary {
  outlet_name: string;
  item_sold: number;
  total_order: number;
  avg_per_transaction: number;
  total_sales: number;
  total_dine_in: number;
  total_qr_order: number;
  total_delivery: number;
}

export interface SalesDetail {
  label: string;
  value: number;
}

export interface PaymentMethodSummary {
  method: string;
  order_count: number;
  total: number;
}

export interface SalesSummaryReport {
  summary: SalesSummary;
  sales_details: SalesDetail[];
  payment_methods: PaymentMethodSummary[];
}

// ====================================
// Product Sales Types (Penjualan Produk)
// ====================================

export type AggregationMode = 'total' | 'hourly' | 'daily' | 'weekly' | 'monthly';

export interface ProductSalesFilter {
  start_date: string;
  end_date: string;
  outlet_id?: string;
  product_ids?: string[];
  variant_ids?: string[];
  category_ids?: string[];
  aggregation_mode: AggregationMode;
  shift_id?: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProductSalesRow {
  outlet: string;
  product_name: string;
  category: string;
  item_sold: number;
  total_sales: number;
}

export interface ProductSalesReport {
  item_sold: number;
  total_gross_sales: number;
  chart_data: ChartDataPoint[];
  products: ProductSalesRow[];
}

// Filter Options
export interface FilterOption {
  value: string;
  label: string;
}

export interface ProductSalesFilterOptions {
  outlets: FilterOption[];
  products: FilterOption[];
  variants: FilterOption[];
  categories: FilterOption[];
  shifts: FilterOption[];
}

// ====================================
// Report Summary Types (Laporan Ringkasan)
// ====================================

export interface ReportSummaryParams {
  start_date: string;
  end_date: string;
}

export interface ReportSummaryExportParams {
  start_date: string;
  end_date: string;
}

export interface ReportOrdersExportParams {
  start_date: string;
  end_date: string;
}

export interface ReportProductsExportParams {
  start_date: string;
  end_date: string;
}

export interface ReportSummary {
  period: {
    start_date: string;
    end_date: string;
  };
  gross_sales: number;
  discount_total: number;
  refund_total: number;
  net_sales: number;
  total_transactions: number;
  void_count: number;
  average_transaction: number;
  payment_summary: {
    cash: number;
    non_cash: number;
    breakdown: Record<string, number>;
  };
}

// ====================================
// Report Orders Types (Laporan Pesanan)
// ====================================

export interface ReportOrdersParams {
  start_date: string;
  end_date: string;
  page?: number;
  limit?: number;
}

// NOTE: ReportOrderItem fields are guessed — adjust when actual response is known
export interface ReportOrderItem {
  id: string;
  order_number: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}

export interface ReportOrdersResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  total: number;
  page: number;
  totalPages: number;
  data: ReportOrderItem[];
}

// ====================================
// Report Products Types (Laporan Produk)
// ====================================

export interface ReportProductsParams {
  start_date: string;
  end_date: string;
}

// NOTE: ReportProductItem fields are guessed — adjust when actual response is known
export interface ReportProductItem {
  id: string;
  product_name: string;
  category: string;
  qty_sold: number;
  total_sales: number;
}

export interface ReportProductsResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  data: ReportProductItem[];
}

// ====================================
// Report Shifts Types (Laporan Shift)
// ====================================

export interface ReportShiftsParams {
  start_date: string;
  end_date: string;
  page?: number;
  limit?: number;
}

// NOTE: ReportShiftItem fields are guessed — adjust when actual response is known
export interface ReportShiftItem {
  id: string;
  cashier_name: string;
  opening_cash: number;
  closing_cash: number;
  total_sales: number;
  started_at: string;
  ended_at: string;
}

export interface ReportShiftsResponse {
  period: {
    start_date: string;
    end_date: string;
  };
  total: number;
  page: number;
  totalPages: number;
  data: ReportShiftItem[];
}
