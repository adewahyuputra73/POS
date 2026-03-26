import {
  Customer,
  CustomerDetail,
  CustomerFilters,
  CustomerSegment,
  Review,
  ReviewQuestion,
  ReviewFilters,
  Voucher,
  VoucherStatus,
  VoucherFilters,
  CoinCustomer,
  CoinApproval,
  CoinSettings,
  CoinFilters,
} from './types';

// ========================
// CUSTOMERS MOCK DATA
// ========================

export const mockCustomers: Customer[] = [
  {
    id: 'c001', store_id: 'store-1', order_id: 'ord-001', name: 'Budi Santoso', phone: '081234567890',
    email: 'budi.santoso@email.com', total_spent: '4250000.00', total_orders: 28,
    last_order_at: '2026-02-12T10:30:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-06-01T09:00:00Z', updatedAt: '2026-02-12T10:30:00Z', outlet_id: null,
  },
  {
    id: 'c002', store_id: 'store-1', order_id: 'ord-002', name: 'Siti Aminah', phone: '081298765432',
    email: null, total_spent: '3180000.00', total_orders: 22,
    last_order_at: '2026-02-11T14:00:00Z', whatsapp_opt_in: false, is_active: true,
    createdAt: '2025-07-15T10:00:00Z', updatedAt: '2026-02-11T14:00:00Z', outlet_id: null,
  },
  {
    id: 'c003', store_id: 'store-1', order_id: 'ord-003', name: 'Andi Wijaya', phone: '082112345678',
    email: null, total_spent: '1245000.00', total_orders: 8,
    last_order_at: '2026-02-05T18:00:00Z', whatsapp_opt_in: false, is_active: true,
    createdAt: '2025-09-10T11:00:00Z', updatedAt: '2026-02-05T18:00:00Z', outlet_id: null,
  },
  {
    id: 'c004', store_id: 'store-1', order_id: 'ord-004', name: 'Dewi Lestari', phone: '085678901234',
    email: 'dewi@email.com', total_spent: '780000.00', total_orders: 5,
    last_order_at: '2026-01-28T12:00:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-10-20T14:00:00Z', updatedAt: '2026-01-28T12:00:00Z', outlet_id: null,
  },
  {
    id: 'c005', store_id: 'store-1', order_id: null, name: 'Rizky Pratama', phone: '087812345678',
    email: null, total_spent: '320000.00', total_orders: 2,
    last_order_at: '2025-12-15T16:00:00Z', whatsapp_opt_in: false, is_active: true,
    createdAt: '2025-11-01T09:00:00Z', updatedAt: '2025-12-15T16:00:00Z', outlet_id: null,
  },
  {
    id: 'c006', store_id: 'store-1', order_id: 'ord-006', name: 'Nurul Hidayah', phone: '081345678901',
    email: 'nurul.h@email.com', total_spent: '5890000.00', total_orders: 35,
    last_order_at: '2026-02-13T09:00:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-04-15T08:00:00Z', updatedAt: '2026-02-13T09:00:00Z', outlet_id: null,
  },
  {
    id: 'c007', store_id: 'store-1', order_id: null, name: 'Ahmad Fauzi', phone: '082299887766',
    email: null, total_spent: '620000.00', total_orders: 4,
    last_order_at: '2026-02-02T20:00:00Z', whatsapp_opt_in: false, is_active: true,
    createdAt: '2025-12-05T13:00:00Z', updatedAt: '2026-02-02T20:00:00Z', outlet_id: null,
  },
  {
    id: 'c008', store_id: 'store-1', order_id: null, name: 'Putri Rahayu', phone: '085511223344',
    email: null, total_spent: '155000.00', total_orders: 1,
    last_order_at: '2025-11-20T11:00:00Z', whatsapp_opt_in: false, is_active: false,
    createdAt: '2025-11-20T11:00:00Z', updatedAt: '2025-11-20T11:00:00Z', outlet_id: null,
  },
  {
    id: 'c009', store_id: 'store-1', order_id: 'ord-009', name: 'Hendri Sutanto', phone: '081456789012',
    email: null, total_spent: '2750000.00', total_orders: 18,
    last_order_at: '2026-02-10T15:00:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-08-01T10:00:00Z', updatedAt: '2026-02-10T15:00:00Z', outlet_id: null,
  },
  {
    id: 'c010', store_id: 'store-1', order_id: null, name: 'Maya Sari', phone: '089912345678',
    email: 'maya@email.com', total_spent: '890000.00', total_orders: 6,
    last_order_at: '2026-01-25T17:00:00Z', whatsapp_opt_in: false, is_active: true,
    createdAt: '2025-10-10T12:00:00Z', updatedAt: '2026-01-25T17:00:00Z', outlet_id: null,
  },
  {
    id: 'c011', store_id: 'store-1', order_id: null, name: 'Joko Widodo', phone: '081567890123',
    email: null, total_spent: '475000.00', total_orders: 3,
    last_order_at: '2025-12-28T13:00:00Z', whatsapp_opt_in: false, is_active: true,
    createdAt: '2025-09-25T09:00:00Z', updatedAt: '2025-12-28T13:00:00Z', outlet_id: null,
  },
  {
    id: 'c012', store_id: 'store-1', order_id: 'ord-012', name: 'Ratna Dewi', phone: '082334556677',
    email: null, total_spent: '3950000.00', total_orders: 25,
    last_order_at: '2026-02-12T19:00:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-05-20T10:00:00Z', updatedAt: '2026-02-12T19:00:00Z', outlet_id: null,
  },
];

