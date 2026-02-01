"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@/components/ui";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Search,
  Filter,
  X,
} from "lucide-react";

// Demo data - Consistent with previous demo but with better types
const stats = [
  {
    title: "Total Revenue",
    value: formatCurrency(125000000),
    change: 12.5,
    trend: "up" as const,
    icon: DollarSign,
    color: "text-success",
    bgColor: "bg-success-light",
  },
  {
    title: "Transactions",
    value: formatNumber(1234),
    change: 8.2,
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-primary",
    bgColor: "bg-primary-light",
  },
  {
    title: "Available Products",
    value: formatNumber(456),
    change: -2.4,
    trend: "down" as const,
    icon: Package,
    color: "text-purple",
    bgColor: "bg-purple/10",
  },
  {
    title: "Active Customers",
    value: formatNumber(892),
    change: 15.3,
    trend: "up" as const,
    icon: Users,
    color: "text-warning",
    bgColor: "bg-warning-light",
  },
];

const recentTransactions = [
  {
    id: "INV-001",
    customer: "John Doe",
    amount: 250000,
    status: "completed",
    time: "2 min ago",
  },
  {
    id: "INV-002",
    customer: "Jane Smith",
    amount: 180000,
    status: "completed",
    time: "15 min ago",
  },
  {
    id: "INV-003",
    customer: "Bob Wilson",
    amount: 320000,
    status: "pending",
    time: "1 hour ago",
  },
  {
    id: "INV-004",
    customer: "Alice Brown",
    amount: 95000,
    status: "completed",
    time: "2 hours ago",
  },
  {
    id: "INV-005",
    customer: "Charlie Davis",
    amount: 450000,
    status: "completed",
    time: "3 hours ago",
  },
];

const topProducts = [
  { name: "Kopi Latte", sold: 234, revenue: 7020000, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=50&h=50&fit=crop" },
  { name: "Nasi Goreng Special", sold: 189, revenue: 5670000, image: "https://images.unsplash.com/photo-1512058560366-cd2427ffaa64?w=50&h=50&fit=crop" },
  { name: "Cappuccino", sold: 156, revenue: 4680000, image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=50&h=50&fit=crop" },
  { name: "Mie Ayam Jamur", sold: 142, revenue: 4260000, image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=50&h=50&fit=crop" },
  { name: "Es Teh Manis", sold: 128, revenue: 1280000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=50&h=50&fit=crop" },
];

type StatusFilter = "all" | "completed" | "pending";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Filter transactions based on search and status
  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter((tx) => {
      const matchesSearch = 
        tx.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return topProducts;
    return topProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Store Overview"
        description="Monitoring your business performance in real-time."
        actions={
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-card shadow-card-hover transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <button className="text-text-secondary hover:text-text-primary transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              
              <div>
                <p className="text-sm font-semibold text-text-secondary mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-text-primary tracking-tight">
                  {stat.value}
                </h3>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-divider">
                <div className={cn(
                  "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold",
                  stat.trend === "up" ? "bg-success-light text-success" : "bg-error-light text-error"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(stat.change)}%
                </div>
                <span className="text-xs text-text-secondary font-medium">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-border shadow-card">
        <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg flex-1 max-w-sm">
          <Search className="h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari transaksi atau produk..."
            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-text-secondary text-text-primary"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-text-secondary hover:text-text-primary">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary">Status:</span>
          <div className="flex items-center gap-1 p-1 bg-background rounded-lg">
            {(["all", "completed", "pending"] as StatusFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize",
                  statusFilter === status
                    ? "bg-white text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {status === "all" ? "Semua" : status === "completed" ? "Selesai" : "Pending"}
              </button>
            ))}
          </div>
        </div>

        {(searchQuery || statusFilter !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            className="text-sm font-medium text-error hover:text-error/80 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions - Improved Table Style */}
        <Card className="lg:col-span-8 border-none shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <div>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <p className="text-xs text-text-secondary font-medium mt-1">
                {filteredTransactions.length} transaksi ditemukan
              </p>
            </div>
            <button className="text-sm text-primary hover:text-primary-dark font-bold px-3 py-1.5 hover:bg-primary-light rounded-lg transition-all">
              View All
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background border-y border-divider">
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Invoice / Customer</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Search className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Tidak ada transaksi yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-background/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                              {tx.customer.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary leading-none">{tx.customer}</p>
                              <p className="text-[11px] font-medium text-text-secondary mt-1">{tx.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-text-primary">{formatCurrency(tx.amount)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={tx.status === "completed" ? "success" : "warning"}
                            className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                          >
                            {tx.status === "completed" ? "Selesai" : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-text-secondary">{tx.time}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Product List */}
        <Card className="lg:col-span-4 border-none shadow-card">
          <CardHeader className="pb-2 border-none">
            <CardTitle className="text-lg">Top Selling</CardTitle>
            <p className="text-xs text-text-secondary font-medium mt-1">
              {filteredProducts.length} produk
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-divider">
              {filteredProducts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Produk tidak ditemukan</p>
                </div>
              ) : (
                filteredProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-background/50 transition-all group"
                  >
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-12 w-12 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                      />
                      <div className="absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {product.name}
                      </p>
                      <p className="text-xs font-medium text-text-secondary mt-0.5">
                        {product.sold} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">
                        {formatCurrency(product.revenue)}
                      </p>
                      <div className="flex justify-end mt-1">
                        <div className="h-1.5 w-16 bg-background rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${100 - (index * 15)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
