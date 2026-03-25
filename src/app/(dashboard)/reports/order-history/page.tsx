"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { DataTable } from "@/features/reports/components/data-table";
import { reportService } from "@/features/reports/services/report-service";
import type { ReportOrderItem } from "@/features/reports/types";
import {
  Search,
  X,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  CreditCard,
  User,
  FileText,
} from "lucide-react";

type OrderStatus = "UNPAID" | "READY" | "SHIPPED" | "COMPLETED" | "FAILED";
type PaymentMethod = "CASH" | "QRIS" | "TRANSFER" | "CARD" | "EWALLET";
type FulfillmentType = "DINE_IN" | "TAKEAWAY" | "GOFOOD" | "GRABFOOD" | "SHOPEE" | "DELIVERY";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  fulfillmentType: string;
  orderDate: string;
  orderTime: string;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  notes?: string;
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function mapStatus(raw: ReportOrderItem): OrderStatus {
  const ful = (raw.fulfillment_status ?? "").toUpperCase();
  const pay = (raw.payment_status ?? "").toUpperCase();
  if (ful === "COMPLETED") return "COMPLETED";
  if (ful === "CANCELLED" || pay === "CANCELLED") return "FAILED";
  if (ful === "DELIVERED") return "SHIPPED";
  if (ful === "READY") return "READY";
  return "UNPAID";
}

function mapReportOrder(raw: ReportOrderItem): Order {
  const payment = (raw.payments ?? [])[0];
  const paymentMethod = (payment?.payment_method ?? "CASH").toUpperCase();
  const d = raw.createdAt ? new Date(raw.createdAt) : null;
  const orderDate = d && !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "";
  const orderTime = d && !isNaN(d.getTime())
    ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : "";

  return {
    id: raw.id,
    orderNumber: raw.order_number ?? raw.id,
    customerName: "Tamu",
    customerPhone: "",
    fulfillmentType: (raw.order_type ?? "DINE_IN").toUpperCase(),
    orderDate,
    orderTime,
    total: Number(raw.total_amount ?? 0),
    paymentMethod,
    status: mapStatus(raw),
  };
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  UNPAID: { label: "Belum Dibayar", color: "warning", icon: Clock },
  READY: { label: "Siap Diproses", color: "primary", icon: CheckCircle2 },
  SHIPPED: { label: "Sudah Dikirim", color: "info", icon: Truck },
  COMPLETED: { label: "Selesai", color: "success", icon: CheckCircle2 },
  FAILED: { label: "Gagal", color: "error", icon: XCircle },
};

const defaultStatusConfig = { label: "Unknown", color: "default" as const, icon: Clock };

const fulfillmentLabels: Record<string, string> = {
  DINE_IN: "Makan di Tempat",
  TAKEAWAY: "Takeaway",
  GOFOOD: "GoFood",
  GRABFOOD: "GrabFood",
  SHOPEE: "ShopeeFood",
  DELIVERY: "Delivery",
};

