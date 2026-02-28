"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { DataTable } from "@/features/reports/components/data-table";
import {
  Search,
  X,
  Eye,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  CreditCard,
  ChevronDown,
  User,
  Phone,
  MapPin,
  FileText,
  Edit2,
  AlertTriangle,
} from "lucide-react";

type OrderStatus = "UNPAID" | "READY" | "SHIPPED" | "COMPLETED" | "FAILED";
type PaymentMethod = "CASH" | "QRIS" | "TRANSFER" | "CARD" | "EWALLET";
type FulfillmentType = "DINE_IN" | "TAKEAWAY" | "GOFOOD" | "GRABFOOD" | "SHOPEE" | "DELIVERY";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  fulfillmentType: FulfillmentType;
  orderDate: string;
  orderTime: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: { name: string; qty: number; price: number }[];
  address?: string;
  notes?: string;
  courier?: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2026020101",
    customerName: "Ahmad Rizky",
    customerPhone: "081234567890",
    fulfillmentType: "DINE_IN",
    orderDate: "2026-02-01",
    orderTime: "10:30",
    total: 125000,
    paymentMethod: "CASH",
    status: "COMPLETED",
    items: [
      { name: "Kopi Susu Gula Aren", qty: 2, price: 30000 },
      { name: "Nasi Goreng Spesial", qty: 1, price: 35000 },
      { name: "Es Teh Manis", qty: 2, price: 15000 },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2026020102",
    customerName: "Siti Aminah",
    customerPhone: "081987654321",
    fulfillmentType: "GOFOOD",
    orderDate: "2026-02-01",
    orderTime: "11:45",
    total: 98000,
    paymentMethod: "EWALLET",
    status: "SHIPPED",
    items: [
      { name: "Matcha Latte", qty: 2, price: 38000 },
      { name: "Croissant", qty: 1, price: 22000 },
    ],
    courier: "Driver GoFood",
    address: "Jl. Sudirman No. 123, Jakarta",
    notes: "Jangan terlalu manis",
  },
  {
    id: "3",
    orderNumber: "ORD-2026020103",
    customerName: "Budi Santoso",
    customerPhone: "082112345678",
    fulfillmentType: "TAKEAWAY",
    orderDate: "2026-02-01",
    orderTime: "12:15",
    total: 65000,
    paymentMethod: "QRIS",
    status: "READY",
    items: [
      { name: "Americano", qty: 1, price: 25000 },
      { name: "Sandwich", qty: 1, price: 28000 },
      { name: "Cookies", qty: 1, price: 12000 },
    ],
  },
  {
    id: "4",
    orderNumber: "ORD-2026020104",
    customerName: "Maya Sari",
    customerPhone: "083345678901",
    fulfillmentType: "GRABFOOD",
    orderDate: "2026-02-01",
    orderTime: "13:00",
    total: 156000,
    paymentMethod: "EWALLET",
    status: "FAILED",
    items: [
      { name: "Nasi Goreng Spesial", qty: 2, price: 70000 },
      { name: "Es Teh Manis", qty: 2, price: 20000 },
      { name: "Cappuccino", qty: 2, price: 66000 },
    ],
    courier: "Driver GrabFood",
    address: "Jl. Gatot Subroto No. 45, Jakarta",
    notes: "Cancel by customer",
  },
  {
    id: "5",
    orderNumber: "ORD-2026020105",
    customerName: "Dewi Lestari",
    customerPhone: "085567890123",
    fulfillmentType: "DINE_IN",
    orderDate: "2026-02-01",
    orderTime: "14:30",
    total: 45000,
    paymentMethod: "CARD",
    status: "UNPAID",
    items: [
      { name: "Kopi Susu Gula Aren", qty: 1, price: 30000 },
      { name: "Es Teh Manis", qty: 1, price: 15000 },
    ],
  },
  {
    id: "6",
    orderNumber: "ORD-2026013101",
    customerName: "Eko Prasetyo",
    customerPhone: "086678901234",
    fulfillmentType: "DELIVERY",
    orderDate: "2026-01-31",
    orderTime: "16:00",
    total: 210000,
    paymentMethod: "TRANSFER",
    status: "COMPLETED",
    items: [
      { name: "Matcha Latte", qty: 3, price: 114000 },
      { name: "Croissant", qty: 2, price: 44000 },
      { name: "Cheesecake", qty: 1, price: 52000 },
    ],
    address: "Jl. Rasuna Said No. 78, Jakarta",
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  UNPAID: { label: "Belum Dibayar", color: "warning", icon: Clock },
  READY: { label: "Siap Diproses", color: "primary", icon: CheckCircle2 },
  SHIPPED: { label: "Sudah Dikirim", color: "info", icon: Truck },
  COMPLETED: { label: "Selesai", color: "success", icon: CheckCircle2 },
  FAILED: { label: "Gagal", color: "error", icon: XCircle },
};

