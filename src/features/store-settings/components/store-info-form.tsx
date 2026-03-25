"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Badge,
} from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Store,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Building2,
  Edit3,
  X,
} from "lucide-react";
import { StoreInfo, BUSINESS_TYPE_LABELS, BusinessType } from "../types";

interface StoreInfoFormProps {
  store: StoreInfo;
  onSave: (data: Partial<StoreInfo>) => Promise<void>;
}

export function StoreInfoForm({ store, onSave }: StoreInfoFormProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<StoreInfo>>({ ...store });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      showToast("Informasi toko berhasil diperbarui", "success");
      setIsEditing(false);
    } catch {
      showToast("Gagal memperbarui informasi toko", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof StoreInfo, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isEditing) {
    return (
      <Card>
        <div className="relative">
          <div className="h-36 bg-gradient-to-r from-primary via-blue-500 to-secondary rounded-t-xl flex items-center justify-center">
            {store.cover_image ? (
              <img src={store.cover_image} alt="Cover" className="h-full w-full object-cover rounded-t-xl" />
            ) : (
              <Store className="h-16 w-16 text-white/30" />
            )}
          </div>
          <div className="absolute -bottom-10 left-6">
            <div className="h-20 w-20 rounded-2xl bg-surface shadow-lg border-4 border-surface flex items-center justify-center overflow-hidden">
              {store.logo ? (
                <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
              ) : (
                <Store className="h-8 w-8 text-primary" />
              )}
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-all"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>

        <CardContent className="pt-14 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{store.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge className="bg-primary-light text-primary text-xs font-semibold">
                  {BUSINESS_TYPE_LABELS[store.business_type]}
                </Badge>
                <Badge
                  className={cn(
                    "text-xs font-semibold",
                    store.is_active ? "bg-success-light text-success" : "bg-background text-text-secondary"
                  )}
                >
                  {store.is_active ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
            </div>
          </div>

          {store.description && (
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              {store.description}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <DetailItem icon={MapPin} label="Alamat" value={`${store.address}, ${store.city}, ${store.province} ${store.postal_code}`} />
            <DetailItem icon={Phone} label="Telepon" value={store.phone} />
            <DetailItem icon={Mail} label="Email" value={store.email} />
            <DetailItem icon={Globe} label="Website" value={store.website || "-"} />
            <DetailItem icon={FileText} label="NPWP" value={store.tax_id || "-"} />
            <DetailItem icon={Building2} label="Tipe Bisnis" value={BUSINESS_TYPE_LABELS[store.business_type]} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Edit Informasi Toko</CardTitle>
          <CardDescription>Perbarui informasi dasar toko Anda</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Logo upload area */}
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl bg-background border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Camera className="h-6 w-6 text-text-disabled" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Logo Toko</p>
              <p className="text-xs text-text-secondary mt-0.5">PNG, JPG, maks 2MB. Disarankan 512x512px.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Nama Toko"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masukkan nama toko"
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-text-primary mb-1.5">Tipe Bisnis</label>
              <Select
                value={formData.business_type || ""}
                onValueChange={(val) => handleChange("business_type", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe bisnis" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BUSINESS_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="email@toko.com"
            />
            <Input
              label="Telepon"
              value={formData.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+62 xxx-xxxx-xxxx"
            />
            <Input
              label="Website"
              value={formData.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://tokosaya.com"
            />
            <Input
              label="NPWP"
              value={formData.tax_id || ""}
              onChange={(e) => handleChange("tax_id", e.target.value)}
              placeholder="XX.XXX.XXX.X-XXX.XXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Deskripsi</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Deskripsi singkat tentang toko Anda"
              rows={3}
              className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 resize-none"
            />
          </div>

          <div className="border-t border-divider pt-5">
            <p className="text-sm font-semibold text-text-primary mb-4">Alamat</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Alamat Lengkap"
                  value={formData.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Jl. Contoh No. 123"
                />
              </div>
              <Input
                label="Kota"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Masukkan kota"
              />
              <Input
                label="Provinsi"
                value={formData.province || ""}
                onChange={(e) => handleChange("province", e.target.value)}
                placeholder="Masukkan provinsi"
              />
              <Input
                label="Kode Pos"
                value={formData.postal_code || ""}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
        <Icon className="h-4 w-4 text-text-secondary" />
      </div>
      <div>
        <p className="text-xs text-text-secondary font-medium">{label}</p>
        <p className="text-sm text-text-primary font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}
