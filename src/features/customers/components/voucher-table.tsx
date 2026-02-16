"use client";

import { Voucher } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2, Tag, Truck } from 'lucide-react';

interface VoucherTableProps {
  vouchers: Voucher[];
  onEdit: (voucher: Voucher) => void;
  onDelete: (voucher: Voucher) => void;
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  active: { label: 'Berjalan', variant: 'success' },
  upcoming: { label: 'Akan Datang', variant: 'warning' },
  ended: { label: 'Selesai', variant: 'default' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function VoucherTable({ vouchers, onEdit, onDelete }: VoucherTableProps) {
  if (vouchers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <Tag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Belum ada voucher</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="font-semibold text-xs">Kode & Tipe Diskon</TableHead>
            <TableHead className="font-semibold text-xs">Detail Voucher</TableHead>
            <TableHead className="font-semibold text-xs">Durasi</TableHead>
            <TableHead className="font-semibold text-xs">Kuota Diskon</TableHead>
            <TableHead className="font-semibold text-xs text-center">Status</TableHead>
            <TableHead className="font-semibold text-xs text-center w-24">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vouchers.map((v) => {
            const sc = statusConfig[v.status];
            const discountLabel = v.discountType === 'percent'
              ? `${v.discountValue}%`
              : formatCurrency(v.discountValue);
            const quotaPercent = v.quotaTotal ? Math.round((v.quotaUsed / v.quotaTotal) * 100) : null;

            return (
              <TableRow key={v.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Kode & Tipe */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${v.type === 'produk' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                      {v.type === 'produk' ? <Tag className="h-4 w-4" /> : <Truck className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-mono font-semibold text-sm text-gray-900">{v.code}</p>
                      <p className="text-[11px] text-gray-500 capitalize">{v.type === 'produk' ? 'Diskon Produk' : 'Ongkos Kirim'}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Detail */}
                <TableCell>
                  <p className="text-sm text-gray-900">{v.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-primary">{discountLabel}</span>
                    {v.budgetPerTransaction && (
                      <span className="text-[11px] text-gray-400">maks {formatCurrency(v.budgetPerTransaction)}/trx</span>
                    )}
                    {v.isStackable && <Badge variant="info" size="sm">Stackable</Badge>}
                  </div>
                </TableCell>

                {/* Durasi */}
                <TableCell>
                  <p className="text-xs text-gray-700">{formatDate(v.startDate)}</p>
                  <p className="text-[11px] text-gray-400">s/d {formatDate(v.endDate)}</p>
                </TableCell>

                {/* Kuota */}
                <TableCell>
                  {v.quotaTotal ? (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-600">{v.quotaUsed} / {v.quotaTotal}</span>
                        <span className="text-gray-400">{quotaPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${quotaPercent! >= 100 ? 'bg-red-500' : quotaPercent! >= 75 ? 'bg-yellow-500' : 'bg-primary'}`}
                          style={{ width: `${Math.min(quotaPercent!, 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Tanpa batas</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(v)} className="h-8 w-8 p-0" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(v)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700" title="Hapus">
                      <Trash2 className="h-4 w-4" />
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
