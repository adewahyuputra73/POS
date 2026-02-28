"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";
import { Customer, CustomerSegment } from "../types";
import { segmentConfig } from "../mock-data";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatBirthdate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
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
            <TableHead className="font-semibold text-xs">Tipe</TableHead>
            <TableHead className="font-semibold text-xs">Nama Pelanggan</TableHead>
            <TableHead className="font-semibold text-xs text-center">Total Reservasi</TableHead>
            <TableHead className="font-semibold text-xs text-center">Transaksi Sukses</TableHead>
            <TableHead className="font-semibold text-xs text-right">Nilai Transaksi</TableHead>
            <TableHead className="font-semibold text-xs text-center">Ulang Tahun</TableHead>
            <TableHead className="font-semibold text-xs text-center">Produk Disukai</TableHead>
            <TableHead className="font-semibold text-xs text-center">Jumlah Koin</TableHead>
            <TableHead className="font-semibold text-xs">Terakhir Datang</TableHead>
            <TableHead className="font-semibold text-xs text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => {
            const seg = segmentConfig[customer.segment];
            return (
              <TableRow key={customer.id} className="hover:bg-background/50 transition-colors">
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${seg.color}`}>
                    {seg.label}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm text-text-primary">{customer.name}</p>
                    <p className="text-xs text-text-secondary">{customer.phone}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm">{customer.totalReservations}</TableCell>
                <TableCell className="text-center text-sm">{customer.successOrders}</TableCell>
                <TableCell className="text-right text-sm font-medium">{formatCurrency(customer.totalSpent)}</TableCell>
                <TableCell className="text-center text-sm">{formatBirthdate(customer.birthdate)}</TableCell>
                <TableCell className="text-center text-sm">{customer.favProducts}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">●</span> {customer.coins.toLocaleString('id-ID')}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-text-secondary">{formatDate(customer.lastVisit)}</TableCell>
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
