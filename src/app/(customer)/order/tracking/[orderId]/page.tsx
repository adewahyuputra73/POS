import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  RefreshCw,
  MapPin,
  Clock,
  Phone,
  AlertCircle,
} from "lucide-react";
import { biteshipService } from "@/features/delivery";
import { DeliveryTrackingMap } from "@/features/delivery";
import { DriverInfoCard } from "@/features/delivery";
import { DeliveryStatusTimeline } from "@/features/delivery";
import { DELIVERY_STATUS_MAP } from "@/features/delivery";
import { pubOrderService } from "@/features/customer-order/services/pub-services";
import { formatCurrency } from "@/lib/utils/format";
import type { BiteshipTrackingResponse, BiteshipOrderStatus } from "@/features/delivery";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

// ── Helper ─────────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: "#0E6B30" }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: "#16A34A" }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#9CA3B5" }}>
          {label}
        </p>
        <p className="text-sm font-bold mt-0.5" style={{ color: "#F8FAFC" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TrackingPage() {
  const params = useParams();
  const navigate = useNavigate();
  const orderId = params.orderId as string;

  const [orderData, setOrderData] = useState<any>(null);
  const [trackingData, setTrackingData] = useState<BiteshipTrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      else setRefreshing(true);
      setError(null);

      // 1. Load our order
      const order = await pubOrderService.detail(orderId);
      setOrderData(order);

      // 2. Cek localStorage untuk Biteship order yang dibuat saat checkout
      let localBiteshipData: any = null;
      try {
        const stored = localStorage.getItem(`biteship_order_${orderId}`);
        if (stored) localBiteshipData = JSON.parse(stored);
      } catch {
        // localStorage tidak tersedia
      }

      // 3. Tracking hanya bisa pakai waybill kurir (nomor resi) — BUKAN Biteship order ID (WYB-...)
      // Waybill baru tersedia setelah driver accept. Sebelum itu, tampilkan "menunggu driver".
      const waybillId: string | null =
        localBiteshipData?.waybillId ??
        order?.delivery?.waybill_id ??
        order?.biteship_waybill_id ??
        order?.courier?.waybill_id ??
        null;

      if (waybillId) {
        const tracking = await biteshipService.trackOrder(waybillId);
        if (tracking) setTrackingData(tracking);
        // Jika tracking null: driver belum bergerak, auto-refresh akan coba lagi
      }
      // Jika tidak ada waybillId sama sekali: driver belum assign → auto-refresh handle

      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err?.message ?? "Gagal memuat informasi pengiriman");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30s:
    // - Kalau trackingData null: terus coba sampai Biteship siap (kurir belum assign)
    // - Kalau trackingData ada: refresh selama status masih aktif
    const interval = setInterval(() => {
      const activeStatus = trackingData?.status &&
        !["delivered", "cancelled", "rejected"].includes(trackingData.status);
      if (!trackingData || activeStatus) {
        loadData(false);
      }
    }, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const status: BiteshipOrderStatus | null = trackingData?.status ?? null;
  const statusInfo = status ? DELIVERY_STATUS_MAP[status] : null;

  // Driver info dari courier object (driver_name/driver_phone langsung, bukan nested)
  const driverName = trackingData?.courier?.driver_name ?? null;
  const driverPhone = trackingData?.courier?.driver_phone ?? null;
  const hasDriver = !!(driverName || driverPhone);
  const destination = trackingData?.destination ?? null;
  const history = trackingData?.history ?? [];

  // Tracking response tidak punya koordinat destination — pakai dari localStorage
  const eta: string | null = orderData?.delivery?.estimated_time_of_delivery ?? null;

  // Baca info lokal dari localStorage (disimpan saat checkout)
  const [localDeliveryInfo, setLocalDeliveryInfo] = useState<{
    destinationAddress?: string;
    destinationArea?: string;
    courierCompany?: string;
    destinationLat?: number | null;
    destinationLng?: number | null;
  } | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`biteship_order_${orderId}`);
      if (stored) setLocalDeliveryInfo(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, [orderId]);

  const displayAddress = destination?.address || localDeliveryInfo?.destinationAddress || null;

  // Koordinat tujuan — dari Biteship atau dari localStorage (disimpan saat checkout)
  // Koordinat tujuan hanya tersedia dari localStorage (disimpan saat checkout)
  const resolvedDestLat = localDeliveryInfo?.destinationLat ?? undefined;
  const resolvedDestLng = localDeliveryInfo?.destinationLng ?? undefined;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0E1F" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse"
            style={{ backgroundColor: "#0E6B30" }}
          >
            <Package className="h-7 w-7" style={{ color: "#16A34A" }} />
          </div>
          <p className="text-sm font-black" style={{ color: "#9CA3B5" }}>
            Memuat informasi pengiriman...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error && !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0A0E1F" }}>
        <div className="text-center max-w-xs">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <AlertCircle className="h-8 w-8" style={{ color: "#DC2626" }} />
          </div>
          <p className="text-base font-black mb-2" style={{ color: "#F8FAFC" }}>Gagal Memuat</p>
          <p className="text-sm font-medium mb-5" style={{ color: "#9CA3B5" }}>{error}</p>
          <button
            onClick={() => loadData()}
            className="h-11 px-6 rounded-2xl font-black text-sm"
            style={{ backgroundColor: "#22D55C", color: "#F8FAFC" }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: "#0A0E1F" }}>
      <div className="container mx-auto px-4 py-6 max-w-lg">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 transition-all active:scale-90"
            style={{ backgroundColor: "#13182B", borderColor: "rgba(34,213,92,0.22)", color: "#9CA3B5" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl font-black tracking-tight font-[family-name:var(--font-fraunces)]"
              style={{ color: "#F8FAFC" }}
            >
              Lacak Pesanan
            </h1>
            {orderData?.order_number && (
              <p className="text-xs font-bold mt-0.5" style={{ color: "#9CA3B5" }}>
                #{orderData.order_number}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => loadData(false)}
            disabled={refreshing}
            className="h-11 w-11 rounded-xl flex items-center justify-center border transition-all active:scale-90 disabled:opacity-50"
            style={{ backgroundColor: "#13182B", borderColor: "rgba(34,213,92,0.22)", color: "#16A34A" }}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Kurir belum ditemukan — sembunyikan map dan semua info tracking */}
        {!trackingData && orderData && (
          <div
            className="rounded-[22px] p-8 text-center"
            style={{
              backgroundColor: "#13182B",
              border: "1.5px solid rgba(124,74,30,0.1)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#0E6B30" }}
            >
              <Package className="h-8 w-8" style={{ color: "#16A34A" }} />
            </div>
            <p className="text-base font-black mb-2" style={{ color: "#F8FAFC" }}>
              Kurir Belum Ditemukan
            </p>
            <p className="text-sm font-medium mb-4" style={{ color: "#9CA3B5" }}>
              Pesanan kamu sedang diproses. Kami sedang mencari kurir terdekat —
              halaman ini akan memperbarui otomatis setiap 30 detik.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black"
              style={{ backgroundColor: "#0E6B30", color: "#16A34A" }}
            >
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Mencari kurir...
            </div>
          </div>
        )}

        {/* Semua section di bawah hanya tampil setelah kurir ditemukan */}
        {trackingData && (
          <>
            {/* Status Banner */}
            {statusInfo && (
              <div
                className="flex items-center gap-3 px-5 py-4 rounded-2xl mb-5"
                style={{ backgroundColor: statusInfo.bg }}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: statusInfo.color }}
                />
                <div>
                  <p className="text-sm font-black" style={{ color: statusInfo.color }}>
                    {statusInfo.label}
                  </p>
                  {lastUpdated && (
                    <p className="text-[11px] font-medium mt-0.5" style={{ color: statusInfo.color, opacity: 0.7 }}>
                      Diperbarui {format(lastUpdated, "HH:mm", { locale: id })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="mb-5">
              <DeliveryTrackingMap
                destinationLat={resolvedDestLat}
                destinationLng={resolvedDestLng}
                destinationAddress={displayAddress ?? undefined}
              />
            </div>

            {/* Info rows */}
            <div
              className="rounded-[22px] p-5 mb-5 space-y-4"
              style={{
                backgroundColor: "#13182B",
                border: "1.5px solid rgba(124,74,30,0.1)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {displayAddress && (
                <InfoRow icon={MapPin} label="Alamat Tujuan" value={displayAddress} />
              )}
              {eta && (
                <InfoRow
                  icon={Clock}
                  label="Estimasi Tiba"
                  value={(() => {
                    try {
                      return format(parseISO(eta), "EEEE, d MMM · HH:mm", { locale: id });
                    } catch {
                      return eta;
                    }
                  })()}
                />
              )}
              {trackingData.courier?.company && (
                <InfoRow icon={Package} label="Kurir" value={trackingData.courier.company} />
              )}
              {trackingData.courier?.phone && (
                <InfoRow icon={Phone} label="Nomor Kurir" value={trackingData.courier.phone} />
              )}
              {trackingData.waybill_id && (
                <InfoRow icon={Package} label="Nomor Resi" value={trackingData.waybill_id} />
              )}
              {trackingData.price != null && trackingData.price > 0 && (
                <InfoRow icon={Package} label="Ongkos Kirim" value={formatCurrency(trackingData.price)} />
              )}
              {trackingData.courier?.link && (
                <div className="pt-1">
                  <Link
                    to={trackingData.courier.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-black px-4 py-2 rounded-xl transition-all active:scale-95"
                    style={{ backgroundColor: "#0E6B30", color: "#16A34A" }}
                  >
                    <Package className="h-3.5 w-3.5" />
                    Lacak di Situs Kurir
                  </Link>
                </div>
              )}
            </div>

            {/* Driver / Courier Info */}
            {hasDriver && (
              <div className="mb-5">
                <DriverInfoCard
                  driver={{
                    name: driverName ?? trackingData.courier?.name ?? "",
                    phone: driverPhone ?? trackingData.courier?.phone ?? "",
                  }}
                  courierCompany={trackingData.courier?.company}
                />
              </div>
            )}

            {/* Status Timeline */}
            {status && (
              <DeliveryStatusTimeline currentStatus={status} history={history} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
