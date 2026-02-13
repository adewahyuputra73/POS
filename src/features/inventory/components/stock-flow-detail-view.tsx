"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, ShoppingCart, MinusCircle, ClipboardCheck, ArrowLeftRight, FileText, Calendar, User, MapPin } from "lucide-react";
import { StockFlowDetailRecord, StockFlowType, StockFlowStatus } from "../types";

const typeConfig: Record<StockFlowType, { label: string; icon: React.ReactNode; color: string }> = {
  pembelian: { label: 'Pembelian', icon: <ShoppingCart className="h-4 w-4" />, color: 'bg-green-100 text-green-700' },
  pengeluaran: { label: 'Pengeluaran', icon: <MinusCircle className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  stok_opname: { label: 'Stok Opname', icon: <ClipboardCheck className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  transfer: { label: 'Transfer', icon: <ArrowLeftRight className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
  purchase_order: { label: 'Purchase Order', icon: <FileText className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700' },
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
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface StockFlowDetailViewProps {
  record: StockFlowDetailRecord;
  onBack: () => void;
}

export function StockFlowDetailView({ record, onBack }: StockFlowDetailViewProps) {
  const tc = typeConfig[record.type];
  const sc = statusConfig[record.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${tc.color} mb-3`}>
              {tc.icon}
              {tc.label}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{record.referenceNumber}</h2>
          </div>
          <Badge variant={sc.variant} className="text-sm px-3 py-1">{sc.label}</Badge>
        </div>

        {/* Status Timeline */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-medium text-green-700">Dibuat</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-300" />
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${record.status === 'selesai' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`h-3 w-3 rounded-full ${record.status === 'selesai' ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
            <span className={`text-sm font-medium ${record.status === 'selesai' ? 'text-green-700' : 'text-gray-400'}`}>Selesai</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <div><span className="text-gray-500">Dibuat oleh:</span> <span className="font-medium">{record.createdBy}</span></div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div><span className="text-gray-500">Tanggal:</span> <span className="font-medium">{formatDate(record.createdAt)}</span></div>
          </div>
          {record.supplierName && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div><span className="text-gray-500">Supplier:</span> <span className="font-medium">{record.supplierName}</span></div>
            </div>
          )}
          {record.outletFrom && record.outletTo && (
            <div className="flex items-center gap-2 text-sm">
              <ArrowLeftRight className="h-4 w-4 text-gray-400" />
              <div><span className="text-gray-500">{record.outletFrom}</span> → <span className="font-medium">{record.outletTo}</span></div>
            </div>
          )}
          <div className="text-sm">
            <span className="text-gray-500">Total Bahan:</span> <span className="font-medium">{record.totalItems} item</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Total Harga:</span> <span className="font-medium">{formatCurrency(record.totalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Detail Items */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold">Detail Item</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="font-semibold text-xs">Nama Bahan</TableHead>
              <TableHead className="font-semibold text-xs">Kategori</TableHead>
              <TableHead className="font-semibold text-xs">Tipe</TableHead>
              <TableHead className="font-semibold text-xs text-right">Jumlah</TableHead>
              <TableHead className="font-semibold text-xs">Unit</TableHead>
              <TableHead className="font-semibold text-xs text-right">Harga</TableHead>
              {record.type === 'pengeluaran' && <TableHead className="font-semibold text-xs">Alasan</TableHead>}
              {record.type === 'stok_opname' && <TableHead className="font-semibold text-xs text-right">Stok Terbaru</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {record.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-sm">{item.materialName}</TableCell>
                <TableCell className="text-sm text-gray-600">{item.categoryName}</TableCell>
                <TableCell>
                  <Badge variant="default" className="text-xs">
                    {item.materialType === 'raw' ? 'Mentah' : 'Setengah Jadi'}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right text-sm font-medium ${item.qty < 0 ? 'text-red-600' : ''}`}>
                  {item.qty > 0 ? `+${item.qty.toLocaleString('id-ID')}` : item.qty.toLocaleString('id-ID')}
                </TableCell>
                <TableCell className="text-sm text-gray-600">{item.unit}</TableCell>
                <TableCell className={`text-right text-sm font-medium ${item.price < 0 ? 'text-red-600' : ''}`}>
                  {formatCurrency(item.price)}
                </TableCell>
                {record.type === 'pengeluaran' && (
                  <TableCell>
                    <Badge variant="warning" className="text-xs">{item.reason || '-'}</Badge>
                  </TableCell>
                )}
                {record.type === 'stok_opname' && (
                  <TableCell className="text-right text-sm font-medium">{item.finalStock?.toLocaleString('id-ID') || '-'}</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
