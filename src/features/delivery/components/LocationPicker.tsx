import { lazy, Suspense } from "react";
import { MapPin, Loader2 } from "lucide-react";
import type { PickedLocation } from "./LocationPickerInner";

export type { PickedLocation };

const LocationPickerInner = lazy(() => import("./LocationPickerInner"));

interface Props {
  initialLat?: number;
  initialLng?: number;
  pickedLocation: PickedLocation | null;
  onPick: (loc: PickedLocation) => void;
  onClear: () => void;
}

export function LocationPicker({ initialLat, initialLng, pickedLocation, onPick, onClear }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-black uppercase tracking-widest" style={{ color: "#9C7D58" }}>
          Titik Lokasi Pengiriman
        </label>
        {pickedLocation && (
          <button
            type="button"
            onClick={onClear}
            className="text-[11px] font-black px-2 py-1 rounded-lg transition-all active:scale-95"
            style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}
          >
            Hapus Titik
          </button>
        )}
      </div>

      {/* Map */}
      <Suspense fallback={
        <div
          className="w-full flex flex-col items-center justify-center gap-3"
          style={{ height: 280, backgroundColor: "#F9FAFB", borderRadius: 16, border: "2px dashed #E5E7EB" }}
        >
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#D97706" }} />
          <p className="text-sm font-bold" style={{ color: "#9C7D58" }}>Memuat peta...</p>
        </div>
      }>
        <LocationPickerInner
          initialLat={initialLat}
          initialLng={initialLng}
          onPick={onPick}
        />
      </Suspense>

      {/* Picked location result */}
      {pickedLocation ? (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-2xl border-2"
          style={{ backgroundColor: "#ECFDF5", borderColor: "#6EE7B7" }}
        >
          <div
            className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ backgroundColor: "#D1FAE5" }}
          >
            <MapPin className="h-3.5 w-3.5" style={{ color: "#059669" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest mb-0.5" style={{ color: "#059669" }}>
              Titik dipilih
            </p>
            {pickedLocation.address ? (
              <p className="text-xs font-medium leading-relaxed" style={{ color: "#065F46" }}>
                {pickedLocation.address}
              </p>
            ) : (
              <p className="text-xs font-medium" style={{ color: "#065F46" }}>
                {pickedLocation.lat.toFixed(6)}, {pickedLocation.lng.toFixed(6)}
              </p>
            )}
            <p className="text-[10px] font-bold mt-1 tabular-nums" style={{ color: "#6EE7B7" }}>
              {pickedLocation.lat.toFixed(6)}, {pickedLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed"
          style={{ borderColor: "rgba(124,74,30,0.2)", color: "#9C7D58" }}
        >
          <MapPin className="h-4 w-4 shrink-0" style={{ color: "#D97706" }} />
          <p className="text-xs font-bold">
            Ketuk peta di atas untuk menentukan titik lokasi pengiriman. Anda juga bisa geser pin setelah ditempatkan.
          </p>
        </div>
      )}
    </div>
  );
}
