"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Supplier, AddStockData } from "../types";

interface AddStockModalProps {
  open: boolean;
  onClose: () => void;
  materialName: string;
  baseUnit: string;
  suppliers: Supplier[];
  onSubmit: (data: AddStockData) => void;
}

export function AddStockModal({
  open,
  onClose,
  materialName,
  baseUnit,
  suppliers,
  onSubmit,
}: AddStockModalProps) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplierId, setSupplierId] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = 'Jumlah harus lebih dari 0';
    if (!price || Number(price) <= 0) newErrors.price = 'Harga harus lebih dari 0';
    if (!supplierId) newErrors.supplierId = 'Supplier wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      quantity: Number(quantity),
      price: Number(price),
      supplierId,
      unit: baseUnit,
      notes,
    });
    setQuantity(''); setPrice(''); setSupplierId(0); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Stok</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-text-secondary">Menambah stok untuk <strong>{materialName}</strong></p>

        <div className="space-y-4 py-4">
          <Input
            label="Jumlah *"
            type="number"
            placeholder="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            error={errors.quantity}
            helperText={`Satuan: ${baseUnit}`}
          />
          <Input
            label="Harga per Unit *"
            type="number"
            placeholder="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={errors.price}
            helperText="Harga pembelian per satuan dasar"
          />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Supplier *</label>
            <select
              className="w-full h-10 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              value={supplierId}
              onChange={(e) => setSupplierId(Number(e.target.value))}
            >
              <option value={0}>Pilih supplier</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId}</p>}
          </div>
          <Input
            label="Keterangan"
            placeholder="Keterangan tambahan..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-divider">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>Tambah Stok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
