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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Upload, 
  Store, 
  Layers, 
  DollarSign, 
  Truck,
  AlertCircle
} from "lucide-react";
import { MasterProduct, MasterCategory, MasterVariant, Outlet } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";

interface MasterProductFormProps {
  open: boolean;
  onClose: () => void;
  product: MasterProduct | null;
  onSubmit: (data: Omit<MasterProduct, "id" | "createdAt" | "updatedAt">) => void;
  categories: MasterCategory[];
  variants: MasterVariant[];
  outlets: Outlet[];
}

export function MasterProductForm({
  open,
  onClose,
  product,
  onSubmit,
  categories,
  variants,
  outlets,
}: MasterProductFormProps) {
  const isEditMode = product !== null;
  
  // Form State
  const [formData, setFormData] = useState<Partial<MasterProduct>>({
    name: "",
    categoryId: "",
    basePrice: 0,
    costPrice: 0,
    channelPrices: { goFood: 0, grabFood: 0, shopeeFood: 0 },
    trackStock: true,
    stock: 0,
    sku: "",
    hasTax: false,
    hasServiceFee: false,
    variantIds: [],
    outletIds: [],
    status: "ACTIVE",
    dimensions: { length: 0, width: 0, height: 0, weight: 0 },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset/Init Form
  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          ...product,
          channelPrices: { 
            goFood: product.channelPrices?.goFood || 0,
            grabFood: product.channelPrices?.grabFood || 0,
            shopeeFood: product.channelPrices?.shopeeFood || 0,
            ...product.channelPrices 
          },
          dimensions: {
            length: product.dimensions?.length || 0,
            width: product.dimensions?.width || 0,
            height: product.dimensions?.height || 0,
            weight: product.dimensions?.weight || 0,
          }
        });
      } else {
        setFormData({
          name: "",
          categoryId: "",
          basePrice: 0,
          costPrice: 0,
          channelPrices: { goFood: 0, grabFood: 0, shopeeFood: 0 },
          trackStock: true,
          stock: 0,
          sku: "",
          hasTax: true,
          hasServiceFee: false,
          variantIds: [],
          outletIds: [],
          status: "ACTIVE",
          dimensions: { length: 0, width: 0, height: 0, weight: 0 },
        });
      }
      setErrors({});
    }
  }, [open, product]);

  const handleChange = (field: keyof MasterProduct, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (
    parent: "channelPrices" | "dimensions",
    field: string,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleToggleSelection = (field: "variantIds" | "outletIds", id: string) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Nama produk wajib diisi";
    if (!formData.categoryId) newErrors.categoryId = "Kategori wajib dipilih";
    if ((formData.basePrice || 0) < 0) newErrors.basePrice = "Harga tidak boleh negatif";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData as Omit<MasterProduct, "id" | "createdAt" | "updatedAt">);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b border-border sticky top-0 bg-surface z-10">
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? "Ubah Master Produk" : "Tambah Master Produk"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8">
          {/* 1. General Info */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
              <Package className="h-5 w-5 text-indigo-500" />
              Informasi Umum
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Kopi Susu Gula Aren"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={cn(errors.name && "border-red-500")}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label>Kategori <span className="text-red-500">*</span></Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleChange("categoryId", cat.id)}
                        className={cn(
                          "flex items-center gap-2 p-3 text-sm font-medium rounded-lg border transition-all text-left",
                          formData.categoryId === cat.id
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                            : "border-border hover:border-border hover:bg-background text-text-secondary"
                        )}
                      >
                         {/* Simple Icon placeholder if not valid URL */}
                        <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center shrink-0">
                           {cat.name.charAt(0)}
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId}</p>}
                </div>
                
                 <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Kode Produk)</Label>
                   <Input
                    id="sku"
                    placeholder="Contoh: COFFEE-001"
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Foto Produk</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-background transition-colors cursor-pointer group">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                    <Upload className="h-6 w-6 text-indigo-600" />
                  </div>
                  <p className="font-medium text-text-primary">Klik untuk upload foto</p>
                  <p className="text-xs text-text-secondary mt-1">PNG, JPG up to 5MB</p>
                </div>
                <Input
                   placeholder="Atau masukkan URL gambar..."
                   value={formData.image || ""}
                   onChange={(e) => handleChange("image", e.target.value)}
                   className="text-sm"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-divider" />

          {/* 2. Pricing & Financials */}
           <section className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
              <DollarSign className="h-5 w-5 text-green-600" />
              Harga & Keuangan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Harga Jual (Base)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">Rp</span>
                    <Input
                      id="basePrice"
                      type="number"
                      className="pl-9"
                      value={formData.basePrice}
                      onChange={(e) => handleChange("basePrice", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Harga Modal (HPP)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-medium">Rp</span>
                    <Input
                      id="costPrice"
                      type="number"
                      className="pl-9"
                      value={formData.costPrice || 0}
                      onChange={(e) => handleChange("costPrice", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              
              <div className="flex items-center justify-between p-4 bg-background rounded-lg md:col-span-2">
                 <div className="space-y-0.5">
                   <Label className="text-base text-text-primary">Pajak (Tax)</Label>
                   <p className="text-xs text-text-secondary">Produk ini dikenakan pajak</p>
                 </div>
                 <StatusToggle 
                    checked={formData.hasTax || false}
                    onChange={(checked) => handleChange("hasTax", checked)}
                 />
              </div>

               <div className="flex items-center justify-between p-4 bg-background rounded-lg md:col-span-2 md:col-start-2">
                 <div className="space-y-0.5">
                   <Label className="text-base text-text-primary">Service Fee</Label>
                   <p className="text-xs text-text-secondary">Produk ini dikenakan biaya layanan</p>
                 </div>
                 <StatusToggle 
                    checked={formData.hasServiceFee || false}
                    onChange={(checked) => handleChange("hasServiceFee", checked)}
                 />
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <Label className="text-blue-900 mb-3 block">Harga Layanan Pesan Antar (Opsional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="space-y-1.5">
                    <span className="text-xs font-medium text-text-secondary">GoFood</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-xs">Rp</span>
                      <Input
                        type="number"
                        className="pl-8 h-9 text-sm bg-surface"
                        placeholder="0"
                        value={formData.channelPrices?.goFood}
                        onChange={(e) => handleNestedChange("channelPrices", "goFood", parseInt(e.target.value) || 0)}
                      />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <span className="text-xs font-medium text-text-secondary">GrabFood</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-xs">Rp</span>
                      <Input
                        type="number"
                        className="pl-8 h-9 text-sm bg-surface"
                        placeholder="0"
                        value={formData.channelPrices?.grabFood}
                        onChange={(e) => handleNestedChange("channelPrices", "grabFood", parseInt(e.target.value) || 0)}
                      />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <span className="text-xs font-medium text-text-secondary">ShopeeFood</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled text-xs">Rp</span>
                      <Input
                        type="number"
                        className="pl-8 h-9 text-sm bg-surface"
                        placeholder="0"
                        value={formData.channelPrices?.shopeeFood}
                        onChange={(e) => handleNestedChange("channelPrices", "shopeeFood", parseInt(e.target.value) || 0)}
                      />
                    </div>
                 </div>
              </div>
            </div>
          </section>

          <div className="border-t border-divider" />

           {/* 3. Inventory & Dimensions */}
           <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Inventori & Pengiriman
                </h3>
                <div className="flex items-center gap-2">
                   <Label htmlFor="trackStock" className="cursor-pointer">Lacak Stok?</Label>
                   <StatusToggle 
                      checked={formData.trackStock || false}
                      onChange={(checked) => handleChange("trackStock", checked)}
                   />
                </div>
             </div>

             {formData.trackStock && (
                <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-lg flex items-center gap-4">
                    <div className="space-y-1 flex-1">
                      <Label>Stok Saat Ini</Label>
                       <Input
                        type="number"
                        className="bg-surface"
                        value={formData.stock}
                        onChange={(e) => handleChange("stock", parseInt(e.target.value) || 0)}
                      />
                    </div>
                     <div className="space-y-1 flex-1">
                      <Label>Minimum Stok (Alert)</Label>
                       <Input
                        type="number"
                        className="bg-surface"
                        value={formData.minStock || 0}
                        onChange={(e) => handleChange("minStock", parseInt(e.target.value) || 0)}
                      />
                    </div>
                </div>
             )}
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Panjang (cm)</Label>
                  <Input 
                    type="number" 
                    className="h-8" 
                    placeholder="0"
                    value={formData.dimensions?.length}
                    onChange={(e) => handleNestedChange("dimensions", "length", parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Lebar (cm)</Label>
                  <Input 
                    type="number" 
                    className="h-8" 
                    placeholder="0"
                    value={formData.dimensions?.width}
                    onChange={(e) => handleNestedChange("dimensions", "width", parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Tinggi (cm)</Label>
                  <Input 
                    type="number" 
                    className="h-8" 
                    placeholder="0"
                    value={formData.dimensions?.height}
                    onChange={(e) => handleNestedChange("dimensions", "height", parseInt(e.target.value) || 0)} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-text-secondary">Berat (gram)</Label>
                  <Input 
                    type="number" 
                    className="h-8" 
                    placeholder="0"
                    value={formData.dimensions?.weight}
                    onChange={(e) => handleNestedChange("dimensions", "weight", parseInt(e.target.value) || 0)} 
                  />
                </div>
             </div>
           </section>

           <div className="border-t border-divider" />
           
           {/* 4. Variants & Outlets */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Variants */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Varian Produk
                </h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-background px-4 py-2 border-b border-border text-xs font-medium text-text-secondary uppercase">
                    Pilih Varian yang Tersedia
                  </div>
                  <div className="divide-y divide-divider max-h-[300px] overflow-y-auto">
                    {variants.map((variant) => (
                      <label 
                        key={variant.id} 
                        className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer transition-colors"
                      >
                        <Checkbox 
                          checked={formData.variantIds?.includes(variant.id)}
                          onCheckedChange={() => handleToggleSelection("variantIds", variant.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-text-primary text-sm">{variant.name}</p>
                          <p className="text-xs text-text-secondary">{variant.options.length} opsi • {variant.type === 'SINGLE' ? '1 Pilihan' : 'Banyak Pilihan'}</p>
                        </div>
                        {variant.isMandatory && (
                          <Badge variant="secondary" className="text-[10px]">Wajib</Badge>
                        )}
                      </label>
                    ))}
                    {variants.length === 0 && (
                      <div className="p-4 text-center text-sm text-text-secondary">
                        Belum ada master varian.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Outlets */}
              <section className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-text-primary">
                  <Store className="h-5 w-5 text-blue-600" />
                  Ketersediaan Outlet
                </h3>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-background px-4 py-2 border-b border-border text-xs font-medium text-text-secondary uppercase">
                    Pilih Outlet yang Menjual
                  </div>
                   <div className="divide-y divide-divider max-h-[300px] overflow-y-auto">
                    {outlets.map((outlet) => (
                      <label 
                        key={outlet.id} 
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <Checkbox 
                          checked={formData.outletIds?.includes(outlet.id)}
                          onCheckedChange={() => handleToggleSelection("outletIds", outlet.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-text-primary text-sm">{outlet.name}</p>
                          <p className="text-xs text-text-secondary">{outlet.address || "Tidak ada alamat"}</p>
                        </div>
                        {outlet.isActive && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </label>
                    ))}
                    {outlets.length === 0 && (
                      <div className="p-4 text-center text-sm text-text-secondary">
                        Belum ada outlet terdaftar.
                      </div>
                    )}
                  </div>
                </div>
              </section>
           </div>
        </div>

        <DialogHeader className="px-6 py-4 border-t border-border bg-background sticky bottom-0">
           <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                 <Label>Status Produk</Label>
                 <StatusToggle 
                    checked={formData.status === 'ACTIVE'}
                    onChange={(checked) => handleChange("status", checked ? 'ACTIVE' : 'INACTIVE')}
                 />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button onClick={handleSubmit}>
                  {isEditMode ? "Simpan Perubahan" : "Buat Produk"}
                </Button>
              </div>
           </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
