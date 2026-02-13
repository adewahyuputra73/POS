import {
  Customer,
  CustomerDetail,
  CustomerFilters,
  CustomerSegment,
  Review,
  ReviewQuestion,
  ReviewFilters,
} from './types';

// ========================
// CUSTOMERS MOCK DATA
// ========================

export const mockCustomers: Customer[] = [
  {
    id: 1, name: 'Budi Santoso', phone: '081234567890', birthdate: '1990-03-15',
    segment: 'hot', totalReservations: 5, successOrders: 28, totalSpent: 4250000,
    favProducts: 4, coins: 1200, lastVisit: '2026-02-12T10:30:00Z', createdAt: '2025-06-01T09:00:00Z',
  },
  {
    id: 2, name: 'Siti Aminah', phone: '081298765432', birthdate: '1985-07-22',
    segment: 'hot', totalReservations: 3, successOrders: 22, totalSpent: 3180000,
    favProducts: 6, coins: 980, lastVisit: '2026-02-11T14:00:00Z', createdAt: '2025-07-15T10:00:00Z',
  },
  {
    id: 3, name: 'Andi Wijaya', phone: '082112345678', birthdate: '1992-11-08',
    segment: 'warm', totalReservations: 2, successOrders: 8, totalSpent: 1245000,
    favProducts: 3, coins: 450, lastVisit: '2026-02-05T18:00:00Z', createdAt: '2025-09-10T11:00:00Z',
  },
  {
    id: 4, name: 'Dewi Lestari', phone: '085678901234', birthdate: '1988-02-14',
    segment: 'warm', totalReservations: 1, successOrders: 5, totalSpent: 780000,
    favProducts: 2, coins: 200, lastVisit: '2026-01-28T12:00:00Z', createdAt: '2025-10-20T14:00:00Z',
  },
  {
    id: 5, name: 'Rizky Pratama', phone: '087812345678', birthdate: null,
    segment: 'boil', totalReservations: 0, successOrders: 2, totalSpent: 320000,
    favProducts: 1, coins: 50, lastVisit: '2025-12-15T16:00:00Z', createdAt: '2025-11-01T09:00:00Z',
  },
  {
    id: 6, name: 'Nurul Hidayah', phone: '081345678901', birthdate: '1995-06-30',
    segment: 'hot', totalReservations: 7, successOrders: 35, totalSpent: 5890000,
    favProducts: 8, coins: 2100, lastVisit: '2026-02-13T09:00:00Z', createdAt: '2025-04-15T08:00:00Z',
  },
  {
    id: 7, name: 'Ahmad Fauzi', phone: '082299887766', birthdate: '1993-09-12',
    segment: 'warm', totalReservations: 1, successOrders: 4, totalSpent: 620000,
    favProducts: 2, coins: 180, lastVisit: '2026-02-02T20:00:00Z', createdAt: '2025-12-05T13:00:00Z',
  },
  {
    id: 8, name: 'Putri Rahayu', phone: '085511223344', birthdate: '1997-01-25',
    segment: 'boil', totalReservations: 0, successOrders: 1, totalSpent: 155000,
    favProducts: 0, coins: 0, lastVisit: '2025-11-20T11:00:00Z', createdAt: '2025-11-20T11:00:00Z',
  },
  {
    id: 9, name: 'Hendri Sutanto', phone: '081456789012', birthdate: '1987-04-18',
    segment: 'hot', totalReservations: 4, successOrders: 18, totalSpent: 2750000,
    favProducts: 5, coins: 850, lastVisit: '2026-02-10T15:00:00Z', createdAt: '2025-08-01T10:00:00Z',
  },
  {
    id: 10, name: 'Maya Sari', phone: '089912345678', birthdate: '1991-12-03',
    segment: 'warm', totalReservations: 2, successOrders: 6, totalSpent: 890000,
    favProducts: 3, coins: 300, lastVisit: '2026-01-25T17:00:00Z', createdAt: '2025-10-10T12:00:00Z',
  },
  {
    id: 11, name: 'Joko Widodo', phone: '081567890123', birthdate: '1986-08-05',
    segment: 'boil', totalReservations: 0, successOrders: 3, totalSpent: 475000,
    favProducts: 1, coins: 100, lastVisit: '2025-12-28T13:00:00Z', createdAt: '2025-09-25T09:00:00Z',
  },
  {
    id: 12, name: 'Ratna Dewi', phone: '082334556677', birthdate: '1994-05-20',
    segment: 'hot', totalReservations: 6, successOrders: 25, totalSpent: 3950000,
    favProducts: 7, coins: 1500, lastVisit: '2026-02-12T19:00:00Z', createdAt: '2025-05-20T10:00:00Z',
  },
];

