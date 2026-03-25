"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MapPin, ShoppingBag, ClipboardList, ReceiptText, Send } from "lucide-react";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { formatCurrency } from "@/lib/utils/format";
import { mockTaxSettings } from "@/features/store-settings/mock-data";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { orderService } from "@/features/orders/services/order-service";
import { tableService } from "@/features/tables/services/table-service";
import type { Table } from "@/features/tables/types";
import type { PaymentMethod } from "@/features/orders/types";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, getTax, getServiceFee, getTotal, clearCart } = useCustomerCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tables, setTables] = useState<Table[]>([]);

    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        fulfillmentType: "dine_in" as "dine_in" | "takeaway",
        tableId: "",
        notes: "",
        paymentMethod: "CASH" as PaymentMethod,
    });

    useEffect(() => {
        tableService.list().then(setTables).catch(() => {});
    }, []);

    const subtotal = getSubtotal();
    const tax = getTax(mockTaxSettings.tax_rate);
    const serviceFee = getServiceFee(mockTaxSettings.service_charge_rate);
    const total = getTotal(mockTaxSettings.tax_rate, mockTaxSettings.service_charge_rate);

    if (items.length === 0) {
        if (typeof window !== "undefined") router.push("/order");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const order = await orderService.checkout({
                order_type: formData.fulfillmentType === "dine_in" ? "DINE_IN" : "TAKEAWAY",
                table_id: formData.fulfillmentType === "dine_in" && formData.tableId ? formData.tableId : undefined,
                items: items.map((item) => ({
                    product_id: item.product.id,
                    qty: item.quantity,
                    notes: item.notes || undefined,
                })),
                payment_method: formData.paymentMethod,
            });
            clearCart();
            const params = new URLSearchParams({
                orderNumber: order.id ?? `ORD-${Date.now()}`,
                name: formData.customerName,
            });
            router.push(`/order/confirmation?${params.toString()}`);
        } catch {
            setIsSubmitting(false);
        }
    };

    // Shared input style helpers
    const inputBaseStyle = {
        backgroundColor: '#FFF8EE',
        borderColor: 'rgba(124,74,30,0.18)',
        color: '#1C0A00',
    };
    const onInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = '#F59E0B';
    };
    const onInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.currentTarget.style.borderColor = 'rgba(124,74,30,0.18)';
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="min-h-screen pb-36 lg:pb-12"
            style={{ backgroundColor: '#FEFAF5' }}
        >
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/order/cart"
                        className="h-11 w-11 rounded-xl flex items-center justify-center transition-all active:scale-90 border shrink-0"
                        style={{ backgroundColor: '#FFF8EE', borderColor: 'rgba(124,74,30,0.2)', color: '#6B4C2A' }}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-fraunces)]"
                            style={{ color: '#1C0A00' }}
                        >
                            Konfirmasi Pesanan
                        </h1>
                        <p className="text-sm font-medium mt-0.5" style={{ color: '#9C7D58' }}>
                            {items.length} menu · {formatCurrency(total)}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    {/* ── Left: Form fields ── */}
                    <div className="lg:col-span-7 space-y-5">

                        {/* Section 1 — Customer Info */}
                        <div
                            className="rounded-[22px] p-6"
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid rgba(124,74,30,0.1)',
                                boxShadow: '0 2px 12px rgba(28,10,0,0.04)',
                            }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#FEF3C7' }}
                                >
                                    <User className="h-4 w-4" style={{ color: '#D97706' }} />
                                </div>
                                <h2 className="text-[15px] font-black tracking-tight" style={{ color: '#1C0A00' }}>
                                    Informasi Pelanggan
                                </h2>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#9C7D58' }}>
                                        Nama Lengkap
                                    </label>
                                    <Input
                                        required
                                        placeholder="Masukkan nama Anda"
                                        className="h-12 rounded-2xl text-sm font-medium border-2 transition-colors"
                                        style={inputBaseStyle}
                                        onFocus={onInputFocus}
                                        onBlur={onInputBlur}
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#9C7D58' }}>
                                        Nomor WhatsApp
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                                            <span className="text-sm font-black" style={{ color: '#9C7D58' }}>+62</span>
                                        </div>
                                        <Input
                                            required
                                            type="tel"
                                            placeholder="812-3456-7890"
                                            className="pl-14 h-12 rounded-2xl text-sm font-medium border-2 transition-colors"
                                            style={inputBaseStyle}
                                            onFocus={onInputFocus}
                                            onBlur={onInputBlur}
                                            value={formData.customerPhone}
                                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 — Fulfillment */}
                        <div
                            className="rounded-[22px] p-6"
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid rgba(124,74,30,0.1)',
                                boxShadow: '0 2px 12px rgba(28,10,0,0.04)',
                            }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#FEF3C7' }}
                                >
                                    <MapPin className="h-4 w-4" style={{ color: '#D97706' }} />
                                </div>
                                <h2 className="text-[15px] font-black tracking-tight" style={{ color: '#1C0A00' }}>
                                    Metode Pemesanan
                                </h2>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {/* Dine In */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, fulfillmentType: 'dine_in' })}
                                    className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97]"
                                    style={
                                        formData.fulfillmentType === 'dine_in'
                                            ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
                                            : { backgroundColor: '#FEFAF5', borderColor: 'rgba(124,74,30,0.14)' }
                                    }
                                >
                                    <div
                                        className="h-11 w-11 rounded-2xl flex items-center justify-center transition-colors"
                                        style={
                                            formData.fulfillmentType === 'dine_in'
                                                ? { backgroundColor: '#F59E0B', color: '#1C0A00' }
                                                : { backgroundColor: 'rgba(124,74,30,0.07)', color: '#9C7D58' }
                                        }
                                    >
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <span
                                        className="text-[13px] font-black"
                                        style={{ color: formData.fulfillmentType === 'dine_in' ? '#92400E' : '#6B4C2A' }}
                                    >
                                        Makan di Tempat
                                    </span>
                                </button>

                                {/* Takeaway */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, fulfillmentType: 'takeaway' })}
                                    className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border-2 transition-all duration-200 active:scale-[0.97]"
                                    style={
                                        formData.fulfillmentType === 'takeaway'
                                            ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
                                            : { backgroundColor: '#FEFAF5', borderColor: 'rgba(124,74,30,0.14)' }
                                    }
                                >
                                    <div
                                        className="h-11 w-11 rounded-2xl flex items-center justify-center transition-colors"
                                        style={
                                            formData.fulfillmentType === 'takeaway'
                                                ? { backgroundColor: '#F59E0B', color: '#1C0A00' }
                                                : { backgroundColor: 'rgba(124,74,30,0.07)', color: '#9C7D58' }
                                        }
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                    </div>
                                    <span
                                        className="text-[13px] font-black"
                                        style={{ color: formData.fulfillmentType === 'takeaway' ? '#92400E' : '#6B4C2A' }}
                                    >
                                        Bawa Pulang
                                    </span>
                                </button>
                            </div>

                            {/* Table selector (conditional) */}
                            {formData.fulfillmentType === 'dine_in' && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="text-[11px] font-black uppercase tracking-widest" style={{ color: '#9C7D58' }}>
                                        Pilih Meja
                                    </label>
                                    <select
                                        required
                                        value={formData.tableId}
                                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                                        className="w-full h-12 rounded-2xl text-sm font-semibold border-2 px-5 focus:outline-none transition-colors"
                                        style={inputBaseStyle}
                                    >
                                        <option value="">-- Pilih meja --</option>
                                        {tables.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}{t.area?.name ? ` · ${t.area.name}` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Section 3 — Payment Method */}
                        <div
                            className="rounded-[22px] p-6"
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid rgba(124,74,30,0.1)',
                                boxShadow: '0 2px 12px rgba(28,10,0,0.04)',
                            }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#FEF3C7' }}>
                                    <ReceiptText className="h-4 w-4" style={{ color: '#D97706' }} />
                                </div>
                                <h2 className="text-[15px] font-black tracking-tight" style={{ color: '#1C0A00' }}>
                                    Metode Pembayaran
                                </h2>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {([
                                    { value: "CASH", label: "Tunai" },
                                    { value: "TRANSFER", label: "Transfer" },
                                    { value: "QRIS", label: "QRIS" },
                                ] as { value: PaymentMethod; label: string }[]).map((m) => (
                                    <button
                                        key={m.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, paymentMethod: m.value })}
                                        className="py-3 rounded-2xl border-2 text-[13px] font-black transition-all"
                                        style={
                                            formData.paymentMethod === m.value
                                                ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E' }
                                                : { backgroundColor: '#FEFAF5', borderColor: 'rgba(124,74,30,0.14)', color: '#6B4C2A' }
                                        }
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 4 — Notes */}
                        <div
                            className="rounded-[22px] p-6"
                            style={{
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid rgba(124,74,30,0.1)',
                                boxShadow: '0 2px 12px rgba(28,10,0,0.04)',
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: '#FEF3C7' }}
                                >
                                    <ClipboardList className="h-4 w-4" style={{ color: '#D97706' }} />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-black tracking-tight" style={{ color: '#1C0A00' }}>
                                        Catatan Tambahan
                                    </h2>
                                    <p className="text-[11px] font-medium" style={{ color: '#9C7D58' }}>Opsional</p>
                                </div>
                            </div>
                            <textarea
                                placeholder="Pesan khusus untuk seluruh pesanan..."
                                rows={3}
                                className="w-full rounded-2xl p-4 text-sm resize-none outline-none border-2 transition-colors font-medium"
                                style={inputBaseStyle}
                                onFocus={onInputFocus}
                                onBlur={onInputBlur}
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* ── Right: Order Summary (desktop) ── */}
                    <div className="hidden lg:block lg:col-span-5">
                        <div
                            className="sticky top-24 rounded-[24px] p-7"
                            style={{ backgroundColor: '#1C0A00', border: '1px solid rgba(245,158,11,0.15)' }}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center gap-3 mb-6 pb-5"
                                style={{ borderBottom: '1px solid rgba(245,158,11,0.12)' }}
                            >
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(245,158,11,0.1)' }}
                                >
                                    <ReceiptText className="h-4 w-4" style={{ color: '#F59E0B' }} />
                                </div>
                                <h2
                                    className="text-base font-black tracking-tight font-[family-name:var(--font-fraunces)]"
                                    style={{ color: 'rgba(255,255,255,0.9)' }}
                                >
                                    Ringkasan Pesanan
                                </h2>
                            </div>

                            {/* Item list */}
                            <div className="space-y-3 mb-5">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>
                                                {item.quantity}× {item.product.name}
                                            </p>
                                            {item.selectedVariants.length > 0 && (
                                                <p className="text-[11px] font-medium truncate mt-0.5 italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
                                                    {item.selectedVariants.map(v => v.optionName).join(", ")}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm font-black shrink-0 tabular-nums" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                            {formatCurrency(item.subtotal)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price breakdown */}
                            <div
                                className="space-y-3 pt-5 mb-6"
                                style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Subtotal</span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.75)' }}>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        {mockTaxSettings.tax_name} ({mockTaxSettings.tax_rate}%)
                                    </span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.75)' }}>{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        Layanan ({mockTaxSettings.service_charge_rate}%)
                                    </span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.75)' }}>{formatCurrency(serviceFee)}</span>
                                </div>

                                {/* Total */}
                                <div className="pt-4" style={{ borderTop: '1px dashed rgba(245,158,11,0.2)' }}>
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Total Akhir</span>
                                        <span className="text-2xl font-black tracking-tight tabular-nums" style={{ color: '#F59E0B' }}>
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit — desktop */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-55"
                                style={{ backgroundColor: '#F59E0B', color: '#1C0A00', boxShadow: '0 8px 24px rgba(245,158,11,0.28)' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 rounded-full border-2 border-[#1C0A00]/40 border-t-[#1C0A00] animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        Pesan Sekarang
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>

                            {/* Pay at cashier note */}
                            <div
                                className="mt-4 flex items-center justify-center gap-2.5 py-3 rounded-xl"
                                style={{ backgroundColor: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.12)' }}
                            >
                                <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: 'rgba(245,158,11,0.65)' }}>
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
                    backgroundColor: '#1C0A00',
                    borderTop: '1px solid rgba(245,158,11,0.15)',
                    paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
                }}
            >
                <div className="flex items-center gap-4 max-w-lg mx-auto">
                    <div className="flex flex-col shrink-0">
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.18em] mb-0.5"
                            style={{ color: 'rgba(245,158,11,0.5)' }}
                        >
                            Total
                        </span>
                        <span className="text-lg font-black tabular-nums leading-none" style={{ color: '#F59E0B' }}>
                            {formatCurrency(total)}
                        </span>
                    </div>

                    <div className="h-8 w-px shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }} />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-55"
                        style={{ backgroundColor: '#F59E0B', color: '#1C0A00' }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-3.5 w-3.5 rounded-full border-2 border-[#1C0A00]/40 border-t-[#1C0A00] animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Pesan Sekarang
                                <Send className="h-3.5 w-3.5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
