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
