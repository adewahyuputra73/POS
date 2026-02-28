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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeftRight } from "lucide-react";
import { mockRawMaterials, mockInventoryCategories } from "../mock-data";
import { MaterialType, TransferType, StockStatus } from "../types";

const outletOptions = [
  { id: 2, name: 'Outlet Cabang 2' },
  { id: 3, name: 'Outlet Cabang 3' },
  { id: 4, name: 'Outlet Cabang 4' },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

interface TransferFormProps {
  onSubmit: (data: { transactionType: TransferType; outletToId: number; items: { materialId: number; qty: number; price: number }[] }) => void;
  onCancel: () => void;
}

export function TransferForm({ onSubmit, onCancel }: TransferFormProps) {
  const [transactionType, setTransactionType] = useState<TransferType>('pengiriman');
  const [outletToId, setOutletToId] = useState<string>('');
  const [materialType, setMaterialType] = useState<MaterialType>('raw');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<StockStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemData, setItemData] = useState<Map<number, { qty: number; price: number }>>(new Map());

  const filteredMaterials = useMemo(() => {
    return mockRawMaterials.filter(m => {
      if (m.type !== materialType) return false;
      if (selectedCategory !== 'all' && m.categoryId.toString() !== selectedCategory) return false;
      if (stockFilter !== 'all' && m.status !== stockFilter) return false;
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [materialType, selectedCategory, stockFilter, searchQuery]);

  const totalItems = useMemo(() => {
    let count = 0;
    itemData.forEach(v => { if (v.qty > 0) count++; });
    return count;
  }, [itemData]);

  const totalPrice = useMemo(() => {
    let sum = 0;
    itemData.forEach(v => { sum += v.price; });
    return sum;
  }, [itemData]);

  const handleQtyChange = (materialId: number, qty: number, maxStock: number) => {
    const newData = new Map(itemData);
    const existing = newData.get(materialId) || { qty: 0, price: 0 };
    newData.set(materialId, { ...existing, qty: Math.min(Math.max(0, qty), maxStock) });
    setItemData(newData);
  };

  const handlePriceChange = (materialId: number, price: number) => {
    const newData = new Map(itemData);
    const existing = newData.get(materialId) || { qty: 0, price: 0 };
    newData.set(materialId, { ...existing, price: Math.max(0, price) });
    setItemData(newData);
  };

  const handleSubmit = () => {
    if (!outletToId || totalItems === 0) return;
    const items: { materialId: number; qty: number; price: number }[] = [];
    itemData.forEach((value, materialId) => {
      if (value.qty > 0) items.push({ materialId, qty: value.qty, price: value.price });
    });
    onSubmit({ transactionType, outletToId: parseInt(outletToId), items });
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5 text-purple-600" />
          Transfer Bahan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium">Jenis Transaksi</Label>
            <Select value={transactionType} onValueChange={(v) => setTransactionType(v as TransferType)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pengiriman">Pengiriman Bahan</SelectItem>
                <SelectItem value="permintaan">Permintaan Bahan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">Outlet Tujuan <span className="text-red-500">*</span></Label>
            <Select value={outletToId} onValueChange={setOutletToId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pilih Outlet" /></SelectTrigger>
              <SelectContent>
                {outletOptions.map(o => (
                  <SelectItem key={o.id} value={o.id.toString()}>{o.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2.5 w-full">
              <span className="text-xs text-purple-600 font-medium">Total: {totalItems} item</span>
              <p className="text-lg font-bold text-purple-700">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border space-y-3">
          <Tabs value={materialType} onValueChange={(v) => setMaterialType(v as MaterialType)}>
            <TabsList>
              <TabsTrigger value="raw">Mentah</TabsTrigger>
              <TabsTrigger value="semi_finished">Setengah Jadi</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-3 flex-wrap">
            <Input
              placeholder="Cari bahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="max-w-64"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {mockInventoryCategories.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockStatus | 'all')}>
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

        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead className="font-semibold text-xs">Nama Bahan</TableHead>
              <TableHead className="font-semibold text-xs">Kategori</TableHead>
              <TableHead className="font-semibold text-xs text-right">Stok Saat Ini</TableHead>
              <TableHead className="font-semibold text-xs">Jumlah Kirim</TableHead>
              <TableHead className="font-semibold text-xs">Unit</TableHead>
              <TableHead className="font-semibold text-xs">Harga Kirim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((m) => {
              const data = itemData.get(m.id) || { qty: 0, price: 0 };
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-sm">{m.name}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{m.categoryName}</TableCell>
                  <TableCell className="text-right text-sm">{m.currentStock.toLocaleString('id-ID')} {m.baseUnit}</TableCell>
                  <TableCell>
                    <Input
                      type="number" min={0} max={m.currentStock}
                      value={data.qty || ''}
                      onChange={(e) => handleQtyChange(m.id, parseFloat(e.target.value) || 0, m.currentStock)}
                      className="w-24 text-sm"
                      placeholder="0"
                      disabled={m.currentStock === 0}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">{m.baseUnit}</TableCell>
                  <TableCell>
                    <Input
                      type="number" min={0}
                      value={data.price || ''}
                      onChange={(e) => handlePriceChange(m.id, parseInt(e.target.value) || 0)}
                      className="w-28 text-sm"
                      placeholder="Rp 0"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-text-disabled">Tidak ada bahan ditemukan</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Batal</Button>
        <Button onClick={handleSubmit} disabled={!outletToId || totalItems === 0} className="gap-1.5 bg-purple-600 hover:bg-purple-700">
          <ArrowLeftRight className="h-4 w-4" /> Kirim Transfer
        </Button>
      </div>
    </div>
  );
}
