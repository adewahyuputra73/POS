"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Store, ChevronRight } from "lucide-react";
import { Outlet } from "../types";

interface ImportCategoryModalProps {
  open: boolean;
  onClose: () => void;
  outlets: Outlet[];
  onImport: (outletId: string, categoryIds: number[]) => void;
}

// Mock outlet categories for demo
const mockOutletCategories: Record<string, { id: number; name: string; productCount: number }[]> = {
  "outlet-1": [
    { id: 101, name: 'Makanan', productCount: 12 },
    { id: 102, name: 'Minuman', productCount: 8 },
    { id: 103, name: 'Snack', productCount: 5 },
  ],
  "outlet-2": [
    { id: 201, name: 'Rice Bowl', productCount: 6 },
    { id: 202, name: 'Noodles', productCount: 4 },
    { id: 203, name: 'Beverages', productCount: 7 },
  ],
  "outlet-3": [
    { id: 301, name: 'Paket Hemat', productCount: 3 },
    { id: 302, name: 'Menu Spesial', productCount: 5 },
  ],
};

export function ImportCategoryModal({
  open,
  onClose,
  outlets,
  onImport,
}: ImportCategoryModalProps) {
  const [step, setStep] = useState<'outlet' | 'category'>('outlet');
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const handleReset = () => {
    setStep('outlet');
    setSelectedOutlet(null);
    setSelectedCategories([]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSelectOutlet = (outlet: Outlet) => {
    setSelectedOutlet(outlet);
    setSelectedCategories([]);
    setStep('category');
  };

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleImport = () => {
    if (selectedOutlet && selectedCategories.length > 0) {
      onImport(selectedOutlet.id, selectedCategories);
      handleClose();
    }
  };

  const categories = selectedOutlet ? (mockOutletCategories[selectedOutlet.id] || []) : [];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Impor Kategori dari Outlet
          </DialogTitle>
        </DialogHeader>

        {step === 'outlet' && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-text-secondary">
              Pilih outlet sumber untuk mengimpor kategori:
            </p>
            <div className="space-y-2">
              {outlets.filter(o => o.isActive).map((outlet) => (
                <button
                  key={outlet.id}
                  onClick={() => handleSelectOutlet(outlet)}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary">{outlet.name}</p>
                    <p className="text-sm text-text-secondary truncate">{outlet.address}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-text-disabled" />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'category' && selectedOutlet && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('outlet')}
                className="text-sm text-primary hover:underline"
              >
                ← Ganti Outlet
              </button>
              <span className="text-sm text-text-disabled">|</span>
              <span className="text-sm text-text-secondary">
                {selectedOutlet.name}
              </span>
            </div>

            <p className="text-sm text-text-secondary">
              Pilih kategori yang ingin diimpor:
            </p>

            {categories.length === 0 ? (
              <div className="text-center py-8 text-text-disabled">
                Tidak ada kategori di outlet ini
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedCategories.includes(category.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-background"
                    )}
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleToggleCategory(category.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">{category.name}</p>
                      <p className="text-sm text-text-secondary">
                        {category.productCount} produk
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button
                onClick={handleImport}
                disabled={selectedCategories.length === 0}
              >
                Impor ({selectedCategories.length})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