export const mockCustomerDetails: CustomerDetail[] = [
  {
    id: 'c001', store_id: 'store-1', order_id: 'ord-001', name: 'Budi Santoso', phone: '081234567890',
    email: 'budi.santoso@email.com', total_spent: '4250000.00', total_orders: 28,
    last_order_at: '2026-02-12T10:30:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-06-01T09:00:00Z', updatedAt: '2026-02-12T10:30:00Z', outlet_id: null,
    avg_rating: 4.5,
    recent_orders: [
      { id: 'o1', order_number: 'ORD-2026-0211-001', total_amount: '65000.00', fulfillment_status: 'completed', created_at: '2026-02-11T10:30:00Z' },
      { id: 'o2', order_number: 'ORD-2026-0209-003', total_amount: '82000.00', fulfillment_status: 'completed', created_at: '2026-02-09T18:00:00Z' },
      { id: 'o3', order_number: 'ORD-2026-0205-002', total_amount: '45000.00', fulfillment_status: 'cancelled', created_at: '2026-02-05T12:00:00Z' },
    ],
    reviews: [
      { id: 'r1', rating: 5, comment: 'Makanan selalu enak dan pelayanan ramah!', created_at: '2026-02-11T11:00:00Z' },
    ],
  },
  {
    id: 'c006', store_id: 'store-1', order_id: 'ord-006', name: 'Nurul Hidayah', phone: '081345678901',
    email: 'nurul.h@email.com', total_spent: '5890000.00', total_orders: 35,
    last_order_at: '2026-02-13T09:00:00Z', whatsapp_opt_in: true, is_active: true,
    createdAt: '2025-04-15T08:00:00Z', updatedAt: '2026-02-13T09:00:00Z', outlet_id: null,
    avg_rating: 4.8,
    recent_orders: [
      { id: 'o6', order_number: 'ORD-2026-0213-001', total_amount: '42000.00', fulfillment_status: 'completed', created_at: '2026-02-13T09:00:00Z' },
    ],
    reviews: [
      { id: 'r3', rating: 5, comment: 'Bubur ayamnya best di kota!', created_at: '2026-02-13T10:00:00Z' },
    ],
  },
];

// Segment config
export const segmentConfig: Record<CustomerSegment, { label: string; color: string; description: string }> = {
  hot: { label: 'Hot', color: 'bg-red-100 text-red-700', description: '≥ 3 transaksi dalam 30 hari' },
  warm: { label: 'Warm', color: 'bg-yellow-100 text-yellow-700', description: '1–2 transaksi dalam 30 hari' },
  boil: { label: 'Boil', color: 'bg-blue-100 text-blue-700', description: 'Tidak transaksi > 30 hari' },
};

