// Customer Types
export type CustomerSegment = 'hot' | 'warm' | 'boil';

export interface Customer {
  id: string;
  store_id: string;
  order_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  total_spent: string;
  total_orders: number;
  last_order_at: string;
  whatsapp_opt_in: boolean;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  outlet_id: string | null;
}

export interface CustomerListResponse {
  total: number;
  page: number;
  totalPages: number;
  data: Customer[];
}

// CONFIRMED from GET /customers/:id
export interface CustomerRecentOrder {
  id: string;
  order_number: string;
  total_amount: string;
  fulfillment_status: string;
  created_at: string;
}

// NOTE: CustomerDetailReview fields are guessed — adjust when actual response is known
export interface CustomerDetailReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CustomerDetail extends Customer {
  recent_orders: CustomerRecentOrder[];
  reviews: CustomerDetailReview[];
  avg_rating: number | null;
}

// Customer Filters
export type LastVisitFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'before_date' | 'after_date' | 'between';
export type TotalSpentFilter = 'all' | 'gt' | 'lt' | 'between';

export interface CustomerFilters {
  search: string;
  segment: CustomerSegment | 'all';
  lastVisit: LastVisitFilter;
  lastVisitDateStart?: string;
  lastVisitDateEnd?: string;
  birthdayMonth: number | null; // 1-12 or null
  totalSpent: TotalSpentFilter;
  totalSpentMin?: number;
  totalSpentMax?: number;
  productId: number | null;
}

// Bulk Message Types
// CONFIRMED from GET /customers/bulk-targets
export interface BulkTarget {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  total_spent: string;
  total_orders: number;
  last_order_at: string;
}

export interface BulkTargetResponse {
  total: number;
  data: BulkTarget[];
}

export interface SendBulkMessageRequest {
  customer_ids: string[];
  message: string;
  channel: string;
}

// Review API Types
export interface CreateReviewRequest {
  rating: number;
  comment: string;
  order_id: string;
}

export interface ReviewListParams {
  min_rating?: number;
  max_rating?: number;
}

// Review Types
export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
  orderDate: string;
  rating: number; // 1-5
  comment: string;
  is_visible: boolean;
  products: string[];
  questionAnswers: ReviewAnswer[];
  createdAt: string;
}

export interface ReviewQuestion {
  id: number;
  questionText: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAnswer {
  questionId: number;
  questionText: string;
  ratingValue: number; // 1-5
}

export interface ReviewFilters {
  search: string;
  ratingMin: number | null;
  ratingMax: number | null;
  dateRange?: { start: string; end: string };
}

// ==========================================
// Voucher Types (PRD v6 D.3)
// ==========================================

export type VoucherType = 'produk' | 'ongkir';
export type VoucherStatus = 'upcoming' | 'active' | 'ended';
export type DiscountType = 'percent' | 'fixed';
export type ProductScope = 'all' | 'selected';

export interface Voucher {
  id: number;
  code: string;
  type: VoucherType;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  budgetPerTransaction: number | null;
  quotaTotal: number | null;
  quotaUsed: number;
  isStackable: boolean;
  productScope: ProductScope;
  selectedProductIds: number[];
  // Criteria
  minOrder: number | null;
  specificDelivery: string[] | null;
  specificPayment: string[] | null;
  specificCustomerSegment: CustomerSegment[] | null;
  // Duration
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  // Computed
  status: VoucherStatus;
  createdAt: string;
}

export interface VoucherFormData {
  code: string;
  type: VoucherType;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  budgetPerTransaction: number | null;
  quotaTotal: number | null;
  isStackable: boolean;
  productScope: ProductScope;
  selectedProductIds: number[];
  minOrder: number | null;
  specificDelivery: string[] | null;
  specificPayment: string[] | null;
  specificCustomerSegment: CustomerSegment[] | null;
  startDate: string;
  endDate: string;
}

export interface VoucherFilters {
  search: string;
  status: VoucherStatus | 'all';
}

// ==========================================
// Koin Types (PRD v6 D.4)
// ==========================================

export interface CoinCustomer {
  id: number;
  name: string;
  phone: string;
  totalCoins: number;
  coinValue: number; // totalCoins × conversionRate
}

export type CoinTransactionType = 'adjust' | 'transfer' | 'earn' | 'redeem';
export type CoinDirection = 'credit' | 'debit';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface CoinTransaction {
  id: number;
  customerId: number;
  customerName: string;
  type: CoinTransactionType;
  direction: CoinDirection;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  createdBy: string;
  createdAt: string;
}

export interface CoinApproval {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  type: 'adjust' | 'transfer';
  amount: number;
  direction: CoinDirection;
  status: ApprovalStatus;
  requestedBy: string;
  approvedBy: string | null;
  createdAt: string;
  approvedAt: string | null;
  // Transfer-specific
  recipientId?: number;
  recipientName?: string;
  recipientPhone?: string;
}

export interface CoinSettings {
  conversionRate: number; // 1 coin = X rupiah
  approvalRequired: boolean;
}

export interface CoinFilters {
  search: string;
}
