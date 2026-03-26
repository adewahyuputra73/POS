// Global TypeScript types

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "kasir";
  avatar?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Product model
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  price: number;
  cost_price?: number;
  stock: number;
  min_stock?: number;
  category_id: string;
  category?: Category;
  image?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Category model
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  products_count?: number;
}

// Customer model
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  total_transactions?: number;
  total_spent?: number;
  created_at: string;
  updated_at: string;
}

// Transaction model
export interface Transaction {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer?: Customer;
  cashier_id: string;
  cashier?: User;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  payment_method: "cash" | "card" | "qris" | "transfer";
  payment_amount: number;
  change_amount: number;
  status: "pending" | "completed" | "voided";
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Transaction Item model
export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  discount: number;
  subtotal: number;
}

// Dashboard stats
export interface DashboardStats {
  total_sales: number;
  total_transactions: number;
  total_products: number;
  total_customers: number;
  sales_growth: number;
  transactions_growth: number;
}