export const monthOptions = [
  { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
  { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' },
];

// Filter function
export function filterCustomers(customers: Customer[], filters: CustomerFilters): Customer[] {
  return customers.filter((c) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
    }
    // Total spent
    const spent = parseFloat(c.total_spent);
    if (filters.totalSpent === 'gt' && filters.totalSpentMin !== undefined) {
      if (spent <= filters.totalSpentMin) return false;
    }
    if (filters.totalSpent === 'lt' && filters.totalSpentMax !== undefined) {
      if (spent >= filters.totalSpentMax) return false;
    }
    if (filters.totalSpent === 'between' && filters.totalSpentMin !== undefined && filters.totalSpentMax !== undefined) {
      if (spent < filters.totalSpentMin || spent > filters.totalSpentMax) return false;
    }
    // Last order
    if (filters.lastVisit !== 'all' && c.last_order_at) {
      const visitDate = new Date(c.last_order_at);
      const now = new Date();
      if (filters.lastVisit === 'today') {
        if (visitDate.toDateString() !== now.toDateString()) return false;
      } else if (filters.lastVisit === 'this_week') {
        const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
        if (visitDate < weekAgo) return false;
      } else if (filters.lastVisit === 'this_month') {
        if (visitDate.getMonth() !== now.getMonth() || visitDate.getFullYear() !== now.getFullYear()) return false;
      } else if (filters.lastVisit === 'before_date' && filters.lastVisitDateEnd) {
        if (visitDate > new Date(filters.lastVisitDateEnd)) return false;
      } else if (filters.lastVisit === 'after_date' && filters.lastVisitDateStart) {
        if (visitDate < new Date(filters.lastVisitDateStart)) return false;
      }
    }
    return true;
  });
}

export function getCustomerDetail(id: string): CustomerDetail | undefined {
  return mockCustomerDetails.find(d => d.id === id);
}

// ========================
// REVIEWS MOCK DATA
// ========================

export const mockReviews: Review[] = [
  {
    id: '1', customerId: '1', customerName: 'Budi Santoso', customerPhone: '081234567890',
    orderId: 'ORD-2026-0211-001', orderDate: '2026-02-11T10:30:00Z',
    rating: 5, comment: 'Makanan selalu enak dan pelayanan ramah!', is_visible: true,
    products: ['Nasi Goreng Spesial', 'Es Teh Manis'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 5 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 5 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 4 },
    ],
    createdAt: '2026-02-11T11:00:00Z',
  },
  {
    id: '2', customerId: '1', customerName: 'Budi Santoso', customerPhone: '081234567890',
    orderId: 'ORD-2026-0201-004', orderDate: '2026-02-01T19:30:00Z',
    rating: 4, comment: 'Porsinya banyak, tapi agak lama datangnya', is_visible: true,
    products: ['Paket Keluarga A', 'Es Campur'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 3 },
    ],
    createdAt: '2026-02-01T20:00:00Z',
  },
  {
    id: '3', customerId: '6', customerName: 'Nurul Hidayah', customerPhone: '081345678901',
    orderId: 'ORD-2026-0213-001', orderDate: '2026-02-13T09:00:00Z',
    rating: 5, comment: 'Bubur ayamnya best di kota! Pasti balik lagi.', is_visible: true,
    products: ['Bubur Ayam', 'Kopi Hitam'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 5 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 5 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 5 },
    ],
    createdAt: '2026-02-13T10:00:00Z',
  },
  {
    id: '4', customerId: '2', customerName: 'Siti Aminah', customerPhone: '081298765432',
    orderId: 'ORD-2026-0210-002', orderDate: '2026-02-10T12:00:00Z',
    rating: 3, comment: 'Makanan lumayan, tapi suasana agak berisik', is_visible: true,
    products: ['Soto Betawi', 'Nasi Uduk'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 3 },
    ],
    createdAt: '2026-02-10T13:00:00Z',
  },
  {
    id: '5', customerId: '3', customerName: 'Andi Wijaya', customerPhone: '082112345678',
    orderId: 'ORD-2026-0205-001', orderDate: '2026-02-05T18:00:00Z',
    rating: 4, comment: 'Enak, harga terjangkau', is_visible: true,
    products: ['Ayam Bakar', 'Sambal Matah', 'Es Kelapa'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 4 },
    ],
    createdAt: '2026-02-05T19:00:00Z',
  },
  {
    id: '6', customerId: '12', customerName: 'Ratna Dewi', customerPhone: '082334556677',
    orderId: 'ORD-2026-0212-003', orderDate: '2026-02-12T19:00:00Z',
    rating: 5, comment: 'Luar biasa! Menu baru sangat recommended.', is_visible: true,
    products: ['Lobster Roll Special', 'Matcha Latte'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 5 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 5 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 5 },
    ],
    createdAt: '2026-02-12T20:00:00Z',
  },
  {
    id: '7', customerId: '9', customerName: 'Hendri Sutanto', customerPhone: '081456789012',
    orderId: 'ORD-2026-0209-005', orderDate: '2026-02-09T15:00:00Z',
    rating: 2, comment: 'Pesanan salah dan lama sekali. Kecewa.', is_visible: true,
    products: ['Nasi Campur'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 3 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 1 },
    ],
    createdAt: '2026-02-09T16:00:00Z',
  },
  {
    id: '8', customerId: '10', customerName: 'Maya Sari', customerPhone: '089912345678',
    orderId: 'ORD-2026-0125-001', orderDate: '2026-01-25T17:00:00Z',
    rating: 4, comment: 'Tempatnya nyaman, cocok buat kerja.', is_visible: true,
    products: ['Cappuccino', 'Cheese Cake'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 4 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 5 },
    ],
    createdAt: '2026-01-25T18:00:00Z',
  },
];

