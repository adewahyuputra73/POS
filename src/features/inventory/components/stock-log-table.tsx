"use client";

import { useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { StockLog } from "../types";

interface StockLogTableProps {
  logs: StockLog[];
}

const ITEMS_PER_PAGE = 10;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function StockLogTable({ logs }: StockLogTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [logs]);

  const totalPages = Math.ceil(sortedLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  if (logs.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <FileText className="h-12 w-12 text-text-disabled mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Belum ada riwayat stok</h3>
        <p className="text-sm text-text-secondary">Riwayat mutasi stok akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead>DESKRIPSI</TableHead>
            <TableHead>KETERANGAN</TableHead>
            <TableHead className="text-right">HARGA BELI</TableHead>
            <TableHead className="text-right">JUMLAH</TableHead>
            <TableHead className="text-right">STOK BARU</TableHead>
            <TableHead className="text-right">NILAI STOK</TableHead>
            <TableHead>TANGGAL</TableHead>
            <TableHead>USER</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLogs.map((log) => (
            <TableRow key={log.id} className="hover:bg-background/50">
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    log.mutationType === 'addition' ? "bg-green-500" :
                    log.mutationType === 'reduction' ? "bg-red-500" :
                    log.mutationType === 'sale' ? "bg-blue-500" : "bg-yellow-500"
                  )} />
                  <span className="text-sm font-medium text-text-primary">{log.description}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-text-secondary max-w-[200px] truncate">
                {log.notes || '-'}
                {log.supplierName && (
                  <span className="block text-xs text-text-disabled">Supplier: {log.supplierName}</span>
                )}
              </TableCell>
              <TableCell className="text-right text-sm">
                {log.purchasePrice > 0 ? formatCurrency(log.purchasePrice) : '-'}
              </TableCell>
              <TableCell className="text-right">
                <span className={cn(
                  "text-sm font-medium",
                  log.quantity > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {log.quantity > 0 ? '+' : ''}{new Intl.NumberFormat('id-ID').format(log.quantity)}
                </span>
              </TableCell>
              <TableCell className="text-right text-sm font-medium text-text-primary">
                {new Intl.NumberFormat('id-ID').format(log.newStock)}
              </TableCell>
              <TableCell className="text-right text-sm text-text-secondary">
                {formatCurrency(log.stockValue)}
              </TableCell>
              <TableCell className="text-sm text-text-secondary">
                {formatDate(log.createdAt)}
              </TableCell>
              <TableCell className="text-sm text-text-secondary">{log.userName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-text-secondary">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, logs.length)} dari {logs.length} riwayat
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={currentPage === page ? "primary" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="min-w-[32px]">
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
