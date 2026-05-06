import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    CheckCircle2, Ticket, Printer, Share2, Home, CreditCard,
    ChevronRight, FileText, Truck, MessageCircle, BellOff, ShoppingBag, Eye,
} from "lucide-react";

// ── WhatsApp Notification Bottom Sheet ────────────────────────────────────────
type NotifType = "delivery" | "pickup" | "dine_in";

const NOTIF_COPY: Record<NotifType, { title: string; subtitle: string; message: string }> = {
    delivery: {
        title: "Mau update status pengiriman?",
        subtitle: "Kirim pesan ke WhatsApp toko agar kamu dapat notif saat pesanan dikirim",
        message: "ketika pesanan sudah dikirim atau ada update status pengiriman",
    },
    pickup: {
        title: "Mau notif saat pesanan siap?",
        subtitle: "Kirim pesan ke WhatsApp toko agar kamu dapat notif saat pesanan siap diambil",
        message: "ketika pesanan sudah siap untuk diambil",
    },
    dine_in: {
        title: "Mau notif saat pesanan siap?",
        subtitle: "Kirim pesan ke WhatsApp toko agar kamu dapat notif saat pesanan siap disajikan",
        message: "ketika pesanan sudah siap disajikan di meja",
    },
};

function WhatsAppNotifSheet({
    open,
    onClose,
    storeName,
    storePhone,
    customerName,
    orderNumber,
    orderId,
    notifType,
}: {
    open: boolean;
    onClose: () => void;
    storeName: string;
    storePhone: string;
    customerName: string;
    orderNumber: string;
    orderId: string;
    notifType: NotifType;
}) {
    const copy = NOTIF_COPY[notifType];
    const waUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(orderNumber)}`;

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Sheet */}
            <div
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[2rem] p-6 pb-10 max-w-lg mx-auto"
                style={{ backgroundColor: "#FFFBF5", boxShadow: "0 -8px 40px rgba(28,10,0,0.15)" }}
            >
                {/* Handle */}
                <div
                    className="w-10 h-1.5 rounded-full mx-auto mb-6"
                    style={{ backgroundColor: "rgba(124,74,30,0.2)" }}
                />

                {/* Icon */}
                <div
                    className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#DCFCE7" }}
                >
                    <MessageCircle className="h-8 w-8" style={{ color: "#16A34A" }} />
                </div>

                <h2
                    className="text-xl font-black text-center mb-2 tracking-tight"
                    style={{ color: "#1C0A00" }}
                >
                    {copy.title}
                </h2>
                <p
                    className="text-sm font-medium text-center mb-6 px-2 leading-relaxed"
                    style={{ color: "#6B4C2A" }}
                >
                    {copy.subtitle}
                </p>

                {/* Preview template */}
                <div
                    className="rounded-2xl p-4 mb-6 text-sm font-medium leading-relaxed"
                    style={{
                        backgroundColor: "#F0FDF4",
                        border: "1.5px solid #BBF7D0",
                        color: "#166534",
                    }}
                >
                    <span
                        className="text-[10px] font-black uppercase tracking-widest block mb-2"
                        style={{ color: "#16A34A" }}
                    >
                        ID Pesanan yang akan dikirim ke {storeName}
                    </span>
                    {orderNumber}
                </div>

                <div className="space-y-3">
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-black text-base transition-all active:scale-[0.98]"
                        style={{ backgroundColor: "#25D366", color: "#FFFFFF" }}
                    >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Ya, Kirim ke WhatsApp
                    </a>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl font-black text-sm transition-all active:scale-[0.98] border-2"
                        style={{
                            borderColor: "rgba(124,74,30,0.18)",
                            color: "#9C7D58",
                            backgroundColor: "transparent",
                        }}
                    >
                        <BellOff className="h-4 w-4" />
                        Tidak, terima kasih
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Main Content ───────────────────────────────────────────────────────────────
function ConfirmationContent() {
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get("orderNumber") || "ORD-0000";
    const customerName = searchParams.get("name") || "Pelanggan";
    const orderId = searchParams.get("orderId") || "";
    const fulfillmentType = searchParams.get("type") as "dine_in" | "pickup" | "delivery" | null;
    const hasDelivery = searchParams.get("hasDelivery") === "1";
    const isPreOrder = searchParams.get("preOrder") === "1";
    const storeName = searchParams.get("storeName") || "Toko";
    const storePhone = searchParams.get("storePhone") || "";

    const isDelivery = fulfillmentType === "delivery" || (!fulfillmentType && hasDelivery);
    const isPickup = fulfillmentType === "pickup";
    const isDineIn = fulfillmentType === "dine_in";
    // WA notif: tampil untuk delivery, pickup, dan dine-in (hanya jika pre-order)
    const showWaNotif = Boolean(storePhone) && (isDelivery || isPickup || (isDineIn && isPreOrder));

    const [showWaSheet, setShowWaSheet] = useState(false);

    // Countdown untuk dine_in: blokir tombol "Kembali ke Menu" selama 8 detik
    const [countdown, setCountdown] = useState<number | null>(isDineIn ? 8 : null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!isDineIn) return;
        setCountdown(8);
        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(countdownRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Auto-show WA sheet setelah 800ms (hanya delivery + ada nomor WA toko)
    useEffect(() => {
        if (isDelivery && storePhone) {
            const t = setTimeout(() => setShowWaSheet(true), 800);
            return () => clearTimeout(t);
        }
    }, [isDelivery, storePhone]);

    const backButtonLocked = isDineIn && countdown !== null && countdown > 0;

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#FEFAF5" }}>
            <div className="container mx-auto px-4 pt-16 pb-32 max-w-xl text-center">
                {/* Success Animation */}
                <div className="relative mb-10">
                    <div
                        className="absolute inset-0 scale-150 blur-3xl rounded-full opacity-25 animate-pulse pointer-events-none"
                        style={{ backgroundColor: "#F59E0B" }}
                    />
                    <div
                        className="relative h-32 w-32 rounded-[2.5rem] flex items-center justify-center mx-auto transform rotate-6 transition-transform hover:rotate-0 duration-500"
                        style={{
                            backgroundColor: "#F59E0B",
                            boxShadow: "0 16px 48px rgba(245,158,11,0.4)",
                        }}
                    >
                        <CheckCircle2 className="h-16 w-16 stroke-[2.5px]" style={{ color: "#1C0A00" }} />
                    </div>
                </div>

                <h1
                    className="text-4xl font-black mb-4 tracking-tight font-[family-name:var(--font-fraunces)]"
                    style={{ color: "#1C0A00" }}
                >
                    Pesanan Diterima!
                </h1>
                <p className="leading-relaxed mb-10 font-medium px-4" style={{ color: "#9C7D58" }}>
                    Terima kasih{" "}
                    <span className="font-black" style={{ color: "#1C0A00" }}>{customerName}</span>
                    , pesanan Anda sedang kami proses.
                </p>

                {/* Order Ticket */}
                <div
                    className="rounded-[2rem] p-8 mb-6 relative overflow-hidden group"
                    style={{
                        backgroundColor: "#FFFFFF",
                        border: "1.5px solid rgba(124,74,30,0.1)",
                        boxShadow: "0 4px 24px rgba(28,10,0,0.06)",
                    }}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <Ticket className="h-40 w-40 -rotate-12" style={{ color: "#1C0A00" }} />
                    </div>
                    <p
                        className="text-[11px] font-black uppercase tracking-[0.2em] mb-2"
                        style={{ color: "#C4A882" }}
                    >
                        Nomor Antrean / Pesanan
                    </p>
                    <div
                        className="text-5xl font-black tracking-tight mb-8 font-[family-name:var(--font-fraunces)]"
                        style={{ color: "#D97706" }}
                    >
                        #{orderNumber}
                    </div>

                    {/* Dine-in info: mohon tunggu */}
                    {isDineIn && (
                        <div
                            className="rounded-2xl px-4 py-3 mb-6 flex items-center gap-3 text-left"
                            style={{ backgroundColor: "#FEF3C7", border: "1.5px solid rgba(245,158,11,0.3)" }}
                        >
                            <div
                                className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "#F59E0B" }}
                            >
                                <ShoppingBag className="h-4 w-4" style={{ color: "#1C0A00" }} />
                            </div>
                            <p className="text-[11px] font-bold leading-snug" style={{ color: "#92400E" }}>
                                Mohon menunggu, pesananmu sedang kami proses
                            </p>
                        </div>
                    )}

                    {/* Pickup info: pantau status di bawah */}
                    {isPickup && (
                        <div
                            className="rounded-2xl px-4 py-3 mb-6 flex items-center gap-3 text-left"
                            style={{ backgroundColor: "#FEF3C7", border: "1.5px solid rgba(245,158,11,0.3)" }}
                        >
                            <div
                                className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "#F59E0B" }}
                            >
                                <Eye className="h-4 w-4" style={{ color: "#1C0A00" }} />
                            </div>
                            <p className="text-[11px] font-bold leading-snug" style={{ color: "#92400E" }}>
                                Pantau status di bawah — kami akan beri tahu saat pesanan siap diambil
                            </p>
                        </div>
                    )}

                    <div
                        className="grid grid-cols-2 gap-3 pt-8"
                        style={{ borderTop: "1px dashed rgba(124,74,30,0.15)" }}
                    >
                        <button
                            onClick={() => {
                                if (orderId) {
                                    const url = `${window.location.origin}/invoice/${orderId}`;
                                    const w = window.open(url, "_blank");
                                    if (w) w.addEventListener("load", () => setTimeout(() => w.print(), 500));
                                }
                            }}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
                            style={{ backgroundColor: "#FFF8EE" }}
                        >
                            <div
                                className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors"
                                style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                            >
                                <Printer className="h-5 w-5" />
                            </div>
                            <span
                                className="text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "#9C7D58" }}
                            >
                                Simpan PDF
                            </span>
                        </button>
                        <button
                            onClick={async () => {
                                const url = orderId ? `${window.location.origin}/invoice/${orderId}` : window.location.href;
                                if (navigator.share) {
                                    try { await navigator.share({ title: `Pesanan #${orderNumber}`, url }); } catch {}
                                } else {
                                    await navigator.clipboard.writeText(url);
                                    alert("Link invoice disalin ke clipboard!");
                                }
                            }}
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95"
                            style={{ backgroundColor: "#FFF8EE" }}
                        >
                            <div
                                className="h-10 w-10 rounded-xl flex items-center justify-center transition-colors"
                                style={{ backgroundColor: "#FEF3C7", color: "#D97706" }}
                            >
                                <Share2 className="h-5 w-5" />
                            </div>
                            <span
                                className="text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "#9C7D58" }}
                            >
                                Bagikan
                            </span>
                        </button>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">

                    {/* PICKUP: Pantau Status — primary CTA */}
                    {isPickup && orderId && (
                        <Link
                            to={`/order/status/${orderId}`}
                            className="inline-flex items-center justify-center font-black transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-16 text-lg"
                            style={{
                                backgroundColor: "#F59E0B",
                                color: "#1C0A00",
                                boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
                            }}
                        >
                            <Eye className="mr-3 h-5 w-5" />
                            Pantau Status Pesanan
                        </Link>
                    )}

                    {/* DELIVERY: Lacak Pesanan */}
                    {orderId && isDelivery && (
                        <Link
                            to={`/order/tracking/${orderId}`}
                            className="inline-flex items-center justify-center font-black transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-16 text-lg"
                            style={{
                                backgroundColor: "#F59E0B",
                                color: "#1C0A00",
                                boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
                            }}
                        >
                            <Truck className="mr-3 h-5 w-5" />
                            Lacak Pesanan
                        </Link>
                    )}

                    {/* WA notif button — delivery, pickup, dine-in (hanya pre-order) */}
                    {showWaNotif && (
                        <button
                            type="button"
                            onClick={() => setShowWaSheet(true)}
                            className="inline-flex items-center justify-center gap-2 font-black transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-14 text-base border-2"
                            style={{
                                borderColor: "rgba(245,158,11,0.4)",
                                color: "#D97706",
                                backgroundColor: "#FFFBEB",
                            }}
                        >
                            <MessageCircle className="h-5 w-5" />
                            {isDelivery
                                ? "Minta notif pengiriman via WA"
                                : "Minta notif pesanan siap via WA"}
                        </button>
                    )}

                    {/* Invoice (semua tipe) */}
                    {orderId && (
                        <Link
                            to={`/invoice/${orderId}`}
                            className="inline-flex items-center justify-center font-black transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-14 text-base border-2"
                            style={{
                                borderColor: "rgba(124,74,30,0.2)",
                                color: "#6B4C2A",
                                backgroundColor: "#FFF8EE",
                            }}
                        >
                            <FileText className="mr-3 h-4 w-4" />
                            Lihat Invoice
                        </Link>
                    )}

                    {/* Ulasan (semua tipe) */}
                    {orderId && (
                        <Link
                            to={`/order/review?order_id=${orderId}`}
                            className="inline-flex items-center justify-center font-black transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-14 text-base border-2"
                            style={{
                                borderColor: "rgba(124,74,30,0.2)",
                                color: "#6B4C2A",
                                backgroundColor: "#FFF8EE",
                            }}
                        >
                            Beri Ulasan
                        </Link>
                    )}

                    {/* Kembali ke Menu — dikunci 8 detik untuk dine_in */}
                    <Link
                        to="/order"
                        onClick={(e) => { if (backButtonLocked) e.preventDefault(); }}
                        className="inline-flex items-center justify-center font-black transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-16 text-lg"
                        style={
                            backButtonLocked
                                ? { backgroundColor: "rgba(28,10,0,0.1)", color: "#C4A882", cursor: "not-allowed", boxShadow: "none" }
                                : { backgroundColor: "#1C0A00", color: "#FFFFFF", boxShadow: "0 8px 24px rgba(28,10,0,0.25)" }
                        }
                    >
                        <Home className="mr-3 h-5 w-5" />
                        {backButtonLocked
                            ? `Kembali ke Menu (${countdown})`
                            : "Kembali ke Menu"
                        }
                    </Link>

                    <p className="text-[11px] font-black uppercase tracking-widest pt-4" style={{ color: "#C4A882" }}>
                        Butuh bantuan?{" "}
                        {storePhone ? (
                            <a
                                href={`https://wa.me/${storePhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                                style={{ color: "#D97706" }}
                            >
                                Hubungi Toko
                            </a>
                        ) : (
                            <span style={{ color: "#D97706" }}>Hubungi Toko</span>
                        )}
                    </p>
                </div>

                {/* Info card bayar — hanya dine_in & pickup */}
                {(isDineIn || isPickup || !fulfillmentType) && (
                    <div
                        className="mt-10 rounded-[22px] p-5 text-left flex items-start gap-4"
                        style={{
                            backgroundColor: "#FFFFFF",
                            border: "1.5px solid rgba(124,74,30,0.1)",
                            boxShadow: "0 2px 12px rgba(28,10,0,0.04)",
                        }}
                    >
                        <div
                            className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: "#FEF3C7" }}
                        >
                            <CreditCard className="h-6 w-6" style={{ color: "#D97706" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-black mb-1" style={{ color: "#1C0A00" }}>
                                Bayar di Tempat
                            </h3>
                            <p className="text-[11px] font-medium leading-relaxed" style={{ color: "#9C7D58" }}>
                                Tunjukkan nomor pesanan di atas ke meja kasir untuk melakukan pembayaran dan mengambil pesanan.
                            </p>
                        </div>
                        <ChevronRight className="h-5 w-5 mt-3 shrink-0" style={{ color: "#C4A882" }} />
                    </div>
                )}
            </div>

            {/* WA Bottom Sheet */}
            <WhatsAppNotifSheet
                open={showWaSheet}
                onClose={() => setShowWaSheet(false)}
                storeName={storeName}
                storePhone={storePhone}
                customerName={customerName}
                orderNumber={orderNumber}
                orderId={orderId}
                notifType={isDelivery ? "delivery" : isPickup ? "pickup" : "dine_in"}
            />
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 pt-16 pb-32 text-center">
                <p className="text-text-secondary font-medium">Memuat rincian pesanan...</p>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
