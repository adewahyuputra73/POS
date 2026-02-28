import {
  Order,
  OrderStatus,
  PaymentMethod,
  FulfillmentType,
  TransactionFilters,
} from './types';

// ============================================================
// Mock Orders
// ============================================================

export const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'INV-20260228-001',
    customerId: 1,
    customerName: 'John Doe',
    customerPhone: '081234567890',
    fulfillmentType: 'dine_in',
    orderDate: '2026-02-28T08:15:00Z',
    completedAt: '2026-02-28T08:45:00Z',
    totalPrice: 250000,
    subtotal: 265000,
    discount: 20000,
    tax: 5000,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'cash',
    status: 'completed',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    items: [
      { id: 1, productId: 1, productName: 'Kopi Latte', quantity: 2, price: 30000, discount: 0, subtotal: 60000 },
      { id: 2, productId: 2, productName: 'Nasi Goreng Special', quantity: 1, price: 45000, discount: 5000, subtotal: 40000 },
      { id: 3, productId: 3, productName: 'Cappuccino', quantity: 3, price: 35000, discount: 0, subtotal: 105000 },
      { id: 4, productId: 5, productName: 'Es Teh Manis', quantity: 2, price: 10000, discount: 0, subtotal: 20000 },
      { id: 5, productId: 4, productName: 'Mie Ayam Jamur', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
    ],
  },
  {
    id: 2,
    orderNumber: 'INV-20260228-002',
    customerId: 2,
    customerName: 'Jane Smith',
    customerPhone: '081298765432',
    fulfillmentType: 'qr_order',
    orderDate: '2026-02-28T09:30:00Z',
    completedAt: '2026-02-28T10:00:00Z',
    totalPrice: 180000,
    subtotal: 180000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'qris',
    status: 'completed',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    items: [
      { id: 6, productId: 1, productName: 'Kopi Latte', quantity: 1, price: 30000, discount: 0, subtotal: 30000 },
      { id: 7, productId: 6, productName: 'Croissant', quantity: 2, price: 25000, discount: 0, subtotal: 50000 },
      { id: 8, productId: 7, productName: 'Chicken Katsu', quantity: 2, price: 50000, discount: 0, subtotal: 100000 },
    ],
  },
  {
    id: 3,
    orderNumber: 'INV-20260228-003',
    customerName: 'Bob Wilson',
    customerPhone: '081377889900',
    fulfillmentType: 'delivery',
    orderDate: '2026-02-28T10:15:00Z',
    totalPrice: 320000,
    subtotal: 305000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 15000,
    paymentMethod: 'transfer',
    status: 'shipped',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    courierName: 'GoSend',
    address: 'Jl. Sudirman No. 45, Jakarta Selatan',
    customerNotes: 'Tolong extra sambal',
    items: [
      { id: 9, productId: 2, productName: 'Nasi Goreng Special', quantity: 2, price: 45000, discount: 0, subtotal: 90000 },
      { id: 10, productId: 4, productName: 'Mie Ayam Jamur', quantity: 2, price: 40000, discount: 0, subtotal: 80000 },
      { id: 11, productId: 8, productName: 'Ayam Bakar', quantity: 1, price: 55000, discount: 0, subtotal: 55000 },
      { id: 12, productId: 5, productName: 'Es Teh Manis', quantity: 4, price: 10000, discount: 0, subtotal: 40000 },
      { id: 13, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
    ],
  },
  {
    id: 4,
    orderNumber: 'INV-20260228-004',
    customerId: 4,
    customerName: 'Alice Brown',
    customerPhone: '081244556677',
    fulfillmentType: 'takeaway',
    orderDate: '2026-02-28T11:00:00Z',
    completedAt: '2026-02-28T11:20:00Z',
    totalPrice: 95000,
    subtotal: 95000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'ewallet',
    status: 'completed',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    items: [
      { id: 14, productId: 3, productName: 'Cappuccino', quantity: 1, price: 35000, discount: 0, subtotal: 35000 },
      { id: 15, productId: 6, productName: 'Croissant', quantity: 1, price: 25000, discount: 0, subtotal: 25000 },
      { id: 16, productId: 10, productName: 'Roti Bakar', quantity: 1, price: 35000, discount: 0, subtotal: 35000 },
    ],
  },
  {
    id: 5,
    orderNumber: 'INV-20260228-005',
    customerName: 'Charlie Davis',
    customerPhone: '081211223344',
    fulfillmentType: 'gofood',
    orderDate: '2026-02-28T11:30:00Z',
    completedAt: '2026-02-28T12:10:00Z',
    totalPrice: 450000,
    subtotal: 440000,
    discount: 0,
    tax: 10000,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'gofood',
    status: 'completed',
    cashierName: 'Ani',
    shiftName: 'Siang',
    items: [
      { id: 17, productId: 7, productName: 'Chicken Katsu', quantity: 3, price: 50000, discount: 0, subtotal: 150000 },
      { id: 18, productId: 8, productName: 'Ayam Bakar', quantity: 2, price: 55000, discount: 0, subtotal: 110000 },
      { id: 19, productId: 2, productName: 'Nasi Goreng Special', quantity: 2, price: 45000, discount: 0, subtotal: 90000 },
      { id: 20, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 21, productId: 5, productName: 'Es Teh Manis', quantity: 5, price: 10000, discount: 0, subtotal: 50000 },
    ],
  },
  {
    id: 6,
    orderNumber: 'INV-20260228-006',
    customerName: 'Diana Lee',
    customerPhone: '081299887766',
    fulfillmentType: 'dine_in',
    orderDate: '2026-02-28T12:00:00Z',
    totalPrice: 125000,
    subtotal: 125000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'cash',
    status: 'unpaid',
    cashierName: 'Budi',
    shiftName: 'Siang',
    items: [
      { id: 22, productId: 2, productName: 'Nasi Goreng Special', quantity: 1, price: 45000, discount: 0, subtotal: 45000 },
      { id: 23, productId: 4, productName: 'Mie Ayam Jamur', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 24, productId: 5, productName: 'Es Teh Manis', quantity: 2, price: 10000, discount: 0, subtotal: 20000 },
      { id: 25, productId: 6, productName: 'Croissant', quantity: 1, price: 25000, discount: 0, subtotal: 25000, notes: 'Tanpa mentega' },
    ],
  },
  {
    id: 7,
    orderNumber: 'INV-20260228-007',
    customerId: 7,
    customerName: 'Edward Kim',
    customerPhone: '081266778899',
    fulfillmentType: 'grabfood',
    orderDate: '2026-02-28T12:45:00Z',
    completedAt: '2026-02-28T13:20:00Z',
    totalPrice: 275000,
    subtotal: 275000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'grabfood',
    status: 'completed',
    cashierName: 'Ani',
    shiftName: 'Siang',
    items: [
      { id: 26, productId: 8, productName: 'Ayam Bakar', quantity: 2, price: 55000, discount: 0, subtotal: 110000 },
      { id: 27, productId: 7, productName: 'Chicken Katsu', quantity: 1, price: 50000, discount: 0, subtotal: 50000 },
      { id: 28, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 29, productId: 1, productName: 'Kopi Latte', quantity: 2, price: 30000, discount: 0, subtotal: 60000 },
      { id: 30, productId: 5, productName: 'Es Teh Manis', quantity: 3, price: 5000, discount: 0, subtotal: 15000 },
    ],
  },
  {
    id: 8,
    orderNumber: 'INV-20260228-008',
    customerName: 'Fiona Wang',
    customerPhone: '081233445566',
    fulfillmentType: 'dine_in',
    orderDate: '2026-02-28T13:15:00Z',
    totalPrice: 75000,
    subtotal: 85000,
    discount: 15000,
    tax: 5000,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'edc',
    status: 'ready',
    cashierName: 'Budi',
    shiftName: 'Siang',
    items: [
      { id: 31, productId: 1, productName: 'Kopi Latte', quantity: 1, price: 30000, discount: 5000, subtotal: 25000 },
      { id: 32, productId: 10, productName: 'Roti Bakar', quantity: 1, price: 35000, discount: 5000, subtotal: 30000 },
      { id: 33, productId: 5, productName: 'Es Teh Manis', quantity: 2, price: 10000, discount: 0, subtotal: 20000 },
    ],
  },
  {
    id: 9,
    orderNumber: 'INV-20260227-009',
    customerName: 'George Chen',
    customerPhone: '081288990011',
    fulfillmentType: 'delivery',
    orderDate: '2026-02-27T14:00:00Z',
    totalPrice: 560000,
    subtotal: 545000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 15000,
    paymentMethod: 'transfer',
    status: 'failed',
    cashierName: 'Ani',
    shiftName: 'Siang',
    courierName: 'GrabExpress',
    address: 'Jl. Gatot Subroto No. 12, Jakarta Pusat',
    items: [
      { id: 34, productId: 7, productName: 'Chicken Katsu', quantity: 4, price: 50000, discount: 0, subtotal: 200000 },
      { id: 35, productId: 8, productName: 'Ayam Bakar', quantity: 3, price: 55000, discount: 0, subtotal: 165000 },
      { id: 36, productId: 2, productName: 'Nasi Goreng Special', quantity: 2, price: 45000, discount: 0, subtotal: 90000 },
      { id: 37, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 38, productId: 5, productName: 'Es Teh Manis', quantity: 5, price: 10000, discount: 0, subtotal: 50000 },
    ],
  },
  {
    id: 10,
    orderNumber: 'INV-20260227-010',
    customerId: 10,
    customerName: 'Hana Sato',
    customerPhone: '081277665544',
    fulfillmentType: 'qr_order',
    orderDate: '2026-02-27T15:30:00Z',
    completedAt: '2026-02-27T16:00:00Z',
    totalPrice: 195000,
    subtotal: 195000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'qris',
    status: 'completed',
    cashierName: 'Budi',
    shiftName: 'Siang',
    items: [
      { id: 39, productId: 3, productName: 'Cappuccino', quantity: 2, price: 35000, discount: 0, subtotal: 70000 },
      { id: 40, productId: 10, productName: 'Roti Bakar', quantity: 1, price: 35000, discount: 0, subtotal: 35000 },
      { id: 41, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 42, productId: 5, productName: 'Es Teh Manis', quantity: 5, price: 10000, discount: 0, subtotal: 50000 },
    ],
  },
  {
    id: 11,
    orderNumber: 'INV-20260227-011',
    customerName: 'Ivan Park',
    customerPhone: '081255443322',
    fulfillmentType: 'shopeefood',
    orderDate: '2026-02-27T16:30:00Z',
    completedAt: '2026-02-27T17:10:00Z',
    totalPrice: 350000,
    subtotal: 350000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'shopeefood',
    status: 'completed',
    cashierName: 'Ani',
    shiftName: 'Sore',
    items: [
      { id: 43, productId: 7, productName: 'Chicken Katsu', quantity: 2, price: 50000, discount: 0, subtotal: 100000 },
      { id: 44, productId: 8, productName: 'Ayam Bakar', quantity: 2, price: 55000, discount: 0, subtotal: 110000 },
      { id: 45, productId: 2, productName: 'Nasi Goreng Special', quantity: 1, price: 45000, discount: 0, subtotal: 45000 },
      { id: 46, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 47, productId: 5, productName: 'Es Teh Manis', quantity: 5, price: 10000, discount: 0, subtotal: 50000 },
      { id: 48, productId: 6, productName: 'Croissant', quantity: 1, price: 25000, discount: 0, subtotal: 25000, notes: 'Extra coklat' },
    ],
  },
  {
    id: 12,
    orderNumber: 'INV-20260226-012',
    customerName: 'Julia Tan',
    customerPhone: '081200112233',
    fulfillmentType: 'dine_in',
    orderDate: '2026-02-26T09:00:00Z',
    completedAt: '2026-02-26T09:40:00Z',
    totalPrice: 155000,
    subtotal: 165000,
    discount: 10000,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'cash',
    status: 'completed',
    cashierName: 'Budi',
    shiftName: 'Pagi',
    items: [
      { id: 49, productId: 1, productName: 'Kopi Latte', quantity: 2, price: 30000, discount: 0, subtotal: 60000 },
      { id: 50, productId: 4, productName: 'Mie Ayam Jamur', quantity: 1, price: 40000, discount: 5000, subtotal: 35000 },
      { id: 51, productId: 10, productName: 'Roti Bakar', quantity: 1, price: 35000, discount: 5000, subtotal: 30000 },
      { id: 52, productId: 5, productName: 'Es Teh Manis', quantity: 4, price: 10000, discount: 0, subtotal: 40000 },
    ],
  },
  {
    id: 13,
    orderNumber: 'INV-20260226-013',
    customerName: 'Kevin Lim',
    customerPhone: '081244332211',
    fulfillmentType: 'takeaway',
    orderDate: '2026-02-26T10:30:00Z',
    completedAt: '2026-02-26T10:50:00Z',
    totalPrice: 85000,
    subtotal: 85000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'qris',
    status: 'completed',
    cashierName: 'Ani',
    shiftName: 'Pagi',
    items: [
      { id: 53, productId: 3, productName: 'Cappuccino', quantity: 1, price: 35000, discount: 0, subtotal: 35000 },
      { id: 54, productId: 6, productName: 'Croissant', quantity: 2, price: 25000, discount: 0, subtotal: 50000 },
    ],
  },
  {
    id: 14,
    orderNumber: 'INV-20260226-014',
    customerId: 14,
    customerName: 'Linda Ng',
    customerPhone: '081288776655',
    fulfillmentType: 'dine_in',
    orderDate: '2026-02-26T12:15:00Z',
    completedAt: '2026-02-26T12:55:00Z',
    totalPrice: 420000,
    subtotal: 430000,
    discount: 20000,
    tax: 10000,
    serviceFee: 0,
    shippingFee: 0,
    paymentMethod: 'edc',
    status: 'completed',
    cashierName: 'Budi',
    shiftName: 'Siang',
    items: [
      { id: 55, productId: 7, productName: 'Chicken Katsu', quantity: 2, price: 50000, discount: 0, subtotal: 100000 },
      { id: 56, productId: 8, productName: 'Ayam Bakar', quantity: 2, price: 55000, discount: 10000, subtotal: 100000 },
      { id: 57, productId: 2, productName: 'Nasi Goreng Special', quantity: 2, price: 45000, discount: 5000, subtotal: 85000 },
      { id: 58, productId: 1, productName: 'Kopi Latte', quantity: 2, price: 30000, discount: 0, subtotal: 60000 },
      { id: 59, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 5000, subtotal: 35000 },
      { id: 60, productId: 5, productName: 'Es Teh Manis', quantity: 5, price: 10000, discount: 0, subtotal: 50000 },
    ],
  },
  {
    id: 15,
    orderNumber: 'INV-20260226-015',
    customerName: 'Michael Zhang',
    customerPhone: '081222334455',
    fulfillmentType: 'grabexpress',
    orderDate: '2026-02-26T14:00:00Z',
    totalPrice: 230000,
    subtotal: 215000,
    discount: 0,
    tax: 0,
    serviceFee: 0,
    shippingFee: 15000,
    paymentMethod: 'transfer',
    status: 'completed',
    cashierName: 'Ani',
    shiftName: 'Siang',
    completedAt: '2026-02-26T14:45:00Z',
    courierName: 'GrabExpress',
    address: 'Jl. Kebon Jeruk No. 88, Jakarta Barat',
    items: [
      { id: 61, productId: 8, productName: 'Ayam Bakar', quantity: 2, price: 55000, discount: 0, subtotal: 110000 },
      { id: 62, productId: 4, productName: 'Mie Ayam Jamur', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 63, productId: 9, productName: 'Sate Ayam', quantity: 1, price: 40000, discount: 0, subtotal: 40000 },
      { id: 64, productId: 5, productName: 'Es Teh Manis', quantity: 3, price: 10000, discount: 0, subtotal: 30000, notes: 'Less sugar' },
    ],
  },
];

// ============================================================
// Filter Functions
// ============================================================

export function filterOrders(
  orders: Order[],
  filters: TransactionFilters
): Order[] {
  return orders.filter((order) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q) ||
        order.orderNumber.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Status
    if (filters.status !== 'all' && order.status !== filters.status) return false;

    // Payment Method
    if (filters.paymentMethod !== 'all' && order.paymentMethod !== filters.paymentMethod) return false;

    // Fulfillment Type
    if (filters.fulfillmentType !== 'all' && order.fulfillmentType !== filters.fulfillmentType) return false;

    // Date range
    if (filters.dateFrom) {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
      if (orderDate < filters.dateFrom) return false;
    }
    if (filters.dateTo) {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
      if (orderDate > filters.dateTo) return false;
    }

    return true;
  });
}

// ============================================================
// Stats Helpers
// ============================================================

export function getOrderStats(orders: Order[]) {
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);
  const totalItems = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const pendingOrders = orders.filter((o) => o.status === 'unpaid' || o.status === 'ready' || o.status === 'shipped').length;
  const failedOrders = orders.filter((o) => o.status === 'failed').length;

  return {
    totalOrders,
    totalRevenue,
    totalItems,
    completedOrders,
    pendingOrders,
    failedOrders,
  };
}
