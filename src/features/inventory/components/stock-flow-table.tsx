"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, MinusCircle, ClipboardCheck, ArrowLeftRight, FileText } from "lucide-react";
import { StockFlowRecord, StockFlowType, StockFlowStatus } from "../types";

const typeConfig: Record<StockFlowType, { label: string; icon: React.ReactNode; color: string }> = {
  pembelian: { label: 'Pembelian', icon: <ShoppingCart className="h-3.5 w-3.5" />, color: 'bg-green-100 text-green-700' },
  pengeluaran: { label: 'Pengeluaran', icon: <MinusCircle className="h-3.5 w-3.5" />, color: 'bg-red-100 text-red-700' },
  stok_opname: { label: 'Stok Opname', icon: <ClipboardCheck className="h-3.5 w-3.5" />, color: 'bg-blue-100 text-blue-700' },
  transfer: { label: 'Transfer', icon: <ArrowLeftRight className="h-3.5 w-3.5" />, color: 'bg-purple-100 text-purple-700' },
  purchase_order: { label: 'Purchase Order', icon: <FileText className="h-3.5 w-3.5" />, color: 'bg-orange-100 text-orange-700' },
};

const statusConfig: Record<StockFlowStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'info' }> = {
  selesai: { label: 'Selesai', variant: 'success' },
  diminta: { label: 'Diminta', variant: 'warning' },
  dikirim: { label: 'Dikirim', variant: 'info' },
};

function formatCurrency(value: number | null): string {
  if (value === null) return '-';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface StockFlowTableProps {
  records: StockFlowRecord[];
  onViewDetail: (record: StockFlowRecord) => void;
}

export function StockFlowTable({ records, onViewDetail }: StockFlowTableProps) {
  if (records.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-background flex items-center justify-center">
          <FileText className="h-6 w-6 text-text-disabled" />
        </div>
        <h3 className="text-sm font-medium text-text-primary">Belum ada arus stok</h3>
        <p className="mt-1 text-sm text-text-secondary">Buat transaksi arus stok pertama Anda</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead className="font-semibold text-xs">Tipe Transfer</TableHead>
            <TableHead className="font-semibold text-xs">No. Referensi</TableHead>
            <TableHead className="font-semibold text-xs">Outlet / Supplier</TableHead>
            <TableHead className="font-semibold text-xs text-center">Total Bahan</TableHead>
            <TableHead className="font-semibold text-xs text-right">Total Harga</TableHead>
            <TableHead className="font-semibold text-xs">Tanggal</TableHead>
            <TableHead className="font-semibold text-xs">Status</TableHead>
            <TableHead className="font-semibold text-xs text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const tc = typeConfig[record.type];
            const sc = statusConfig[record.status];
            return (
              <TableRow key={record.id} className="hover:bg-background/50 transition-colors">
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${tc.color}`}>
                    {tc.icon}
                    {tc.label}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-text-secondary">{record.referenceNumber}</TableCell>
                <TableCell className="text-sm">{record.outletOrSupplier}</TableCell>
                <TableCell className="text-center text-sm">{record.totalItems} item</TableCell>
                <TableCell className="text-right text-sm font-medium">
                  {record.totalPrice !== null ? (
                    <span className={record.totalPrice < 0 ? 'text-red-600' : ''}>
                      {formatCurrency(record.totalPrice)}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-sm text-text-secondary">{formatDate(record.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={sc.variant}>{sc.label}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetail(record)} className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