const paymentLabels: Record<PaymentMethod, string> = {
  CASH: "Tunai",
  QRIS: "QRIS",
  TRANSFER: "Transfer",
  CARD: "Kartu",
  EWALLET: "E-Wallet",
};

const fulfillmentLabels: Record<FulfillmentType, string> = {
  DINE_IN: "Makan di Tempat",
  TAKEAWAY: "Takeaway",
  GOFOOD: "GoFood",
  GRABFOOD: "GrabFood",
  SHOPEE: "ShopeeFood",
  DELIVERY: "Delivery",
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">("all");
  const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentType | "all">("all");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerPhone.includes(searchQuery) ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentMethod === paymentFilter;
      const matchesFulfillment = fulfillmentFilter === "all" || order.fulfillmentType === fulfillmentFilter;
      return matchesSearch && matchesStatus && matchesPayment && matchesFulfillment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter, fulfillmentFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const canChangeDate = () => {
    const selected = orders.filter((o) => selectedOrders.includes(o.id));
    return selected.every((o) => o.status === "COMPLETED");
  };

  const canDelete = () => {
    const selected = orders.filter((o) => selectedOrders.includes(o.id));
    return selected.every((o) => o.status === "COMPLETED" || o.status === "FAILED");
  };

  const handleChangeDate = () => {
    if (!canChangeDate()) {
      alert("Hanya pesanan dengan status Selesai yang dapat diubah tanggalnya");
      return;
    }
    setShowDateModal(true);
  };

  const handleConfirmDateChange = () => {
    setOrders((prev) =>
      prev.map((order) =>
        selectedOrders.includes(order.id)
          ? { ...order, orderDate: newDate, orderTime: newTime }
          : order
      )
    );
    setShowDateModal(false);
    setSelectedOrders([]);
    setNewDate("");
    setNewTime("");
  };

  const handleDelete = () => {
    if (!canDelete()) {
      alert("Tidak dapat menghapus pesanan dengan status Belum Dibayar atau Siap Diproses");
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setOrders((prev) => prev.filter((order) => !selectedOrders.includes(order.id)));
    setShowDeleteConfirm(false);
    setSelectedOrders([]);
  };

  const columns = [
    {
      key: "select",
      header: (
        <input
          type="checkbox"
          checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
      ),
      className: "w-10",
      render: (row: Order) => (
        <input
          type="checkbox"
          checked={selectedOrders.includes(row.id)}
          onChange={(e) => handleSelectOrder(row.id, e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
      ),
    },
    {
      key: "customer",
      header: "Pelanggan",
      sortable: true,
      render: (row: Order) => (
        <div>
          <p className="font-semibold text-text-primary">{row.customerName}</p>
          <p className="text-xs text-text-secondary">{row.customerPhone}</p>
        </div>
      ),
    },
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
          {fulfillmentLabels[row.fulfillmentType]}
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
        <span className="font-semibold">{formatCurrency(row.total)}</span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Pembayaran",
      sortable: true,
      render: (row: Order) => (
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-4 w-4 text-text-secondary" />
          <span className="text-sm">{paymentLabels[row.paymentMethod]}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row: Order) => {
        const config = statusConfig[row.status];
        const Icon = config.icon;
        return (
          <Badge variant={config.color as "success" | "warning" | "error" | "info" | "primary"} size="sm" className="gap-1">
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
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => setDetailOrder(row)}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (row.status !== "COMPLETED" && row.status !== "FAILED") {
                alert("Tidak dapat menghapus pesanan dengan status ini");
                return;
              }
              setSelectedOrders([row.id]);
              setShowDeleteConfirm(true);
            }}
            className="p-2 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Riwayat Pesanan"
        description="Kelola dan lihat riwayat semua pesanan"
        breadcrumbs={[
          { label: "Home", href: "/" },
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
              placeholder="Cari nama, no. telp, atau no. order..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-text-secondary"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-text-secondary" />
              </button>
            )}
          </div>

          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
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

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentMethod | "all")}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="all">Semua Pembayaran</option>
            <option value="CASH">Tunai</option>
            <option value="QRIS">QRIS</option>
            <option value="TRANSFER">Transfer</option>
            <option value="CARD">Kartu</option>
            <option value="EWALLET">E-Wallet</option>
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
            <option value="GOFOOD">GoFood</option>
            <option value="GRABFOOD">GrabFood</option>
            <option value="SHOPEE">ShopeeFood</option>
            <option value="DELIVERY">Delivery</option>
          </select>

          <div className="flex-1" />

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {selectedOrders.length} dipilih
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChangeDate}
                className="gap-1.5"
              >
                <Calendar className="h-4 w-4" />
                Ubah Tanggal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="gap-1.5 text-error border-error hover:bg-error-light"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        <DataTable
          data={filteredOrders}
          columns={columns}
          emptyMessage="Tidak ada pesanan ditemukan"
          pageSize={10}
        />
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
                    <h2 className="text-xl font-bold text-text-primary">
                      Detail Pesanan
                    </h2>
                    <p className="text-sm text-text-secondary mt-0.5">
                      {detailOrder.orderNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => setDetailOrder(null)}
                    className="p-2 hover:bg-background rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Pelanggan</h3>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{detailOrder.customerName}</p>
                      <p className="text-sm text-text-secondary">{detailOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Payment */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">Status</p>
                    <Badge
                      variant={statusConfig[detailOrder.status].color as "success" | "warning" | "error" | "primary"}
                      size="sm"
                    >
                      {statusConfig[detailOrder.status].label}
                    </Badge>
                  </div>
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-xs text-text-secondary mb-1">Pembayaran</p>
                    <p className="font-medium">{paymentLabels[detailOrder.paymentMethod]}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-text-primary">Item Pesanan</h3>
                  <div className="space-y-2">
                    {detailOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-text-secondary">x{item.qty}</p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <p className="font-semibold">Total</p>
                    <p className="text-lg font-bold text-primary">{formatCurrency(detailOrder.total)}</p>
                  </div>
                </div>

                {/* Address & Notes */}
                {(detailOrder.address || detailOrder.notes) && (
                  <div className="space-y-3">
                    {detailOrder.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-text-secondary mt-0.5" />
                        <div>
                          <p className="text-xs text-text-secondary">Alamat</p>
                          <p className="text-sm">{detailOrder.address}</p>
                        </div>
                      </div>
                    )}
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
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Date Change Modal */}
      {showDateModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDateModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-text-primary mb-4">
                Ubah Tanggal Pesanan
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                {selectedOrders.length} pesanan akan diubah tanggalnya
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tanggal Baru</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Jam Baru</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowDateModal(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleConfirmDateChange} disabled={!newDate || !newTime}>
                    Simpan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-error-light rounded-xl">
                  <AlertTriangle className="h-6 w-6 text-error" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Hapus Pesanan
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {selectedOrders.length} pesanan akan dihapus
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-6">
                Pesanan yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                  Batal
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  className="bg-error hover:bg-error/90"
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