export const mockReviewQuestions: ReviewQuestion[] = [
  { id: 1, questionText: 'Bagaimana rasa makanan kami?', isActive: true, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 2, questionText: 'Bagaimana pelayanan kami?', isActive: true, createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 3, questionText: 'Bagaimana pengalaman order?', isActive: true, createdAt: '2025-03-15T00:00:00Z', updatedAt: '2025-03-15T00:00:00Z' },
  { id: 4, questionText: 'Apakah harga sesuai kualitas?', isActive: false, createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-08-20T00:00:00Z' },
];

export function filterReviews(reviews: Review[], filters: ReviewFilters): Review[] {
  return reviews.filter((r) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !r.customerName.toLowerCase().includes(q) &&
        !r.orderId.toLowerCase().includes(q) &&
        !r.comment.toLowerCase().includes(q)
      ) return false;
    }
    if (filters.ratingMin !== null && r.rating < filters.ratingMin) return false;
    if (filters.ratingMax !== null && r.rating > filters.ratingMax) return false;
    return true;
  });
}

export function getReviewStats(reviews: Review[]) {
  if (reviews.length === 0) return { avgRating: 0, totalReviews: 0, ratingDistribution: [0, 0, 0, 0, 0] };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const dist = [0, 0, 0, 0, 0]; // index 0 = 1★, index 4 = 5★
  reviews.forEach(r => dist[r.rating - 1]++);
  return { avgRating: Math.round(avg * 10) / 10, totalReviews: reviews.length, ratingDistribution: dist };
}

// ========================
// VOUCHER MOCK DATA
// ========================

