"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Spinner,
  useToast,
} from "@/components/ui";
import { formatCurrency, formatNumber, formatRelativeTime, cn } from "@/lib/utils";
import {
  DollarSign,
  ShoppingCart,
  Package,
  MoreVertical,
  Search,
  Filter,
  X,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { dashboardService } from "@/features/dashboard/services";
import { orderService } from "@/features/orders/services/order-service";
import type { DashboardTodaySummary, TopProductItem } from "@/features/dashboard/types";
import type { Order } from "@/features/orders/types";

type StatusFilter = "all" | "completed" | "pending";

const RANK_COLORS = [
  "bg-yellow-500",
  "bg-slate-400",
  "bg-amber-600",
  "bg-primary",
  "bg-secondary",
];

function getOrderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    COMPLETED: "Selesai",
    PROCESSING: "Diproses",
    READY: "Siap",
    PENDING: "Pending",
    CANCELLED: "Dibatalkan",
    completed: "Selesai",
    processing: "Diproses",
    ready: "Siap",
    pending: "Pending",
    cancelled: "Dibatalkan",
  };
  return map[status] ?? status;
}

function getOrderStatusVariant(status: string): "success" | "warning" | "error" | "default" {
  const s = status.toUpperCase();
  if (s === "COMPLETED") return "success";
  if (s === "PENDING" || s === "PROCESSING" || s === "READY") return "warning";
  if (s === "CANCELLED") return "error";
  return "default";
}

function getOrderTypeLabel(orderType: string): string {
  if (orderType === "DINE_IN") return "Dine In";
  if (orderType === "TAKEAWAY") return "Takeaway";
  return orderType;
}

export default function DashboardPage() {
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardTodaySummary | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const [summaryData, productsData, ordersData] = await Promise.all([
          dashboardService.todaySummary(),
          dashboardService.topProducts({ limit: 5 }),
          orderService.list({ limit: 5 }),
        ]);
        setSummary(summaryData);
        setTopProducts(productsData);
        setRecentOrders(ordersData);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Gagal memuat data dashboard";
        setFetchError(message);
        showToast("Gagal memuat data dashboard. Silakan coba lagi.", "error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [showToast]);

  const stats = useMemo(() => {
    if (!summary) return [];
    return [
      {
        title: "Pendapatan Hari Ini",
        value: formatCurrency(summary.payment_summary.total_revenue),
        icon: DollarSign,
        color: "text-success",
        bgColor: "bg-success-light",
      },
      {
        title: "Transaksi Hari Ini",
        value: formatNumber(summary.order_summary.total_today),
        icon: ShoppingCart,
        color: "text-primary",
        bgColor: "bg-primary-light",
      },
      {
        title: "Pesanan Pending",
        value: formatNumber(summary.order_summary.pending),
        icon: Clock,
        color: "text-warning",
        bgColor: "bg-warning-light",
      },
      {
        title: "Pesanan Selesai",
        value: formatNumber(summary.order_summary.completed),
        icon: CheckCircle,
        color: "text-success",
        bgColor: "bg-success-light",
      },
    ];
  }, [summary]);

  const filteredOrders = useMemo(() => {
    return recentOrders.filter((order) => {
      const shortId = (order.id ?? "").slice(0, 8).toLowerCase();
      const orderType = (order.order_type ?? "").toLowerCase();
      const matchesSearch =
        shortId.includes(searchQuery.toLowerCase()) ||
        orderType.includes(searchQuery.toLowerCase());

      const orderStatusNormalized = (order.status ?? "").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && orderStatusNormalized === "completed") ||
        (statusFilter === "pending" && (orderStatusNormalized === "pending" || orderStatusNormalized === "processing"));

      return matchesSearch && matchesStatus;
    });
  }, [recentOrders, searchQuery, statusFilter]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return topProducts;
    return topProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [topProducts, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Dashboard"
        description="Ringkasan penjualan hari ini"
      />

      {/* Inline error notice */}
      {fetchError && (
        <div className="flex items-center gap-3 p-4 bg-error-light border border-error/20 rounded-xl text-sm text-error font-medium">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{fetchError}</span>
          <button
            onClick={() => setFetchError(null)}
            className="ml-auto text-error/70 hover:text-error transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-surface rounded-xl border border-border shadow-card">
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
                    ? "bg-surface text-primary shadow-sm"
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
        {/* Recent Orders Table */}
        <Card className="lg:col-span-8 border-none shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-none">
            <div>
              <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
              <p className="text-xs text-text-secondary font-medium mt-1">
                {filteredOrders.length} transaksi ditemukan
              </p>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background border-y border-divider">
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">ID / Tipe</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Search className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Tidak ada transaksi yang ditemukan</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-background/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
                              {order.order_type === "DINE_IN" ? "DI" : "TA"}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary leading-none">
                                {getOrderTypeLabel(order.order_type)}
                              </p>
                              <p className="text-[11px] font-medium text-text-secondary mt-1">
                                #{order.id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-text-primary">{formatCurrency(order.total)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={getOrderStatusVariant(order.status)}
                            className="rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                          >
                            {getOrderStatusLabel(order.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-text-secondary">
                            {formatRelativeTime(order.created_at)}
                          </span>
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
                    key={product.product_id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-background/50 transition-all group"
                  >
                    <div className="relative flex-shrink-0">
                      <div className={cn(
                        "h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg",
                        RANK_COLORS[index] ?? "bg-text-secondary"
                      )}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {product.name}
                      </p>
                      <p className="text-xs font-medium text-text-secondary mt-0.5">
                        {formatNumber(product.total_qty)} terjual
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-text-primary">
                        {formatCurrency(product.total_revenue)}
                      </p>
                      <div className="flex justify-end mt-1">
                        <div className="h-1.5 w-16 bg-background rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${100 - index * 15}%` }}
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
