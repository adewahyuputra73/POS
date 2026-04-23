"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Clock, MapPin, Loader2, Crosshair } from "lucide-react";
import type { Outlet, CreateOutletRequest, OutletOperatingHours } from "../types";
import type { PickedLocation } from "@/features/delivery/components/LocationPickerInner";

const LocationPickerInner = dynamic(
  () => import("@/features/delivery/components/LocationPickerInner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-divider bg-background h-[280px]">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <p className="text-xs font-medium text-text-secondary">Memuat peta...</p>
      </div>
    ),
  }
);

const DAYS: { key: keyof OutletOperatingHours; label: string }[] = [
  { key: "monday", label: "Senin" },
  { key: "tuesday", label: "Selasa" },
  { key: "wednesday", label: "Rabu" },
  { key: "thursday", label: "Kamis" },
  { key: "friday", label: "Jumat" },
  { key: "saturday", label: "Sabtu" },
  { key: "sunday", label: "Minggu" },
];

const DEFAULT_HOURS: OutletOperatingHours = {
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
};

interface OutletModalProps {
  outlet?: Outlet;
  onClose: () => void;
  onSave: (data: CreateOutletRequest) => Promise<void>;
}

export function OutletModal({ outlet, onClose, onSave }: OutletModalProps) {
  const [name, setName] = useState(outlet?.name ?? "");
  const [address, setAddress] = useState(outlet?.address ?? "");
  const [phone, setPhone] = useState(outlet?.phone_number ?? "");
  const [latitude, setLatitude] = useState(outlet?.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(outlet?.longitude?.toString() ?? "");
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const handlePick = (loc: PickedLocation) => {
    setLatitude(loc.lat.toString());
    setLongitude(loc.lng.toString());
    // Auto-isi alamat kalau alamat masih kosong & reverse geocode dapat hasil
    if (!address.trim() && loc.address) setAddress(loc.address);
  };

  const handleUseMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setLocateError("Geolocation tidak tersedia di browser ini");
      return;
    }
    setLocateError(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
        setIsLocating(false);
      },
      () => {
        setLocateError("Tidak bisa mengakses lokasi. Izinkan akses lokasi di browser.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const initialLat = outlet?.latitude ?? undefined;
  const initialLng = outlet?.longitude ?? undefined;
  const [hours, setHours] = useState<OutletOperatingHours>(
    outlet?.operating_hours ?? { ...DEFAULT_HOURS }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleHourChange = (day: keyof OutletOperatingHours, value: string) => {
    setHours((prev) => ({ ...prev, [day]: value }));
  };

  const buildPayload = (): CreateOutletRequest => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const hasHours = Object.values(hours).some((v) => v && v.trim() !== "");
    return {
      name,
      address,
      phone_number: phone || undefined,
      latitude: !isNaN(lat) ? lat : undefined,
      longitude: !isNaN(lng) ? lng : undefined,
      operating_hours: hasHours ? hours : undefined,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(buildPayload());
      showToast(outlet ? "Cabang berhasil diperbarui" : "Cabang berhasil ditambahkan", "success");
      onClose();
    } catch {
      showToast("Gagal menyimpan cabang", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="pt-6 pb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">
            {outlet ? "Edit Cabang" : "Tambah Cabang"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Cabang"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Cabang Utama"
              required
            />
            <Input
              label="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap cabang"
              required
            />
            <Input
              label="Nomor Telepon (opsional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 xxx-xxxx-xxxx"
            />

            {/* Koordinat */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-text-secondary" />
                    <p className="text-sm font-medium text-text-primary">Titik Lokasi Cabang</p>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Klik peta atau geser pin untuk menentukan titik. Dipakai sebagai origin pengiriman Biteship.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleUseMyLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Crosshair className="h-3.5 w-3.5" />
                  )}
                  Lokasi saya
                </Button>
              </div>

              <LocationPickerInner
                initialLat={initialLat}
                initialLng={initialLng}
                onPick={handlePick}
              />

              {locateError && (
                <p className="text-xs text-error font-medium">{locateError}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Latitude"
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="-6.8958"
                />
                <Input
                  label="Longitude"
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="107.6104"
                />
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-secondary" />
                <p className="text-sm font-medium text-text-primary">Jam Operasional (opsional)</p>
              </div>
              <p className="text-xs text-text-secondary -mt-1">Format: HH:MM-HH:MM, contoh: 09:00-21:00. Kosongkan jika tutup.</p>
              <div className="space-y-2">
                {DAYS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm text-text-secondary w-14 shrink-0">{label}</span>
                    <Input
                      value={hours[key] ?? ""}
                      onChange={(e) => handleHourChange(key, e.target.value)}
                      placeholder="09:00-21:00"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {outlet ? "Simpan Perubahan" : "Tambah Cabang"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