export const mockVouchers: Voucher[] = [
  {
    id: 1, code: 'HEMAT20', type: 'produk', description: 'Diskon 20% semua produk',
    discountType: 'percent', discountValue: 20, budgetPerTransaction: 50000,
    quotaTotal: 100, quotaUsed: 45, isStackable: false,
    productScope: 'all', selectedProductIds: [],
    minOrder: 100000, specificDelivery: null, specificPayment: null, specificCustomerSegment: null,
    startDate: '2026-02-01T00:00:00Z', endDate: '2026-03-01T23:59:59Z',
    status: 'active', createdAt: '2026-01-25T10:00:00Z',
  },
  {
    id: 2, code: 'FREEONGKIR', type: 'ongkir', description: 'Gratis ongkir min. Rp75.000',
    discountType: 'fixed', discountValue: 15000, budgetPerTransaction: null,
    quotaTotal: 200, quotaUsed: 87, isStackable: true,
    productScope: 'all', selectedProductIds: [],
    minOrder: 75000, specificDelivery: ['GoSend', 'GrabExpress'], specificPayment: null, specificCustomerSegment: null,
    startDate: '2026-02-01T00:00:00Z', endDate: '2026-02-28T23:59:59Z',
    status: 'active', createdAt: '2026-01-28T14:00:00Z',
  },
  {
    id: 3, code: 'VIP30', type: 'produk', description: 'Diskon 30% khusus pelanggan Hot',
    discountType: 'percent', discountValue: 30, budgetPerTransaction: 75000,
    quotaTotal: 50, quotaUsed: 12, isStackable: false,
    productScope: 'all', selectedProductIds: [],
    minOrder: 150000, specificDelivery: null, specificPayment: null, specificCustomerSegment: ['hot'],
    startDate: '2026-02-10T00:00:00Z', endDate: '2026-02-28T23:59:59Z',
    status: 'active', createdAt: '2026-02-05T09:00:00Z',
  },
  {
    id: 4, code: 'KOPI10K', type: 'produk', description: 'Potongan Rp10.000 menu kopi',
    discountType: 'fixed', discountValue: 10000, budgetPerTransaction: null,
    quotaTotal: 300, quotaUsed: 300, isStackable: false,
    productScope: 'selected', selectedProductIds: [1, 5, 8, 12],
    minOrder: null, specificDelivery: null, specificPayment: null, specificCustomerSegment: null,
    startDate: '2026-01-15T00:00:00Z', endDate: '2026-02-15T23:59:59Z',
    status: 'ended', createdAt: '2026-01-10T11:00:00Z',
  },
  {
    id: 5, code: 'OPENING50', type: 'produk', description: 'Grand Opening 50% OFF',
    discountType: 'percent', discountValue: 50, budgetPerTransaction: 100000,
    quotaTotal: 500, quotaUsed: 500, isStackable: false,
    productScope: 'all', selectedProductIds: [],
    minOrder: null, specificDelivery: null, specificPayment: null, specificCustomerSegment: null,
    startDate: '2025-12-01T00:00:00Z', endDate: '2025-12-31T23:59:59Z',
    status: 'ended', createdAt: '2025-11-25T10:00:00Z',
  },
  {
    id: 6, code: 'RAMADAN25', type: 'produk', description: 'Diskon Ramadan 25%',
    discountType: 'percent', discountValue: 25, budgetPerTransaction: 60000,
    quotaTotal: 200, quotaUsed: 0, isStackable: true,
    productScope: 'all', selectedProductIds: [],
    minOrder: 80000, specificDelivery: null, specificPayment: ['QRIS', 'E-Wallet'], specificCustomerSegment: null,
    startDate: '2026-03-01T00:00:00Z', endDate: '2026-03-31T23:59:59Z',
    status: 'upcoming', createdAt: '2026-02-10T08:00:00Z',
  },
  {
    id: 7, code: 'PAYDAY15', type: 'produk', description: 'Payday Sale 15% OFF',
    discountType: 'percent', discountValue: 15, budgetPerTransaction: 40000,
    quotaTotal: 150, quotaUsed: 0, isStackable: false,
    productScope: 'all', selectedProductIds: [],
    minOrder: 50000, specificDelivery: null, specificPayment: null, specificCustomerSegment: null,
    startDate: '2026-02-25T00:00:00Z', endDate: '2026-02-28T23:59:59Z',
    status: 'upcoming', createdAt: '2026-02-12T15:00:00Z',
  },
  {
    id: 8, code: 'QRIS5K', type: 'produk', description: 'Cashback Rp5.000 bayar QRIS',
    discountType: 'fixed', discountValue: 5000, budgetPerTransaction: null,
    quotaTotal: null, quotaUsed: 234, isStackable: true,
    productScope: 'all', selectedProductIds: [],
    minOrder: 30000, specificDelivery: null, specificPayment: ['QRIS'], specificCustomerSegment: null,
    startDate: '2026-01-01T00:00:00Z', endDate: '2026-06-30T23:59:59Z',
    status: 'active', createdAt: '2025-12-20T10:00:00Z',
  },
];

export function getVoucherStatus(v: Pick<Voucher, 'startDate' | 'endDate' | 'quotaTotal' | 'quotaUsed'>): VoucherStatus {
  const now = new Date();
  const start = new Date(v.startDate);
  const end = new Date(v.endDate);
  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  if (v.quotaTotal !== null && v.quotaUsed >= v.quotaTotal) return 'ended';
  return 'active';
}

