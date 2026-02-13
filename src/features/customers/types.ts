// Customer Types
export type CustomerSegment = 'hot' | 'warm' | 'boil';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  birthdate: string | null; // ISO date string
  segment: CustomerSegment;
  totalReservations: number;
  successOrders: number;
  totalSpent: number;
  favProducts: number;
  coins: number;
  lastVisit: string | null; // ISO date string
  createdAt: string;
}

export interface CustomerOrder {
  id: number;
  orderId: string;
  date: string;
  status: 'success' | 'cancelled' | 'pending';
  items: string[];
  totalAmount: number;
  paymentMethod: string;
}

export interface CustomerReservation {
  id: number;
  date: string;
  time: string;
  guests: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no_show';
  notes: string;
  tableNumber: string;
}

export interface CustomerReview {
  id: number;
  orderId: string;
  date: string;
  rating: number; // 1-5
  comment: string;
  products: string[];
  questionAnswers: { question: string; rating: number }[];
}

export interface CustomerDetail extends Customer {
  address: string;
  notes: string;
  email: string;
  orders: CustomerOrder[];
  reservations: CustomerReservation[];
  reviews: CustomerReview[];
  // Summary stats
  avgOrderValue: number;
  avgRating: number;
  totalReviews: number;
  memberSince: string;
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

// Review Types
export interface Review {
  id: number;
  customerId: number;
  customerName: string;
  customerPhone: string;
  orderId: string;
  orderDate: string;
  rating: number; // 1-5
  comment: string;
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
