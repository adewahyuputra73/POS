// Payment Types

export type PaymentMethodType =
  | 'cash'
  | 'qris'
  | 'transfer'
  | 'edc'
  | 'ewallet'
  | 'gofood'
  | 'grabfood'
  | 'shopeefood';

export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export type CashierAction = 'open' | 'change'; // Buka Kasir / Ganti Kasir

export interface PaymentRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethodType;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
  cashierName: string;
  shiftName?: string;
  outletName: string;
  notes?: string;
}

export interface PaymentMethodSummary {
  method: PaymentMethodType;
  totalOrders: number;
  totalAmount: number;
  percentage: number;
}

export interface CashRegisterLog {
  id: number;
  outletName: string;
  actionType: CashierAction;
  timestamp: string;
  paymentMethod: PaymentMethodType;
  totalAmount: number;
  description?: string;
  cashierName: string;
}

export interface PaymentFilters {
  search: string;
  paymentMethod: PaymentMethodType | 'all';
  status: PaymentStatus | 'all';
  dateFrom: string;
  dateTo: string;
}

// Label maps
export const PAYMENT_METHOD_LABELS: Record<PaymentMethodType, string> = {
  cash: 'Tunai',
  qris: 'QRIS',
  transfer: 'Transfer',
  edc: 'EDC',
  ewallet: 'E-Wallet',
  gofood: 'GoFood',
  grabfood: 'GrabFood',
  shopeefood: 'ShopeeFood',
};

export const PAYMENT_METHOD_ICONS: Record<PaymentMethodType, string> = {
  cash: '💵',
  qris: '📱',
  transfer: '🏦',
  edc: '💳',
  ewallet: '📲',
  gofood: '🟢',
  grabfood: '🟩',
  shopeefood: '🟠',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  success: 'Berhasil',
  pending: 'Menunggu',
  failed: 'Gagal',
  refunded: 'Refund',
};

export const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, 'success' | 'warning' | 'error' | 'info'> = {
  success: 'success',
  pending: 'warning',
  failed: 'error',
  refunded: 'info',
};

export const CASHIER_ACTION_LABELS: Record<CashierAction, string> = {
  open: 'Buka Kasir',
  change: 'Ganti Kasir',
};
