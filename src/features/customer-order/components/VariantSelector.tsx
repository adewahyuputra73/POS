"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, X, Check, PenLine } from "lucide-react";
import { Product, Variant } from "@/features/products/types";
import { CartItemVariant } from "@/features/customer-order/types";
import { formatCurrency } from "@/lib/utils/format";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface VariantSelectorProps {
    product: Product;
    variants: Variant[];
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number, selectedVariants: CartItemVariant[], notes: string) => void;
}

export function VariantSelector({
    product,
    variants,
    isOpen,
    onClose,
    onConfirm,
}: VariantSelectorProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [notes, setNotes] = useState("");
    const [notesOpen, setNotesOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setNotes("");
            setNotesOpen(false);
            const initial: Record<number, number> = {};
            variants.forEach(v => {
                if (v.isRequired && v.options.length > 0) {
                    initial[v.id] = v.options[0].id;
                }
            });
            setSelectedOptions(initial);
        }
    }, [isOpen, variants]);

    const handleToggleOption = (variantId: number, optionId: number) => {
        setSelectedOptions(prev => {
            const next = { ...prev };
            if (next[variantId] === optionId) {
                const variant = variants.find(v => v.id === variantId);
                if (!variant?.isRequired) delete next[variantId];
            } else {
                next[variantId] = optionId;
            }
            return next;
        });
    };

    const handleConfirm = () => {
        const cartVariants: CartItemVariant[] = [];
        Object.entries(selectedOptions).forEach(([vId, oId]) => {
            const variant = variants.find(v => v.id === parseInt(vId));
            const option = variant?.options.find(o => o.id === oId);
            if (variant && option) {
                cartVariants.push({
                    variantId: variant.id,
                    variantName: variant.name,
                    optionId: option.id,
                    optionName: option.name,
                    price: option.price,
                });
            }
        });
        onConfirm(quantity, cartVariants, notes);
        onClose();
    };

    const totalPrice = (() => {
        let price = product.price;
        Object.entries(selectedOptions).forEach(([vId, oId]) => {
            const variant = variants.find(v => v.id === parseInt(vId));
            const option = variant?.options.find(o => o.id === oId);
            if (option) price += option.price;
        });
        return price * quantity;
    })();

    const canConfirm = variants
        .filter(v => v.isRequired)
        .every(v => selectedOptions[v.id] !== undefined);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                hideCloseButton
                className={cn(
                    // Remove default padding/border, keep shadow
                    "p-0 border-none shadow-2xl overflow-hidden",
                    // Desktop: centered, normal modal shape
                    "sm:max-w-md sm:rounded-[28px]",
                    // Mobile: full-width bottom sheet
                    "max-sm:fixed max-sm:bottom-0 max-sm:top-auto",
                    "max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0",
                    "max-sm:w-full max-sm:max-w-none",
                    "max-sm:rounded-t-[28px] max-sm:rounded-b-none",
                )}
            >
                <DialogTitle className="sr-only">{product.name}</DialogTitle>

                {/* Mobile drag handle */}
                <div
                    className="sm:hidden flex justify-center pt-3 pb-1 shrink-0"
                    style={{ backgroundColor: '#FEFAF5' }}
                >
                    <div
                        className="w-9 h-1 rounded-full"
                        style={{ backgroundColor: 'rgba(124,74,30,0.2)' }}
                    />
                </div>

                {/* Outer shell — flex column, capped height */}
                <div
                    className="flex flex-col max-h-[90vh]"
                    style={{ backgroundColor: '#FEFAF5' }}
                >
                    {/* ── Hero image (sticky — doesn't scroll) ── */}
                    {/* maxHeight caps image on very small/narrow viewports */}
                    <div className="shrink-0 relative overflow-hidden" style={{ aspectRatio: '16/9', maxHeight: '45vw', minHeight: '140px' }}>
                        {product.images[0] ? (
                            <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div
                                className="absolute inset-0 flex items-center justify-center"
                                style={{ backgroundColor: '#FEF3C7' }}
                            >
                                <span
                                    className="font-black font-[family-name:var(--font-fraunces)] select-none"
                                    style={{ fontSize: 'clamp(3.5rem, 14vw, 7rem)', color: '#D97706', opacity: 0.18 }}
                                >
                                    {product.name.charAt(0)}
                                </span>
                            </div>
                        )}

                        {/* Dark gradient from bottom */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(to top, rgba(28,10,0,0.88) 0%, rgba(28,10,0,0.35) 45%, transparent 75%)',
                            }}
                        />

                        {/* Product info overlaid on image */}
                        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10">
                            <div className="flex items-end gap-3 justify-between">
                                <div className="flex-1 min-w-0">
                                    <h2
                                        className="font-black leading-tight tracking-tight font-[family-name:var(--font-fraunces)] truncate"
                                        style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', color: '#FFFFFF' }}
                                    >
                                        {product.name}
                                    </h2>
                                    {product.description && (
                                        <p
                                            className="text-xs mt-0.5 line-clamp-1"
                                            style={{ color: 'rgba(255,255,255,0.55)' }}
                                        >
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                                {/* Base price badge */}
                                <div
                                    className="shrink-0 px-3 py-1.5 rounded-xl font-black text-sm tracking-tight"
                                    style={{ backgroundColor: '#F59E0B', color: '#1C0A00' }}
                                >
                                    {formatCurrency(product.price)}
                                </div>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                            style={{ backgroundColor: 'rgba(28,10,0,0.45)', backdropFilter: 'blur(8px)', color: '#FFFFFF' }}
                            aria-label="Tutup"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* ── Scrollable body ── */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="px-5 pt-5 pb-3 space-y-6">

                            {/* Variant sections */}
                            {variants.map((variant) => (
                                <div key={variant.id}>
                                    {/* Section label */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span
                                            className="text-[13px] font-black tracking-tight"
                                            style={{ color: '#1C0A00' }}
                                        >
                                            {variant.name}
                                        </span>
                                        {variant.isRequired ? (
                                            <span
                                                className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide"
                                                style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                                            >
                                                Wajib
                                            </span>
                                        ) : (
                                            <span
                                                className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide"
                                                style={{ backgroundColor: 'rgba(124,74,30,0.07)', color: '#9C7D58' }}
                                            >
                                                Opsional
                                            </span>
                                        )}
                                    </div>

                                    {/* Option cards — 2-col grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {variant.options.map((option) => {
                                            const isSelected = selectedOptions[variant.id] === option.id;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleToggleOption(variant.id, option.id)}
                                                    className={cn(
                                                        "relative flex flex-col items-start p-3 rounded-2xl border-2 transition-all duration-150 active:scale-[0.96] text-left"
                                                    )}
                                                    style={
                                                        isSelected
                                                            ? { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }
                                                            : { backgroundColor: '#FFFFFF', borderColor: 'rgba(124,74,30,0.14)' }
                                                    }
                                                >
                                                    {/* Animated checkmark */}
                                                    <div
                                                        className={cn(
                                                            "absolute top-2.5 right-2.5 h-[18px] w-[18px] rounded-full flex items-center justify-center transition-all duration-200",
                                                            isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                                        )}
                                                        style={{ backgroundColor: '#F59E0B' }}
                                                    >
                                                        <Check
                                                            className="h-2.5 w-2.5"
                                                            style={{ color: '#1C0A00' }}
                                                            strokeWidth={3.5}
                                                        />
                                                    </div>

                                                    <span
                                                        className="text-[13px] font-bold leading-tight pr-6 mb-1"
                                                        style={{ color: isSelected ? '#92400E' : '#1C0A00' }}
                                                    >
                                                        {option.name}
                                                    </span>
                                                    <span
                                                        className="text-[11px] font-black"
                                                        style={{ color: isSelected ? '#D97706' : 'rgba(124,74,30,0.45)' }}
                                                    >
                                                        {option.price > 0 ? `+${formatCurrency(option.price)}` : 'Gratis'}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Notes — collapsible */}
                            <div>
                                <button
                                    onClick={() => setNotesOpen(o => !o)}
                                    className="flex items-center gap-2 w-full text-left py-0.5 transition-opacity active:opacity-70"
                                >
                                    <PenLine
                                        className="h-3.5 w-3.5 shrink-0"
                                        style={{ color: '#9C7D58' }}
                                    />
                                    <span
                                        className="text-[13px] font-bold"
                                        style={{ color: '#1C0A00' }}
                                    >
                                        Catatan Khusus
                                    </span>
                                    <span
                                        className="text-[11px] ml-auto font-medium"
                                        style={{ color: '#9C7D58' }}
                                    >
                                        {notesOpen ? 'Sembunyikan' : 'Tambah +'}
                                    </span>
                                </button>

                                {notesOpen && (
                                    <textarea
                                        autoFocus
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Contoh: Kurangi gula, tanpa es, ekstra pedas..."
                                        rows={3}
                                        className="mt-2.5 w-full rounded-2xl p-3.5 text-[13px] resize-none outline-none border-2 transition-colors font-medium"
                                        style={{
                                            backgroundColor: '#FFF8EE',
                                            borderColor: 'rgba(124,74,30,0.18)',
                                            color: '#1C0A00',
                                        }}
                                        onFocus={e => (e.currentTarget.style.borderColor = '#F59E0B')}
                                        onBlur={e => (e.currentTarget.style.borderColor = 'rgba(124,74,30,0.18)')}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Bottom spacer so last content clears the fixed bar */}
                        <div className="h-2" />
                    </div>

                    {/* ── Sticky bottom bar ── */}
                    <div
                        className="shrink-0 flex items-center gap-3 px-4 py-3.5"
                        style={{
                            backgroundColor: '#1C0A00',
                            borderTop: '1px solid rgba(245,158,11,0.15)',
                        }}
                    >
                        {/* Quantity stepper */}
                        <div
                            className="flex items-center gap-2.5 shrink-0 px-1.5 py-1.5 rounded-2xl"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(245,158,11,0.18)',
                            }}
                        >
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                className="h-8 w-8 rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-25"
                                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#F59E0B' }}
                            >
                                <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span
                                className="text-[15px] font-black w-5 text-center tabular-nums"
                                style={{ color: '#FFFFFF' }}
                            >
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="h-8 w-8 rounded-xl flex items-center justify-center transition-all active:scale-90"
                                style={{ backgroundColor: '#F59E0B', color: '#1C0A00' }}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        {/* Confirm button — price inside */}
                        <button
                            onClick={handleConfirm}
                            disabled={!canConfirm}
                            className="flex-1 h-12 rounded-2xl font-black text-[15px] transition-all duration-200 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-between px-5"
                            style={{
                                backgroundColor: canConfirm ? '#F59E0B' : 'rgba(245,158,11,0.5)',
                                color: '#1C0A00',
                                boxShadow: canConfirm ? '0 6px 20px rgba(245,158,11,0.28)' : 'none',
                            }}
                        >
                            <span>Tambah ke Pesanan</span>
                            <span className="font-black tabular-nums text-[14px]">
                                {formatCurrency(totalPrice)}
                            </span>
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
