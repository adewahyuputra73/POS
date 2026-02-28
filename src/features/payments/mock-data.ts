import {
  PaymentRecord,
  PaymentMethodSummary,
  CashRegisterLog,
  PaymentFilters,
  PaymentMethodType,
} from './types';

// ============================================================
// Mock Payment Records
// ============================================================

export const mockPayments: PaymentRecord[] = [
  {
    id: 1,
    orderNumber: 'INV-20260228-001',
    customerName: 'John Doe',
    customerPhone: '081234567890',
    paymentMethod: 'cash',
    amount: 250000,
    status: 'success',
    paidAt: '2026-02-28T08:45:00Z',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 2,
    orderNumber: 'INV-20260228-002',
    customerName: 'Jane Smith',
    customerPhone: '081298765432',
    paymentMethod: 'qris',
    amount: 180000,
    status: 'success',
    paidAt: '2026-02-28T10:00:00Z',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 3,
    orderNumber: 'INV-20260228-003',
    customerName: 'Bob Wilson',
    customerPhone: '081377889900',
    paymentMethod: 'transfer',
    amount: 320000,
    status: 'pending',
    paidAt: '2026-02-28T10:15:00Z',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 4,
    orderNumber: 'INV-20260228-004',
    customerName: 'Alice Brown',
    customerPhone: '081244556677',
    paymentMethod: 'ewallet',
    amount: 95000,
    status: 'success',
    paidAt: '2026-02-28T11:20:00Z',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 5,
    orderNumber: 'INV-20260228-005',
    customerName: 'Charlie Davis',
    customerPhone: '081211223344',
    paymentMethod: 'gofood',
    amount: 450000,
    status: 'success',
    paidAt: '2026-02-28T12:10:00Z',
    cashierName: 'Ani',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 6,
    orderNumber: 'INV-20260228-006',
    customerName: 'Diana Lee',
    customerPhone: '081299887766',
    paymentMethod: 'cash',
    amount: 125000,
    status: 'pending',
    paidAt: '2026-02-28T12:00:00Z',
    cashierName: 'Budi',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 7,
    orderNumber: 'INV-20260228-007',
    customerName: 'Edward Kim',
    customerPhone: '081266778899',
    paymentMethod: 'grabfood',
    amount: 275000,
    status: 'success',
    paidAt: '2026-02-28T13:20:00Z',
    cashierName: 'Ani',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 8,
    orderNumber: 'INV-20260228-008',
    customerName: 'Fiona Wang',
    customerPhone: '081233445566',
    paymentMethod: 'edc',
    amount: 75000,
    status: 'success',
    paidAt: '2026-02-28T13:15:00Z',
    cashierName: 'Budi',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 9,
    orderNumber: 'INV-20260227-009',
    customerName: 'George Chen',
    customerPhone: '081288990011',
    paymentMethod: 'transfer',
    amount: 560000,
    status: 'failed',
    paidAt: '2026-02-27T14:00:00Z',
    cashierName: 'Ani',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
    notes: 'Pembayaran gagal - timeout',
  },
  {
    id: 10,
    orderNumber: 'INV-20260227-010',
    customerName: 'Hana Sato',
    customerPhone: '081277665544',
    paymentMethod: 'qris',
    amount: 195000,
    status: 'success',
    paidAt: '2026-02-27T16:00:00Z',
    cashierName: 'Budi',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 11,
    orderNumber: 'INV-20260227-011',
    customerName: 'Ivan Park',
    customerPhone: '081255443322',
    paymentMethod: 'shopeefood',
    amount: 350000,
    status: 'success',
    paidAt: '2026-02-27T17:10:00Z',
    cashierName: 'Ani',
    shiftName: 'Sore',
    outletName: 'Toko Utama',
  },
  {
    id: 12,
    orderNumber: 'INV-20260226-012',
    customerName: 'Julia Tan',
    customerPhone: '081200112233',
    paymentMethod: 'cash',
    amount: 155000,
    status: 'success',
    paidAt: '2026-02-26T09:40:00Z',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 13,
    orderNumber: 'INV-20260226-013',
    customerName: 'Kevin Lim',
    customerPhone: '081244332211',
    paymentMethod: 'qris',
    amount: 85000,
    status: 'success',
    paidAt: '2026-02-26T10:50:00Z',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 14,
    orderNumber: 'INV-20260226-014',
    customerName: 'Linda Ng',
    customerPhone: '081288776655',
    paymentMethod: 'edc',
    amount: 420000,
    status: 'success',
    paidAt: '2026-02-26T12:55:00Z',
    cashierName: 'Budi',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 15,
    orderNumber: 'INV-20260226-015',
    customerName: 'Michael Zhang',
    customerPhone: '081222334455',
    paymentMethod: 'transfer',
    amount: 230000,
    status: 'success',
    paidAt: '2026-02-26T14:45:00Z',
    cashierName: 'Ani',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
  {
    id: 16,
    orderNumber: 'INV-20260225-016',
    customerName: 'Nancy Wu',
    customerPhone: '081211009988',
    paymentMethod: 'cash',
    amount: 340000,
    status: 'success',
    paidAt: '2026-02-25T10:30:00Z',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
  },
  {
    id: 17,
    orderNumber: 'INV-20260225-017',
    customerName: 'Oliver Ho',
    customerPhone: '081233221100',
    paymentMethod: 'ewallet',
    amount: 190000,
    status: 'refunded',
    paidAt: '2026-02-25T11:15:00Z',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    outletName: 'Toko Utama',
    notes: 'Refund - pesanan salah',
  },
  {
    id: 18,
    orderNumber: 'INV-20260225-018',
    customerName: 'Patricia Lee',
    customerPhone: '081244005566',
    paymentMethod: 'qris',
    amount: 275000,
    status: 'success',
    paidAt: '2026-02-25T13:00:00Z',
    cashierName: 'Budi',
    shiftName: 'Siang',
    outletName: 'Toko Utama',
  },
];

// ============================================================
// Mock Cash Register Logs
// ============================================================

export const mockCashRegisterLogs: CashRegisterLog[] = [
  {
    id: 1,
    outletName: 'Toko Utama',
    actionType: 'open',
    timestamp: '2026-02-28T07:00:00Z',
    paymentMethod: 'cash',
    totalAmount: 500000,
    description: 'Modal awal kasir pagi',
    cashierName: 'Ani',
  },
  {
    id: 2,
    outletName: 'Toko Utama',
    actionType: 'change',
    timestamp: '2026-02-28T12:00:00Z',
    paymentMethod: 'cash',
    totalAmount: 1250000,
    description: 'Ganti shift pagi ke siang',
    cashierName: 'Budi',
  },
  {
    id: 3,
    outletName: 'Toko Utama',
    actionType: 'open',
    timestamp: '2026-02-27T07:00:00Z',
    paymentMethod: 'cash',
    totalAmount: 500000,
    description: 'Modal awal kasir pagi',
    cashierName: 'Budi',
  },
  {
    id: 4,
    outletName: 'Toko Utama',
    actionType: 'change',
    timestamp: '2026-02-27T12:00:00Z',
    paymentMethod: 'cash',
    totalAmount: 980000,
    description: 'Ganti shift pagi ke siang',
    cashierName: 'Ani',
  },
  {
    id: 5,
    outletName: 'Toko Utama',
    actionType: 'change',
    timestamp: '2026-02-27T17:00:00Z',
    paymentMethod: 'cash',
    totalAmount: 2150000,
    description: 'Ganti shift siang ke sore',
    cashierName: 'Ani',
  },
];

// ============================================================
// Filter Functions
// ============================================================

export function filterPayments(
  payments: PaymentRecord[],
  filters: PaymentFilters
): PaymentRecord[] {
  return payments.filter((payment) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        payment.customerName.toLowerCase().includes(q) ||
        payment.customerPhone.includes(q) ||
        payment.orderNumber.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Payment Method
    if (filters.paymentMethod !== 'all' && payment.paymentMethod !== filters.paymentMethod)
      return false;

    // Status
    if (filters.status !== 'all' && payment.status !== filters.status) return false;

    // Date range
    if (filters.dateFrom) {
      const paidDate = new Date(payment.paidAt).toISOString().split('T')[0];
      if (paidDate < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      const paidDate = new Date(payment.paidAt).toISOString().split('T')[0];
      if (paidDate > filters.dateTo) return false;
    }

    return true;
  });
}

// ============================================================
// Stats Helpers
// ============================================================

export function getPaymentMethodSummary(payments: PaymentRecord[]): PaymentMethodSummary[] {
  const successPayments = payments.filter((p) => p.status === 'success');
  const totalAmount = successPayments.reduce((sum, p) => sum + p.amount, 0);

  const methods: PaymentMethodType[] = [
    'cash', 'qris', 'transfer', 'edc', 'ewallet', 'gofood', 'grabfood', 'shopeefood',
  ];

  return methods
    .map((method) => {
      const methodPayments = successPayments.filter((p) => p.paymentMethod === method);
      const methodTotal = methodPayments.reduce((sum, p) => sum + p.amount, 0);
      return {
        method,
        totalOrders: methodPayments.length,
        totalAmount: methodTotal,
        percentage: totalAmount > 0 ? (methodTotal / totalAmount) * 100 : 0,
      };
    })
    .sort((a, b) => b.totalAmount - a.totalAmount);
}

export function getPaymentStats(payments: PaymentRecord[]) {
  const totalPayments = payments.length;
  const successPayments = payments.filter((p) => p.status === 'success');
  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const failedPayments = payments.filter((p) => p.status === 'failed');
  const refundedPayments = payments.filter((p) => p.status === 'refunded');

  const totalRevenue = successPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalRefunded = refundedPayments.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalPayments,
    totalRevenue,
    totalPending,
    totalRefunded,
    successCount: successPayments.length,
    pendingCount: pendingPayments.length,
    failedCount: failedPayments.length,
    refundedCount: refundedPayments.length,
  };
}
