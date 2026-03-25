"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Button, useToast } from "@/components/ui";
import { TransactionTable } from "@/features/transactions/components/transaction-table";
import { TransactionFilterBar } from "@/features/transactions/components/transaction-filters";
import { TransactionDetail } from "@/features/transactions/components/transaction-detail";
import { TransactionCreateModal } from "@/features/transactions/components/transaction-create-modal";
import {
  Order,
  OrderStatus,
  TransactionFilters,
} from "@/features/transactions/types";
import { filterOrders, getOrderStats } from "@/features/transactions/mock-data";
import { orderService } from "@/features/orders/services/order-service";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
  Search,
  Download,
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  X,
  CalendarDays,
  Trash2,
  Plus,
} from "lucide-react";

function mapStatus(raw: string): OrderStatus {
  const map: Record<string, OrderStatus> = {
    UNPAID: "unpaid", READY: "ready", SHIPPED: "shipped",
    COMPLETED: "completed", CANCELLED: "failed", FAILED: "failed",
    unpaid: "unpaid", ready: "ready", shipped: "shipped",
    completed: "completed", cancelled: "failed", failed: "failed",
    PROCESSING: "ready", processing: "ready",
  };
  return map[raw] ?? "unpaid";
}

function mapApiOrder(raw: any): Order {
  return {
    id: raw.id,
    orderNumber: raw.order_number ?? raw.id,
    customerName: raw.customer_name ?? raw.customerName ?? raw.customer?.name ?? "",
    customerPhone: raw.customer_phone ?? raw.customerPhone ?? raw.customer?.phone ?? "",
    fulfillmentType: ((raw.order_type ?? raw.fulfillment_type ?? "dine_in") as string).toLowerCase() as Order["fulfillmentType"],
    orderDate: raw.created_at ?? raw.createdAt ?? "",
    completedAt: raw.completed_at ?? raw.completedAt ?? undefined,
    totalPrice: Number(raw.total ?? raw.total_price ?? 0),
    subtotal: Number(raw.subtotal ?? raw.total ?? 0),
    discount: Number(raw.discount ?? 0),
    tax: Number(raw.tax ?? 0),
    serviceFee: Number(raw.service_fee ?? 0),
    shippingFee: Number(raw.shipping_fee ?? 0),
    paymentMethod: ((raw.payment_method ?? "cash") as string).toLowerCase() as Order["paymentMethod"],
    status: mapStatus(raw.status ?? ""),
    items: (raw.items ?? []).map((item: any) => ({
      id: item.id ?? 0,
      productId: item.product_id ?? 0,
      productName: item.product_name ?? item.name ?? "",
      quantity: item.qty ?? item.quantity ?? 1,
      price: Number(item.price ?? 0),
      discount: Number(item.discount ?? 0),
      subtotal: Number(item.subtotal ?? item.price ?? 0),
    })),
    cashierName: raw.cashier_name ?? raw.cashier?.name ?? "",
  };
}

