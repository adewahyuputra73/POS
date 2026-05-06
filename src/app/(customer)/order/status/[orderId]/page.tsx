import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
    ArrowLeft, RefreshCw, CheckCircle2, Clock,
    ChefHat, XCircle, ShoppingBag, FileText,
} from "lucide-react";
import { pubOrderService } from "@/features/customer-order/services/pub-services";

// ── Status resolution ─────────────────────────────────────────────────────────
type DisplayStep = "PROCESSING" | "READY" | "CANCELLED";

function resolveStep(fulfillmentStatus: string | undefined | null): DisplayStep {
    if (!fulfillmentStatus) return "PROCESSING";
    const s = fulfillmentStatus.toUpperCase();
    if (s === "CANCELLED") return "CANCELLED";
    if (s === "READY" || s === "DELIVERED" || s === "COMPLETED") return "READY";
    return "PROCESSING";
}

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS: { key: DisplayStep; label: string; icon: React.ElementType; color: string; bg: string }[] = [
    { key: "PROCESSING", label: "Dimasak", icon: ChefHat,      color: "#D97706", bg: "#FEF3C7" },
    { key: "READY",      label: "Siap Ambil", icon: ShoppingBag, color: "#059669", bg: "#D1FAE5" },
];

function StepIndicator({ currentStep }: { currentStep: DisplayStep }) {
    const currentIdx = STEPS.findIndex((s) => s.key === currentStep);
    return (
        <div className="flex items-center w-full mb-10">
            {STEPS.map((step, idx) => {
                const done = currentIdx >= idx;
                const active = currentIdx === idx;
                const Icon = step.icon;
                return (
                    <div key={step.key} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-2">
                            <div
                                className="h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500"
                                style={{
                                    backgroundColor: done ? step.bg : "rgba(124,74,30,0.06)",
                                    border: `2px solid ${active ? step.color : "transparent"}`,
                                    transform: active ? "scale(1.12)" : "scale(1)",
                                    boxShadow: active ? `0 4px 16px ${step.color}40` : "none",
                                }}
                            >
                                <Icon
                                    className={`h-6 w-6 transition-all duration-500 ${active && step.key === "PROCESSING" ? "animate-bounce" : ""}`}
                                    style={{ color: done ? step.color : "#C4A882" }}
                                />
                            </div>
                            <span
                                className="text-[11px] font-black uppercase tracking-wider text-center leading-tight"
                                style={{ color: done ? step.color : "#C4A882" }}
                            >
                                {step.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div
                                className="h-0.5 flex-1 mx-3 rounded-full transition-all duration-700"
                                style={{ backgroundColor: currentIdx > idx ? "#F59E0B" : "rgba(124,74,30,0.12)" }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Hero illustration ─────────────────────────────────────────────────────────
function StatusHero({ step }: { step: DisplayStep }) {
    if (step === "CANCELLED") {
        return (
            <div className="flex flex-col items-center mb-10">
                <div
                    className="h-32 w-32 rounded-[2.5rem] flex items-center justify-center mb-6"
                    style={{ backgroundColor: "#FEE2E2", boxShadow: "0 12px 40px rgba(220,38,38,0.15)" }}
                >
                    <XCircle className="h-16 w-16" style={{ color: "#DC2626" }} strokeWidth={1.5} />
                </div>
                <h2
                    className="text-3xl font-black tracking-tight mb-2 font-[family-name:var(--font-fraunces)]"
                    style={{ color: "#1C0A00" }}
                >
                    Pesanan Dibatalkan
                </h2>
                <p className="text-sm font-medium text-center leading-relaxed px-4" style={{ color: "#9C7D58" }}>
                    Maaf, pesananmu telah dibatalkan. Hubungi toko jika ada pertanyaan.
                </p>
            </div>
        );
    }

    if (step === "READY") {
        return (
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <div
                        className="absolute inset-0 rounded-full scale-[2] opacity-15 animate-ping"
                        style={{ backgroundColor: "#F59E0B" }}
                    />
                    <div
                        className="absolute inset-0 rounded-full scale-[1.5] opacity-20 animate-pulse"
                        style={{ backgroundColor: "#F59E0B" }}
                    />
                    <div
                        className="h-32 w-32 rounded-[2.5rem] flex items-center justify-center relative"
                        style={{
                            backgroundColor: "#F59E0B",
                            boxShadow: "0 16px 48px rgba(245,158,11,0.45)",
                            transform: "rotate(-6deg)",
                        }}
                    >
                        <ShoppingBag className="h-16 w-16 text-white" strokeWidth={1.5} />
                    </div>
                </div>
                <h2
                    className="text-3xl font-black tracking-tight mb-2 font-[family-name:var(--font-fraunces)]"
                    style={{ color: "#1C0A00" }}
                >
                    Siap Dijemput!
                </h2>
                <p className="text-sm font-medium text-center leading-relaxed px-4" style={{ color: "#9C7D58" }}>
                    Pesananmu sudah siap. Segera ambil di kasir ya!
                </p>
            </div>
        );
    }

    // PROCESSING
    return (
        <div className="flex flex-col items-center mb-10">
            <div
                className="h-32 w-32 rounded-[2.5rem] flex items-center justify-center mb-6"
                style={{
                    backgroundColor: "#FEF3C7",
                    boxShadow: "0 12px 40px rgba(245,158,11,0.18)",
                }}
            >
                <ChefHat className="h-16 w-16 animate-bounce" style={{ color: "#D97706" }} strokeWidth={1.5} />
            </div>
            <h2
                className="text-3xl font-black tracking-tight mb-2 font-[family-name:var(--font-fraunces)]"
                style={{ color: "#1C0A00" }}
            >
                Sedang Dimasak
            </h2>
            <p className="text-sm font-medium text-center leading-relaxed px-4" style={{ color: "#9C7D58" }}>
                Dapur sedang menyiapkan pesananmu dengan penuh kasih. Mohon tunggu!
            </p>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 15_000;

export default function OrderStatusPage() {
    const params = useParams();
    const orderId = params.orderId as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const currentStep = resolveStep(order?.fulfillment_status);
    const isFinal = currentStep === "READY" || currentStep === "CANCELLED";

    const fetchOrder = useCallback(async (showSpinner = true) => {
        try {
            if (showSpinner) setLoading(true);
            else setRefreshing(true);
            setError(null);

            const data = await pubOrderService.detail(orderId);
            setOrder(data);
            setLastUpdated(new Date());
        } catch (err: any) {
            setError(err?.response?.data?.error ?? err?.message ?? "Gagal memuat status pesanan");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [orderId]);

    // Initial load
    useEffect(() => { fetchOrder(true); }, [fetchOrder]);

    // Polling — berhenti saat status final
    useEffect(() => {
        if (isFinal) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
        intervalRef.current = setInterval(() => fetchOrder(false), POLL_INTERVAL_MS);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFinal]);

    const orderNumber = order?.order_number ?? orderId;

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FEFAF5" }}>
                <div className="flex flex-col items-center gap-4">
                    <div
                        className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse"
                        style={{ backgroundColor: "#FEF3C7" }}
                    >
                        <ChefHat className="h-7 w-7" style={{ color: "#D97706" }} />
                    </div>
                    <p className="text-sm font-black" style={{ color: "#9C7D58" }}>
                        Memuat status pesanan...
                    </p>
                </div>
            </div>
        );
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error && !order) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#FEFAF5" }}>
                <div className="text-center max-w-xs">
                    <div
                        className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: "#FEE2E2" }}
                    >
                        <XCircle className="h-8 w-8" style={{ color: "#DC2626" }} />
                    </div>
                    <p className="text-base font-black mb-2" style={{ color: "#1C0A00" }}>Gagal Memuat</p>
                    <p className="text-sm font-medium mb-5" style={{ color: "#9C7D58" }}>{error}</p>
                    <button
                        onClick={() => fetchOrder(true)}
                        className="h-11 px-6 rounded-2xl font-black text-sm"
                        style={{ backgroundColor: "#F59E0B", color: "#1C0A00" }}
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    // ── Main UI ──────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen pb-10" style={{ backgroundColor: "#FEFAF5" }}>
            <div className="container mx-auto px-4 py-6 max-w-lg">

                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        to="/order"
                        className="h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 transition-all active:scale-90"
                        style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.2)", color: "#6B4C2A" }}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1
                            className="text-xl font-black tracking-tight font-[family-name:var(--font-fraunces)]"
                            style={{ color: "#1C0A00" }}
                        >
                            Status Pesanan
                        </h1>
                        {orderNumber && (
                            <p className="text-xs font-bold mt-0.5" style={{ color: "#9C7D58" }}>
                                #{orderNumber}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fetchOrder(false)}
                        disabled={refreshing || isFinal}
                        className="h-11 w-11 rounded-xl flex items-center justify-center border transition-all active:scale-90 disabled:opacity-40"
                        style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.2)", color: "#D97706" }}
                        aria-label="Refresh status"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {/* Main card */}
                <div
                    className="rounded-[2rem] p-8 mb-6"
                    style={{
                        backgroundColor: "#FFFFFF",
                        border: "1.5px solid rgba(124,74,30,0.1)",
                        boxShadow: "0 4px 24px rgba(28,10,0,0.06)",
                    }}
                >
                    <StatusHero step={currentStep} />

                    {currentStep !== "CANCELLED" && (
                        <StepIndicator currentStep={currentStep} />
                    )}

                    {/* Auto-refresh note / final timestamp */}
                    {!isFinal && lastUpdated && (
                        <div className="flex items-center justify-center gap-2">
                            <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "#C4A882" }} />
                            <p className="text-[11px] font-medium" style={{ color: "#C4A882" }}>
                                Diperbarui {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                                {" · "}otomatis setiap 15 detik
                            </p>
                        </div>
                    )}
                    {currentStep === "READY" && lastUpdated && (
                        <div className="flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: "#059669" }} />
                            <p className="text-[11px] font-black" style={{ color: "#059669" }}>
                                Siap sejak {lastUpdated.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                    <Link
                        to={`/invoice/${orderId}`}
                        className="inline-flex items-center justify-center gap-3 font-semibold transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-14 text-base border-2"
                        style={{ borderColor: "rgba(245,158,11,0.4)", color: "#D97706", backgroundColor: "#FFFBEB" }}
                    >
                        <FileText className="h-5 w-5" />
                        Lihat Invoice
                    </Link>

                    <Link
                        to="/order"
                        className="inline-flex items-center justify-center gap-3 font-semibold transition-all duration-200 rounded-2xl active:scale-[0.98] w-full h-14 text-base"
                        style={{ backgroundColor: "#1C0A00", color: "#FFFFFF", boxShadow: "0 6px 20px rgba(28,10,0,0.25)" }}
                    >
                        Kembali ke Menu
                    </Link>
                </div>

            </div>
        </div>
    );
}
