"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Product, Variant, Tax, ServiceFee, ProductFormData } from "../types";
import { StatusToggle } from "./status-toggle";
import { ImageUploader } from "./image-uploader";
import { mockVariants, mockTaxes, mockServiceFees } from "../mock-data";
import { 
  X, 
  ChevronDown,
  Package,
  Tag,
  DollarSign,
  Box,
  Truck,
  Settings,
} from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData, productId?: string) => void;
  product?: Product | null;
  isLoading?: boolean;
  categories?: { id: string; name: string }[];
}

interface ImageFile {
  id: string;
  file?: File;
  url: string;
  isPrimary: boolean;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  price: 0,
  comparePrice: 0,
  categoryId: null,
  isActive: true,
  barcode: "",
  sku: "",
  useStock: false,
  stockQuantity: 0,
  stockLimit: 0,
  taxId: null,
  serviceFeeId: null,
  takeawayFee: 0,
  useDimension: false,
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  images: [],
  channelPrices: {
    gofood: 0,
    grabfood: 0,
    shopeefood: 0,
  },
  variantIds: [],
};

type TabType = "basic" | "pricing" | "inventory" | "advanced";

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  isLoading = false,
  categories = [],
}: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!product;

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        comparePrice: product.comparePrice || 0,
        categoryId: product.categoryId || null,
        isActive: product.isActive,
        barcode: product.barcode || "",
        sku: product.sku || "",
        useStock: product.useStock,
        stockQuantity: product.stockQuantity || 0,
        stockLimit: product.stockLimit || 0,
        taxId: product.taxId || null,
        serviceFeeId: product.serviceFeeId || null,
        takeawayFee: product.takeawayFee || 0,
        useDimension: product.useDimension,
        weight: product.weight || 0,
        length: product.length || 0,
        width: product.width || 0,
        height: product.height || 0,
        images: [],
        channelPrices: {
          gofood: product.channelPrices.find(p => p.channel === 'gofood')?.price || 0,
          grabfood: product.channelPrices.find(p => p.channel === 'grabfood')?.price || 0,
          shopeefood: product.channelPrices.find(p => p.channel === 'shopeefood')?.price || 0,
        },
        variantIds: product.variantIds,
      });
      setImages(product.images.map(img => ({
        id: `existing-${img.id}`,
        url: img.url,
        isPrimary: img.isPrimary,
      })));
    } else {
      setFormData(initialFormData);
      setImages([]);
    }
    setActiveTab("basic");
    setErrors({});
  }, [product, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Nama produk wajib diisi";
    }
    if (formData.price <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }
    if (formData.useStock && formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Stok tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData, product?.id);
  };

  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "basic", label: "Informasi Dasar", icon: <Package className="h-4 w-4" /> },
    { id: "pricing", label: "Harga & Channel", icon: <DollarSign className="h-4 w-4" /> },
    { id: "inventory", label: "Stok & Varian", icon: <Box className="h-4 w-4" /> },
    { id: "advanced", label: "Lainnya", icon: <Settings className="h-4 w-4" /> },
  ];

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
          className="bg-surface rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">
              {isEditing ? "Ubah Produk" : "Tambah Produk"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-background rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-text-secondary" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Basic Tab */}
            {activeTab === "basic" && (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Nama Produk <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Contoh: Nasi Goreng Spesial"
                    className={cn(
                      "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      errors.name ? "border-error" : "border-border"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-error mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Deskripsi produk..."
                    rows={3}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={formData.categoryId || ""}
                    onChange={(e) => updateField("categoryId", e.target.value || null)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Status Dijual</p>
                    <p className="text-xs text-text-secondary">
                      Produk akan ditampilkan di menu penjualan
                    </p>
                  </div>
                  <StatusToggle
                    checked={formData.isActive}
                    onChange={(checked) => updateField("isActive", checked)}
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Foto Produk
                  </label>
                  <ImageUploader
                    images={images}
                    onChange={setImages}
                    maxImages={5}
                  />
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-5">
                {/* Main Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Harga Produk <span className="text-error">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) => updateField("price", Number(e.target.value))}
                        placeholder="0"
                        className={cn(
                          "w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                          errors.price ? "border-error" : "border-border"
                        )}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-error mt-1">{errors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Harga Coret
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                        Rp
                      </span>
                      <input
                        type="number"
                        value={formData.comparePrice || ""}
                        onChange={(e) => updateField("comparePrice", Number(e.target.value))}
                        placeholder="0"
                        className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Channel Prices */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-3">
                    Harga per Channel
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: "gofood", label: "GoFood", color: "bg-green-500" },
                      { key: "grabfood", label: "GrabFood", color: "bg-emerald-500" },
                      { key: "shopeefood", label: "ShopeeFood", color: "bg-orange-500" },
                    ].map((channel) => (
                      <div key={channel.key} className="flex items-center gap-3">
                        <div className={cn("w-3 h-3 rounded-full", channel.color)} />
                        <span className="text-sm text-text-primary w-24">
                          {channel.label}
                        </span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                            Rp
                          </span>
                          <input
                            type="number"
                            value={formData.channelPrices[channel.key as keyof typeof formData.channelPrices] || ""}
                            onChange={(e) =>
                              updateField("channelPrices", {
                                ...formData.channelPrices,
                                [channel.key]: Number(e.target.value),
                              })
                            }
                            placeholder="Sama dengan harga utama"
                            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-text-secondary mt-2">
                    Kosongkan jika sama dengan harga utama
                  </p>
                </div>

                {/* SKU & Barcode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => updateField("sku", e.target.value)}
                      placeholder="Contoh: NSG-001"
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                      Barcode
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => updateField("barcode", e.target.value)}
                      placeholder="Scan atau ketik barcode"
                      className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Tab */}
            {activeTab === "inventory" && (
              <div className="space-y-5">
                {/* Stock Toggle */}
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Aktifkan Stok</p>
                    <p className="text-xs text-text-secondary">
                      Hitung stok produk secara otomatis
                    </p>
                  </div>
                  <StatusToggle
                    checked={formData.useStock}
                    onChange={(checked) => updateField("useStock", checked)}
                  />
                </div>

                {/* Stock Fields */}
                {formData.useStock && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Sisa Stok
                      </label>
                      <input
                        type="number"
                        value={formData.stockQuantity || ""}
                        onChange={(e) => updateField("stockQuantity", Number(e.target.value))}
                        placeholder="0"
                        className={cn(
                          "w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                          errors.stockQuantity ? "border-error" : "border-border"
                        )}
                      />
                      {errors.stockQuantity && (
                        <p className="text-xs text-error mt-1">{errors.stockQuantity}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Batas Stok (Peringatan)
                      </label>
                      <input
                        type="number"
                        value={formData.stockLimit || ""}
                        onChange={(e) => updateField("stockLimit", Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Variants */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Varian Produk
                  </label>
                  <div className="space-y-2">
                    {mockVariants.filter(v => v.isActive).map((variant) => (
                      <label
                        key={variant.id}
                        className={cn(
                          "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                          formData.variantIds.includes(variant.id)
                            ? "border-primary bg-primary-light"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={formData.variantIds.includes(variant.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField("variantIds", [...formData.variantIds, variant.id]);
                            } else {
                              updateField("variantIds", formData.variantIds.filter(id => id !== variant.id));
                            }
                          }}
                          className="h-4 w-4 text-primary rounded border-border focus:ring-primary"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-text-primary">{variant.name}</p>
                          <p className="text-xs text-text-secondary">
                            {variant.options.length} opsi • {variant.isRequired ? "Wajib" : "Opsional"}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === "advanced" && (
              <div className="space-y-5">
                {/* Tax */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Pajak
                  </label>
                  <select
                    value={formData.taxId || ""}
                    onChange={(e) => updateField("taxId", e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Tidak Ada Pajak</option>
                    {mockTaxes.map((tax) => (
                      <option key={tax.id} value={tax.id}>
                        {tax.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Fee */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Service Fee
                  </label>
                  <select
                    value={formData.serviceFeeId || ""}
                    onChange={(e) => updateField("serviceFeeId", e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Tidak Ada Service Fee</option>
                    {mockServiceFees.map((fee) => (
                      <option key={fee.id} value={fee.id}>
                        {fee.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Takeaway Fee */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Biaya Bawa Pulang
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={formData.takeawayFee || ""}
                      onChange={(e) => updateField("takeawayFee", Number(e.target.value))}
                      placeholder="0"
                      className="w-full pl-10 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Dimension Toggle */}
                <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Dimensi Pengiriman</p>
                    <p className="text-xs text-text-secondary">
                      Aktifkan untuk produk yang dikirim
                    </p>
                  </div>
                  <StatusToggle
                    checked={formData.useDimension}
                    onChange={(checked) => updateField("useDimension", checked)}
                  />
                </div>

                {/* Dimension Fields */}
                {formData.useDimension && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Berat (gram)
                      </label>
                      <input
                        type="number"
                        value={formData.weight || ""}
                        onChange={(e) => updateField("weight", Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Panjang (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.length || ""}
                        onChange={(e) => updateField("length", Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Lebar (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.width || ""}
                        onChange={(e) => updateField("width", Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Tinggi (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.height || ""}
                        onChange={(e) => updateField("height", Number(e.target.value))}
                        placeholder="0"
                        className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Produk"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
