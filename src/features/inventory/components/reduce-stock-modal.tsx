"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReduceStockData } from "../types";

interface ReduceStockModalProps {
  open: boolean;
  onClose: () => void;
  materialName: string;
  baseUnit: string;
  currentStock: number;
  onSubmit: (data: ReduceStockData) => void;
}

export function ReduceStockModal({
  open,
  onClose,
  materialName,
  baseUnit,
  currentStock,
  onSubmit,
}: ReduceStockModalProps) {
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!quantity || Number(quantity) <= 0) newErrors.quantity = 'Jumlah harus lebih dari 0';
    if (Number(quantity) > currentStock) newErrors.quantity = `Tidak bisa melebihi stok saat ini (${currentStock} ${baseUnit})`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ quantity: Number(quantity), unit: baseUnit, notes });
    setQuantity(''); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Kurangi Stok</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Mengurangi stok untuk <strong>{materialName}</strong>
          <br />
          <span className="text-xs">Stok saat ini: {new Intl.NumberFormat('id-ID').format(currentStock)} {baseUnit}</span>
        </p>

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
            label="Keterangan"
            placeholder="Alasan pengurangan stok..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">Kurangi Stok</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
