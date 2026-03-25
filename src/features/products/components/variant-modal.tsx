"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui";
import { 
  Variant, 
  VariantOption, 
  VariantFormData, 
  VariantOptionFormData,
  VariantSourceType,
  Product,
} from "../types";
import { StatusToggle } from "./status-toggle";
import { mockProducts } from "../mock-data";
import { 
  X, 
  Plus,
  Trash2,
  AlertCircle,
  Package,
  Layers,
  Search,
  Check,
} from "lucide-react";

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VariantFormData, variantId?: number) => void;
  variant?: Variant | null;
  isLoading?: boolean;
}

const createEmptyOption = (): VariantOptionFormData => ({
  name: "",
  price: 0,
  channelPrices: {
    gofood: 0,
    grabfood: 0,
    shopeefood: 0,
  },
  useStock: false,
  stockQuantity: 0,
  isActive: true,
});

const initialFormData: VariantFormData = {
  name: "",
  isRequired: false,
  maxOptions: null,
  sourceType: "custom",
  options: [createEmptyOption()],
};

export function VariantModal({
  isOpen,
  onClose,
  onSave,
  variant,
  isLoading = false,
}: VariantModalProps) {
  const [formData, setFormData] = useState<VariantFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [hasLimitOptions, setHasLimitOptions] = useState(false);

  const isEditing = !!variant;

  // Populate form when editing
  useEffect(() => {
    if (variant) {
      setFormData({
        name: variant.name,
        isRequired: variant.isRequired,
        maxOptions: variant.maxOptions ?? null,
        sourceType: variant.sourceType,
        options: variant.options.map(opt => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
          channelPrices: {
            gofood: opt.channelPrices?.find(p => p.channel === 'gofood')?.price || 0,
            grabfood: opt.channelPrices?.find(p => p.channel === 'grabfood')?.price || 0,
            shopeefood: opt.channelPrices?.find(p => p.channel === 'shopeefood')?.price || 0,
          },
          useStock: opt.useStock,
          stockQuantity: opt.stockQuantity || 0,
          isActive: opt.isActive,
          sourceProductId: opt.sourceProductId,
        })),
      });
      setHasLimitOptions(!!variant.maxOptions);
      setSelectedProductIds(
        variant.options
          .filter(o => o.sourceProductId)
          .map(o => o.sourceProductId!)
      );
    } else {
      setFormData(initialFormData);
      setHasLimitOptions(false);
      setSelectedProductIds([]);
    }
    setErrors({});
    setShowProductPicker(false);
    setProductSearch("");
  }, [variant, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nama varian wajib diisi";
    }
    if (formData.options.length === 0) {
      newErrors.options = "Minimal harus ada 1 opsi";
    }
    for (let i = 0; i < formData.options.length; i++) {
      if (!formData.options[i].name.trim()) {
        newErrors[`option_${i}`] = "Nama opsi wajib diisi";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData, variant?.id);
  };

  const updateField = <K extends keyof VariantFormData>(
    field: K,
    value: VariantFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, createEmptyOption()],
    }));
  };

  const updateOption = (index: number, data: Partial<VariantOptionFormData>) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, ...data } : opt
      ),
    }));
    if (errors[`option_${index}`] && data.name) {
      setErrors(prev => ({ ...prev, [`option_${index}`]: "" }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSourceTypeChange = (type: VariantSourceType) => {
    if (isEditing) return; // Cannot change source type when editing
    
    setFormData(prev => ({
      ...prev,
      sourceType: type,
      options: type === 'custom' ? [createEmptyOption()] : [],
    }));
    setSelectedProductIds([]);
  };

  const toggleProductSelection = (product: Product) => {
    if (selectedProductIds.includes(product.id)) {
      setSelectedProductIds(prev => prev.filter(id => id !== product.id));
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter(o => o.sourceProductId !== product.id),
      }));
    } else {
      setSelectedProductIds(prev => [...prev, product.id]);
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, {
          name: product.name,
          price: product.price,
          channelPrices: {
            gofood: product.channelPrices.find(p => p.channel === 'gofood')?.price || 0,
            grabfood: product.channelPrices.find(p => p.channel === 'grabfood')?.price || 0,
            shopeefood: product.channelPrices.find(p => p.channel === 'shopeefood')?.price || 0,
          },
          useStock: false,
          stockQuantity: 0,
          isActive: product.isActive,
          sourceProductId: product.id,
        }],
      }));
    }
  };

  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku?.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">
              {isEditing ? "Ubah Varian" : "Tambah Varian"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-text-secondary" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Informasi Dasar
              </h3>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Nama Varian <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Contoh: Level Pedas, Ukuran, Topping"
                  className={cn(
                    "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    errors.name ? "border-error" : "border-border"
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-error mt-1">{errors.name}</p>
                )}
              </div>

              {/* Required & Max Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary text-sm">Wajib Dipilih</p>
                    <p className="text-xs text-text-secondary">
                      Customer harus memilih opsi
                    </p>
                  </div>
                  <StatusToggle
                    checked={formData.isRequired}
                    onChange={(checked) => updateField("isRequired", checked)}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary text-sm">Batasi Pilihan</p>
                    <p className="text-xs text-text-secondary">
                      Maks. opsi bisa dipilih
                    </p>
                  </div>
                  <StatusToggle
                    checked={hasLimitOptions}
                    onChange={(checked) => {
                      setHasLimitOptions(checked);
                      updateField("maxOptions", checked ? 1 : null);
                    }}
                    size="sm"
                  />
                </div>
              </div>

              {hasLimitOptions && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Maksimal Pilihan
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxOptions || 1}
                    onChange={(e) => updateField("maxOptions", Number(e.target.value))}
                    className="w-32 px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              )}
            </div>

            {/* Source Type Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">
                Sumber Opsi
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSourceTypeChange("custom")}
                  disabled={isEditing}
                  className={cn(
                    "p-4 border-2 rounded-xl text-left transition-all",
                    formData.sourceType === "custom"
                      ? "border-primary bg-primary-light"
                      : "border-border hover:border-primary/50",
                    isEditing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Layers className={cn(
                    "h-6 w-6 mb-2",
                    formData.sourceType === "custom" ? "text-primary" : "text-text-secondary"
                  )} />
                  <p className="font-semibold text-text-primary">Buat Opsi Sendiri</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Buat dan kelola opsi secara manual
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSourceTypeChange("product")}
                  disabled={isEditing}
                  className={cn(
                    "p-4 border-2 rounded-xl text-left transition-all",
                    formData.sourceType === "product"
                      ? "border-primary bg-primary-light"
                      : "border-border hover:border-primary/50",
                    isEditing && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Package className={cn(
                    "h-6 w-6 mb-2",
                    formData.sourceType === "product" ? "text-primary" : "text-text-secondary"
                  )} />
                  <p className="font-semibold text-text-primary">Dari Buku Menu</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Ambil opsi dari produk yang ada
                  </p>
                </button>
              </div>

              {isEditing && (
                <div className="flex items-start gap-2 p-3 bg-warning-light rounded-lg">
                  <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-warning">
                    Sumber opsi tidak dapat diubah setelah varian disimpan.
                  </p>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">
                  Daftar Opsi
                </h3>
                {formData.sourceType === "custom" && (
                  <Button variant="outline" size="sm" onClick={addOption}>
                    <Plus className="h-4 w-4 mr-1" />
                    Tambah Opsi
                  </Button>
                )}
                {formData.sourceType === "product" && (
                  <Button variant="outline" size="sm" onClick={() => setShowProductPicker(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Pilih Produk
                  </Button>
                )}
              </div>

              {errors.options && (
                <p className="text-xs text-error">{errors.options}</p>
              )}

              {/* Custom Options */}
              {formData.sourceType === "custom" && (
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Nama Opsi *
                            </label>
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) => updateOption(index, { name: e.target.value })}
                              placeholder="Contoh: Pedas"
                              className={cn(
                                "w-full px-3 py-2 border rounded-lg text-sm",
                                errors[`option_${index}`] ? "border-error" : "border-border"
                              )}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-text-secondary mb-1">
                              Harga Tambahan
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                                Rp
                              </span>
                              <input
                                type="number"
                                value={option.price || ""}
                                onChange={(e) => updateOption(index, { price: Number(e.target.value) })}
                                placeholder="0"
                                className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-5">
                          <StatusToggle
                            checked={option.isActive}
                            onChange={(checked) => updateOption(index, { isActive: checked })}
                            size="sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            disabled={formData.options.length <= 1}
                            className="p-2 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center gap-4 pt-2 border-t border-border">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={option.useStock}
                            onChange={(e) => updateOption(index, { useStock: e.target.checked })}
                            className="h-4 w-4 text-primary rounded border-border"
                          />
                          <span className="text-text-secondary">Aktifkan Stok</span>
                        </label>
                        {option.useStock && (
                          <input
                            type="number"
                            value={option.stockQuantity || ""}
                            onChange={(e) => updateOption(index, { stockQuantity: Number(e.target.value) })}
                            placeholder="Sisa stok"
                            className="w-24 px-3 py-1.5 border border-border rounded-lg text-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Product Options (Read-only) */}
              {formData.sourceType === "product" && (
                <div className="space-y-3">
                  {formData.options.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
                      <Package className="h-8 w-8 mx-auto text-text-secondary mb-2" />
                      <p className="text-sm text-text-secondary">
                        Belum ada produk dipilih
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowProductPicker(true)}
                        className="mt-3"
                      >
                        Pilih Produk
                      </Button>
                    </div>
                  ) : (
                    formData.options.map((option, index) => (
                      <div
                        key={index}
                        className="p-4 border border-border rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{option.name}</p>
                            <p className="text-sm text-text-secondary">
                              {formatCurrency(option.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2 py-1 text-xs font-medium rounded-md",
                            option.isActive ? "bg-success-light text-success" : "bg-error-light text-error"
                          )}>
                            {option.isActive ? "Aktif" : "Tidak Aktif"}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (option.sourceProductId) {
                                toggleProductSelection({ id: option.sourceProductId } as Product);
                              }
                            }}
                            className="p-2 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {formData.options.length > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-primary-light rounded-lg">
                      <AlertCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-primary">
                        Opsi ini berasal dari Menu Produk. Untuk mengubah status aktif/non-aktif atau harga, silakan kelola dari Menu Produk.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Varian"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Picker Modal */}
      {showProductPicker && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-[60]"
            onClick={() => setShowProductPicker(false)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-text-primary">Pilih Produk</h3>
                <button
                  onClick={() => setShowProductPicker(false)}
                  className="p-1.5 hover:bg-background rounded-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Cari produk..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProductSelection(product)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors",
                      selectedProductIds.includes(product.id)
                        ? "bg-primary-light"
                        : "hover:bg-background"
                    )}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded border-2 flex items-center justify-center",
                      selectedProductIds.includes(product.id)
                        ? "bg-primary border-primary"
                        : "border-border"
                    )}>
                      {selectedProductIds.includes(product.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-text-primary">{product.name}</p>
                      <p className="text-xs text-text-secondary">
                        {formatCurrency(product.price)}
                        {product.categoryName && ` • ${product.categoryName}`}
                      </p>
                    </div>
                    {!product.isActive && (
                      <span className="text-xs text-error">Tidak Aktif</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border">
                <Button onClick={() => setShowProductPicker(false)} className="w-full">
                  Selesai ({selectedProductIds.length} dipilih)
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