export default function TransactionsPage() {
  const { showToast } = useToast();

  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // View state
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>({
    search: "",
    status: "all",
    paymentMethod: "all",
    fulfillmentType: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);

  // Change date modal
  const [changeDateTarget, setChangeDateTarget] = useState<boolean>(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const raw = await orderService.list({ limit: 100 });
      const mapped = (Array.isArray(raw) ? raw : []).map(mapApiOrder);
      setOrders(mapped);
    } catch {
      showToast("Gagal memuat transaksi", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Computed
  const mergedFilters = useMemo(
    () => ({ ...filters, search: searchQuery }),
    [filters, searchQuery]
  );

  const filteredOrders = useMemo(
    () => filterOrders(orders, mergedFilters),
    [orders, mergedFilters]
  );

  const stats = useMemo(() => getOrderStats(orders), [orders]);

  // Handlers
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedOrder(null);
  };

  const handleToggleSelect = (id: string | number) => {
    const sid = String(id);
    setSelectedIds((prev) =>
      prev.includes(sid) ? prev.filter((x) => x !== sid) : [...prev, sid]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => String(o.id)));
    }
  };

  const handleDelete = (order: Order) => {
    // Validate: only completed or failed
    if (order.status !== "completed" && order.status !== "failed") {
      showToast("Hanya pesanan Selesai atau Gagal yang bisa dihapus", "error");
      return;
    }
    setDeleteTarget(order);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await orderService.void(deleteTarget.id, { reason: "Dihapus oleh admin" });
      await fetchData();
      showToast(`Pesanan ${deleteTarget.orderNumber} berhasil di-void`, "success");
    } catch {
      showToast("Gagal menghapus pesanan", "error");
    } finally {
      setDeleteTarget(null);
      setSelectedIds((prev) => prev.filter((id) => id !== String(deleteTarget.id)));
    }
  };

  const handleBulkDelete = () => {
    const selected = orders.filter((o) => selectedIds.includes(String(o.id)));
    const invalid = selected.filter(
      (o) => o.status !== "completed" && o.status !== "failed"
    );
    if (invalid.length > 0) {
      showToast(
        `${invalid.length} pesanan tidak bisa dihapus karena belum Selesai/Gagal`,
        "error"
      );
      return;
    }
    setBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => orderService.void(id, { reason: "Dihapus oleh admin" }))
      );
      await fetchData();
      showToast(`${selectedIds.length} pesanan berhasil di-void`, "success");
    } catch {
      showToast("Gagal menghapus beberapa pesanan", "error");
    } finally {
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
    }
  };

  const handleChangeDate = () => {
    const selected = orders.filter((o) => selectedIds.includes(String(o.id)));
    const invalid = selected.filter((o) => o.status !== "completed");
    if (invalid.length > 0) {
      showToast("Hanya pesanan Selesai yang bisa diubah tanggalnya", "error");
      return;
    }
    setChangeDateTarget(true);
    setNewDate("");
    setNewTime("");
  };

  const confirmChangeDate = () => {
    if (!newDate || !newTime) {
      showToast("Tanggal dan jam harus diisi", "error");
      return;
    }
    showToast("Fitur ubah tanggal belum tersedia di API", "error");
    setChangeDateTarget(false);
    setSelectedIds([]);
  };

  // Detail view
  if (view === "detail" && selectedOrder) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Transaksi"
          description={selectedOrder.orderNumber}
          breadcrumbs={[
            { label: "Home", href: "/dashboard" },
            { label: "Transaksi", href: "/transactions" },
            { label: selectedOrder.orderNumber },
          ]}
        />
        <TransactionDetail order={selectedOrder} onBack={handleBackToList} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Transaksi",
      value: formatNumber(stats.totalOrders),
      icon: ShoppingCart,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Pendapatan",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Item Terjual",
      value: formatNumber(stats.totalItems),
      icon: Package,
      color: "text-purple",
      bg: "bg-purple/10",
    },
    {
      label: "Selesai",
      value: formatNumber(stats.completedOrders),
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Dalam Proses",
      value: formatNumber(stats.pendingOrders),
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Gagal",
      value: formatNumber(stats.failedOrders),
      icon: XCircle,
      color: "text-error",
      bg: "bg-error/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Transaksi"
        description="Riwayat pesanan dan transaksi outlet Anda"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Transaksi" },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1.5">
              <Download className="h-4 w-4" /> Ekspor
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Tambah Transaksi
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  stat.bg
                )}
              >
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-text-primary truncate">
                  {stat.value}
                </p>
                <p className="text-[11px] text-text-secondary font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, telepon, atau nomor order..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <TransactionFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredOrders.length}
          totalOrders={orders.length}
        />
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {selectedIds.length} pesanan dipilih
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleChangeDate}
              className="gap-1.5"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Ubah Tanggal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Transaction Table */}
      <TransactionTable
        orders={filteredOrders}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Hapus Pesanan?
              </h3>
              <p className="text-text-secondary mb-6">
                Pesanan <strong>{deleteTarget.orderNumber}</strong> yang dihapus
                tidak dapat dikembalikan. Apakah Anda yakin?
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                >
                  Batal
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Hapus Pesanan
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bulk Delete Confirmation Modal */}
      {bulkDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setBulkDeleteConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Hapus {selectedIds.length} Pesanan?
              </h3>
              <p className="text-text-secondary mb-6">
                Pesanan yang dihapus tidak dapat dikembalikan. Apakah Anda yakin
                ingin menghapus {selectedIds.length} pesanan?
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setBulkDeleteConfirm(false)}
                >
                  Batal
                </Button>
                <Button variant="destructive" onClick={confirmBulkDelete}>
                  Hapus {selectedIds.length} Pesanan
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change Date Modal */}
      {changeDateTarget && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setChangeDateTarget(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Ubah Tanggal Selesai
              </h3>
              <p className="text-text-secondary mb-4">
                Ubah tanggal selesai untuk {selectedIds.length} pesanan yang
                dipilih.
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Jam
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setChangeDateTarget(false)}
                >
                  Batal
                </Button>
                <Button onClick={confirmChangeDate}>Simpan</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    {showCreateModal && (
      <TransactionCreateModal
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => { setShowCreateModal(false); fetchData(); }}
      />
    )}
    </>
  );
}
