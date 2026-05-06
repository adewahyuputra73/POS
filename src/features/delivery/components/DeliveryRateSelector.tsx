import { useState, useEffect } from "react";
import { Truck, Loader2, AlertCircle, PackageX, ChevronRight, Store } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { biteshipService } from "../services/biteship-service";
import type { BiteshipCourier, BiteshipArea } from "../types";

interface Props {
  originAreaId: string | null;
  destinationArea: BiteshipArea | null;
  items: { name: string; value: number; weight: number; quantity: number }[];
  selected: BiteshipCourier | null;
  onChange: (rate: BiteshipCourier | null) => void;
  originLat?: number | null;
  originLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
}

/**
 * Transformasi raw Biteship pricing → 2 pilihan tampilan:
 * 1. Kurir Online  = kurir dengan harga tertinggi dari semua opsi online (Grab/GoJek)
 *                    → pakai courier_code/service_code asli untuk buat Biteship order
 * 2. Kurir Internal = harga tertinggi - Rp 1.000, tidak buat Biteship order
 */
function buildDisplayRates(rawRates: BiteshipCourier[]): BiteshipCourier[] {
  if (rawRates.length === 0) return [];

  // Kurir dengan harga tertinggi → jadi "Kurir Online"
  const maxRate = rawRates.reduce((best, r) => (r.price > best.price ? r : best));

  const onlineRate: BiteshipCourier = {
    ...maxRate,
    courier_name: "Kurir Online",
    courier_service_name: "GoSend / GrabExpress",
    description: "Diantar oleh mitra kurir online terpilih",
    is_internal: false,
  };

  const internalRate: BiteshipCourier = {
    ...maxRate,
    courier_code: "internal",
    courier_service_code: "internal",
    courier_name: "Kurir Internal",
    courier_service_name: "Antar Langsung",
    description: "Diantar langsung oleh tim toko",
    price: Math.max(0, maxRate.price - 1000),
    shipping_fee: Math.max(0, maxRate.shipping_fee - 1000),
    is_internal: true,
  };

  return [onlineRate, internalRate];
}

