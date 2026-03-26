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
import { useToast } from "@/components/ui";
import {
  Store,
  Save,
  MapPin,
  Phone,
  User,
  Edit3,
  X,
  Hash,
} from "lucide-react";
import type { StoreInfo, UpdateStoreRequest } from "../types";

interface StoreInfoFormProps {
  store: StoreInfo;
  onSave: (data: UpdateStoreRequest) => Promise<void>;
}

export function StoreInfoForm({ store, onSave }: StoreInfoFormProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(store.name);
  const [address, setAddress] = useState(store.address);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ name, address });
      showToast("Informasi toko berhasil diperbarui", "success");
      setIsEditing(false);
    } catch {
      showToast("Gagal memperbarui informasi toko", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(store.name);
    setAddress(store.address);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card>
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-primary via-blue-500 to-secondary rounded-t-xl flex items-center justify-center">
            <Store className="h-14 w-14 text-white/30" />
          </div>
          <div className="absolute -bottom-10 left-6">
            <div className="h-20 w-20 rounded-2xl bg-surface shadow-lg border-4 border-surface flex items-center justify-center overflow-hidden">
              <Store className="h-8 w-8 text-primary" />
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
                  {store.slug}
                </Badge>
                <Badge
                  className={
                    store.status === "active"
                      ? "bg-success-light text-success text-xs font-semibold"
                      : "bg-background text-text-secondary text-xs font-semibold"
                  }
                >
                  {store.status === "active" ? "Aktif" : store.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <DetailItem icon={MapPin} label="Alamat" value={store.address} />
            {store.owner && (
              <>
                <DetailItem icon={User} label="Pemilik" value={store.owner.full_name} />
                <DetailItem icon={Phone} label="Telepon Pemilik" value={store.owner.phone_number} />
              </>
            )}
            <DetailItem icon={Hash} label="Slug" value={store.slug} />
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
          <CardDescription>Perbarui nama dan alamat toko Anda</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nama Toko"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama toko"
            required
          />
          <Input
            label="Alamat"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Masukkan alamat toko"
            required
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
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
