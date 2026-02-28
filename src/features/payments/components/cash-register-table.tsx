"use client";

import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  CashRegisterLog,
  CASHIER_ACTION_LABELS,
  PAYMENT_METHOD_LABELS,
} from "../types";
import { Receipt } from "lucide-react";

interface CashRegisterTableProps {
  logs: CashRegisterLog[];
}

export function CashRegisterTable({ logs }: CashRegisterTableProps) {
  if (logs.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Receipt className="h-12 w-12 text-text-secondary mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Tidak Ada Catatan Kasir
        </h3>
        <p className="text-sm text-text-secondary">
          Belum ada catatan buka/ganti kasir
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary">
          Catatan Kasir
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Log aktivitas buka kasir dan ganti shift
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-background">
              <TableHead>Outlet</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Metode Pembayaran</TableHead>
              <TableHead>Total Pencatatan</TableHead>
              <TableHead>Kasir</TableHead>
              <TableHead>Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="group transition-colors">
                <TableCell>
                  <span className="text-sm font-medium text-text-primary">
                    {log.outletName}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={log.actionType === 'open' ? 'success' : 'info'}
                    size="sm"
                  >
                    {CASHIER_ACTION_LABELS[log.actionType]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-secondary">
                    {formatDateTime(log.timestamp)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-primary">
                    {PAYMENT_METHOD_LABELS[log.paymentMethod]}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-text-primary">
                    {formatCurrency(log.totalAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-primary">
                    {log.cashierName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-text-secondary">
                    {log.description || '-'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
