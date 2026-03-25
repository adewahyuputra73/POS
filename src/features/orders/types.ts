export type OrderType = "DINE_IN" | "TAKEAWAY";

export type PaymentMethod = "CASH" | "TRANSFER" | "QRIS";

export interface OrderItem {
  product_id: string;
  qty: number;
  notes?: string;
}

export interface CheckoutPayment {
  method: PaymentMethod;
  amount?: number;
}

export interface CheckoutRequest {
  order_type: OrderType;
  table_number?: string;
  items: OrderItem[];
  voucher_code?: string;
  payments?: CheckoutPayment[];
  customer_name?: string;
  customer_phone?: string;
}

export type FulfillmentStatus = "PROCESSING" | "READY" | "DELIVERED" | "COMPLETED" | "CANCELLED";

export interface UpdateOrderStatusRequest {
  fulfillment_status: FulfillmentStatus;
}

export interface VoidOrderRequest {
  reason: string;
}

export interface PayOrderRequest {
  payment_method: PaymentMethod;
  cash_given?: number;
}

export interface OrderSummaryCards {
  belum_dibayar: { count: number; potensi: number };
  siap_diproses: { count: number; potensi: number };
  dalam_pengiriman: { count: number; potensi: number };
  selesai_3hari: { count: number; total: number };
}

export interface OrderListParams {
  page?: number;
  limit?: number;
}

export interface Order {
  id: string;
  order_number?: string;
  order_type: OrderType;
  table_id?: string | null;
  table_number?: string | null;
  items: OrderItem[];
  total?: number;
  total_amount?: string;
  status?: string;
  payment_status?: string;
  fulfillment_status?: string;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  customer?: { name: string; phone: string } | null;
  payments?: { payment_method: string; amount: string; is_cash: boolean }[];
}
