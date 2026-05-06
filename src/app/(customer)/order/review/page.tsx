import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { pubOrderService, pubCustomerService } from "@/features/customer-order/services/pub-services";

type PageState = "loading" | "no_account" | "form" | "submitted" | "error";

function ReviewContent() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("order_id") ?? "";

    const [pageState, setPageState] = useState<PageState>("loading");
    const [customerId, setCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!orderId) { setPageState("error"); return; }

        pubOrderService.detail(orderId)
            .then((order: any) => {
                const cid = order.customer_id ?? null;

                if (!cid) {
                    setPageState("no_account");
                    return;
                }
                setCustomerId(cid);
                setCustomerName(order.customer?.name ?? "");
                setPageState("form");
            })
            .catch(() => setPageState("error"));
    }, [orderId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) { setErrorMsg("Pilih rating terlebih dahulu"); return; }
        setIsSubmitting(true);
        setErrorMsg("");
        try {
            await pubCustomerService.createReview(customerId, {
                rating,
                comment,
                order_id: orderId,
            });
            setPageState("submitted");
        } catch {
            setErrorMsg("Gagal mengirim ulasan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (pageState === "loading") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#0A0E1F" }}>
                <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: "#0E6B30" }}
                >
                    <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#16A34A" }} />
                </div>
                <p className="text-sm font-black" style={{ color: "#9CA3B5" }}>Memeriksa status pesanan...</p>
            </div>
        );
    }

    if (pageState === "no_account") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6" style={{ backgroundColor: "#0A0E1F" }}>
                <div
                    className="h-32 w-32 rounded-[2.5rem] flex items-center justify-center"
                    style={{ backgroundColor: "#0E6B30", boxShadow: "0 12px 40px rgba(34,213,92,0.20)" }}
                >
                    <Star className="h-16 w-16" style={{ color: "#16A34A" }} strokeWidth={1.5} />
                </div>
                <div>
                    <h2
                        className="text-3xl font-black tracking-tight mb-2 font-[family-name:var(--font-fraunces)]"
                        style={{ color: "#F8FAFC" }}
                    >
                        Ulasan Tidak Tersedia
                    </h2>
                    <p className="text-sm font-medium leading-relaxed max-w-xs" style={{ color: "#9CA3B5" }}>
                        Pesanan ini tidak terhubung ke akun pelanggan. Ulasan hanya bisa diberikan jika nomor HP terdaftar.
                    </p>
                </div>
                <Link
                    to="/order"
                    className="inline-flex items-center justify-center gap-3 font-semibold rounded-2xl h-14 px-8 text-base transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#F8FAFC", color: "#13182B", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
                >
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    if (pageState === "submitted") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6" style={{ backgroundColor: "#0A0E1F" }}>
                <div className="relative">
                    <div
                        className="absolute inset-0 rounded-full scale-[1.5] opacity-20 animate-pulse"
                        style={{ backgroundColor: "#22D55C" }}
                    />
                    <div
                        className="h-32 w-32 rounded-[2.5rem] flex items-center justify-center relative"
                        style={{
                            backgroundColor: "#22D55C",
                            boxShadow: "0 16px 48px rgba(34,213,92,0.4)",
                            transform: "rotate(-6deg)",
                        }}
                    >
                        <CheckCircle2 className="h-16 w-16" style={{ color: "#F8FAFC" }} strokeWidth={1.5} />
                    </div>
                </div>
                <div>
                    <h2
                        className="text-3xl font-black tracking-tight mb-2 font-[family-name:var(--font-fraunces)]"
                        style={{ color: "#F8FAFC" }}
                    >
                        Terima Kasih!
                    </h2>
                    <p className="text-sm font-medium leading-relaxed max-w-xs" style={{ color: "#9CA3B5" }}>
                        Ulasan Anda telah berhasil dikirim. Feedback Anda sangat berarti bagi kami.
                    </p>
                </div>
                <Link
                    to="/order"
                    className="inline-flex items-center justify-center gap-3 font-semibold rounded-2xl h-14 px-8 text-base transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#F8FAFC", color: "#13182B", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
                >
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    if (pageState === "error") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 gap-6" style={{ backgroundColor: "#0A0E1F" }}>
                <p className="text-sm font-medium" style={{ color: "#9CA3B5" }}>Pesanan tidak ditemukan.</p>
                <Link
                    to="/order"
                    className="inline-flex items-center justify-center gap-3 font-semibold rounded-2xl h-14 px-8 text-base transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#F8FAFC", color: "#13182B", boxShadow: "0 6px 20px rgba(0,0,0,0.25)" }}
                >
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    // "form" state
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#0A0E1F" }}>
            <div className="container mx-auto px-4 pt-12 pb-24 max-w-lg">
                <div className="text-center mb-10">
                    <h1
                        className="text-3xl font-black tracking-tight mb-2 font-[family-name:var(--font-fraunces)]"
                        style={{ color: "#F8FAFC" }}
                    >
                        Bagaimana Pesanannya?
                    </h1>
                    {customerName && (
                        <p className="text-sm font-medium" style={{ color: "#9CA3B5" }}>
                            Halo <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{customerName}</span>, ceritakan pengalaman Anda
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Star Rating */}
                    <div
                        className="rounded-[2rem] p-8 text-center"
                        style={{
                            backgroundColor: "#13182B",
                            border: "1.5px solid rgba(124,74,30,0.1)",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                        }}
                    >
                        <p className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: "#606988" }}>
                            Beri Rating
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className="h-12 w-12 transition-colors"
                                        style={{
                                            color: star <= (hoverRating || rating) ? "#22D55C" : "rgba(34,213,92,0.22)",
                                            fill: star <= (hoverRating || rating) ? "#22D55C" : "transparent",
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="mt-4 text-sm font-black" style={{ color: "#16A34A" }}>
                                {["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"][rating]}
                            </p>
                        )}
                    </div>

                    {/* Comment */}
                    <div
                        className="rounded-[2rem] p-6"
                        style={{
                            backgroundColor: "#13182B",
                            border: "1.5px solid rgba(124,74,30,0.1)",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                        }}
                    >
                        <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: "#606988" }}>
                            Komentar (opsional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Ceritakan pengalaman Anda..."
                            rows={4}
                            className="w-full resize-none rounded-xl border p-3 text-sm outline-none transition-colors"
                            style={{
                                backgroundColor: "#13182B",
                                borderColor: "rgba(34,213,92,0.22)",
                                color: "#F8FAFC",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#16A34A"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(34,213,92,0.22)"}
                        />
                    </div>

                    {errorMsg && (
                        <p className="text-center text-sm font-medium" style={{ color: "#DC2626" }}>{errorMsg}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0}
                        className="w-full h-14 rounded-2xl text-base font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: "#F8FAFC",
                            color: "#13182B",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                        }}
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0A0E1F" }}>
                <div
                    className="h-14 w-14 rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: "#0E6B30" }}
                >
                    <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#16A34A" }} />
                </div>
            </div>
        }>
            <ReviewContent />
        </Suspense>
    );
}
