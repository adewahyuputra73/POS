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
import { Search, ClipboardCheck } from "lucide-react";
import { mockRawMaterials, mockInventoryCategories } from "../mock-data";
import { MaterialType, OpnameItem } from "../types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

interface StockOpnameFormProps {
  onSubmit: (items: OpnameItem[]) => void;
  onCancel: () => void;
}

export function StockOpnameForm({ onSubmit, onCancel }: StockOpnameFormProps) {
  const [materialType, setMaterialType] = useState<MaterialType>('raw');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stockInputs, setStockInputs] = useState<Map<number, number>>(new Map());

  const filteredMaterials = useMemo(() => {
    return mockRawMaterials.filter(m => {
      if (m.type !== materialType) return false;
      if (selectedCategory !== 'all' && m.categoryId.toString() !== selectedCategory) return false;
      if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [materialType, selectedCategory, searchQuery]);

  const changedItems = useMemo(() => {
    const items: OpnameItem[] = [];
    stockInputs.forEach((newStock, materialId) => {
      const material = mockRawMaterials.find(m => m.id === materialId);
      if (material && newStock !== material.currentStock) {
        const difference = newStock - material.currentStock;
        items.push({
          materialId, materialName: material.name, categoryName: material.categoryName,
          type: material.type, currentStock: material.currentStock, newStock,
          unit: material.baseUnit, difference, adjustmentValue: difference * material.hpp,
        });
      }
    });
    return items;
  }, [stockInputs]);

  const totalAdjustment = useMemo(() => {
    return changedItems.reduce((sum, item) => sum + item.adjustmentValue, 0);
  }, [changedItems]);

  const handleStockChange = (materialId: number, value: number) => {
    const newInputs = new Map(stockInputs);
    newInputs.set(materialId, Math.max(0, value));
    setStockInputs(newInputs);
  };

  const handleSubmit = () => {
    if (changedItems.length === 0) return;
    onSubmit(changedItems);
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-blue-600" />
          Stok Opname
        </h3>
        <p className="text-sm text-text-secondary">Masukkan jumlah stok fisik aktual untuk setiap bahan.</p>
        {changedItems.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
              <span className="text-xs text-blue-600 font-medium">Item Berubah</span>
              <p className="text-lg font-bold text-blue-700">{changedItems.length}</p>
            </div>
            <div className={`border rounded-lg px-4 py-2.5 ${totalAdjustment < 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <span className={`text-xs font-medium ${totalAdjustment < 0 ? 'text-red-600' : 'text-green-600'}`}>Total Penyesuaian</span>
              <p className={`text-lg font-bold ${totalAdjustment < 0 ? 'text-red-700' : 'text-green-700'}`}>{formatCurrency(totalAdjustment)}</p>
            </div>
          </div>
        )}
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
              <TableHead className="font-semibold text-xs">Kategori</TableHead>
              <TableHead className="font-semibold text-xs text-right">Stok Sistem</TableHead>
              <TableHead className="font-semibold text-xs">Stok Terbaru</TableHead>
              <TableHead className="font-semibold text-xs">Unit</TableHead>
              <TableHead className="font-semibold text-xs text-right">Selisih</TableHead>
              <TableHead className="font-semibold text-xs text-right">Nilai Penyesuaian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((m) => {
              const newStock = stockInputs.get(m.id);
              const hasChanged = newStock !== undefined && newStock !== m.currentStock;
              const difference = hasChanged ? (newStock! - m.currentStock) : 0;
              const adjustValue = difference * m.hpp;
              return (
                <TableRow key={m.id} className={hasChanged ? 'bg-yellow-50/50' : ''}>
                  <TableCell className="font-medium text-sm">{m.name}</TableCell>
                  <TableCell className="text-sm text-text-secondary">{m.categoryName}</TableCell>
                  <TableCell className="text-right text-sm">{m.currentStock.toLocaleString('id-ID')} {m.baseUnit}</TableCell>
                  <TableCell>
                    <Input
                      type="number" min={0}
                      value={newStock !== undefined ? newStock : m.currentStock}
                      onChange={(e) => handleStockChange(m.id, parseFloat(e.target.value) || 0)}
                      className="w-28 text-sm"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">{m.baseUnit}</TableCell>
                  <TableCell className={`text-right text-sm font-medium ${difference < 0 ? 'text-red-600' : difference > 0 ? 'text-green-600' : ''}`}>
                    {hasChanged ? (difference > 0 ? `+${difference.toLocaleString('id-ID')}` : difference.toLocaleString('id-ID')) : '-'}
                  </TableCell>
                  <TableCell className={`text-right text-sm font-medium ${adjustValue < 0 ? 'text-red-600' : adjustValue > 0 ? 'text-green-600' : ''}`}>
                    {hasChanged ? formatCurrency(adjustValue) : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-text-disabled">Tidak ada bahan ditemukan</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Batal</Button>
        <Button onClick={handleSubmit} disabled={changedItems.length === 0} className="gap-1.5">
          <ClipboardCheck className="h-4 w-4" /> Perbarui Stok
        </Button>
      </div>
    </div>
  );
}
