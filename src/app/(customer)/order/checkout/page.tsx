import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    ArrowLeft, MapPin, ShoppingBag, Truck, User,
    ClipboardList, ReceiptText, Send, Calendar, Clock,
    Check,
} from "lucide-react";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/components/ui";
import { pubOrderService, pubStoreService, pubPreorderService, pubOutletService } from "@/features/customer-order/services/pub-services";
import { TableLayoutPicker } from "@/features/customer-order/components/TableLayoutPicker";
import { DeliveryAddressSearch } from "@/features/delivery/components/DeliveryAddressSearch";
import { DeliveryRateSelector } from "@/features/delivery/components/DeliveryRateSelector";
import { LocationPicker } from "@/features/delivery/components/LocationPicker";
import { biteshipService } from "@/features/delivery/services/biteship-service";
import type { PickedLocation } from "@/features/delivery/components/LocationPicker";
import type { StoreInfo } from "@/features/store-settings/types";
import type { Outlet } from "@/features/outlets/types";
import type { BiteshipArea, BiteshipCourier } from "@/features/delivery/types";

// ── Types ─────────────────────────────────────────────────────────────────────
type FulfillmentType = "dine_in" | "pickup" | "delivery";

// ── Constants ─────────────────────────────────────────────────────────────────
const FULFILLMENT_OPTIONS: {
    type: FulfillmentType;
    label: string;
    icon: React.ElementType;
    orderType: "DINE_IN" | "TAKEAWAY";
}[] = [
    { type: "dine_in", label: "Makan di Tempat", icon: MapPin, orderType: "DINE_IN" },
    { type: "pickup", label: "Ambil Sendiri", icon: ShoppingBag, orderType: "TAKEAWAY" },
    { type: "delivery", label: "Diantar", icon: Truck, orderType: "TAKEAWAY" },
];

// Time slots 08:00 – 22:00 every 30 min
const TIME_SLOTS: string[] = (() => {
    const slots: string[] = [];
    for (let h = 8; h <= 22; h++) {
        for (const m of [0, 30]) {
            if (h === 22 && m > 0) break;
            slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
        }
    }
    return slots;
})();

function todayStr(): string {
    return new Date().toISOString().slice(0, 10);
}

function isPastSlot(date: string, slot: string): boolean {
    if (date !== todayStr()) return false;
    const now = new Date();
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes();
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputStyle = {
    backgroundColor: "#FFF8EE",
    borderColor: "rgba(124,74,30,0.18)",
    color: "#1C0A00",
};
function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "#F59E0B";
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.style.borderColor = "rgba(124,74,30,0.18)";
}

