"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Order,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANT,
  PAYMENT_METHOD_LABELS,
  FULFILLMENT_TYPE_LABELS,
} from "../types";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  ArrowRight,
  CreditCard,
} from "lucide-react";

interface TransactionTableProps {
  orders: Order[];
  selectedIds: (string | number)[];
  onToggleSelect: (id: string | number) => void;
  onToggleSelectAll: () => void;
  onViewDetail: (order: Order) => void;
  onDelete: (order: Order) => void;
  onUpdateStatus?: (orderId: string | number, status: string) => Promise<void>;
  onPay?: (order: Order) => void;
}

const STATUS_NEXT: Record<string, { label: string; value: string; colorClass: string }> = {
  PROCESSING: { label: "Tandai Siap", value: "READY", colorClass: "text-warning hover:bg-warning/5" },
  READY:      { label: "Tandai Dikirim", value: "DELIVERED", colorClass: "text-primary hover:bg-primary/5" },
  DELIVERED:  { label: "Tandai Selesai", value: "COMPLETED", colorClass: "text-success hover:bg-success/5" },
};

const PAGE_SIZE = 10;

export function TransactionTable({
  orders,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onDelete,
  onUpdateStatus,
  onPay,
}: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);

  const handleStatusAction = async (orderId: string | number, nextStatus: string) => {
    if (!onUpdateStatus) return;
    setUpdatingId(orderId);
    await onUpdateStatus(orderId, nextStatus);
    setUpdatingId(null);
  };
  const [sortField, setSortField] = useState<'orderDate' | 'totalPrice'>('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === 'orderDate') {
      return sortOrder === 'desc'
        ? new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        : new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    }
    return sortOrder === 'desc' ? b.totalPrice - a.totalPrice : a.totalPrice - b.totalPrice;
  });

  // Paginate
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (field: 'orderDate' | 'totalPrice') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const allSelected = paginatedOrders.length > 0 && paginatedOrders.every((o) => selectedIds.includes(o.id));

  if (orders.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <ShoppingCart className="h-12 w-12 text-text-secondary mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Tidak Ada Transaksi
        </h3>
        <p className="text-sm text-text-secondary">
          Tidak ditemukan transaksi sesuai filter yang dipilih
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-background">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
              </TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>No. Order</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-text-primary"
                onClick={() => handleSort('orderDate')}
              >
                Tanggal {sortField === 'orderDate' && (sortOrder === 'desc' ? '↓' : '↑')}
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-text-primary"
                onClick={() => handleSort('totalPrice')}
              >
                Total {sortField === 'totalPrice' && (sortOrder === 'desc' ? '↓' : '↑')}
              </TableHead>
              <TableHead>Pembayaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => {
              const isSelected = selectedIds.includes(order.id);
              return (
                <TableRow
                  key={order.id}
                  className={cn(
                    "group transition-colors",
                    isSelected && "bg-primary/5"
                  )}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(order.id)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-text-primary leading-none">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {order.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-primary">
                      {order.orderNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-primary">
                      {FULFILLMENT_TYPE_LABELS[order.fulfillmentType]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-text-secondary">
                      {formatDateTime(order.orderDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-text-primary">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" size="sm">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ORDER_STATUS_VARIANT[order.status]}
                      size="sm"
                      className="uppercase tracking-wider"
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      {/* Tombol Bayar — hanya untuk order belum bayar */}
                      {order.status === "unpaid" && onPay && (
                        <button
                          onClick={() => onPay(order)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-success bg-success/10 hover:bg-success/20 rounded-lg transition-colors"
                          title="Konfirmasi Pembayaran"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          Bayar
                        </button>
                      )}
                      <button
                        onClick={() => onViewDetail(order)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(() => {
                        const next = STATUS_NEXT[order.fulfillmentStatus ?? ""];
                        if (!next || !onUpdateStatus) return null;
                        const isUpdating = updatingId === order.id;
                        return (
                          <button
                            onClick={() => handleStatusAction(order.id, next.value)}
                            disabled={isUpdating}
                            className={cn(
                              "p-2 rounded-lg transition-colors disabled:opacity-50",
                              next.colorClass
                            )}
                            title={next.label}
                          >
                            {isUpdating ? (
                              <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                          </button>
                        );
                      })()}
                      {(order.status === 'completed' || order.status === 'failed') && (
                        <button
                          onClick={() => onDelete(order)}
                          className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-text-secondary">
            Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, orders.length)} dari {orders.length} transaksi
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "h-8 w-8 rounded-lg text-sm font-medium transition-colors",
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-background"
                )}
              >
                {page}
              </button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
