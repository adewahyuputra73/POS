// Transaction / Order Types

export type OrderStatus = 
  | 'unpaid'        // Belum Dibayar
  | 'ready'         // Siap Diproses
  | 'shipped'       // Sudah Dikirim
  | 'completed'     // Selesai
  | 'failed';       // Gagal

export type PaymentMethod = 
  | 'cash'          // Tunai
  | 'qris'          // QRIS
  | 'transfer'      // Transfer
  | 'edc'           // EDC
  | 'ewallet'       // E-Wallet
  | 'gofood'        // GoFood
  | 'grabfood'      // GrabFood
  | 'shopeefood';   // ShopeeFood

export type FulfillmentType = 
  | 'dine_in'       // Makan di Tempat
  | 'takeaway'      // Bawa Pulang
  | 'delivery'      // Pesan Antar
  | 'gofood'        // GoFood
  | 'grabfood'      // GrabFood
  | 'grabexpress'   // GrabExpress
  | 'shopeefood'    // ShopeeFood
  | 'qr_order';     // Pesanan QR

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string | number;
  orderNumber: string;
  customerId?: number;
  customerName: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  orderDate: string;
  completedAt?: string;
  totalPrice: number;
  subtotal: number;
  discount: number;
  tax: number;
  serviceFee: number;
  shippingFee: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
  cashierName: string;
  shiftName?: string;
  courierName?: string;
  address?: string;
  customerNotes?: string;
  invoiceUrl?: string;
  deletedAt?: string;
  deletedBy?: string;
  deleteReason?: string;
}

// Filter Types
export interface TransactionFilters {
  search: string;
  status: OrderStatus | 'all';
  paymentMethod: PaymentMethod | 'all';
  fulfillmentType: FulfillmentType | 'all';
  dateFrom: string;
  dateTo: string;
}

// Label maps
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  unpaid: 'Belum Dibayar',
  ready: 'Siap Diproses',
  shipped: 'Sudah Dikirim',
  completed: 'Selesai',
  failed: 'Gagal',
};

export const ORDER_STATUS_VARIANT: Record<OrderStatus, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
  unpaid: 'warning',
  ready: 'info',
  shipped: 'primary',
  completed: 'success',
  failed: 'error',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Tunai',
  qris: 'QRIS',
  transfer: 'Transfer',
  edc: 'EDC',
  ewallet: 'E-Wallet',
  gofood: 'GoFood',
  grabfood: 'GrabFood',
  shopeefood: 'ShopeeFood',
};

export const FULFILLMENT_TYPE_LABELS: Record<FulfillmentType, string> = {
  dine_in: 'Makan di Tempat',
  takeaway: 'Bawa Pulang',
  delivery: 'Pesan Antar',
  gofood: 'GoFood',
  grabfood: 'GrabFood',
  grabexpress: 'GrabExpress',
  shopeefood: 'ShopeeFood',
  qr_order: 'Pesanan QR',
};