export function filterVouchers(vouchers: Voucher[], filters: VoucherFilters): Voucher[] {
  return vouchers.filter((v) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!v.code.toLowerCase().includes(q) && !v.description.toLowerCase().includes(q)) return false;
    }
    if (filters.status !== 'all' && v.status !== filters.status) return false;
    return true;
  });
}

export function getVoucherStats(vouchers: Voucher[]) {
  return {
    total: vouchers.length,
    active: vouchers.filter(v => v.status === 'active').length,
    upcoming: vouchers.filter(v => v.status === 'upcoming').length,
    ended: vouchers.filter(v => v.status === 'ended').length,
  };
}

// ========================
// KOIN MOCK DATA
// ========================

export const coinSettings: CoinSettings = {
  conversionRate: 100, // 1 coin = Rp100
  approvalRequired: true,
};

export const mockCoinCustomers: CoinCustomer[] = [
  { id: 1, name: 'Budi Santoso', phone: '081234567890', totalCoins: 1200, coinValue: 120000 },
  { id: 2, name: 'Siti Aminah', phone: '081298765432', totalCoins: 980, coinValue: 98000 },
  { id: 3, name: 'Andi Wijaya', phone: '082112345678', totalCoins: 450, coinValue: 45000 },
  { id: 4, name: 'Dewi Lestari', phone: '085678901234', totalCoins: 200, coinValue: 20000 },
  { id: 5, name: 'Rizky Pratama', phone: '087812345678', totalCoins: 50, coinValue: 5000 },
  { id: 6, name: 'Nurul Hidayah', phone: '081345678901', totalCoins: 2100, coinValue: 210000 },
  { id: 7, name: 'Ahmad Fauzi', phone: '082299887766', totalCoins: 180, coinValue: 18000 },
  { id: 8, name: 'Putri Rahayu', phone: '085511223344', totalCoins: 0, coinValue: 0 },
  { id: 9, name: 'Hendri Sutanto', phone: '081456789012', totalCoins: 850, coinValue: 85000 },
  { id: 10, name: 'Maya Sari', phone: '089912345678', totalCoins: 300, coinValue: 30000 },
  { id: 11, name: 'Joko Widodo', phone: '081567890123', totalCoins: 100, coinValue: 10000 },
  { id: 12, name: 'Ratna Dewi', phone: '082334556677', totalCoins: 1500, coinValue: 150000 },
];

export const mockCoinApprovals: CoinApproval[] = [
  {
    id: 1, customerId: 3, customerName: 'Andi Wijaya', customerPhone: '082112345678',
    type: 'adjust', amount: 500, direction: 'credit', status: 'pending',
    requestedBy: 'Admin Kasir', approvedBy: null, createdAt: '2026-02-13T10:00:00Z', approvedAt: null,
  },
  {
    id: 2, customerId: 1, customerName: 'Budi Santoso', customerPhone: '081234567890',
    type: 'transfer', amount: 200, direction: 'debit', status: 'pending',
    requestedBy: 'Admin Kasir', approvedBy: null, createdAt: '2026-02-13T11:00:00Z', approvedAt: null,
    recipientId: 6, recipientName: 'Nurul Hidayah', recipientPhone: '081345678901',
  },
  {
    id: 3, customerId: 12, customerName: 'Ratna Dewi', customerPhone: '082334556677',
    type: 'adjust', amount: 100, direction: 'debit', status: 'pending',
    requestedBy: 'Manager', approvedBy: null, createdAt: '2026-02-12T16:00:00Z', approvedAt: null,
  },
  {
    id: 4, customerId: 9, customerName: 'Hendri Sutanto', customerPhone: '081456789012',
    type: 'adjust', amount: 300, direction: 'credit', status: 'approved',
    requestedBy: 'Admin Kasir', approvedBy: 'Manager', createdAt: '2026-02-11T09:00:00Z', approvedAt: '2026-02-11T14:00:00Z',
  },
];

export function filterCoinCustomers(customers: CoinCustomer[], filters: CoinFilters): CoinCustomer[] {
  return customers.filter((c) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
    }
    return true;
  });
}