export function DeliveryRateSelector({
  destinationArea,
  items,
  selected,
  onChange,
  originLat,
  originLng,
  destinationLat,
  destinationLng,
}: Props) {
  const [rates, setRates] = useState<BiteshipCourier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Koersi string→number (BE kadang kirim koordinat sebagai string)
  const oLat = originLat != null ? Number(originLat) : null;
  const oLng = originLng != null ? Number(originLng) : null;
  const dLat = destinationLat != null ? Number(destinationLat) : null;
  const dLng = destinationLng != null ? Number(destinationLng) : null;

  // Bounding box Indonesia — lat [-11, 6], lng [95, 141]
  const inID = (lat: number | null, lng: number | null) =>
    lat != null &&
    lng != null &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -11 &&
    lat <= 6 &&
    lng >= 95 &&
    lng <= 141;

  const hasValidOrigin = inID(oLat, oLng);
  const hasValidDestination = inID(dLat, dLng);

  useEffect(() => {
    if (!destinationArea) {
      setRates([]);
      setError(null);
      onChange(null);
      return;
    }

    if (!hasValidDestination) {
      setRates([]);
      setError(null);
      onChange(null);
      return;
    }

    if (!hasValidOrigin) {
      setRates([]);
      setError(null);
      onChange(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    onChange(null);

    biteshipService
      .getRates({
        origin_latitude: oLat as number,
        origin_longitude: oLng as number,
        destination_latitude: dLat as number,
        destination_longitude: dLng as number,
        items,
      })
      .then((rawCouriers) => {
        if (cancelled) return;
        setRates(buildDisplayRates(rawCouriers));
        setLoading(false);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.message === "getRates_failed" ? "area_unavailable" : "load_failed");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    `${destinationArea?.id ?? ""}|${originLat ?? ""}|${originLng ?? ""}|${destinationLat ?? ""}|${destinationLng ?? ""}`,
  ]);

  // Guard: area dipilih tapi belum pin peta
  if (destinationArea && !hasValidDestination) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed"
        style={{ borderColor: "rgba(124,74,30,0.18)", color: "#9C7D58" }}
      >
        <Truck className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">
          Tentukan titik lokasi pengiriman di peta untuk menghitung tarif
        </span>
      </div>
    );
  }

  // Guard: koordinat toko tidak valid
  if (destinationArea && !hasValidOrigin) {
    return (
      <div
        className="flex items-start gap-2 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: "#FEF3C7", color: "#92400E", border: "1.5px solid #FDE68A" }}
      >
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <div className="text-sm font-medium">
          <p>Koordinat toko belum diatur.</p>
          <p className="text-xs mt-1">
            Buka dashboard → Pengaturan → Informasi Toko → Edit → tandai lokasi di peta.
          </p>
        </div>
      </div>
    );
  }

  if (!destinationArea) {
    return (
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed"
        style={{ borderColor: "rgba(124,74,30,0.18)", color: "#9C7D58" }}
      >
        <Truck className="h-4 w-4 shrink-0" />
        <span className="text-sm font-medium">Pilih alamat tujuan untuk melihat tarif</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-4 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#D97706" }} />
        <span className="text-sm font-bold" style={{ color: "#9C7D58" }}>
          Menghitung tarif pengiriman...
        </span>
      </div>
    );
  }

  if (error) {
    const isUnavailable = error === "area_unavailable";
    return (
      <div
        className="rounded-2xl p-4 space-y-2"
        style={{
          backgroundColor: isUnavailable ? "#FEF3C7" : "#FEE2E2",
          border: `1.5px solid ${isUnavailable ? "#FDE68A" : "#FECACA"}`,
        }}
      >
        <div className="flex items-start gap-2">
          <AlertCircle
            className="h-4 w-4 shrink-0 mt-0.5"
            style={{ color: isUnavailable ? "#D97706" : "#DC2626" }}
          />
          <div className="space-y-1">
            <p
              className="text-sm font-black"
              style={{ color: isUnavailable ? "#92400E" : "#DC2626" }}
            >
              {isUnavailable
                ? "Pengiriman ke area ini belum tersedia"
                : "Gagal memuat tarif pengiriman"}
            </p>
            <p
              className="text-xs font-medium leading-relaxed"
              style={{ color: isUnavailable ? "#A16207" : "#B91C1C" }}
            >
              {isUnavailable
                ? "Layanan kurir online belum menjangkau area tujuan yang dipilih. Pilih metode pengambilan sendiri atau hubungi toko untuk alternatif pengiriman."
                : "Terjadi kendala saat menghubungi layanan kurir. Coba pilih ulang area tujuan atau muat ulang halaman."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div
        className="flex items-start gap-2 px-4 py-3 rounded-2xl"
        style={{ backgroundColor: "#FEF3C7", border: "1.5px solid #FDE68A" }}
      >
        <PackageX className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#D97706" }} />
        <div>
          <p className="text-sm font-black" style={{ color: "#92400E" }}>
            Tidak ada kurir tersedia
          </p>
          <p className="text-xs font-medium mt-0.5" style={{ color: "#A16207" }}>
            Tidak ada layanan pengiriman yang melayani rute ini saat ini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: "#9C7D58" }}>
        Pilih Layanan Pengiriman
      </p>
      {rates.map((rate) => {
        const key = `${rate.courier_code}-${rate.courier_service_code}`;
        const isSelected =
          selected?.courier_code === rate.courier_code &&
          selected?.courier_service_code === rate.courier_service_code;
        const isInternal = rate.is_internal === true;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(isSelected ? null : rate)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-[0.98] text-left"
            style={{
              backgroundColor: isSelected ? "#FEF3C7" : "#FFF8EE",
              borderColor: isSelected ? "#F59E0B" : "rgba(124,74,30,0.12)",
            }}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: isSelected ? "#F59E0B" : "rgba(124,74,30,0.08)",
                color: isSelected ? "#1C0A00" : "#6B4C2A",
              }}
            >
              {isInternal ? (
                <Store className="h-5 w-5" />
              ) : (
                <Truck className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-black" style={{ color: "#1C0A00" }}>
                {rate.courier_name}
              </p>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: "#9C7D58" }}>
                {rate.description || rate.duration}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              <span
                className="text-sm font-black tabular-nums"
                style={{ color: isSelected ? "#92400E" : "#1C0A00" }}
              >
                {formatCurrency(rate.price)}
              </span>
              <ChevronRight
                className="h-4 w-4"
                style={{ color: isSelected ? "#D97706" : "#9C7D58" }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
