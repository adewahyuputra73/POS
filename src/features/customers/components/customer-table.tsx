"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";
import { Customer } from "../types";

function formatCurrency(value: string): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(value));
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface CustomerTableProps {
  customers: Customer[];
  onViewDetail: (customer: Customer) => void;
  onWhatsApp: (customer: Customer) => void;
}

export function CustomerTable({ customers, onViewDetail, onWhatsApp }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-background flex items-center justify-center">
          <Eye className="h-6 w-6 text-text-disabled" />
        </div>
        <h3 className="text-sm font-medium text-text-primary">Belum ada pelanggan</h3>
        <p className="mt-1 text-sm text-text-secondary">Pelanggan akan muncul setelah ada transaksi</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead className="font-semibold text-xs">Nama Pelanggan</TableHead>
            <TableHead className="font-semibold text-xs text-center">Total Pesanan</TableHead>
            <TableHead className="font-semibold text-xs text-right">Total Belanja</TableHead>
            <TableHead className="font-semibold text-xs">Order Terakhir</TableHead>
            <TableHead className="font-semibold text-xs text-center">Status</TableHead>
            <TableHead className="font-semibold text-xs text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-background/50 transition-colors">
              <TableCell>
                <div>
                  <p className="font-medium text-sm text-text-primary">{customer.name}</p>
                  <p className="text-xs text-text-secondary">{customer.phone}</p>
                </div>
              </TableCell>
              <TableCell className="text-center text-sm">{customer.total_orders}</TableCell>
              <TableCell className="text-right text-sm font-medium">{formatCurrency(customer.total_spent)}</TableCell>
              <TableCell className="text-sm text-text-secondary">{formatDate(customer.last_order_at)}</TableCell>
              <TableCell className="text-center">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {customer.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetail(customer)} className="h-8 w-8 p-0" title="Lihat detail">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onWhatsApp(customer)} className="h-8 w-8 p-0 text-green-600 hover:text-green-700" title="WhatsApp">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
