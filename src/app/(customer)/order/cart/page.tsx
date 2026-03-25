"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, ReceiptText, ArrowRight, Plus } from "lucide-react";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { CartItemCard } from "@/features/customer-order";
import { formatCurrency } from "@/lib/utils/format";
import { mockTaxSettings } from "@/features/store-settings/mock-data";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getSubtotal, getTax, getServiceFee, getTotal } = useCustomerCartStore();

    const subtotal = getSubtotal();
    const tax = getTax(mockTaxSettings.tax_rate);
    const serviceFee = getServiceFee(mockTaxSettings.service_charge_rate);
    const total = getTotal(mockTaxSettings.tax_rate, mockTaxSettings.service_charge_rate);

    if (items.length === 0) {
        return (
            <div
                className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center"
                style={{ backgroundColor: '#FEFAF5' }}
            >
                <div
                    className="h-24 w-24 rounded-3xl flex items-center justify-center mx-auto mb-7"
                    style={{ backgroundColor: '#FEF3C7' }}
                >
                    <ShoppingBag className="h-11 w-11" style={{ color: '#D97706' }} />
                </div>
                <h1
                    className="text-3xl font-black mb-3 tracking-tight font-[family-name:var(--font-fraunces)]"
                    style={{ color: '#1C0A00' }}
                >
                    Keranjang Kosong
                </h1>
                <p className="leading-relaxed mb-10 font-medium max-w-xs text-sm" style={{ color: '#6B4C2A' }}>
                    Sepertinya Anda belum menambahkan menu apa pun. Mari jelajahi menu lezat kami!
                </p>
                <Link
                    href="/order"
                    className="inline-flex items-center gap-3 h-13 px-8 rounded-2xl font-black text-sm transition-all duration-200 active:scale-95"
                    style={{ backgroundColor: '#1C0A00', color: '#F59E0B', boxShadow: '0 8px 32px rgba(28,10,0,0.22)' }}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Lihat Menu
                </Link>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen pb-32 lg:pb-10"
            style={{ backgroundColor: '#FEFAF5' }}
        >
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/order"
                        className="h-11 w-11 rounded-xl flex items-center justify-center transition-all active:scale-90 border"
                        style={{ backgroundColor: '#FFF8EE', borderColor: 'rgba(124,74,30,0.2)', color: '#6B4C2A' }}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1
                            className="text-2xl sm:text-3xl font-black tracking-tight font-[family-name:var(--font-fraunces)]"
                            style={{ color: '#1C0A00' }}
                        >
                            Keranjang Anda
                        </h1>
                        <p className="text-sm font-medium mt-0.5" style={{ color: '#9C7D58' }}>
                            {items.reduce((s, i) => s + i.quantity, 0)} item dipilih
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                    {/* Left: Cart Items */}
                    <div className="lg:col-span-7 space-y-3">
                        {items.map((item, idx) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}

                        {/* Add more items */}
                        <Link
                            href="/order"
                            className="flex items-center justify-center gap-2 w-full h-13 rounded-2xl font-black text-sm transition-all duration-200 border-2 active:scale-[0.98]"
                            style={{ borderColor: 'rgba(245,158,11,0.3)', color: '#92400E', borderStyle: 'dashed' }}
                        >
                            <Plus className="h-4 w-4" />
                            Tambah Menu Lain
                        </Link>
                    </div>

                    {/* Right: Summary (desktop) */}
                    <div className="hidden lg:block lg:col-span-5">
                        <div
                            className="sticky top-24 rounded-[24px] p-7"
                            style={{ backgroundColor: '#1C0A00', border: '1px solid rgba(245,158,11,0.15)' }}
                        >
                            {/* Summary header */}
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

                            {/* Price rows */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>Subtotal</span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.8)' }}>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                        {mockTaxSettings.tax_name} ({mockTaxSettings.tax_rate}%)
                                    </span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.8)' }}>{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                        Biaya Layanan ({mockTaxSettings.service_charge_rate}%)
                                    </span>
                                    <span className="text-sm font-black tabular-nums" style={{ color: 'rgba(255,255,255,0.8)' }}>{formatCurrency(serviceFee)}</span>
                                </div>

                                {/* Total */}
                                <div
                                    className="pt-5 mt-2"
                                    style={{ borderTop: '1px dashed rgba(245,158,11,0.2)' }}
                                >
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="font-black text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Total Akhir</span>
                                        <span className="text-2xl font-black tracking-tight tabular-nums" style={{ color: '#F59E0B' }}>
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                    {mockTaxSettings.is_tax_inclusive && (
                                        <p
                                            className="text-[10px] font-bold text-right uppercase tracking-widest mt-1"
                                            style={{ color: 'rgba(255,255,255,0.2)' }}
                                        >
                                            *Sudah termasuk pajak
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/order/checkout"
                                className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl font-black text-base transition-all duration-200 active:scale-[0.98] group"
                                style={{ backgroundColor: '#F59E0B', color: '#1C0A00', boxShadow: '0 8px 28px rgba(245,158,11,0.28)' }}
                            >
                                Lanjut ke Checkout
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <p
                                className="mt-4 text-center text-[10px] font-medium leading-relaxed"
                                style={{ color: 'rgba(255,255,255,0.18)' }}
                            >
                                Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan kami.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sticky bottom bar */}
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-3 z-50"
                style={{
                    backgroundColor: '#1C0A00',
                    borderTop: '1px solid rgba(245,158,11,0.15)',
                    paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
                }}
            >
                <div className="flex items-center gap-4 max-w-lg mx-auto">
                    {/* Total */}
                    <div className="flex flex-col shrink-0">
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.18em] mb-0.5"
                            style={{ color: 'rgba(245,158,11,0.55)' }}
                        >
                            Total
                        </span>
                        <span
                            className="text-lg font-black tabular-nums leading-none"
                            style={{ color: '#F59E0B' }}
                        >
                            {formatCurrency(total)}
                        </span>
                    </div>

                    {/* Divider */}
                    <div className="h-8 w-px shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }} />

                    {/* Checkout link */}
                    <Link
                        href="/order/checkout"
                        className="flex-1 h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        style={{ backgroundColor: '#F59E0B', color: '#1C0A00' }}
                    >
                        Lanjut ke Checkout
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
