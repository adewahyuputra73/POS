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
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Plus, X } from "lucide-react";
import { mockSuppliers, mockRawMaterials, mockInventoryCategories } from "../mock-data";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

interface POMultiRow {
  id: number;
  materialId: number;
  materialName: string;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  qty: number;
  unit: string;
  pricePerUnit: number;
  subtotal: number;
}

interface POMultiSupplierFormProps {
  onSubmit: (data: { deliveryDate: string; rows: POMultiRow[] }) => void;
  onCancel: () => void;
}

export function POMultiSupplierForm({ onSubmit, onCancel }: POMultiSupplierFormProps) {
  const [deliveryDate, setDeliveryDate] = useState('');
  const [rows, setRows] = useState<POMultiRow[]>([]);
  const [nextId, setNextId] = useState(1);

  const addRow = () => {
    setRows([...rows, {
      id: nextId, materialId: 0, materialName: '', categoryName: '',
      supplierId: 0, supplierName: '', qty: 0, unit: 'kg', pricePerUnit: 0, subtotal: 0,
    }]);
    setNextId(nextId + 1);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: number, field: string, value: string | number) => {
    setRows(rows.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'materialId') {
        const mat = mockRawMaterials.find(m => m.id === Number(value));
        if (mat) {
          updated.materialName = mat.name;
          updated.categoryName = mat.categoryName;
          updated.unit = mat.baseUnit;
        }
      }
      if (field === 'supplierId') {
        const sup = mockSuppliers.find(s => s.id === Number(value));
        if (sup) updated.supplierName = sup.name;
      }
      if (field === 'qty' || field === 'pricePerUnit') {
        updated.subtotal = updated.qty * updated.pricePerUnit;
      }
      return updated;
    }));
  };

  const summary = useMemo(() => {
    const suppliers = new Set(rows.filter(r => r.supplierId > 0).map(r => r.supplierId));
    const totalBelanja = rows.reduce((sum, r) => sum + r.subtotal, 0);
    return {
      totalSupplier: suppliers.size,
      totalPO: suppliers.size,
      totalBelanja,
    };
  }, [rows]);

  const isValid = deliveryDate && rows.length > 0 && rows.every(r => r.materialId > 0 && r.supplierId > 0 && r.qty > 0);

  const handleSubmit = () => {
    if (!isValid) return;
    onSubmit({ deliveryDate, rows });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-orange-600" />
          Purchase Order (Multi Supplier)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium">Tanggal Pengiriman <span className="text-red-500">*</span></Label>
            <Input type="date" className="mt-1.5" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
            <span className="text-xs text-blue-600 font-medium">Total Supplier</span>
            <p className="text-lg font-bold text-blue-700">{summary.totalSupplier}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2.5">
            <span className="text-xs text-orange-600 font-medium">Total PO</span>
            <p className="text-lg font-bold text-orange-700">{summary.totalPO}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            <span className="text-xs text-green-600 font-medium">Total Belanja</span>
            <p className="text-lg font-bold text-green-700">{formatCurrency(summary.totalBelanja)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h4 className="text-sm font-semibold">Daftar Item</h4>
          <Button size="sm" onClick={addRow} className="gap-1.5">
            <Plus className="h-4 w-4" /> Tambah Item
          </Button>
        </div>

        {rows.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Klik &quot;Tambah Item&quot; untuk mulai menambahkan bahan</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold text-xs">Bahan Dasar</TableHead>
                <TableHead className="font-semibold text-xs">Kategori</TableHead>
                <TableHead className="font-semibold text-xs">Supplier</TableHead>
                <TableHead className="font-semibold text-xs">Qty</TableHead>
                <TableHead className="font-semibold text-xs">Satuan</TableHead>
                <TableHead className="font-semibold text-xs">Harga/Satuan</TableHead>
                <TableHead className="font-semibold text-xs text-right">Subtotal</TableHead>
                <TableHead className="font-semibold text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Select value={row.materialId ? row.materialId.toString() : ''} onValueChange={(v) => updateRow(row.id, 'materialId', parseInt(v))}>
                      <SelectTrigger className="w-44 text-sm"><SelectValue placeholder="Pilih bahan" /></SelectTrigger>
                      <SelectContent>
                        {mockRawMaterials.map(m => (
                          <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{row.categoryName || '-'}</TableCell>
                  <TableCell>
                    <Select value={row.supplierId ? row.supplierId.toString() : ''} onValueChange={(v) => updateRow(row.id, 'supplierId', parseInt(v))}>
                      <SelectTrigger className="w-40 text-sm"><SelectValue placeholder="Pilih supplier" /></SelectTrigger>
                      <SelectContent>
                        {mockSuppliers.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input type="number" min={0} value={row.qty || ''} onChange={(e) => updateRow(row.id, 'qty', parseFloat(e.target.value) || 0)} className="w-20 text-sm" placeholder="0" />
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{row.unit || '-'}</TableCell>
                  <TableCell>
                    <Input type="number" min={0} value={row.pricePerUnit || ''} onChange={(e) => updateRow(row.id, 'pricePerUnit', parseInt(e.target.value) || 0)} className="w-28 text-sm" placeholder="Rp 0" />
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">{formatCurrency(row.subtotal)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => removeRow(row.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>Batal</Button>
        <Button onClick={handleSubmit} disabled={!isValid} className="gap-1.5 bg-orange-600 hover:bg-orange-700">
          <FileText className="h-4 w-4" /> Simpan PO
        </Button>
      </div>
    </div>
  );
}
