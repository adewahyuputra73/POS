import { lazy, Suspense } from "react";
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
  Navigation,
  Loader2,
} from "lucide-react";
import type { StoreInfo, UpdateStoreRequest, StoreProductType } from "../types";
import type { PickedLocation } from "@/features/delivery/components/LocationPicker";

const LocationPickerInner = lazy(
  () => import("@/features/delivery/components/LocationPickerInner")
);

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
  const [notificationPhone, setNotificationPhone] = useState(store.notification_phone ?? "");
  const [productType, setProductType] = useState<StoreProductType>(store.product_type ?? "UNIT");
  const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(null);

  const hasStoredCoords = store.latitude != null && store.longitude != null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const cleanPhone = notificationPhone.trim().replace(/\D/g, "").replace(/^0/, "62") || null;
      await onSave({
        name,
        address,
        latitude: pickedLocation?.lat ?? store.latitude,
        longitude: pickedLocation?.lng ?? store.longitude,
        notification_phone: cleanPhone,
        product_type: productType,
      });
      // Simpan ke localStorage sebagai fallback untuk customer-facing side
      if (cleanPhone) localStorage.setItem("wa_notification_phone", cleanPhone);
      else localStorage.removeItem("wa_notification_phone");
      showToast("Informasi toko berhasil diperbarui", "success");
      setIsEditing(false);
      setPickedLocation(null);
    } catch {
      showToast("Gagal memperbarui informasi toko", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setName(store.name);
    setAddress(store.address);
    setNotificationPhone(store.notification_phone ?? "");
    setProductType(store.product_type ?? "UNIT");
    setPickedLocation(null);
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
            {hasStoredCoords && (
              <DetailItem
                icon={Navigation}
                label="Koordinat"
                value={`${Number(store.latitude).toFixed(6)}, ${Number(store.longitude).toFixed(6)}`}
              />
            )}
            {store.owner && (
              <>
                <DetailItem icon={User} label="Pemilik" value={store.owner.full_name} />
                <DetailItem icon={Phone} label="Telepon Pemilik" value={store.owner.phone_number} />
              </>
            )}
            <DetailItem
              icon={Phone}
              label="Nomor WhatsApp Toko"
              value={store.notification_phone ?? "Belum diatur — klik Edit untuk mengisi"}
            />
            <DetailItem icon={Hash} label="Slug" value={store.slug} />
          </div>

          {!hasStoredCoords && (
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-warning-light border border-warning/20">
              <Navigation className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                Koordinat toko belum diatur. Klik <strong>Edit</strong> lalu tandai lokasi di peta agar tarif pengiriman dapat dihitung otomatis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Edit Informasi Toko</CardTitle>
          <CardDescription>Perbarui nama, alamat, dan lokasi toko Anda</CardDescription>
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

          <div className="space-y-1.5">
            <Input
              label="Nomor WhatsApp Toko"
              value={notificationPhone}
              onChange={(e) => setNotificationPhone(e.target.value)}
              placeholder="cth: 08123456789 atau 628123456789"
              type="tel"
            />
            <p className="text-xs text-text-secondary">
              Nomor WA asli yang bisa dihubungi customer — berbeda dari nomor akun. Dipakai untuk tombol "Hubungi Toko" dan notifikasi pesanan via WhatsApp.
            </p>
          </div>

          {/* Tipe Penjualan */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Tipe Penjualan Produk
            </label>
            <p className="text-xs text-text-secondary -mt-1">
              Pilih sekali sesuai jenis toko. Semua produk mengikuti tipe ini saat checkout.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "UNIT", label: "Per Satuan", hint: "Dijual per pcs / item" },
                { value: "WEIGHT", label: "Per Timbangan", hint: "Ditimbang (kg) saat checkout" },
              ] as const).map((opt) => {
                const active = productType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setProductType(opt.value)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      active ? "border-primary bg-primary-light" : "border-divider hover:border-primary/40"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${active ? "text-primary" : "text-text-primary"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{opt.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-text-primary">
                Lokasi di Peta
              </label>
              {pickedLocation && (
                <button
                  type="button"
                  onClick={() => setPickedLocation(null)}
                  className="text-xs font-semibold text-error hover:text-error/80 flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  Hapus pilihan
                </button>
              )}
            </div>

            <p className="text-xs text-text-secondary -mt-2">
              Klik peta atau seret pin untuk menentukan koordinat toko. Digunakan untuk menghitung tarif pengiriman.
            </p>

            <Suspense fallback={
              <div
                className="w-full flex flex-col items-center justify-center gap-3"
                style={{
                  height: 280,
                  backgroundColor: "#F9FAFB",
                  borderRadius: 12,
                  border: "2px dashed #E5E7EB",
                }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm font-medium text-text-secondary">Memuat peta...</p>
              </div>
            }>
              <LocationPickerInner
                initialLat={store.latitude ?? undefined}
                initialLng={store.longitude ?? undefined}
                onPick={setPickedLocation}
              />
            </Suspense>

            {/* Result display */}
            {pickedLocation ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-light border border-primary/20">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-primary">Lokasi baru dipilih</p>
                  {pickedLocation.address && (
                    <p className="text-xs text-text-secondary mt-0.5 leading-relaxed line-clamp-2">
                      {pickedLocation.address}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary tabular-nums mt-0.5">
                    {pickedLocation.lat.toFixed(6)}, {pickedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            ) : hasStoredCoords ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success-light border border-success/20">
                <Navigation className="h-4 w-4 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-success">Koordinat tersimpan</p>
                  <p className="text-xs text-text-secondary tabular-nums mt-0.5">
                    {Number(store.latitude).toFixed(6)}, {Number(store.longitude).toFixed(6)}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Klik peta untuk mengubah koordinat
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-light border border-warning/20">
                <Navigation className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary">
                  Belum ada koordinat. Klik peta di atas untuk menentukan lokasi toko.
                </p>
              </div>
            )}
          </div>

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
