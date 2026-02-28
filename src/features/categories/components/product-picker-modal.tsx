"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Search, X, Package } from "lucide-react";
import { ProductForPicker } from "../types";

interface ProductPickerModalProps {
  open: boolean;
  onClose: () => void;
  products: ProductForPicker[];
  selectedProductIds: number[];
  onConfirm: (productIds: number[]) => void;
}

export function ProductPickerModal({
  open,
  onClose,
  products,
  selectedProductIds,
  onConfirm,
}: ProductPickerModalProps) {
  const [search, setSearch] = useState("");
  const [localSelected, setLocalSelected] = useState<number[]>(selectedProductIds);

  // Reset local state when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelected(selectedProductIds);
      setSearch("");
    } else {
      onClose();
    }
  };

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!search) return products;
    const searchLower = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.categoryName?.toLowerCase().includes(searchLower) ?? false)
    );
  }, [products, search]);

  const handleToggleProduct = (productId: number) => {
    setLocalSelected((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredProducts.map((p) => p.id);
    const allSelected = allIds.every((id) => localSelected.includes(id));
    
    if (allSelected) {
      setLocalSelected((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setLocalSelected((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleConfirm = () => {
    onConfirm(localSelected);
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const allSelected = filteredProducts.length > 0 && 
    filteredProducts.every((p) => localSelected.includes(p.id));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Pilih Produk</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Select All */}
        <div className="flex items-center justify-between py-2 px-1 border-b">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">Pilih Semua</span>
          </label>
          <span className="text-sm text-text-secondary">
            {localSelected.length} produk dipilih
          </span>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[400px] space-y-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-disabled">
              <Package className="h-12 w-12 mb-3" />
              <p>Tidak ada produk ditemukan</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <label
                key={product.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                  localSelected.includes(product.id)
                    ? "bg-primary/5 border border-primary/20"
                    : "hover:bg-background border border-transparent"
                )}
              >
                <Checkbox
                  checked={localSelected.includes(product.id)}
                  onCheckedChange={() => handleToggleProduct(product.id)}
                />
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-text-disabled" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{product.name}</p>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{formatPrice(product.price)}</span>
                    {product.categoryName && (
                      <>
                        <span>•</span>
                        <span>{product.categoryName}</span>
                      </>
                    )}
                  </div>
                </div>
                {!product.isActive && (
                  <span className="text-xs px-2 py-0.5 rounded bg-background text-text-secondary">
                    Tidak Aktif
                  </span>
                )}
              </label>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleConfirm}>
            Tambahkan ({localSelected.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
