"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, FileText } from "lucide-react";
import { mockSuppliers, mockSupplierMaterials, mockRawMaterials, mockInventoryCategories } from "../mock-data";
import { StockStatus } from "../types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

interface PurchaseOrderFormProps {
  onSubmit: (data: { supplierId: number; deliveryDate: string; items: { materialId: number; qty: number; unit: string }[] }) => void;
  onCancel: () => void;
}

export function PurchaseOrderForm({ onSubmit, onCancel }: PurchaseOrderFormProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemData, setItemData] = useState<Map<number, number>>(new Map());

  const supplierMaterials = useMemo(() => {
    if (!selectedSupplierId) return [];
    const suppId = parseInt(selectedSupplierId);
    const supplierBahan = mockSupplierMaterials.filter(sm => sm.supplierId === suppId);
    return supplierBahan.map(sb => {
      const material = mockRawMaterials.find(m => m.id === sb.materialId);
      return {
        ...sb,
        currentStock: material?.currentStock || 0,
        baseUnit: material?.baseUnit || 'unit',
        status: material?.status || 'available',
        categoryId: material?.categoryId || 0,
      };
    }).filter(sm => {
      if (selectedCategory !== 'all' && sm.categoryId.toString() !== selectedCategory) return false;
      if (stockFilter !== 'all' && sm.status !== stockFilter) return false;
      if (searchQuery && !sm.materialName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedSupplierId, selectedCategory, stockFilter, searchQuery]);

  const totalItems = useMemo(() => {
    let count = 0;
    itemData.forEach(v => { if (v > 0) count++; });
    return count;
  }, [itemData]);

  const handleQtyChange = (materialId: number, qty: number) => {
    const newData = new Map(itemData);
    newData.set(materialId, Math.max(0, qty));
    setItemData(newData);
  };

  const handleSubmit = () => {
    if (!selectedSupplierId || !deliveryDate || totalItems === 0) return;
    const items: { materialId: number; qty: number; unit: string }[] = [];
    itemData.forEach((qty, materialId) => {
      if (qty > 0) {
        const sm = mockSupplierMaterials.find(s => s.materialId === materialId);
        items.push({ materialId, qty, unit: sm?.purchaseUnit || 'unit' });
      }
    });
    onSubmit({ supplierId: parseInt(selectedSupplierId), deliveryDate, items });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-600" />
          Purchase Order
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Supplier <span className="text-red-500">*</span></Label>
            <Select value={selectedSupplierId} onValueChange={(v) => { setSelectedSupplierId(v); setItemData(new Map()); }}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pilih Supplier" /></SelectTrigger>
              <SelectContent>
                {mockSuppliers.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Tanggal Pengiriman <span className="text-red-500">*</span></Label>
            <Input
              type="date" className="mt-1.5"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5 w-full">
              <span className="text-xs text-orange-600 font-medium">Total Item Diminta</span>
              <p className="text-lg font-bold text-orange-700">{totalItems}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Cari bahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="max-w-64"
              disabled={!selectedSupplierId}
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={!selectedSupplierId}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {mockInventoryCategories.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockStatus | 'all')} disabled={!selectedSupplierId}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Status Stok" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="available">Masih Ada</SelectItem>
                <SelectItem value="low">Menipis</SelectItem>
                <SelectItem value="empty">Habis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {!selectedSupplierId ? (
          <div className="p-12 text-center text-text-disabled">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Pilih supplier untuk melihat daftar bahan</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background/50">
                <TableHead className="font-semibold text-xs">Nama Bahan</TableHead>
                <TableHead className="font-semibold text-xs">Kategori</TableHead>
                <TableHead className="font-semibold text-xs text-right">Stok Saat Ini</TableHead>
                <TableHead className="font-semibold text-xs">Jumlah Diminta</TableHead>
                <TableHead className="font-semibold text-xs">Satuan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierMaterials.map((sm) => {
                const qty = itemData.get(sm.materialId) || 0;
                return (
                  <TableRow key={sm.id}>
                    <TableCell className="font-medium text-sm">{sm.materialName}</TableCell>
                    <TableCell className="text-sm text-text-secondary">{sm.categoryName}</TableCell>
                    <TableCell className="text-right text-sm">{sm.currentStock.toLocaleString('id-ID')} {sm.baseUnit}</TableCell>
                    <TableCell>
                      <Input
                        type="number" min={0}
                        value={qty || ''}
                        onChange={(e) => handleQtyChange(sm.materialId, parseFloat(e.target.value) || 0)}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{sm.purchaseUnit}</TableCell>
                  </TableRow>
                );
              })}
              {supplierMaterials.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-text-disabled">Tidak ada bahan ditemukan</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Batal</Button>
        <Button onClick={handleSubmit} disabled={!selectedSupplierId || !deliveryDate || totalItems === 0} className="gap-1.5 bg-orange-600 hover:bg-orange-700">
          <FileText className="h-4 w-4" /> Kirim Permintaan
        </Button>
      </div>
    </div>
  );
}
