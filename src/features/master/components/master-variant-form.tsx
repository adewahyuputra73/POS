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
import { cn } from "@/lib/utils";
import { Plus, X, GripVertical, AlertCircle, BookOpen, Type } from "lucide-react";
import { MasterVariant, MasterVariantOption, MasterProduct } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";

interface MasterVariantFormProps {
  open: boolean;
  onClose: () => void;
  variant: MasterVariant | null;
  onSubmit: (data: Omit<MasterVariant, "id" | "createdAt" | "updatedAt">) => void;
  products: MasterProduct[];
}

export function MasterVariantForm({
  open,
  onClose,
  variant,
  onSubmit,
  products,
}: MasterVariantFormProps) {
  const isEditMode = variant !== null;
  
  // Form State
  const [formData, setFormData] = useState<Partial<MasterVariant>>({
    name: "",
    type: "SINGLE",
    isMandatory: true,
    minSelection: 0,
    maxSelection: 0,
    options: [],
    status: "ACTIVE",
    optionSource: "custom",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset/Init Form
  useEffect(() => {
    if (open) {
      if (variant) {
        setFormData({
          ...variant,
        });
      } else {
        setFormData({
          name: "",
          type: "SINGLE",
          isMandatory: true,
          minSelection: 0,
          maxSelection: 0,
          options: [
            { id: `opt-${Date.now()}-1`, name: "", priceAdjustment: 0, isDefault: false }
          ],
          status: "ACTIVE",
          optionSource: "custom",
        });
      }
      setErrors({});
    }
  }, [open, variant]);

  const handleChange = (field: keyof MasterVariant, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Option Management
  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        { 
          id: `opt-${Date.now()}`, 
          name: "", 
          priceAdjustment: 0, 
          isDefault: false,
          productId: undefined
        }
      ]
    }));
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options?.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index: number, field: keyof MasterVariantOption, value: any) => {
    setFormData((prev) => {
      const newOptions = [...(prev.options || [])];
      
      // Special handling for product selection
      if (field === 'productId') {
        const selectedProduct = products.find(p => p.id === value);
        if (selectedProduct) {
          newOptions[index] = {
            ...newOptions[index],
            productId: value,
            name: selectedProduct.name, // Auto-fill name
            priceAdjustment: selectedProduct.basePrice // Optional: auto-fill price from product
          };
        }
      } else {
        newOptions[index] = { ...newOptions[index], [field]: value };
      }
      
      // Handle logic for SINGLE type default selection (radio behavior)
      if (field === 'isDefault' && value === true && prev.type === 'SINGLE') {
        newOptions.forEach((opt, i) => {
          if (i !== index) opt.isDefault = false;
        });
      }
      
      return { ...prev, options: newOptions };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = "Nama varian wajib diisi";
    
    if (!formData.options || formData.options.length === 0) {
      newErrors.options = "Minimal satu opsi wajib dibuat";
    } else {
      const hasEmptyOptionName = formData.options.some(opt => !opt.name.trim());
      if (hasEmptyOptionName) newErrors.options = "Nama opsi tidak boleh kosong";
    }

    if (formData.type === 'MULTIPLE') {
      if ((formData.maxSelection || 0) < (formData.minSelection || 0)) {
        newErrors.maxSelection = "Maksimal tidak boleh kurang dari minimal";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Clean up data before submit
      const submissionData = {
        name: formData.name!,
        type: formData.type!,
        isMandatory: formData.isMandatory!,
        minSelection: formData.type === 'MULTIPLE' ? (formData.minSelection || 0) : undefined,
        maxSelection: formData.type === 'MULTIPLE' ? (formData.maxSelection || 0) : undefined,
        options: formData.options!,
        status: formData.status!,
        optionSource: formData.optionSource || 'custom',
        appliedProductCount: variant?.appliedProductCount || 0,
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditMode ? "Ubah Master Varian" : "Tambah Master Varian"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Varian <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Ukuran, Topping"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={cn(errors.name && "border-red-500")}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Sumber Opsi</Label>
                   <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                      type="button"
                      onClick={() => {
                        handleChange("optionSource", "custom");
                        // Reset options on source change to avoid invalid state? 
                        // Or keep them but let user fix? better reset or confirm.
                        // preventing reset for now for UX, but ideally warn.
                      }}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                        formData.optionSource === "custom" 
                          ? "bg-white text-indigo-600 shadow-sm" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <Type className="h-4 w-4" />
                      Custom
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange("optionSource", "menu_book")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                        formData.optionSource === "menu_book" 
                          ? "bg-white text-purple-600 shadow-sm" 
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <BookOpen className="h-4 w-4" />
                      Dari Produk
                    </button>
                  </div>
                </div>
            </div>

            <div className="space-y-2">
              <Label>Tipe Pilihan</Label>
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => handleChange("type", "SINGLE")}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                    formData.type === "SINGLE" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Satu Pilihan (Radio)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("type", "MULTIPLE")}
                  className={cn(
                    "flex-1 py-1.5 text-sm font-medium rounded-md transition-all",
                    formData.type === "MULTIPLE" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  Banyak Pilihan (Checkbox)
                </button>
              </div>
            </div>
          </div>

          {/* Validation Settings */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Wajib Dipilih?</Label>
                <p className="text-xs text-gray-500">Pelanggan harus memilih opsi ini</p>
              </div>
              <StatusToggle
                checked={formData.isMandatory || false}
                onChange={(checked) => handleChange("isMandatory", checked)}
              />
            </div>

            {formData.type === "MULTIPLE" && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <Label>Minimal Pilihan</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.minSelection}
                    onChange={(e) => handleChange("minSelection", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maksimal Pilihan</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.maxSelection}
                    onChange={(e) => handleChange("maxSelection", parseInt(e.target.value) || 0)}
                    className={cn(errors.maxSelection && "border-red-500")}
                  />
                  {errors.maxSelection && <p className="text-xs text-red-500">{errors.maxSelection}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Daftar Opsi <span className="text-red-500">*</span></Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                <Plus className="h-4 w-4 mr-1.5" /> Tambah Opsi
              </Button>
            </div>
            
            {errors.options && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle className="h-4 w-4" />
                {errors.options}
              </div>
            )}

            <div className="space-y-2">
              {formData.options?.map((option, index) => (
                <div key={option.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg group hover:border-indigo-200 transition-colors">
                  <div className="mt-2.5 text-gray-400 cursor-move">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        {formData.optionSource === 'menu_book' ? (
                          <div className="relative">
                            <select
                              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                              value={option.productId || ""}
                              onChange={(e) => handleOptionChange(index, "productId", e.target.value)}
                            >
                              <option value="">-- Pilih Produk --</option>
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                            {!option.productId && (
                              <p className="text-xs text-orange-500 mt-1">Pilih produk untuk auto-fill nama</p>
                            )}
                          </div>
                        ) : (
                          <Input
                            placeholder="Nama Opsi"
                            value={option.name}
                            onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                            className="h-9"
                          />
                        )}
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold">
                            +Rp
                          </span>
                          <Input
                            type="number"
                            placeholder="0"
                            value={option.priceAdjustment}
                            onChange={(e) => handleOptionChange(index, "priceAdjustment", parseInt(e.target.value) || 0)}
                            className="h-9 pl-9 text-right"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                        <input
                          type={formData.type === "SINGLE" ? "radio" : "checkbox"}
                          name="default-option"
                          checked={option.isDefault}
                          onChange={(e) => handleOptionChange(index, "isDefault", e.target.checked)}
                          className="w-3.5 h-3.5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                        />
                        Terpilih Default
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="mt-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {(!formData.options || formData.options.length === 0) && (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500 text-sm">Belum ada opsi ditambahkan</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Status */}
           <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Status Aktif</p>
              <p className="text-sm text-gray-500">
                Varian akan tersedia untuk produk
              </p>
            </div>
            <StatusToggle
              checked={formData.status === 'ACTIVE'}
              onChange={(checked) => handleChange("status", checked ? 'ACTIVE' : 'INACTIVE')}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Simpan Perubahan" : "Buat Varian"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