// ── Helper components ──────────────────────────────────────────────────────────
function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="rounded-[22px] p-5"
            style={{
                backgroundColor: "#FFFFFF",
                border: "1.5px solid rgba(124,74,30,0.1)",
                boxShadow: "0 2px 12px rgba(28,10,0,0.04)",
            }}
        >
            {children}
        </div>
    );
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
    return (
        <div className="flex items-center gap-2.5 mb-4">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#FEF3C7" }}>
                <Icon className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
            </div>
            <span className="text-[13px] font-black uppercase tracking-wider" style={{ color: "#1C0A00" }}>
                {label}
            </span>
        </div>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-[11px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#9C7D58" }}>
            {children}
        </label>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { items, getSubtotal, getTax, getServiceFee, getTotal, clearCart } = useCustomerCartStore();

    // Table comes directly from cart store (set by QR scan or manual picker)
    const selectedTable = useCustomerCartStore((state) => state.selectedTable);
    const setSelectedTable = useCustomerCartStore((state) => state.setSelectedTable);
    const qrToken = useCustomerCartStore((state) => state.qrToken);

    // Hindari hydration mismatch: Zustand persist store berbeda antara server & client
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [outlets, setOutlets] = useState<Outlet[]>([]);
    const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
    const [originAreaId, setOriginAreaId] = useState<string | null>(null);

    useEffect(() => {
        pubStoreService.my().then((info) => {
            setStoreInfo(info);
            if (info?.area_id) setOriginAreaId(info.area_id);
        });
        pubOutletService.list().then((list) => {
            setOutlets(list);
            // Auto-pilih outlet pertama (atau yang punya koordinat) sebagai default
            const withCoords = list.find(
                (o) => typeof o.latitude === "number" && typeof o.longitude === "number"
            );
            const defaultOutlet = withCoords ?? list[0] ?? null;
            if (defaultOutlet) setSelectedOutletId(defaultOutlet.id);
        });
    }, []);

    const selectedOutlet = useMemo(
        () => outlets.find((o) => o.id === selectedOutletId) ?? null,
        [outlets, selectedOutletId]
    );

    // Origin koordinat: prioritas outlet → store → null (component anak yang handle fallback)
    const originLat = useMemo<number | null>(() => {
        if (selectedOutlet && typeof selectedOutlet.latitude === "number") return selectedOutlet.latitude;
        if (storeInfo && typeof storeInfo.latitude === "number") return storeInfo.latitude;
        return null;
    }, [selectedOutlet, storeInfo]);

    const originLng = useMemo<number | null>(() => {
        if (selectedOutlet && typeof selectedOutlet.longitude === "number") return selectedOutlet.longitude;
        if (storeInfo && typeof storeInfo.longitude === "number") return storeInfo.longitude;
        return null;
    }, [selectedOutlet, storeInfo]);

    // Fallback geocode (Nominatim) hanya kalau outlet & store sama-sama tidak punya koordinat
    const [geocodedOrigin, setGeocodedOrigin] = useState<{ lat: number; lng: number } | null>(null);
    useEffect(() => {
        if (originLat != null || originLng != null) return;
        const address = selectedOutlet?.address || storeInfo?.address;
        if (!address) return;
        let cancelled = false;
        fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
            { headers: { "Accept-Language": "id" } }
        )
            .then((r) => r.json())
            .then((results: any[]) => {
                if (cancelled || results.length === 0) return;
                setGeocodedOrigin({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) });
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [originLat, originLng, selectedOutlet?.address, storeInfo?.address]);

    const effectiveOriginLat = originLat ?? geocodedOrigin?.lat ?? null;
    const effectiveOriginLng = originLng ?? geocodedOrigin?.lng ?? null;

    const taxRate = storeInfo?.is_tax_enabled ? (storeInfo.tax_rate ?? 0) : 0;
    const serviceRate = storeInfo?.is_service_charge_enabled ? (storeInfo.service_charge_rate ?? 0) : 0;
    const taxName = storeInfo?.tax_name ?? "Pajak";
    const isTaxInclusive = storeInfo?.is_tax_inclusive ?? false;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTablePicker, setShowTablePicker] = useState(false);

    const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("dine_in");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [notes, setNotes] = useState("");

    // Pre-order (only for dine_in / pickup)
    const [isPreOrder, setIsPreOrder] = useState(false);
    const [scheduledDate, setScheduledDate] = useState(todayStr());
    const [scheduledTime, setScheduledTime] = useState("");
    const [availableSlots, setAvailableSlots] = useState<string[] | null>(null);
    const [loadingSlots, setLoadingSlots] = useState(false);

    // Delivery fields (only for "delivery" fulfillment)
    const [destinationArea, setDestinationArea] = useState<BiteshipArea | null>(null);
    const [selectedRate, setSelectedRate] = useState<BiteshipCourier | null>(null);
    const [recipientAddress, setRecipientAddress] = useState("");
    const [pickedLocation, setPickedLocation] = useState<PickedLocation | null>(null);

    const subtotal = getSubtotal();
    const tax = getTax(taxRate);
    const serviceFee = getServiceFee(serviceRate);
    const total = getTotal(taxRate, serviceRate);

    useEffect(() => {
        // Jangan redirect kalau sedang/baru submit — cart akan kosong setelah
        // clearCart() dipanggil, dan kita perlu lanjut ke /order/confirmation
        // tanpa diintervensi guard ini (race condition: dine-in/pickup nggak
        // punya await panjang seperti Biteship, jadi useEffect ini balap
        // duluan push ke confirmation).
        if (items.length === 0 && !isSubmitting) navigate("/order");
    }, [items.length, navigate, isSubmitting]);

    // Reset pre-order state when switching to delivery
    useEffect(() => {
        if (fulfillmentType === "delivery") setIsPreOrder(false);
        else {
            // Reset delivery state saat pindah dari delivery
            setDestinationArea(null);
            setSelectedRate(null);
            setRecipientAddress("");
            setPickedLocation(null);
        }
    }, [fulfillmentType]);

    // Fetch available slots dari API setiap kali pre-order aktif dan date/table berubah
    useEffect(() => {
        if (!isPreOrder || !storeInfo?.id || !scheduledDate) {
            setAvailableSlots(null);
            return;
        }
        const orderType = FULFILLMENT_OPTIONS.find((o) => o.type === fulfillmentType)!.orderType;
        setLoadingSlots(true);
        setScheduledTime("");
        pubPreorderService
            .slots(storeInfo.id, scheduledDate, orderType, selectedTable?.id)
            .then((slots) => setAvailableSlots(slots.length > 0 ? slots : null))
            .catch(() => setAvailableSlots(null))
            .finally(() => setLoadingSlots(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPreOrder, scheduledDate, fulfillmentType, selectedTable?.id, storeInfo?.id]);

    // If switching to non-dine_in, clear the stored table
    useEffect(() => {
        if (fulfillmentType !== "dine_in") setSelectedTable(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fulfillmentType]);

    const canSubmit = useMemo(() => {
        if (!customerName.trim() || !customerPhone.trim()) return false;
        if (fulfillmentType === "dine_in" && !selectedTable) return false;
        if (isPreOrder && (!scheduledDate || !scheduledTime)) return false;
        if (fulfillmentType === "delivery" && (!destinationArea || !selectedRate || !recipientAddress.trim())) return false;
        return true;
    }, [customerName, customerPhone, fulfillmentType, selectedTable, isPreOrder, scheduledDate, scheduledTime, destinationArea, selectedRate, recipientAddress]);

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setIsSubmitting(true);
        try {
            const orderType = FULFILLMENT_OPTIONS.find((o) => o.type === fulfillmentType)!.orderType;

            // Format phone: gabungkan "62" + input user (tanpa leading 0)
            const rawPhone = customerPhone.trim().replace(/^0/, "");
            const phone = rawPhone ? `62${rawPhone}` : undefined;

            if (!storeInfo?.id) throw new Error("Store belum termuat, coba refresh halaman");

            let order: any;

            if (isPreOrder && scheduledDate && scheduledTime) {
                // Gunakan endpoint dedicated /preorders/
                order = await pubPreorderService.create({
                    name: customerName.trim(),
                    phone: phone ?? "",
                    order_type: orderType,
                    scheduled_at: `${scheduledDate}T${scheduledTime}:00`,
                    table_id: fulfillmentType === "dine_in" && selectedTable ? selectedTable.id : undefined,
                    items: items.map((item) => ({
                        product_id: item.product.id,
                        qty: item.quantity,
                    })),
                });
            } else {
                // Order reguler (bukan pre-order)
                const deliveryNotes = fulfillmentType === "delivery" && destinationArea && selectedRate
                    ? `[DELIVERY] ${selectedRate.courier_name} ${selectedRate.courier_service_name} | Tujuan: ${recipientAddress.trim()}, ${destinationArea.administrative_division_level_3_name || destinationArea.name}, ${destinationArea.administrative_division_level_2_name} | Ongkir: Rp${selectedRate.price.toLocaleString("id-ID")}`
                    : "";
                const combinedNotes = [deliveryNotes, notes.trim()].filter(Boolean).join(" | ") || undefined;

                order = await pubOrderService.checkout(storeInfo.id, {
                    order_type: orderType,
                    table_number: fulfillmentType === "dine_in" && selectedTable ? selectedTable.name : undefined,
                    name: customerName.trim(),
                    phone: phone ?? "",
                    items: items.map((item) => ({
                        product_id: item.product.id,
                        qty: item.quantity,
                        note: item.notes || undefined,
                    })),
                    payments: [{ method: "CASH", amount: total }],
                    notes: combinedNotes,
                });
            }

            // Clear cart & stored table after successful order
            clearCart();
            setSelectedTable(null);

            const orderId = order?.id ?? "";

            // Untuk delivery: buat Biteship order secara terpisah setelah checkout sukses
            // Kurir Internal (is_internal=true) tidak membuat Biteship order — diantar langsung toko
            if (fulfillmentType === "delivery" && destinationArea && selectedRate && storeInfo && orderId && !selectedRate.is_internal) {
                try {
                    const biteshipOrder = await biteshipService.createOrder({
                        order_id: orderId,   // ← WAJIB: BE butuh order_id di body
                        origin_contact_name: selectedOutlet?.name || storeInfo.name,
                        origin_contact_phone:
                            selectedOutlet?.phone_number || storeInfo.owner?.phone_number || "",
                        origin_address: selectedOutlet?.address || storeInfo.address || "",
                        ...(effectiveOriginLat != null && effectiveOriginLng != null ? {
                            origin_coordinate: { latitude: effectiveOriginLat, longitude: effectiveOriginLng },
                        } : {}),
                        destination_contact_name: customerName.trim(),
                        destination_contact_phone: phone ?? "",
                        destination_address: recipientAddress.trim(),
                        ...(pickedLocation ? {
                            destination_coordinate: {
                                latitude: pickedLocation.lat,
                                longitude: pickedLocation.lng,
                            }
                        } : {}),
                        courier_company: selectedRate.courier_code,
                        courier_type: selectedRate.courier_service_code,
                        delivery_type: "now",
                        order_note: notes.trim() || undefined,
                        items: items.map((item) => ({
                            name: item.product.name,
                            value: Math.min(item.subtotal, 20_000_000),
                            weight: 200,
                            quantity: item.quantity,
                        })),
                        metadata: {},
                    });

                    // Simpan Biteship order ID di localStorage untuk tracking
                    if (biteshipOrder?.id) {
                        localStorage.setItem(
                            `biteship_order_${orderId}`,
                            JSON.stringify({
                                biteshipOrderId: biteshipOrder.id,
                                waybillId: biteshipOrder.courier?.waybill_id ?? null,
                                courierCompany: selectedRate.courier_name,
                                destinationAddress: recipientAddress.trim(),
                                destinationArea: destinationArea.administrative_division_level_2_name,
                                destinationLat: pickedLocation?.lat ?? null,
                                destinationLng: pickedLocation?.lng ?? null,
                            })
                        );
                    }
                } catch (biteshipErr) {
                    // Jangan gagalkan order utama jika Biteship error
                    console.warn("[checkout] Biteship order creation failed:", biteshipErr);
                }
            }

            const orderNumber = order?.order_number ?? order?.id ?? `ORD-${Date.now()}`;
            // Prioritas: notification_phone dari storeInfo → localStorage fallback → owner phone
            const rawStorePhone =
              storeInfo?.notification_phone ||
              (typeof window !== "undefined" ? localStorage.getItem("wa_notification_phone") : null) ||
              storeInfo?.owner?.phone_number ||
              "";
            const storeWaPhone = rawStorePhone.replace(/\D/g, "").replace(/^0/, "62");
            const confirmParams = new URLSearchParams({
                orderNumber,
                name: customerName,
                orderId,
                type: fulfillmentType,
                storeName: storeInfo?.name ?? "",
                ...(storeWaPhone ? { storePhone: storeWaPhone } : {}),
                ...(fulfillmentType === "delivery" ? { hasDelivery: "1" } : {}),
                ...(isPreOrder ? { preOrder: "1" } : {}),
            });
            navigate(`/order/confirmation?${confirmParams.toString()}`);
        } catch (err: any) {
            const status = err?.response?.status;
            const beMsg = err?.response?.data?.error ?? err?.response?.data?.message;
            const msg = status === 403
                ? "Fitur pemesanan belum aktif. Silakan hubungi pengelola."
                : beMsg ?? err?.message ?? "Gagal membuat pesanan";
            showToast(msg, "error");
            setIsSubmitting(false);
        }
    };

    // ── Tunggu client mount (hindari Zustand persist hydration mismatch) ──────
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FEFAF5" }}>
                <div className="h-8 w-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            </div>
        );
    }

    // ── Table picker overlay ───────────────────────────────────────────────────
    if (showTablePicker) {
        return (
            <div className="min-h-screen p-4" style={{ backgroundColor: "#FEFAF5" }}>
                <div className="container mx-auto max-w-2xl">
                    <TableLayoutPicker
                        onSelect={(table) => {
                            setSelectedTable(table);
                            setShowTablePicker(false);
                        }}
                        onBack={() => setShowTablePicker(false)}
                    />
                </div>
            </div>
        );
    }

    // ── Main form ──────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen pb-36 lg:pb-12" style={{ backgroundColor: "#FEFAF5" }}>
            <div className="container mx-auto px-4 py-8 max-w-5xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/order/cart"
                        className="h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 transition-all active:scale-90"
                        style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.2)", color: "#6B4C2A" }}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-fraunces)]"
                            style={{ color: "#1C0A00" }}
                        >
                            Konfirmasi Pesanan
                        </h1>
                        <p className="text-sm font-medium mt-0.5" style={{ color: "#9C7D58" }}>
                            {items.length} menu · {formatCurrency(total + (selectedRate?.price ?? 0))}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

                    {/* ── Left: form ── */}
                    <div className="lg:col-span-7 space-y-4">

                        {/* ① Jenis Layanan */}
                        <SectionCard>
                            <SectionTitle icon={ReceiptText} label="Jenis Layanan" />
                            <div className="flex gap-2">
                                {FULFILLMENT_OPTIONS.map(({ type, label, icon: Icon }) => {
                                    const active = fulfillmentType === type;
                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFulfillmentType(type)}
                                            className="flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-2 transition-all active:scale-[0.97]"
                                            style={{
                                                backgroundColor: active ? "#FEF3C7" : "#FEFAF5",
                                                borderColor: active ? "#F59E0B" : "rgba(124,74,30,0.12)",
                                            }}
                                        >
                                            <div
                                                className="h-9 w-9 rounded-xl flex items-center justify-center"
                                                style={
                                                    active
                                                        ? { backgroundColor: "#F59E0B", color: "#1C0A00" }
                                                        : { backgroundColor: "rgba(124,74,30,0.07)", color: "#9C7D58" }
                                                }
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span
                                                className="text-[11px] font-black leading-tight text-center"
                                                style={{ color: active ? "#92400E" : "#6B4C2A" }}
                                            >
                                                {label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </SectionCard>

                        {/* ② Meja — hanya untuk dine_in */}
                        {fulfillmentType === "dine_in" && (
                            <SectionCard>
                                <SectionTitle icon={MapPin} label="Meja" />
                                {selectedTable ? (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: "#ECFDF5" }}
                                            >
                                                <Check className="h-5 w-5" style={{ color: "#059669" }} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black" style={{ color: "#1C0A00" }}>
                                                    {selectedTable.name}
                                                </p>
                                                <p className="text-xs font-medium" style={{ color: "#9C7D58" }}>
                                                    {selectedTable.area?.name
                                                        ? `${selectedTable.area.name} · `
                                                        : ""}
                                                    {selectedTable.capacity} kursi
                                                    {qrToken && (
                                                        <span
                                                            className="ml-1.5 text-[10px] font-black px-1.5 py-0.5 rounded"
                                                            style={{ backgroundColor: "#ECFDF5", color: "#059669" }}
                                                        >
                                                            dari QR
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setShowTablePicker(true)}
                                            className="text-xs font-black px-3 py-1.5 rounded-xl transition-all active:scale-95"
                                            style={{ color: "#D97706", backgroundColor: "#FEF3C7" }}
                                        >
                                            Ganti
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowTablePicker(true)}
                                        className="w-full h-12 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 font-bold text-sm transition-all"
                                        style={{ borderColor: "rgba(124,74,30,0.25)", color: "#9C7D58" }}
                                    >
                                        <MapPin className="h-4 w-4" />
                                        Buka Denah Meja
                                    </button>
                                )}
                            </SectionCard>
                        )}

                        {/* ③ Jadwalkan untuk nanti — toggle, hanya dine_in / pickup */}
                        {(fulfillmentType === "dine_in" || fulfillmentType === "pickup") && (
                            <SectionCard>
                                {/* Toggle header */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPreOrder((v) => !v);
                                        if (!isPreOrder) setScheduledTime(""); // reset on open
                                    }}
                                    className="w-full flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: isPreOrder ? "#FEF3C7" : "rgba(124,74,30,0.07)" }}
                                        >
                                            <Calendar
                                                className="h-3.5 w-3.5"
                                                style={{ color: isPreOrder ? "#D97706" : "#9C7D58" }}
                                            />
                                        </div>
                                        <span
                                            className="text-[13px] font-black uppercase tracking-wider"
                                            style={{ color: isPreOrder ? "#1C0A00" : "#9C7D58" }}
                                        >
                                            Jadwalkan untuk nanti
                                        </span>
                                        {isPreOrder && scheduledDate && scheduledTime && (
                                            <span
                                                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                                                style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                                            >
                                                {scheduledTime}
                                            </span>
                                        )}
                                    </div>
                                    {/* Toggle pill */}
                                    <div
                                        className="relative h-6 w-11 rounded-full transition-colors shrink-0"
                                        style={{ backgroundColor: isPreOrder ? "#F59E0B" : "rgba(124,74,30,0.15)" }}
                                    >
                                        <div
                                            className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
                                            style={{ left: isPreOrder ? "calc(100% - 22px)" : "2px" }}
                                        />
                                    </div>
                                </button>

                                {/* Expanded date + time slot picker */}
                                {isPreOrder && (
                                    <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div>
                                            <FieldLabel>Tanggal</FieldLabel>
                                            <input
                                                type="date"
                                                min={todayStr()}
                                                className="w-full h-12 rounded-2xl px-4 text-sm font-medium border-2 outline-none transition-colors"
                                                style={inputStyle}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                value={scheduledDate}
                                                onChange={(e) => {
                                                    setScheduledDate(e.target.value);
                                                    setScheduledTime(""); // reset time on date change
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <FieldLabel>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3 inline" />
                                                    Waktu Kedatangan
                                                </span>
                                            </FieldLabel>
                                            {loadingSlots ? (
                                                <div className="flex items-center justify-center h-12 gap-2" style={{ color: "#9C7D58" }}>
                                                    <div className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                                                    <span className="text-xs font-medium">Memuat slot waktu...</span>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-4 gap-2">
                                                    {(availableSlots ?? TIME_SLOTS).map((slot) => {
                                                        const past = !availableSlots && isPastSlot(scheduledDate, slot);
                                                        const active = scheduledTime === slot;
                                                        return (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                disabled={past}
                                                                onClick={() => setScheduledTime(slot)}
                                                                className="py-2.5 rounded-xl text-xs font-bold border-2 transition-all"
                                                                style={{
                                                                    backgroundColor: active ? "#F59E0B" : past ? "#F5F5F5" : "#FFF8EE",
                                                                    borderColor: active ? "#D97706" : past ? "#E5E7EB" : "rgba(124,74,30,0.15)",
                                                                    color: active ? "#1C0A00" : past ? "#9CA3AF" : "#6B4C2A",
                                                                    cursor: past ? "not-allowed" : "pointer",
                                                                }}
                                                            >
                                                                {slot}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </SectionCard>
                        )}

                        {/* ④ Informasi Pelanggan (opsional) */}
                        <SectionCard>
                            <SectionTitle icon={User} label="Informasi Pelanggan" />
                            <div className="space-y-3">
                                <div>
                                    <FieldLabel>Nama</FieldLabel>
                                    <input
                                        placeholder="Nama kamu"
                                        className="w-full h-11 rounded-2xl px-4 text-sm font-medium border-2 outline-none transition-colors"
                                        style={inputStyle}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <FieldLabel>Nomor WhatsApp</FieldLabel>
                                    <div className="relative">
                                        <span
                                            className="absolute inset-y-0 left-4 flex items-center text-sm font-black pointer-events-none"
                                            style={{ color: "#9C7D58" }}
                                        >
                                            +62
                                        </span>
                                        <input
                                            type="tel"
                                            placeholder="812-3456-7890"
                                            className="w-full pl-14 h-11 rounded-2xl px-4 text-sm font-medium border-2 outline-none transition-colors"
                                            style={inputStyle}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </SectionCard>

                        {/* ④b Pengiriman — hanya untuk delivery */}
                        {fulfillmentType === "delivery" && (
                            <SectionCard>
                                <SectionTitle icon={Truck} label="Detail Pengiriman" />
                                <div className="space-y-5">

                                    {/* ⓪ Outlet asal pengiriman */}
                                    {outlets.length > 0 && (
                                        <div>
                                            <FieldLabel>Diantar dari Cabang</FieldLabel>
                                            {outlets.length === 1 ? (
                                                <div
                                                    className="flex items-start gap-3 px-4 py-3 rounded-2xl border-2"
                                                    style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.18)" }}
                                                >
                                                    <div
                                                        className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                                        style={{ backgroundColor: "#FEF3C7" }}
                                                    >
                                                        <MapPin className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-black" style={{ color: "#1C0A00" }}>
                                                            {outlets[0].name}
                                                        </p>
                                                        <p className="text-xs font-medium mt-0.5" style={{ color: "#9C7D58" }}>
                                                            {outlets[0].address}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-2">
                                                    {outlets.map((o) => {
                                                        const active = o.id === selectedOutletId;
                                                        const hasCoords =
                                                            typeof o.latitude === "number" && typeof o.longitude === "number";
                                                        return (
                                                            <button
                                                                key={o.id}
                                                                type="button"
                                                                onClick={() => setSelectedOutletId(o.id)}
                                                                className="flex items-start gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all active:scale-[0.99]"
                                                                style={{
                                                                    backgroundColor: active ? "#FEF3C7" : "#FFF8EE",
                                                                    borderColor: active ? "#F59E0B" : "rgba(124,74,30,0.18)",
                                                                }}
                                                            >
                                                                <div
                                                                    className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                                                                    style={{ backgroundColor: active ? "#FDE68A" : "#FEF3C7" }}
                                                                >
                                                                    <MapPin className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="text-sm font-black" style={{ color: "#1C0A00" }}>
                                                                            {o.name}
                                                                        </p>
                                                                        {!hasCoords && (
                                                                            <span
                                                                                className="text-[9px] font-black px-1.5 py-0.5 rounded"
                                                                                style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
                                                                            >
                                                                                TANPA TITIK
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-xs font-medium mt-0.5" style={{ color: "#9C7D58" }}>
                                                                        {o.address}
                                                                    </p>
                                                                </div>
                                                                {active && (
                                                                    <Check className="h-4 w-4 shrink-0 mt-1" style={{ color: "#D97706" }} />
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            {selectedOutlet && !(typeof selectedOutlet.latitude === "number" && typeof selectedOutlet.longitude === "number") && (
                                                <p className="mt-2 text-[11px] font-bold" style={{ color: "#D97706" }}>
                                                    * Cabang ini belum punya titik lokasi — origin akan di-geocode dari alamat (kurang akurat). Atur titik di dashboard Cabang.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ① Peta — pilih titik lokasi */}
                                    <LocationPicker
                                        initialLat={pickedLocation?.lat}
                                        initialLng={pickedLocation?.lng}
                                        pickedLocation={pickedLocation}
                                        onPick={(loc) => {
                                            setPickedLocation(loc);
                                            // Auto-isi alamat dari reverse geocode
                                            if (loc.address) {
                                                setRecipientAddress(loc.address);
                                            }
                                            // Auto-search kecamatan via structured address (lebih reliable
                                            // dari parsing display_name). Prioritas: district → village → city.
                                            const candidates = [loc.district, loc.village, loc.city]
                                                .filter((s): s is string => Boolean(s && s.length >= 3));
                                            if (candidates.length === 0) return;

                                            (async () => {
                                                for (const term of candidates) {
                                                    // Gabungkan dengan city agar hasil pencarian lebih tepat
                                                    const keyword = loc.city && term !== loc.city
                                                        ? `${term} ${loc.city}`
                                                        : term;
                                                    const areas = await biteshipService.searchAreas(keyword);
                                                    if (areas.length > 0) {
                                                        setDestinationArea(areas[0]);
                                                        setSelectedRate(null);
                                                        return;
                                                    }
                                                }
                                            })().catch(() => {});
                                        }}
                                        onClear={() => setPickedLocation(null)}
                                    />

                                    {/* ② Area tujuan (Biteship area) */}
                                    <DeliveryAddressSearch
                                        label="Kecamatan / Kelurahan Tujuan"
                                        value={destinationArea}
                                        onChange={(area) => {
                                            setDestinationArea(area);
                                            setSelectedRate(null);
                                        }}
                                    />

                                    {/* ③ Alamat lengkap — bisa diisi manual atau dari peta */}
                                    <div>
                                        <FieldLabel>Alamat Lengkap / Patokan</FieldLabel>
                                        <textarea
                                            placeholder="Jl. Contoh No.1, Gedung A Lt.3, dekat minimarket..."
                                            rows={2}
                                            className="w-full rounded-2xl p-4 text-sm resize-none outline-none border-2 transition-colors font-medium"
                                            style={inputStyle}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            value={recipientAddress}
                                            onChange={(e) => setRecipientAddress(e.target.value)}
                                        />
                                        {pickedLocation && !recipientAddress.trim() && (
                                            <button
                                                type="button"
                                                onClick={() => pickedLocation.address && setRecipientAddress(pickedLocation.address)}
                                                className="mt-1.5 text-[11px] font-black px-2 py-1 rounded-lg transition-all active:scale-95"
                                                style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                                            >
                                                Gunakan alamat dari peta
                                            </button>
                                        )}
                                    </div>

                                    {/* ④ Tarif kurir */}
                                    <DeliveryRateSelector
                                        originAreaId={originAreaId}
                                        destinationArea={destinationArea}
                                        items={items.map((item) => ({
                                            name: item.product.name,
                                            value: Math.min(item.subtotal, 20_000_000),
                                            weight: 200,
                                            quantity: item.quantity,
                                        }))}
                                        selected={selectedRate}
                                        onChange={setSelectedRate}
                                        originLat={effectiveOriginLat}
                                        originLng={effectiveOriginLng}
                                        destinationLat={pickedLocation?.lat}
                                        destinationLng={pickedLocation?.lng}
                                    />

                                    {/* Selected rate summary */}
                                    {selectedRate && (
                                        <div
                                            className="flex items-center justify-between px-4 py-3 rounded-2xl"
                                            style={{ backgroundColor: "#ECFDF5", border: "1.5px solid #A7F3D0" }}
                                        >
                                            <div>
                                                <p className="text-sm font-black" style={{ color: "#065F46" }}>
                                                    {selectedRate.courier_name} — {selectedRate.courier_service_name}
                                                </p>
                                                <p className="text-xs font-medium mt-0.5" style={{ color: "#6B7280" }}>
                                                    {selectedRate.duration}
                                                </p>
                                            </div>
                                            <span className="text-sm font-black tabular-nums" style={{ color: "#059669" }}>
                                                +{formatCurrency(selectedRate.price)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Validation hints */}
                                    {!destinationArea && (
                                        <p className="text-xs font-bold" style={{ color: "#D97706" }}>
                                            * Pilih kecamatan/kelurahan tujuan untuk melihat kurir tersedia
                                        </p>
                                    )}
                                    {destinationArea && !selectedRate && (
                                        <p className="text-xs font-bold" style={{ color: "#D97706" }}>
                                            * Pilih layanan pengiriman
                                        </p>
                                    )}
                                    {destinationArea && selectedRate && !recipientAddress.trim() && (
                                        <p className="text-xs font-bold" style={{ color: "#D97706" }}>
                                            * Masukkan alamat lengkap tujuan
                                        </p>
                                    )}
                                </div>
                            </SectionCard>
                        )}

                        {/* ⑤ Catatan (opsional) */}
                        <SectionCard>
                            <SectionTitle icon={ClipboardList} label="Catatan" />
                            <textarea
                                placeholder="Pesan khusus untuk pesananmu..."
                                rows={3}
                                className="w-full rounded-2xl p-4 text-sm resize-none outline-none border-2 transition-colors font-medium"
                                style={inputStyle}
                                onFocus={onFocus}
                                onBlur={onBlur}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </SectionCard>

                        {/* Metode pembayaran (visual only) */}
                        <SectionCard>
                            <SectionTitle icon={ReceiptText} label="Pembayaran" />
                            <div
                                className="flex items-center gap-3 py-3 px-4 rounded-2xl border-2"
                                style={{ backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }}
                            >
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: "#F59E0B" }}
                                >
                                    <ReceiptText className="h-4 w-4" style={{ color: "#1C0A00" }} />
                                </div>
                                <div>
                                    <p className="text-[13px] font-black" style={{ color: "#92400E" }}>Tunai (Cash)</p>
                                    <p className="text-[11px] font-medium" style={{ color: "#9C7D58" }}>Bayar di kasir</p>
                                </div>
                            </div>
                        </SectionCard>
                    </div>

                    {/* ── Right: Order summary (desktop) ── */}
                    <div className="hidden lg:block lg:col-span-5">
                        <div
                            className="sticky top-24 rounded-[24px] p-7"
                            style={{ backgroundColor: "#1C0A00", border: "1px solid rgba(245,158,11,0.15)" }}
                        >
                            <div
                                className="flex items-center gap-3 mb-6 pb-5"
                                style={{ borderBottom: "1px solid rgba(245,158,11,0.12)" }}
                            >
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
                                >
                                    <ReceiptText className="h-4 w-4" style={{ color: "#F59E0B" }} />
                                </div>
                                <h2
                                    className="text-base font-black tracking-tight font-[family-name:var(--font-fraunces)]"
                                    style={{ color: "rgba(255,255,255,0.9)" }}
                                >
                                    Pesananmu
                                </h2>
                            </div>

                            <div className="space-y-3 mb-5">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-3">
                                        <p className="text-sm font-bold flex-1 min-w-0 truncate" style={{ color: "rgba(255,255,255,0.75)" }}>
                                            {item.quantity}× {item.product.name}
                                        </p>
                                        <span className="text-sm font-black shrink-0 tabular-nums" style={{ color: "rgba(255,255,255,0.65)" }}>
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div
                                className="space-y-3 pt-5 mb-6"
                                style={{ borderTop: "1px solid rgba(245,158,11,0.12)" }}
                            >
                                {[
                                    ["Subtotal", formatCurrency(subtotal)],
                                    ...(taxRate > 0 ? [[`${taxName} (${taxRate}%)`, formatCurrency(tax)]] : []),
                                    ...(serviceRate > 0 ? [[`Layanan (${serviceRate}%)`, formatCurrency(serviceFee)]] : []),
                                    ...(selectedRate ? [[`Ongkos Kirim`, formatCurrency(selectedRate.price)]] : []),
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between">
                                        <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
                                        <span className="text-sm font-black tabular-nums" style={{ color: "rgba(255,255,255,0.75)" }}>{value}</span>
                                    </div>
                                ))}
                                <div className="pt-4" style={{ borderTop: "1px dashed rgba(245,158,11,0.2)" }}>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Total</span>
                                        <span className="text-2xl font-black tracking-tight tabular-nums" style={{ color: "#F59E0B" }}>
                                            {formatCurrency(total + (selectedRate?.price ?? 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Validation hint */}
                            {!canSubmit && fulfillmentType === "dine_in" && !selectedTable && (
                                <p className="text-xs font-bold text-center mb-3" style={{ color: "rgba(245,158,11,0.6)" }}>
                                    Pilih meja terlebih dahulu
                                </p>
                            )}
                            {!canSubmit && isPreOrder && (!scheduledDate || !scheduledTime) && (
                                <p className="text-xs font-bold text-center mb-3" style={{ color: "rgba(245,158,11,0.6)" }}>
                                    Pilih tanggal & waktu pre-order
                                </p>
                            )}
                            {!canSubmit && fulfillmentType === "delivery" && (!destinationArea || !selectedRate || !recipientAddress.trim()) && (
                                <p className="text-xs font-bold text-center mb-3" style={{ color: "rgba(245,158,11,0.6)" }}>
                                    Lengkapi detail pengiriman
                                </p>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || !canSubmit}
                                className="w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-55"
                                style={{ backgroundColor: "#F59E0B", color: "#1C0A00", boxShadow: "0 8px 24px rgba(245,158,11,0.28)" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 rounded-full border-2 border-[#1C0A00]/40 border-t-[#1C0A00] animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>Pesan Sekarang <Send className="h-4 w-4" /></>
                                )}
                            </button>

                            <div
                                className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl"
                                style={{ backgroundColor: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.12)" }}
                            >
                                <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: "#F59E0B" }} />
                                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "rgba(245,158,11,0.65)" }}>
                                    Bayar di Kasir
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Mobile sticky bottom bar ── */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-3 z-50"
                style={{
                    backgroundColor: "#1C0A00",
                    borderTop: "1px solid rgba(245,158,11,0.15)",
                    paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
                }}
            >
                <div className="flex items-center gap-4 max-w-lg mx-auto">
                    <div className="flex flex-col shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-[0.18em] mb-0.5" style={{ color: "rgba(245,158,11,0.5)" }}>
                            Total
                        </span>
                        <span className="text-lg font-black tabular-nums leading-none" style={{ color: "#F59E0B" }}>
                            {formatCurrency(total + (selectedRate?.price ?? 0))}
                        </span>
                    </div>
                    <div className="h-8 w-px shrink-0" style={{ backgroundColor: "rgba(245,158,11,0.15)" }} />
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !canSubmit}
                        className="flex-1 h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-55"
                        style={{ backgroundColor: "#F59E0B", color: "#1C0A00" }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-[#1C0A00]/40 border-t-[#1C0A00] animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>Pesan Sekarang <Send className="h-3.5 w-3.5" /></>
                        )}
                    </button>
                </div>

                {/* Hint below button on mobile */}
                {!canSubmit && (
                    <p className="text-center text-[10px] font-bold mt-2" style={{ color: "rgba(245,158,11,0.5)" }}>
                        {fulfillmentType === "dine_in" && !selectedTable
                            ? "Pilih meja terlebih dahulu"
                            : fulfillmentType === "delivery" && (!destinationArea || !selectedRate || !recipientAddress.trim())
                            ? "Lengkapi detail pengiriman"
                            : "Pilih tanggal & waktu pre-order"}
                    </p>
                )}
            </div>
        </div>
    );
}
