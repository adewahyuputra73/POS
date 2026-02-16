"use client";

import { CoinCustomer } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ArrowUpDown, ArrowDown, Coins } from 'lucide-react';

interface CoinTableProps {
  customers: CoinCustomer[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onAdjust: (customer: CoinCustomer) => void;
  onTransfer: (customer: CoinCustomer) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function CoinTable({ customers, selectedIds, onToggleSelect, onToggleSelectAll, onAdjust, onTransfer }: CoinTableProps) {
  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <Coins className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Belum ada data koin pelanggan</p>
      </div>
    );
  }

  const allSelected = customers.length > 0 && selectedIds.length === customers.length;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-10">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </TableHead>
            <TableHead className="font-semibold text-xs">Nama Pelanggan</TableHead>
            <TableHead className="font-semibold text-xs">Nomor Telepon</TableHead>
            <TableHead className="font-semibold text-xs text-right">Total Koin</TableHead>
            <TableHead className="font-semibold text-xs text-right">Nilai Koin (Rp)</TableHead>
            <TableHead className="font-semibold text-xs text-center w-40">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id} className="hover:bg-gray-50/50 transition-colors">
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onChange={() => onToggleSelect(c.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-100 to-yellow-50 flex items-center justify-center">
                    <span className="text-xs font-semibold text-amber-700">{c.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{c.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-gray-600">{c.phone}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Coins className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-sm font-semibold text-gray-900">{formatNumber(c.totalCoins)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right text-sm text-gray-700 font-medium">{formatCurrency(c.coinValue)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => onAdjust(c)} className="h-7 text-xs gap-1">
                    <ArrowUpDown className="h-3 w-3" /> Adjust
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onTransfer(c)} className="h-7 text-xs gap-1">
                    <ArrowDown className="h-3 w-3 rotate-[135deg]" /> Transfer
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
