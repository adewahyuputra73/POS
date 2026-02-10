"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { RawMaterial, SupplierMaterialFormData } from "../types";

interface AddSupplierMaterialModalProps {
  open: boolean;
  onClose: () => void;
  materials: RawMaterial[];
  excludeMaterialIds: number[];
  onSubmit: (data: SupplierMaterialFormData) => void;
}

export function AddSupplierMaterialModal({
  open, onClose, materials, excludeMaterialIds, onSubmit,
}: AddSupplierMaterialModalProps) {
  const [materialId, setMaterialId] = useState<number>(0);
  const [purchaseQty, setPurchaseQty] = useState('1');
  const [purchaseUnit, setPurchaseUnit] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [includePpn, setIncludePpn] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableMaterials = materials.filter((m) => !excludeMaterialIds.includes(m.id));

  useEffect(() => {
    if (open) {
      setMaterialId(0); setPurchaseQty('1'); setPurchaseUnit('');
      setPricePerUnit(''); setMinOrder(''); setIsPrimary(false);
      setIncludePpn(false); setErrors({});
    }
  }, [open]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!materialId) e.materialId = 'Bahan wajib dipilih';
    if (!purchaseQty || Number(purchaseQty) <= 0) e.purchaseQty = 'Harus > 0';
    if (!purchaseUnit.trim()) e.purchaseUnit = 'Satuan wajib diisi';
    if (!pricePerUnit || Number(pricePerUnit) <= 0) e.pricePerUnit = 'Harga harus > 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      materialId,
      purchaseQty: Number(purchaseQty),
      purchaseUnit: purchaseUnit.trim(),
      pricePerUnit: Number(pricePerUnit),
      minOrder: minOrder ? Number(minOrder) : undefined,
      isPrimary,
      includePpn,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Bahan ke Supplier</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bahan Dasar *</label>
            <select
              className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              value={materialId}
              onChange={(e) => setMaterialId(Number(e.target.value))}
            >
              <option value={0}>Pilih bahan dasar</option>
              {availableMaterials.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.categoryName})</option>
              ))}
            </select>
            {errors.materialId && <p className="mt-1 text-sm text-red-600">{errors.materialId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Qty Pembelian *" type="number" value={purchaseQty} onChange={(e) => setPurchaseQty(e.target.value)} error={errors.purchaseQty} />
            <Input label="Satuan Beli *" placeholder="kg, liter…" value={purchaseUnit} onChange={(e) => setPurchaseUnit(e.target.value)} error={errors.purchaseUnit} />
          </div>

          <Input label="Harga per Unit *" type="number" placeholder="0" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} error={errors.pricePerUnit} />
          <Input label="Min Order" type="number" placeholder="0" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Supplier Utama</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includePpn} onChange={(e) => setIncludePpn(e.target.checked)} className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Include PPN</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>Tambah</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
