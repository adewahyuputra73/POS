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

export interface ReportOrderPayment {
  id: string;
  order_id: string;
  payment_method: string;
  amount: string;
  change: string;
  is_cash: boolean;
  createdAt: string;
  updatedAt: string;
  invoice_id: string | null;
}

export interface ReportOrderItem {
  id: string;
  store_id: string;
  order_number: string;
  order_type: string;
  customer_id: string | null;
  table_number: string | null;
  fulfillment_status: string;
  payment_status: string;
  source: string;
  subtotal: string;
  delivery_fee: string;
  service_fee: string;
  rounding: string;
  tax: string;
  discount: string;
  total_amount: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  payments: ReportOrderPayment[];
  kasirDetail: unknown | null;
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

export interface ReportProductItem {
  product_id: string;
  name: string;
  sku: string | null;
  category: string;
  price: number;
  total_qty: number;
  total_orders: number;
  total_revenue: number;
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

export interface ReportShiftItem {
  id: string;
  shift_number: number;
  cashier: string;
  start_time: string;
  end_time: string | null;
  status: string;
  opening_cash: number;
  closing_cash: number;
  cash_deposited: number;
  total_orders: number;
  total_sales: number;
  cash_sales: number;
  non_cash_sales: number;
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
