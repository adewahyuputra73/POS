export type OrderType = "DINE_IN" | "TAKEAWAY";

export interface OrderItem {
  product_id: string;
  qty: number;
}

export interface CheckoutRequest {
  order_type: OrderType;
  table_id: string | null;
  items: OrderItem[];
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
