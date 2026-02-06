"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus, X, Package } from "lucide-react";
import { MasterCategory, MasterCategoryFormData, MasterProduct } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";

interface MasterCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: MasterCategory | null;
  masterProducts: MasterProduct[];
  onSubmit: (data: MasterCategoryFormData) => void;
}

export function MasterCategoryModal({
  open,
  onClose,
  category,
  masterProducts,
  onSubmit,
}: MasterCategoryModalProps) {
  const isEditMode = category !== null;
  
  const [formData, setFormData] = useState<MasterCategoryFormData>({
    name: "",
    isActive: true,
    productIds: [],
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          isActive: category.isActive,
          productIds: category.productIds,
        });
        setSelectedProducts(category.productIds);
      } else {
        setFormData({
          name: "",
          isActive: true,
          productIds: [],
        });
        setSelectedProducts([]);
      }
      setErrors({});
      setShowProductPicker(false);
    }
  }, [open, category]);

  const handleChange = (field: keyof MasterCategoryFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "name" && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((id) => id !== productId),
    }));
  };

  const handleAddProduct = (productId: number) => {
    if (!selectedProducts.includes(productId)) {
      setSelectedProducts((prev) => [...prev, productId]);
      setFormData((prev) => ({
        ...prev,
        productIds: [...prev.productIds, productId],
      }));
    }
    setShowProductPicker(false);
  };

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nama kategori wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({ ...formData, productIds: selectedProducts });
      onClose();
    }
  };

  const selectedProductList = masterProducts.filter((p) =>
    selectedProducts.includes(p.id)
  );

  const availableProducts = masterProducts.filter(
    (p) => !selectedProducts.includes(p.id) && p.isActive
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? "Ubah Master Kategori" : "Tambah Master Kategori"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama Kategori <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Makanan Utama"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={cn(errors.name && "border-red-500")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Status Aktif</p>
              <p className="text-sm text-gray-500">
                Kategori akan tersedia untuk digunakan
              </p>
            </div>
            <StatusToggle
              checked={formData.isActive}
              onChange={(checked) => handleChange("isActive", checked)}
            />
          </div>

          {/* Master Products Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Pilih Master Produk</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowProductPicker(!showProductPicker)}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Tambah
              </Button>
            </div>

            {/* Quick Product Picker */}
            {showProductPicker && availableProducts.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-2 max-h-[200px] overflow-y-auto space-y-1">
                {availableProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleAddProduct(product.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(product.basePrice)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {showProductPicker && availableProducts.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Semua master produk sudah ditambahkan
              </p>
            )}

            {/* Selected Products */}
            {selectedProductList.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center">
                <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Belum ada master produk dipilih
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Opsional - produk dapat ditambahkan nanti
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                {selectedProductList.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                  >
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(product.basePrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Simpan Perubahan" : "Tambah Kategori"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