export const mockCustomerDetails: CustomerDetail[] = [
  {
    id: 1, name: 'Budi Santoso', phone: '081234567890', birthdate: '1990-03-15',
    segment: 'hot', totalReservations: 5, successOrders: 28, totalSpent: 4250000,
    favProducts: 4, coins: 1200, lastVisit: '2026-02-12T10:30:00Z', createdAt: '2025-06-01T09:00:00Z',
    address: 'Jl. Merdeka No. 45, Surabaya', notes: 'Pelanggan setia, suka meja dekat jendela',
    email: 'budi.santoso@email.com', avgOrderValue: 151786, avgRating: 4.5, totalReviews: 8,
    memberSince: '2025-06-01',
    orders: [
      { id: 1, orderId: 'ORD-2026-0211-001', date: '2026-02-11T10:30:00Z', status: 'success', items: ['Nasi Goreng Spesial', 'Es Teh Manis'], totalAmount: 65000, paymentMethod: 'QRIS' },
      { id: 2, orderId: 'ORD-2026-0209-003', date: '2026-02-09T18:00:00Z', status: 'success', items: ['Mie Ayam Bakso', 'Jus Jeruk', 'Kerupuk'], totalAmount: 82000, paymentMethod: 'Cash' },
      { id: 3, orderId: 'ORD-2026-0205-002', date: '2026-02-05T12:00:00Z', status: 'cancelled', items: ['Rendang Padang'], totalAmount: 45000, paymentMethod: 'Debit' },
      { id: 4, orderId: 'ORD-2026-0201-004', date: '2026-02-01T19:30:00Z', status: 'success', items: ['Paket Keluarga A', 'Es Campur x2'], totalAmount: 185000, paymentMethod: 'QRIS' },
      { id: 5, orderId: 'ORD-2026-0128-001', date: '2026-01-28T11:00:00Z', status: 'success', items: ['Soto Ayam', 'Nasi Putih', 'Teh Tarik'], totalAmount: 55000, paymentMethod: 'Cash' },
    ],
    reservations: [
      { id: 1, date: '2026-02-14', time: '18:00', guests: 4, status: 'confirmed', notes: 'Ulang tahun istri', tableNumber: 'A5' },
      { id: 2, date: '2026-02-08', time: '12:00', guests: 2, status: 'completed', notes: '', tableNumber: 'B2' },
      { id: 3, date: '2026-01-20', time: '19:00', guests: 6, status: 'completed', notes: 'Minta high chair', tableNumber: 'C1' },
    ],
    reviews: [
      { id: 1, orderId: 'ORD-2026-0211-001', date: '2026-02-11T11:00:00Z', rating: 5, comment: 'Makanan selalu enak dan pelayanan ramah!', products: ['Nasi Goreng Spesial'], questionAnswers: [{ question: 'Bagaimana rasa makanan?', rating: 5 }, { question: 'Bagaimana pelayanan?', rating: 5 }] },
      { id: 2, orderId: 'ORD-2026-0201-004', date: '2026-02-01T20:00:00Z', rating: 4, comment: 'Porsinya banyak, tapi agak lama datangnya', products: ['Paket Keluarga A'], questionAnswers: [{ question: 'Bagaimana rasa makanan?', rating: 4 }, { question: 'Bagaimana pelayanan?', rating: 3 }] },
    ],
  },
  {
    id: 6, name: 'Nurul Hidayah', phone: '081345678901', birthdate: '1995-06-30',
    segment: 'hot', totalReservations: 7, successOrders: 35, totalSpent: 5890000,
    favProducts: 8, coins: 2100, lastVisit: '2026-02-13T09:00:00Z', createdAt: '2025-04-15T08:00:00Z',
    address: 'Jl. Ahmad Yani No. 12, Surabaya', notes: 'VIP customer, sering bawa teman',
    email: 'nurul.h@email.com', avgOrderValue: 168286, avgRating: 4.8, totalReviews: 12,
    memberSince: '2025-04-15',
    orders: [
      { id: 6, orderId: 'ORD-2026-0213-001', date: '2026-02-13T09:00:00Z', status: 'success', items: ['Bubur Ayam', 'Kopi Hitam'], totalAmount: 42000, paymentMethod: 'QRIS' },
      { id: 7, orderId: 'ORD-2026-0211-005', date: '2026-02-11T12:30:00Z', status: 'success', items: ['Ayam Geprek Level 5', 'Es Teh', 'Nasi Extra'], totalAmount: 55000, paymentMethod: 'Cash' },
    ],
    reservations: [
      { id: 4, date: '2026-02-15', time: '19:00', guests: 8, status: 'confirmed', notes: 'Arisan kantor', tableNumber: 'VIP-1' },
    ],
    reviews: [
      { id: 3, orderId: 'ORD-2026-0213-001', date: '2026-02-13T10:00:00Z', rating: 5, comment: 'Bubur ayamnya best di kota!', products: ['Bubur Ayam'], questionAnswers: [{ question: 'Bagaimana rasa makanan?', rating: 5 }, { question: 'Bagaimana pelayanan?', rating: 5 }] },
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
    // Segment
    if (filters.segment !== 'all' && c.segment !== filters.segment) return false;
    // Birthday month
    if (filters.birthdayMonth !== null && c.birthdate) {
      const month = new Date(c.birthdate).getMonth() + 1;
      if (month !== filters.birthdayMonth) return false;
    }
    if (filters.birthdayMonth !== null && !c.birthdate) return false;
    // Total spent
    if (filters.totalSpent === 'gt' && filters.totalSpentMin !== undefined) {
      if (c.totalSpent <= filters.totalSpentMin) return false;
    }
    if (filters.totalSpent === 'lt' && filters.totalSpentMax !== undefined) {
      if (c.totalSpent >= filters.totalSpentMax) return false;
    }
    if (filters.totalSpent === 'between' && filters.totalSpentMin !== undefined && filters.totalSpentMax !== undefined) {
      if (c.totalSpent < filters.totalSpentMin || c.totalSpent > filters.totalSpentMax) return false;
    }
    // Last visit
    if (filters.lastVisit !== 'all' && c.lastVisit) {
      const visitDate = new Date(c.lastVisit);
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

export function getCustomerDetail(id: number): CustomerDetail | undefined {
  return mockCustomerDetails.find(d => d.id === id);
}

// ========================
// REVIEWS MOCK DATA
// ========================

export const mockReviews: Review[] = [
  {
    id: 1, customerId: 1, customerName: 'Budi Santoso', customerPhone: '081234567890',
    orderId: 'ORD-2026-0211-001', orderDate: '2026-02-11T10:30:00Z',
    rating: 5, comment: 'Makanan selalu enak dan pelayanan ramah!',
    products: ['Nasi Goreng Spesial', 'Es Teh Manis'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 5 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 5 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 4 },
    ],
    createdAt: '2026-02-11T11:00:00Z',
  },
  {
    id: 2, customerId: 1, customerName: 'Budi Santoso', customerPhone: '081234567890',
    orderId: 'ORD-2026-0201-004', orderDate: '2026-02-01T19:30:00Z',
    rating: 4, comment: 'Porsinya banyak, tapi agak lama datangnya',
    products: ['Paket Keluarga A', 'Es Campur'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 3 },
    ],
    createdAt: '2026-02-01T20:00:00Z',
  },
  {
    id: 3, customerId: 6, customerName: 'Nurul Hidayah', customerPhone: '081345678901',
    orderId: 'ORD-2026-0213-001', orderDate: '2026-02-13T09:00:00Z',
    rating: 5, comment: 'Bubur ayamnya best di kota! Pasti balik lagi.',
    products: ['Bubur Ayam', 'Kopi Hitam'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 5 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 5 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 5 },
    ],
    createdAt: '2026-02-13T10:00:00Z',
  },
  {
    id: 4, customerId: 2, customerName: 'Siti Aminah', customerPhone: '081298765432',
    orderId: 'ORD-2026-0210-002', orderDate: '2026-02-10T12:00:00Z',
    rating: 3, comment: 'Makanan lumayan, tapi suasana agak berisik',
    products: ['Soto Betawi', 'Nasi Uduk'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 3 },
    ],
    createdAt: '2026-02-10T13:00:00Z',
  },
  {
    id: 5, customerId: 3, customerName: 'Andi Wijaya', customerPhone: '082112345678',
    orderId: 'ORD-2026-0205-001', orderDate: '2026-02-05T18:00:00Z',
    rating: 4, comment: 'Enak, harga terjangkau',
    products: ['Ayam Bakar', 'Sambal Matah', 'Es Kelapa'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 4 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 4 },
    ],
    createdAt: '2026-02-05T19:00:00Z',
  },
  {
    id: 6, customerId: 12, customerName: 'Ratna Dewi', customerPhone: '082334556677',
    orderId: 'ORD-2026-0212-003', orderDate: '2026-02-12T19:00:00Z',
    rating: 5, comment: 'Luar biasa! Menu baru sangat recommended.',
    products: ['Lobster Roll Special', 'Matcha Latte'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 5 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 5 },
      { questionId: 3, questionText: 'Bagaimana pengalaman order?', ratingValue: 5 },
    ],
    createdAt: '2026-02-12T20:00:00Z',
  },
  {
    id: 7, customerId: 9, customerName: 'Hendri Sutanto', customerPhone: '081456789012',
    orderId: 'ORD-2026-0209-005', orderDate: '2026-02-09T15:00:00Z',
    rating: 2, comment: 'Pesanan salah dan lama sekali. Kecewa.',
    products: ['Nasi Campur'],
    questionAnswers: [
      { questionId: 1, questionText: 'Bagaimana rasa makanan kami?', ratingValue: 3 },
      { questionId: 2, questionText: 'Bagaimana pelayanan kami?', ratingValue: 1 },
    ],
    createdAt: '2026-02-09T16:00:00Z',
  },
  {
    id: 8, customerId: 10, customerName: 'Maya Sari', customerPhone: '089912345678',
    orderId: 'ORD-2026-0125-001', orderDate: '2026-01-25T17:00:00Z',
    rating: 4, comment: 'Tempatnya nyaman, cocok buat kerja.',
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
