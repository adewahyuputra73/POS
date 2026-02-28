"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, MinusCircle } from "lucide-react";
import { mockRawMaterials, mockInventoryCategories, expenseReasonOptions } from "../mock-data";
import { MaterialType, ExpenseReason } from "../types";

interface ExpenseFormProps {
  onSubmit: (items: { materialId: number; qty: number; reason: ExpenseReason }[]) => void;
  onCancel: () => void;
}

export function ExpenseForm({ onSubmit, onCancel }: ExpenseFormProps) {
  const [materialType, setMaterialType] = useState<MaterialType>('raw');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [itemData, setItemData] = useState<Map<number, { qty: number; reason: ExpenseReason | '' }>>(new Map());

  const filteredMaterials = useMemo(() => {
    return mockRawMaterials.filter(m => {
      if (m.type !== materialType) return false;
      if (selectedCategory !== 'all' && m.categoryId.toString() !== selectedCategory) return false;
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [materialType, selectedCategory, searchQuery]);

  const totalItems = useMemo(() => {
    let count = 0;
    itemData.forEach(v => { if (v.qty > 0) count++; });
    return count;
  }, [itemData]);

  const handleQtyChange = (materialId: number, qty: number, maxStock: number) => {
    const newData = new Map(itemData);
    const existing = newData.get(materialId) || { qty: 0, reason: '' as const };
    newData.set(materialId, { ...existing, qty: Math.min(Math.max(0, qty), maxStock) });
    setItemData(newData);
  };

  const handleReasonChange = (materialId: number, reason: string) => {
    const newData = new Map(itemData);
    const existing = newData.get(materialId) || { qty: 0, reason: '' as const };
    newData.set(materialId, { ...existing, reason: reason as ExpenseReason });
    setItemData(newData);
  };

  const isValid = useMemo(() => {
    let hasValidItem = false;
    let allReasonsSet = true;
    itemData.forEach(v => {
      if (v.qty > 0) {
        hasValidItem = true;
        if (!v.reason) allReasonsSet = false;
      }
    });
    return hasValidItem && allReasonsSet;
  }, [itemData]);

  const handleSubmit = () => {
    if (!isValid) return;
    const items: { materialId: number; qty: number; reason: ExpenseReason }[] = [];
    itemData.forEach((value, materialId) => {
      if (value.qty > 0 && value.reason) {
        items.push({ materialId, qty: value.qty, reason: value.reason as ExpenseReason });
      }
    });
    onSubmit(items);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <MinusCircle className="h-5 w-5 text-red-600" />
          Pengeluaran Stok
        </h3>
        <p className="text-sm text-text-secondary">Kurangi stok bahan dasar dengan mencatat alasan pengeluaran.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border space-y-3">
          <Tabs value={materialType} onValueChange={(v) => setMaterialType(v as MaterialType)}>
            <TabsList>
              <TabsTrigger value="raw">Mentah</TabsTrigger>
              <TabsTrigger value="semi_finished">Setengah Jadi</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-3">
            <Input
              placeholder="Cari bahan dasar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="max-w-sm"
            />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48"><SelectValue placeholder="Semua Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {mockInventoryCategories.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead className="font-semibold text-xs">Nama Bahan Dasar</TableHead>
              <TableHead className="font-semibold text-xs text-right">Stok Saat Ini</TableHead>
              <TableHead className="font-semibold text-xs">Jumlah Pengeluaran</TableHead>
              <TableHead className="font-semibold text-xs">Unit</TableHead>
              <TableHead className="font-semibold text-xs">Alasan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((m) => {
              const data = itemData.get(m.id) || { qty: 0, reason: '' };
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-medium text-sm">{m.name}</TableCell>
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
                    <Select
                      value={data.reason}
                      onValueChange={(v) => handleReasonChange(m.id, v)}
                      disabled={data.qty === 0}
                    >
                      <SelectTrigger className="w-36 text-sm"><SelectValue placeholder="Pilih alasan" /></SelectTrigger>
                      <SelectContent>
                        {expenseReasonOptions.map(r => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-text-disabled">Tidak ada bahan ditemukan</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-text-secondary">{totalItems} item dipilih</div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>Batal</Button>
          <Button onClick={handleSubmit} disabled={!isValid} className="gap-1.5 bg-red-600 hover:bg-red-700">
            <MinusCircle className="h-4 w-4" /> Perbarui Stok
          </Button>
        </div>
      </div>
    </div>
  );
}
