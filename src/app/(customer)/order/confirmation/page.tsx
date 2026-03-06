"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Ticket, Printer, Share2, Home, CreditCard, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("orderNumber") || "ORD-0000";
    const customerName = searchParams.get("name") || "Pelanggan";

    return (
        <div className="container mx-auto px-4 pt-16 pb-32 max-w-xl text-center">
            {/* Success Animation Area */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-primary/20 scale-150 blur-3xl rounded-full opacity-30 animate-pulse" />
                <div className="relative h-32 w-32 rounded-[2.5rem] bg-emerald-500 shadow-2xl shadow-emerald-500/40 flex items-center justify-center mx-auto transform rotate-12 transition-transform hover:rotate-0 duration-500">
                    <CheckCircle2 className="h-16 w-16 text-white stroke-[3px]" />
                </div>
            </div>

            <h1 className="text-4xl font-black text-text-primary mb-4 tracking-tighter">
                Pesanan Diterima!
            </h1>
            <p className="text-text-secondary leading-relaxed mb-10 font-medium px-4">
                Terima kasih <span className="text-text-primary font-black">{customerName}</span>, pesanan Anda sedang kami proses. Silakan tunjukkan nomor pesanan ini ke kasir.
            </p>

            {/* Order Ticket Card */}
            <div className="bg-white rounded-[2.5rem] border border-divider shadow-card p-10 mb-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Ticket className="h-40 w-40 -rotate-12" />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-text-disabled mb-2">
                    Nomor Antrean / Pesanan
                </p>
                <div className="text-5xl font-black text-primary tracking-tight mb-8">
                    #{orderNumber}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-divider pt-8">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Printer className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Simpan PDF</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Share2 className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Bagikan</span>
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <Link
                    href="/order"
                    className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-2xl active:scale-[0.98] w-full h-16 text-lg bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/25"
                >
                    <Home className="mr-3 h-5 w-5" />
                    Kembali ke Beranda
                </Link>
                <p className="text-xs text-text-disabled font-bold uppercase tracking-widest pt-4">
                    Butuh bantuan? <a href="#" className="text-primary hover:underline">Hubungi Toko</a>
                </p>
            </div>

            {/* Cross-sell or Info? */}
            <div className="mt-16 bg-slate-100/50 rounded-3xl p-6 border border-divider text-left flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                    <CreditCard className="h-6 w-6 text-text-secondary" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-text-primary mb-1">Bayar di Tempat</h3>
                    <p className="text-[11px] text-text-secondary font-medium leading-relaxed">
                        Tunjukkan nomor pesanan di atas ke meja kasir untuk melakukan pembayaran dan mengambil pesanan.
                    </p>
                </div>
                <ChevronRight className="h-5 w-5 text-text-disabled mt-3 ml-auto" />
            </div>
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
