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
import { Search, ShoppingCart } from "lucide-react";
import { mockSuppliers, mockSupplierMaterials, mockRawMaterials } from "../mock-data";
import { PurchaseMaterialItem } from "../types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

interface PurchaseFormProps {
  onSubmit: (supplierId: number, items: PurchaseMaterialItem[]) => void;
  onCancel: () => void;
}

export function PurchaseForm({ onSubmit, onCancel }: PurchaseFormProps) {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<Map<number, { qty: number; price: number }>>(new Map());

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
        categoryName: sb.categoryName || material?.categoryName || '-',
      };
    }).filter(sm => {
      if (!searchQuery) return true;
      return sm.materialName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [selectedSupplierId, searchQuery]);

  const totalItems = useMemo(() => {
    let count = 0;
    items.forEach(v => { if (v.qty > 0) count++; });
    return count;
  }, [items]);

  const totalPrice = useMemo(() => {
    let sum = 0;
    items.forEach(v => { sum += v.price; });
    return sum;
  }, [items]);

  const handleQtyChange = (materialId: number, qty: number) => {
    const newItems = new Map(items);
    const existing = newItems.get(materialId) || { qty: 0, price: 0 };
    newItems.set(materialId, { ...existing, qty: Math.max(0, qty) });
    setItems(newItems);
  };

  const handlePriceChange = (materialId: number, price: number) => {
    const newItems = new Map(items);
    const existing = newItems.get(materialId) || { qty: 0, price: 0 };
    newItems.set(materialId, { ...existing, price: Math.max(0, price) });
    setItems(newItems);
  };

  const handleSubmit = () => {
    if (!selectedSupplierId || totalItems === 0) return;
    const purchaseItems: PurchaseMaterialItem[] = [];
    items.forEach((value, materialId) => {
      if (value.qty > 0) {
        const sm = mockSupplierMaterials.find(s => s.materialId === materialId);
        const mat = mockRawMaterials.find(m => m.id === materialId);
        if (sm && mat) {
          purchaseItems.push({
            materialId, materialName: mat.name, categoryName: mat.categoryName,
            purchaseQty: value.qty, purchaseUnit: sm.purchaseUnit,
            totalPrice: value.price, currentStock: mat.currentStock, baseUnit: mat.baseUnit,
          });
        }
      }
    });
    onSubmit(parseInt(selectedSupplierId), purchaseItems);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-green-600" />
          Pembelian Bahan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Supplier <span className="text-red-500">*</span></Label>
            <Select value={selectedSupplierId} onValueChange={(v) => { setSelectedSupplierId(v); setItems(new Map()); }}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pilih Supplier" /></SelectTrigger>
              <SelectContent>
                {mockSuppliers.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 w-full">
              <span className="text-xs text-blue-600 font-medium">Total Item Terpilih</span>
              <p className="text-lg font-bold text-blue-700">{totalItems}</p>
            </div>
          </div>
          <div className="flex items-end">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 w-full">
              <span className="text-xs text-green-600 font-medium">Total Harga</span>
              <p className="text-lg font-bold text-green-700">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Material List */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <Input
            placeholder="Cari bahan dasar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="max-w-sm"
            disabled={!selectedSupplierId}
          />
        </div>

        {!selectedSupplierId ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Pilih supplier terlebih dahulu untuk melihat daftar bahan</p>
          </div>
        ) : supplierMaterials.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-sm">Tidak ada bahan yang terhubung dengan supplier ini</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-xs">Nama Bahan Dasar</TableHead>
                <TableHead className="font-semibold text-xs">Kategori</TableHead>
                <TableHead className="font-semibold text-xs text-right">Stok Saat Ini</TableHead>
                <TableHead className="font-semibold text-xs">Jumlah Pembelian</TableHead>
                <TableHead className="font-semibold text-xs">Satuan</TableHead>
                <TableHead className="font-semibold text-xs">Total Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierMaterials.map((sm) => {
                const itemData = items.get(sm.materialId) || { qty: 0, price: 0 };
                return (
                  <TableRow key={sm.id}>
                    <TableCell className="font-medium text-sm">{sm.materialName}</TableCell>
                    <TableCell className="text-sm text-gray-600">{sm.categoryName}</TableCell>
                    <TableCell className="text-right text-sm">{sm.currentStock.toLocaleString('id-ID')} {sm.baseUnit}</TableCell>
                    <TableCell>
                      <Input
                        type="number" min={0} step="any"
                        value={itemData.qty || ''}
                        onChange={(e) => handleQtyChange(sm.materialId, parseFloat(e.target.value) || 0)}
                        className="w-24 text-sm"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{sm.purchaseUnit}</TableCell>
                    <TableCell>
                      <Input
                        type="number" min={0}
                        value={itemData.price || ''}
                        onChange={(e) => handlePriceChange(sm.materialId, parseInt(e.target.value) || 0)}
                        className="w-32 text-sm"
                        placeholder="Rp 0"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Batal</Button>
        <Button onClick={handleSubmit} disabled={!selectedSupplierId || totalItems === 0} className="gap-1.5">
          <ShoppingCart className="h-4 w-4" /> Perbarui Stok
        </Button>
      </div>
    </div>
  );
}
