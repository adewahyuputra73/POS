"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MasterCategory } from "../types";
import { X, Coffee, Utensils, Cookie, Box } from "lucide-react";

interface MasterCategoryFormProps {
  initialData?: MasterCategory | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<MasterCategory>) => void;
}

const iconOptions = [
  { value: "Coffee", label: "Minuman", icon: Coffee },
  { value: "Utensils", label: "Makanan", icon: Utensils },
  { value: "Cookie", label: "Snack", icon: Cookie },
  { value: "Box", label: "Lainnya", icon: Box },
];

export function MasterCategoryForm({
  initialData,
  isOpen,
  onClose,
  onSubmit,
}: MasterCategoryFormProps) {
  const [formData, setFormData] = useState<Partial<MasterCategory>>({
    name: "",
    icon: "Box",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        icon: "Box",
        status: "ACTIVE",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              {initialData ? "Edit Kategori Master" : "Tambah Kategori Master"}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Minuman, Makanan Berat"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ikon</Label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.icon === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: opt.value })}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-primary bg-primary-light/20 text-primary"
                          : "border-border hover:border-primary/50 text-text-secondary"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === "ACTIVE"}
                    onChange={() => setFormData({ ...formData, status: "ACTIVE" })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Aktif</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === "INACTIVE"}
                    onChange={() => setFormData({ ...formData, status: "INACTIVE" })}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Nonaktif</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">
                {initialData ? "Simpan Perubahan" : "Tambah Kategori"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
