"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RawMaterial, RawMaterialFormData, MaterialType, InventoryCategory, UnitConversion } from "../types";

interface RawMaterialModalProps {
  open: boolean;
  onClose: () => void;
  material?: RawMaterial | null;
  materialType: MaterialType;
  categories: InventoryCategory[];
  unitConversions: UnitConversion[];
  onSubmit: (data: RawMaterialFormData) => void;
}

export function RawMaterialModal({
  open,
  onClose,
  material,
  materialType,
  categories,
  unitConversions,
  onSubmit,
}: RawMaterialModalProps) {
  const isEdit = !!material;

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [unitConversionId, setUnitConversionId] = useState<number>(0);
  const [estimatedProduction, setEstimatedProduction] = useState('');
  const [stockLimit, setStockLimit] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (material) {
        setName(material.name);
        setCategoryId(material.categoryId);
        setUnitConversionId(material.unitConversionId);
        setEstimatedProduction(material.estimatedProduction ? String(material.estimatedProduction) : '');
        setStockLimit(material.stockLimit ? String(material.stockLimit) : '');
      } else {
        setName('');
        setCategoryId(categories[0]?.id || 0);
        setUnitConversionId(unitConversions[0]?.id || 0);
        setEstimatedProduction('');
        setStockLimit('');
      }
      setErrors({});
    }
  }, [open, material, categories, unitConversions]);

  const selectedConversion = unitConversions.find(u => u.id === unitConversionId);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nama item wajib diisi';
    if (!categoryId) newErrors.categoryId = 'Kategori wajib dipilih';
    if (!unitConversionId) newErrors.unitConversionId = 'Unit konversi wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      type: materialType,
      categoryId,
      unitConversionId,
      estimatedProduction: estimatedProduction ? Number(estimatedProduction) : undefined,
      stockLimit: stockLimit ? Number(stockLimit) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Ubah' : 'Tambah'} Bahan {materialType === 'raw' ? 'Mentah' : 'Setengah Jadi'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            label="Nama Item *"
            placeholder="Contoh: Beras Premium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori *</label>
            <select
              className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              <option value={0}>Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Unit Konversi *</label>
            <select
              className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              value={unitConversionId}
              onChange={(e) => setUnitConversionId(Number(e.target.value))}
            >
              <option value={0}>Pilih unit konversi</option>
              {unitConversions.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {errors.unitConversionId && <p className="mt-1 text-sm text-red-600">{errors.unitConversionId}</p>}
          </div>

          {selectedConversion && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-700 mb-2">Unit yang tersedia:</p>
              <div className="flex flex-wrap gap-2">
                {selectedConversion.units.map((u) => (
                  <span key={u.id} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white text-xs text-blue-600 border border-blue-200">
                    {u.name}
                    <span className="text-blue-400">({u.role})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {materialType === 'semi_finished' && (
            <Input
              label="Estimasi Produksi per Resep"
              type="number"
              placeholder="Contoh: 50"
              value={estimatedProduction}
              onChange={(e) => setEstimatedProduction(e.target.value)}
              helperText="Jumlah output per batch produksi"
            />
          )}

          <Input
            label="Batas Bawah Stok"
            type="number"
            placeholder="Contoh: 1000"
            value={stockLimit}
            onChange={(e) => setStockLimit(e.target.value)}
            helperText="Stok di bawah batas ini akan berstatus 'Menipis'"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Bahan'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
