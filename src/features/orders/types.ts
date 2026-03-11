export type OrderType = "DINE_IN" | "TAKEAWAY";

export type PaymentMethod = "CASH" | "TRANSFER" | "QRIS";

export interface OrderItem {
  product_id: string;
  qty: number;
  notes?: string;
}

export interface CheckoutRequest {
  order_type: OrderType;
  table_id?: string;
  items: OrderItem[];
  voucher_code?: string;
  payment_method?: PaymentMethod;
  cash_given?: number;
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

// NOTE: OrderSummaryCards fields are guessed — adjust when actual response is known
export interface OrderSummaryCards {
  totalOrders: number;
  totalRevenue: number;
  totalPaid: number;
  totalUnpaid: number;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
}

export interface Order {
  id: string;
  order_type: OrderType;
  table_id: string | null;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
}
