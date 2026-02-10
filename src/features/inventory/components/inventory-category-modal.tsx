"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryCategory, InventoryCategoryFormData } from "../types";

interface InventoryCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: InventoryCategory | null;
  existingNames: string[];
  onSubmit: (data: InventoryCategoryFormData) => void;
}

export function InventoryCategoryModal({
  open, onClose, category, existingNames, onSubmit,
}: InventoryCategoryModalProps) {
  const isEdit = !!category;
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(category?.name || '');
      setError('');
    }
  }, [open, category]);

  const validate = (): boolean => {
    if (!name.trim()) { setError('Nama kategori wajib diisi'); return false; }
    if (name.trim().length > 50) { setError('Maksimal 50 karakter'); return false; }
    const isDup = existingNames
      .filter((n) => !isEdit || n !== category?.name)
      .some((n) => n.toLowerCase() === name.trim().toLowerCase());
    if (isDup) { setError('Nama kategori sudah digunakan'); return false; }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Ubah Kategori' : 'Tambah Kategori'}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            label="Nama Kategori *"
            placeholder="Contoh: Bahan Kering"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
            maxLength={50}
          />
          <p className="mt-1 text-xs text-gray-400">{name.length}/50 karakter</p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
