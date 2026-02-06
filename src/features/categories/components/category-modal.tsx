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
import { Category, CategoryFormData, ProductForPicker } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";
import { ProductPickerModal } from "./product-picker-modal";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: Category | null; // null = add mode
  products: ProductForPicker[];
  onSubmit: (data: CategoryFormData) => void;
}

export function CategoryModal({
  open,
  onClose,
  category,
  products,
  onSubmit,
}: CategoryModalProps) {
  const isEditMode = category !== null;
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    isActive: true,
    productIds: [],
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [showProductPicker, setShowProductPicker] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          isActive: category.isActive,
          productIds: [], // Would be loaded from API in real app
        });
      } else {
        setFormData({
          name: "",
          isActive: true,
          productIds: [],
        });
      }
      setErrors({});
    }
  }, [open, category]);

  const handleChange = (field: keyof CategoryFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "name" && errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleRemoveProduct = (productId: number) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((id) => id !== productId),
    }));
  };

  const handleProductsSelected = (productIds: number[]) => {
    setFormData((prev) => ({ ...prev, productIds }));
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
      onSubmit(formData);
      onClose();
    }
  };

  const selectedProducts = products.filter((p) =>
    formData.productIds.includes(p.id)
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isEditMode ? "Ubah Kategori" : "Tambah Kategori"}
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
                placeholder="Contoh: Makanan"
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
                  Kategori akan ditampilkan di menu
                </p>
              </div>
              <StatusToggle
                checked={formData.isActive}
                onChange={(checked) => handleChange("isActive", checked)}
              />
            </div>

            {/* Products Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Pilih Produk untuk Kategori</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowProductPicker(true)}
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Tambah Produk
                </Button>
              </div>

              {selectedProducts.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Belum ada produk dipilih
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Klik &quot;Tambah Produk&quot; untuk memilih produk
                  </p>
                </div>
              ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-[200px] overflow-y-auto">
                  {selectedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50"
                    >
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(product.price)}
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
              <p className="text-xs text-gray-400">
                Opsional. Produk bisa ditambahkan nanti.
              </p>
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

      {/* Product Picker Modal */}
      <ProductPickerModal
        open={showProductPicker}
        onClose={() => setShowProductPicker(false)}
        products={products}
        selectedProductIds={formData.productIds}
        onConfirm={handleProductsSelected}
      />
    </>
  );
}
