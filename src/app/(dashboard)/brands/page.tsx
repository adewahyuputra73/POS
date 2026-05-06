import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { LocationPicker, type PickedLocation } from "@/components/ui/location-picker";
import {
  Plus, Store, MapPin, User, Loader2, X, ChevronDown, Map, Trash2,
} from "lucide-react";
import { storeSettingsService } from "@/features/store-settings/services/store-settings-service";
import { staffService } from "@/features/staff/services/staff-service";
import type { StoreInfo, CreateStoreRequest } from "@/features/store-settings/types";
import type { StaffMember } from "@/features/staff/types";

// ── Create Brand Modal ────────────────────────────────────────────────────────

interface CreateBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function CreateBrandModal({ isOpen, onClose, onSuccess }: CreateBrandModalProps) {
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [form, setForm] = useState<CreateStoreRequest>({
    ownerId: "",
    name: "",
    address: "",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (!isOpen) return;
    setLoadingStaff(true);
    staffService
      .listAll()
      .then((res) => setStaffList(res.data.filter((s) => s.is_active)))
      .catch(() => showToast("Gagal memuat daftar staff", "error"))
      .finally(() => setLoadingStaff(false));
  }, [isOpen, showToast]);

  const handleClose = () => {
    setForm({ ownerId: "", name: "", address: "", latitude: null, longitude: null });
    setShowMapPicker(false);
    onClose();
  };

  const handleLocationPicked = (loc: PickedLocation) => {
    setForm((f) => ({
      ...f,
      latitude: loc.lat,
      longitude: loc.lng,
      // Auto-fill address jika masih kosong
      address: f.address.trim() ? f.address : (loc.address ?? f.address),
    }));
    setShowMapPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ownerId || !form.name.trim() || !form.address.trim()) return;
    setIsSubmitting(true);
    try {
      await storeSettingsService.create(form);
      showToast("Brand baru berhasil dibuat", "success");
      handleClose();
      onSuccess();
    } catch {
      showToast("Gagal membuat brand baru", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
    {showMapPicker && (
      <LocationPicker
        initialLat={form.latitude}
        initialLng={form.longitude}
        onConfirm={handleLocationPicked}
        onClose={() => setShowMapPicker(false)}
      />
    )}
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "rgba(28,10,0,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#FEF3C7" }}
            >
              <Store className="h-5 w-5" style={{ color: "#D97706" }} />
            </div>
            <h2 className="text-base font-black" style={{ color: "#1C0A00" }}>
              Buat Brand Baru
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="h-8 w-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Owner */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#9C7D58" }}>
              Pemilik Brand <span style={{ color: "#DC2626" }}>*</span>
            </label>
            {loadingStaff ? (
              <div className="flex items-center gap-2 h-11 px-4 rounded-xl border" style={{ borderColor: "rgba(124,74,30,0.18)", backgroundColor: "#FFF8EE" }}>
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#D97706" }} />
                <span className="text-sm text-gray-400">Memuat staff...</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={form.ownerId}
                  onChange={(e) => setForm((f) => ({ ...f, ownerId: e.target.value }))}
                  required
                  className="w-full h-11 pl-4 pr-10 rounded-xl border text-sm font-medium appearance-none outline-none transition-colors"
                  style={{
                    backgroundColor: "#FFF8EE",
                    borderColor: "rgba(124,74,30,0.18)",
                    color: form.ownerId ? "#1C0A00" : "#9CA3AF",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#F59E0B")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(124,74,30,0.18)")}
                >
                  <option value="" disabled>Pilih pemilik...</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} · {s.phone_number}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
              </div>
            )}
          </div>

          {/* Nama Brand */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#9C7D58" }}>
              Nama Brand <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              placeholder="Contoh: Kopi Nusantara"
              className="w-full h-11 px-4 rounded-xl border text-sm font-medium outline-none transition-colors"
              style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.18)", color: "#1C0A00" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(124,74,30,0.18)")}
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#9C7D58" }}>
              Alamat <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              required
              placeholder="Jl. Contoh No. 1, Kota..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-colors resize-none"
              style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.18)", color: "#1C0A00" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#F59E0B")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(124,74,30,0.18)")}
            />
          </div>

          {/* Koordinat — pilih dari peta */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: "#9C7D58" }}>
              Lokasi (Opsional)
            </label>

            {form.latitude != null && form.longitude != null ? (
              /* Sudah ada koordinat — tampilkan info + tombol ganti/hapus */
              <div
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.18)" }}
              >
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#FEF3C7" }}
                >
                  <MapPin className="h-4 w-4" style={{ color: "#D97706" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black tabular-nums" style={{ color: "#D97706" }}>
                    {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#9C7D58" }}>
                    Lokasi sudah dipilih
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="h-8 px-3 rounded-lg text-xs font-bold border transition-colors hover:bg-amber-50"
                    style={{ borderColor: "rgba(124,74,30,0.18)", color: "#1C0A00" }}
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, latitude: null, longitude: null }))}
                    className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                    style={{ color: "#DC2626" }}
                    title="Hapus lokasi"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Belum ada — tampilkan tombol pick */
              <button
                type="button"
                onClick={() => setShowMapPicker(true)}
                className="w-full h-11 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-bold transition-colors hover:bg-amber-50"
                style={{ borderColor: "rgba(124,74,30,0.25)", color: "#9C7D58" }}
              >
                <Map className="h-4 w-4" />
                Pilih dari Peta
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-11 rounded-xl text-sm font-bold border transition-colors"
              style={{ borderColor: "rgba(28,10,0,0.15)", color: "#1C0A00" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.ownerId || !form.name.trim() || !form.address.trim()}
              className="flex-1 h-11 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: "#1C0A00", color: "#FFFFFF" }}
            >
              {isSubmitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Membuat...</>
              ) : (
                <><Plus className="h-4 w-4" /> Buat Brand</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

// ── Brand Card ─────────────────────────────────────────────────────────────────

function BrandCard({ store }: { store: StoreInfo }) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 transition-shadow hover:shadow-md"
      style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(28,10,0,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: "#FEF3C7" }}
        >
          <Store className="h-5 w-5" style={{ color: "#D97706" }} />
        </div>
        <span
          className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: store.status === "ACTIVE" ? "#DCFCE7" : "#F3F4F6",
            color: store.status === "ACTIVE" ? "#15803D" : "#6B7280",
          }}
        >
          {store.status === "ACTIVE" ? "Aktif" : store.status}
        </span>
      </div>

      <div>
        <h3 className="font-black text-base leading-tight" style={{ color: "#1C0A00" }}>
          {store.name}
        </h3>
        {store.slug && (
          <p className="text-xs font-medium mt-0.5" style={{ color: "#9C7D58" }}>
            /{store.slug}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        {store.address && (
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#D97706" }} />
            <span className="text-xs font-medium leading-relaxed" style={{ color: "#6B7280" }}>
              {store.address}
            </span>
          </div>
        )}
        {store.owner && (
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 shrink-0" style={{ color: "#D97706" }} />
            <span className="text-xs font-medium" style={{ color: "#6B7280" }}>
              {store.owner.full_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BrandsPage() {
  const { showToast } = useToast();
  const [currentStore, setCurrentStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadStore = useCallback(async () => {
    try {
      const data = await storeSettingsService.my();
      setCurrentStore(data);
    } catch {
      showToast("Gagal memuat data brand", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi Brand"
        description="Kelola beberapa brand dalam satu platform"
        actions={
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Buat Brand Baru
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D97706" }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentStore && <BrandCard store={currentStore} />}
        </div>
      )}

      <CreateBrandModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadStore}
      />
    </div>
  );
}