function formatCurrencyLocal(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function OrderHistoryPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: firstOfMonth, endDate: today });
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentType | "all">("all");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.orders({
        start_date: toDateStr(dateRange.startDate),
        end_date: toDateStr(dateRange.endDate),
        limit: 100,
        page: 1,
      });
      const mapped = (res?.data ?? []).map(mapReportOrder);
      setOrders(mapped);
      setTotalCount(res?.total ?? mapped.length);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.fulfillmentType ?? "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesFulfillment =
        fulfillmentFilter === "all" || order.fulfillmentType === fulfillmentFilter;
      return matchesSearch && matchesStatus && matchesFulfillment;
    });
  }, [orders, searchQuery, statusFilter, fulfillmentFilter]);

  const columns = [
    {
      key: "orderNumber",
      header: "No. Order",
      sortable: true,
      render: (row: Order) => (
        <span className="font-mono text-sm">{row.orderNumber}</span>
      ),
    },
    {
      key: "fulfillmentType",
      header: "Tipe",
      sortable: true,
      render: (row: Order) => (
        <Badge variant="secondary" size="sm">
          {fulfillmentLabels[row.fulfillmentType] ?? row.fulfillmentType}
        </Badge>
      ),
    },
    {
      key: "orderDate",
      header: "Tanggal",
      sortable: true,
      render: (row: Order) => (
        <div className="text-sm">
          <p className="font-medium">{row.orderDate}</p>
          <p className="text-text-secondary">{row.orderTime}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      sortable: true,
      className: "text-right",
      render: (row: Order) => (
        <span className="font-semibold">{formatCurrencyLocal(row.total)}</span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Pembayaran",
      sortable: true,
      render: (row: Order) => (
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-text-secondary" />
          <span className="text-sm">{row.paymentMethod}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Order) => {
        const config = statusConfig[row.status] ?? defaultStatusConfig;
        const Icon = config.icon;
        return (
          <Badge
            variant={config.color as "success" | "warning" | "error" | "info" | "primary"}
            size="sm"
            className="gap-1"
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi",
      className: "text-right",
      render: (row: Order) => (
        <button
          onClick={() => setDetailOrder(row)}
          className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Pesanan"
        description="Lihat riwayat semua pesanan berdasarkan periode"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Riwayat Pesanan" },
        ]}
      />

      {/* Filters */}
      <div className="space-y-4 p-4 bg-surface rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-xl flex-1 max-w-sm">
            <Search className="h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari no. order atau tipe..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-secondary"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            )}
          </div>

          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Semua Status</option>
            <option value="UNPAID">Belum Dibayar</option>
            <option value="READY">Siap Diproses</option>
            <option value="SHIPPED">Sudah Dikirim</option>
            <option value="COMPLETED">Selesai</option>
            <option value="FAILED">Gagal</option>
          </select>

          {/* Fulfillment Filter */}
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value as FulfillmentType | "all")}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Semua Tipe</option>
            <option value="DINE_IN">Makan di Tempat</option>
            <option value="TAKEAWAY">Takeaway</option>
          </select>

          <div className="flex-1" />
          {!loading && (
            <p className="text-sm text-text-secondary">
              {filteredOrders.length} dari {totalCount} pesanan
            </p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <DataTable
            data={filteredOrders}
            columns={columns}
            emptyMessage="Tidak ada pesanan ditemukan"
            pageSize={10}
          />
        )}
      </div>

      {/* Detail Modal */}
      {detailOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDetailOrder(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">Detail Pesanan</h2>
                    <p className="text-sm text-text-secondary mt-0.5">{detailOrder.orderNumber}</p>
                  </div>
                  <button
                    onClick={() => setDetailOrder(null)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">Status</p>
                    {(() => {
                      const config = statusConfig[detailOrder.status] ?? defaultStatusConfig;
                      const Icon = config.icon;
                      return (
                        <Badge
                          variant={config.color as "success" | "warning" | "error" | "primary"}
                          size="sm"
                          className="gap-1"
                        >
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      );
                    })()}
                  </div>
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">Tipe</p>
                    <p className="text-sm font-medium">
                      {fulfillmentLabels[detailOrder.fulfillmentType] ?? detailOrder.fulfillmentType}
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">Pembayaran</p>
                    <p className="text-sm font-medium">{detailOrder.paymentMethod}</p>
                  </div>
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">Tanggal</p>
                    <p className="text-sm font-medium">{detailOrder.orderDate}</p>
                    <p className="text-xs text-text-secondary">{detailOrder.orderTime}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <p className="font-semibold">Total</p>
                  <p className="text-lg font-bold text-primary">
                    {formatCurrencyLocal(detailOrder.total)}
                  </p>
                </div>

                {detailOrder.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-text-secondary mt-0.5" />
                    <div>
                      <p className="text-xs text-text-secondary">Catatan</p>
                      <p className="text-sm">{detailOrder.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
