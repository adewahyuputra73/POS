"use client";

import { useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
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
  PaymentRecord,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANT,
} from "../types";
import {
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

interface PaymentTableProps {
  payments: PaymentRecord[];
}

const PAGE_SIZE = 10;

export function PaymentTable({ payments }: PaymentTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'paidAt' | 'amount'>('paidAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sort
  const sortedPayments = [...payments].sort((a, b) => {
    if (sortField === 'paidAt') {
      return sortOrder === 'desc'
        ? new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
        : new Date(a.paidAt).getTime() - new Date(b.paidAt).getTime();
    }
    return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
  });

  // Paginate
  const totalPages = Math.ceil(sortedPayments.length / PAGE_SIZE);
  const paginatedPayments = sortedPayments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSort = (field: 'paidAt' | 'amount') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (payments.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Wallet className="h-12 w-12 text-text-secondary mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Tidak Ada Pembayaran
        </h3>
        <p className="text-sm text-text-secondary">
          Tidak ditemukan catatan pembayaran sesuai filter yang dipilih
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
              <TableHead>No. Faktur</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Metode</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-text-primary"
                onClick={() => handleSort('amount')}
              >
                Nominal {sortField === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-text-primary"
                onClick={() => handleSort('paidAt')}
              >
                Waktu {sortField === 'paidAt' && (sortOrder === 'desc' ? '↓' : '↑')}
              </TableHead>
              <TableHead>Kasir</TableHead>
              <TableHead>Outlet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayments.map((payment) => (
              <TableRow key={payment.id} className="group transition-colors">
                <TableCell>
                  <span className="text-sm font-medium text-primary">
                    {payment.orderNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-semibold text-text-primary leading-none">
                      {payment.customerName}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      {payment.customerPhone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {PAYMENT_METHOD_ICONS[payment.paymentMethod]}
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {PAYMENT_METHOD_LABELS[payment.paymentMethod]}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-text-primary">
                    {formatCurrency(payment.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={PAYMENT_STATUS_VARIANT[payment.status]}
                    size="sm"
                    className="uppercase tracking-wider"
                  >
                    {PAYMENT_STATUS_LABELS[payment.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-secondary">
                    {formatDateTime(payment.paidAt)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-primary">
                    {payment.cashierName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-secondary">
                    {payment.outletName}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-text-secondary">
            Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, payments.length)} dari {payments.length} pembayaran
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
