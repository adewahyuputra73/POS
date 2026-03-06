"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, ReceiptText, ArrowRight } from "lucide-react";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { CartItemCard } from "@/features/customer-order";
import { formatCurrency } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { mockTaxSettings } from "@/features/store-settings/mock-data";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getSubtotal, getTax, getServiceFee, getTotal } = useCustomerCartStore();

    const subtotal = getSubtotal();
    const tax = getTax(mockTaxSettings.tax_rate);
    const serviceFee = getServiceFee(mockTaxSettings.service_charge_rate);
    const total = getTotal(mockTaxSettings.tax_rate, mockTaxSettings.service_charge_rate);

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 pt-20 pb-40 max-w-xl text-center">
                <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <ShoppingBag className="h-10 w-10 text-text-disabled" />
                </div>
                <h1 className="text-3xl font-black text-text-primary mb-4 tracking-tight">Keranjang Kosong</h1>
                <p className="text-text-secondary leading-relaxed mb-10 font-medium">
                    Sepertinya Anda belum menambahkan menu apa pun ke keranjang. Mari jelajahi menu lezat kami!
                </p>
                <Link href="/order" className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-2xl active:scale-[0.98] h-16 px-10 text-lg bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/20 ring-offset-4 ring-primary/20 hover:ring-2">
                    <ArrowLeft className="mr-3 h-5 w-5 stroke-[3px]" />
                    Lihat Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/order" className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98] h-12 w-12 border border-divider p-0 bg-transparent text-text-secondary hover:bg-background hover:text-text-primary focus:ring-primary">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">Keranjang Anda</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Cart Items */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-text-secondary">
                            {items.length} Pesanan Berbeda
                        </span>
                    </div>
                    {items.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeItem}
                        />
                    ))}

                    <Link href="/order" className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-2xl active:scale-[0.98] w-full h-14 border-2 border-primary/20 text-primary font-black hover:bg-primary/5 mt-4">
                        Tambah Menu Lainnya
                    </Link>
                </div>

                {/* Right: Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 bg-surface rounded-[2rem] p-8 border border-divider shadow-card">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-divider">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <ReceiptText className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-black text-text-primary tracking-tight">Ringkasan Pesanan</h2>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center group">
                                <span className="text-text-secondary font-bold transition-colors group-hover:text-text-primary">Subtotal</span>
                                <span className="text-text-primary font-black">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-text-secondary font-bold transition-colors group-hover:text-text-primary">
                                    {mockTaxSettings.tax_name} ({mockTaxSettings.tax_rate}%)
                                </span>
                                <span className="text-text-primary font-black">{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-text-secondary font-bold transition-colors group-hover:text-text-primary">
                                    Biaya Layanan ({mockTaxSettings.service_charge_rate}%)
                                </span>
                                <span className="text-text-primary font-black">{formatCurrency(serviceFee)}</span>
                            </div>

                            <div className="pt-6 mt-2 border-t border-dashed border-divider">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-text-primary font-black text-xl tracking-tight">Total Akhir</span>
                                    <span className="text-3xl font-black text-primary tracking-tight">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                                {mockTaxSettings.is_tax_inclusive && (
                                    <p className="text-[10px] text-text-disabled font-bold text-right uppercase tracking-widest mt-1">
                                        *Harga sudah termasuk Pajak
                                    </p>
                                )}
                            </div>
                        </div>

                        <Link href="/order/checkout" className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-2xl active:scale-[0.98] w-full h-16 text-lg bg-primary text-white hover:bg-primary-dark shadow-xl shadow-primary/25 group">
                            Lanjut ke Checkout
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform stroke-[3px]" />
                        </Link>

                        <p className="mt-6 text-center text-xs text-text-disabled font-medium leading-relaxed">
                            Dengan menekan tombol di atas, Anda setuju dengan Syarat & Ketentuan kami.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
