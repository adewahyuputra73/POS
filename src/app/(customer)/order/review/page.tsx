"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { orderService } from "@/features/orders/services/order-service";
import { customerService } from "@/features/customers/services/customer-service";

type PageState = "loading" | "no_account" | "form" | "submitted" | "error";

function ReviewContent() {
    const searchParams = useSearchParams();
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

        orderService.detail(orderId)
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
            await customerService.createReview(customerId, {
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
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin" style={{ color: "#D97706" }} />
                <p className="text-sm font-medium" style={{ color: "rgba(28,10,0,0.5)" }}>Memeriksa status pesanan...</p>
            </div>
        );
    }

    if (pageState === "no_account") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-6">
                <div className="h-24 w-24 rounded-3xl flex items-center justify-center" style={{ backgroundColor: "#FEF3C7" }}>
                    <Star className="h-12 w-12" style={{ color: "#D97706" }} />
                </div>
                <div>
                    <h2 className="text-2xl font-black mb-2" style={{ color: "#1C0A00" }}>Ulasan Tidak Tersedia</h2>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(28,10,0,0.5)" }}>
                        Pesanan ini tidak terhubung ke akun pelanggan. Ulasan hanya bisa diberikan jika nomor HP terdaftar.
                    </p>
                </div>
                <Link
                    href="/order"
                    className="px-8 py-3 rounded-2xl text-sm font-bold text-white"
                    style={{ backgroundColor: "#D97706" }}
                >
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    if (pageState === "submitted") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-6">
                <div className="h-24 w-24 rounded-3xl flex items-center justify-center" style={{ backgroundColor: "#D1FAE5" }}>
                    <CheckCircle2 className="h-12 w-12" style={{ color: "#10B981" }} />
                </div>
                <div>
                    <h2 className="text-2xl font-black mb-2" style={{ color: "#1C0A00" }}>Terima Kasih!</h2>
                    <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(28,10,0,0.5)" }}>
                        Ulasan Anda telah berhasil dikirim. Feedback Anda sangat berarti bagi kami.
                    </p>
                </div>
                <Link
                    href="/order"
                    className="px-8 py-3 rounded-2xl text-sm font-bold text-white"
                    style={{ backgroundColor: "#D97706" }}
                >
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    if (pageState === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 gap-6">
                <p className="text-sm" style={{ color: "rgba(28,10,0,0.5)" }}>Pesanan tidak ditemukan.</p>
                <Link href="/order" className="px-8 py-3 rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: "#D97706" }}>
                    Kembali ke Menu
                </Link>
            </div>
        );
    }

    // "form" state
    return (
        <div className="container mx-auto px-4 pt-12 pb-24 max-w-lg">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: "#1C0A00" }}>
                    Bagaimana Pesanannya?
                </h1>
                {customerName && (
                    <p className="text-sm font-medium" style={{ color: "rgba(28,10,0,0.5)" }}>
                        Halo <span style={{ color: "#1C0A00", fontWeight: 700 }}>{customerName}</span>, ceritakan pengalaman Anda
                    </p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Star Rating */}
                <div className="bg-white rounded-3xl border p-8 text-center" style={{ borderColor: "rgba(124,74,30,0.15)" }}>
                    <p className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: "rgba(28,10,0,0.4)" }}>
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
                                        color: star <= (hoverRating || rating) ? "#F59E0B" : "rgba(28,10,0,0.15)",
                                        fill: star <= (hoverRating || rating) ? "#F59E0B" : "transparent",
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="mt-4 text-sm font-bold" style={{ color: "#D97706" }}>
                            {["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus"][rating]}
                        </p>
                    )}
                </div>

                {/* Comment */}
                <div className="bg-white rounded-3xl border p-6" style={{ borderColor: "rgba(124,74,30,0.15)" }}>
                    <label className="block text-xs font-black uppercase tracking-widest mb-3" style={{ color: "rgba(28,10,0,0.4)" }}>
                        Komentar (opsional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Ceritakan pengalaman Anda..."
                        rows={4}
                        className="w-full resize-none rounded-xl border p-3 text-sm outline-none transition-colors"
                        style={{
                            backgroundColor: "#FFF8EE",
                            borderColor: "rgba(124,74,30,0.18)",
                            color: "#1C0A00",
                        }}
                        onFocus={(e) => e.target.style.borderColor = "#D97706"}
                        onBlur={(e) => e.target.style.borderColor = "rgba(124,74,30,0.18)"}
                    />
                </div>

                {errorMsg && (
                    <p className="text-center text-sm font-medium text-red-500">{errorMsg}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0}
                    className="w-full h-16 rounded-2xl text-lg font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#1C0A00" }}
                >
                    {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
            </form>
        </div>
    );
}

export default function ReviewPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#D97706" }} />
            </div>
        }>
            <ReviewContent />
        </Suspense>
    );
}
