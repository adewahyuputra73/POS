"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Phone, MapPin, ClipboardList, Send, CreditCard, ChevronRight, ShoppingBag } from "lucide-react";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { formatCurrency } from "@/lib/utils/format";
import { mockTaxSettings } from "@/features/store-settings/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, getTax, getServiceFee, getTotal, clearCart } = useCustomerCartStore();

    const [formData, setFormData] = useState({
        customerName: "",
        customerPhone: "",
        fulfillmentType: "dine_in" as "dine_in" | "takeaway",
        tableNumber: "",
        notes: ""
    });

    const subtotal = getSubtotal();
    const tax = getTax(mockTaxSettings.tax_rate);
    const serviceFee = getServiceFee(mockTaxSettings.service_charge_rate);
    const total = getTotal(mockTaxSettings.tax_rate, mockTaxSettings.service_charge_rate);

    if (items.length === 0) {
        if (typeof window !== "undefined") router.push("/order");
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would call an API. 
        // For now, we simulate success and redirect to confirmation.

        // Simulate API call delay
        setTimeout(() => {
            // We'll pass some info via search params for the confirmation page to show
            const params = new URLSearchParams({
                orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
                name: formData.customerName
            });
            clearCart();
            router.push(`/order/confirmation?${params.toString()}`);
        }, 1000);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/order/cart" className="inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl active:scale-[0.98] h-12 w-12 border border-divider p-0 bg-transparent text-text-secondary hover:bg-background">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-3xl font-black text-text-primary tracking-tight">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                    {/* Customer Info Section */}
                    <div className="bg-white rounded-[2rem] p-8 border border-divider shadow-card relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-black text-text-primary tracking-tight">Informasi Pelanggan</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-sm font-bold text-text-secondary">Nama Lengkap</Label>
                                <div className="relative group">
                                    <Input
                                        id="name"
                                        required
                                        placeholder="Masukkan nama Anda"
                                        className="pl-5 h-14 rounded-2xl border-2 border-divider focus:border-primary transition-all text-base font-medium"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="phone" className="text-sm font-bold text-text-secondary">Nomor WhatsApp</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                        <span className="text-text-disabled font-bold text-sm">+62</span>
                                    </div>
                                    <Input
                                        id="phone"
                                        required
                                        type="tel"
                                        placeholder="812-3456-7890"
                                        className="pl-14 h-14 rounded-2xl border-2 border-divider focus:border-primary transition-all text-base font-medium"
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fulfillment Section */}
                    <div className="bg-white rounded-[2rem] p-8 border border-divider shadow-card relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-orange-500" />
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <MapPin className="h-5 w-5 text-orange-500" />
                            </div>
                            <h2 className="text-xl font-black text-text-primary tracking-tight">Metode Pemesanan</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, fulfillmentType: 'dine_in' })}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300",
                                    formData.fulfillmentType === 'dine_in'
                                        ? "border-orange-500 bg-orange-500/5 ring-4 ring-orange-500/10"
                                        : "border-divider bg-white hover:border-orange-200"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                    formData.fulfillmentType === 'dine_in' ? "bg-orange-500 text-white" : "bg-slate-100 text-text-disabled"
                                )}>
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <span className={cn("text-sm font-black", formData.fulfillmentType === 'dine_in' ? "text-orange-600" : "text-text-secondary")}>
                                    Makan di Tempat
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, fulfillmentType: 'takeaway' })}
                                className={cn(
                                    "flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300",
                                    formData.fulfillmentType === 'takeaway'
                                        ? "border-orange-500 bg-orange-500/5 ring-4 ring-orange-500/10"
                                        : "border-divider bg-white hover:border-orange-200"
                                )}
                            >
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                                    formData.fulfillmentType === 'takeaway' ? "bg-orange-500 text-white" : "bg-slate-100 text-text-disabled"
                                )}>
                                    <ShoppingBag className="h-6 w-6" />
                                </div>
                                <span className={cn("text-sm font-black", formData.fulfillmentType === 'takeaway' ? "text-orange-600" : "text-text-secondary")}>
                                    Bawa Pulang
                                </span>
                            </button>
                        </div>

                        {formData.fulfillmentType === 'dine_in' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <Label htmlFor="table" className="text-sm font-bold text-text-secondary">Nomor Meja</Label>
                                <Input
                                    id="table"
                                    required={formData.fulfillmentType === 'dine_in'}
                                    placeholder="Contoh: Meja 04"
                                    className="h-14 rounded-2xl border-2 border-divider focus:border-orange-500 transition-all text-base font-black px-6"
                                    value={formData.tableNumber}
                                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                                />
                            </div>
                        )}
                    </div>

                    {/* Notes Section */}
                    <div className="bg-white rounded-[2rem] p-8 border border-divider shadow-card relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-slate-400" />
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <ClipboardList className="h-5 w-5 text-slate-500" />
                            </div>
                            <h2 className="text-xl font-black text-text-primary tracking-tight">Catatan Tambahan</h2>
                        </div>
                        <textarea
                            placeholder="Pesan khusus untuk seluruh pesanan (opsional)..."
                            className="w-full bg-background border-2 border-divider rounded-2xl p-5 text-base focus:border-primary focus:ring-0 transition-all resize-none h-32 font-medium"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 bg-surface rounded-[2rem] p-8 border border-divider shadow-card">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-divider">
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-black text-text-primary tracking-tight">Ringkasan Biaya</h2>
                        </div>

                        <div className="space-y-4 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between gap-4 group">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-text-primary truncate">{item.quantity}x {item.product.name}</p>
                                        {item.selectedVariants.length > 0 && (
                                            <p className="text-[10px] text-text-disabled font-medium truncate italic">
                                                {item.selectedVariants.map(v => v.optionName).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-sm font-black text-text-secondary shrink-0">{formatCurrency(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-divider pt-6 space-y-4 mb-8">
                            <div className="flex justify-between items-center group">
                                <span className="text-text-secondary font-bold text-sm">Subtotal</span>
                                <span className="text-text-primary font-bold text-sm">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-text-secondary font-bold text-sm">PB1 (10%)</span>
                                <span className="text-text-primary font-bold text-sm">{formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-text-secondary font-bold text-sm">Service (5%)</span>
                                <span className="text-text-primary font-bold text-sm">{formatCurrency(serviceFee)}</span>
                            </div>

                            <div className="pt-6 mt-2 border-t border-dashed border-divider">
                                <div className="flex justify-between items-end">
                                    <span className="text-text-primary font-black text-xl tracking-tight">Total</span>
                                    <span className="text-3xl font-black text-primary tracking-tight">
                                        {formatCurrency(total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 rounded-2xl font-black text-lg bg-primary hover:bg-primary-dark shadow-xl shadow-primary/25 transition-all group active:scale-[0.98]"
                        >
                            Pesan Sekarang
                            <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>

                        <div className="mt-8 flex items-center justify-center gap-4 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 px-6">
                            <CreditCard className="h-5 w-5 text-emerald-600" />
                            <p className="text-[11px] text-emerald-800 font-black leading-tight uppercase tracking-widest text-center">
                                Metode Pembayaran Kasir / Bayar di Tempat
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
