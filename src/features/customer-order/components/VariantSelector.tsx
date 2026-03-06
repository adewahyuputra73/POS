"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, X } from "lucide-react";
import { Product, Variant, VariantOption } from "@/features/products/types";
import { CartItemVariant } from "@/features/customer-order/types";
import { formatCurrency } from "@/lib/utils/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

    useEffect(() => {
        if (isOpen) {
            setQuantity(1);
            setNotes("");

            // Initialize required variants with first option if any
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
                // If already selected, only remove if not required
                const variant = variants.find(v => v.id === variantId);
                if (!variant?.isRequired) {
                    delete next[variantId];
                }
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
                    price: option.price
                });
            }
        });

        onConfirm(quantity, cartVariants, notes);
        onClose();
    };

    const calculateTotalPrice = () => {
        let price = product.price;
        Object.entries(selectedOptions).forEach(([vId, oId]) => {
            const variant = variants.find(v => v.id === parseInt(vId));
            const option = variant?.options.find(o => o.id === oId);
            if (option) price += option.price;
        });
        return price * quantity;
    };

    // Check if all required variants are selected
    const canConfirm = variants
        .filter(v => v.isRequired)
        .every(v => selectedOptions[v.id] !== undefined);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-[95vw] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="max-h-[85vh] overflow-y-auto flex flex-col">
                    <div className="relative h-48 bg-slate-100">
                        {product.images[0] ? (
                            <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-disabled">
                                <span className="text-4xl font-black opacity-20">{product.name.charAt(0)}</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/40 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-text-primary mb-1 tracking-tight">{product.name}</h2>
                            <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>
                        </div>

                        <div className="space-y-8">
                            {variants.map((variant) => (
                                <div key={variant.id} className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-black text-text-primary flex items-center gap-2">
                                            {variant.name}
                                            {variant.isRequired && (
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">Wajib</span>
                                            )}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {variant.options.map((option) => {
                                            const isSelected = selectedOptions[variant.id] === option.id;
                                            return (
                                                <button
                                                    key={option.id}
                                                    onClick={() => handleToggleOption(variant.id, option.id)}
                                                    className={cn(
                                                        "flex flex-col text-left p-3 rounded-2xl border-2 transition-all duration-200 shadow-sm",
                                                        isSelected
                                                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                                                            : "border-divider bg-white hover:border-primary-light"
                                                    )}
                                                >
                                                    <span className={cn("text-sm font-bold mb-1", isSelected ? "text-primary" : "text-text-primary")}>
                                                        {option.name}
                                                    </span>
                                                    <span className="text-xs font-black text-text-secondary">
                                                        {option.price > 0 ? `+ ${formatCurrency(option.price)}` : 'Gratis'}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            <div className="space-y-3">
                                <h3 className="text-base font-black text-text-primary">Catatan Khusus</h3>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Contoh: Kurangi gula, tanpa es, dll."
                                    className="w-full bg-background border-2 border-divider rounded-2xl p-4 text-sm focus:border-primary focus:ring-0 transition-colors resize-none h-24 font-medium"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-divider">
                                <span className="text-sm font-bold text-text-secondary">Jumlah</span>
                                <div className="flex items-center gap-4 bg-background p-1.5 rounded-2xl border border-divider">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="h-8 w-8 rounded-xl bg-white text-text-primary flex items-center justify-center shadow-sm disabled:opacity-30 transition-all font-bold border border-divider"
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-lg font-black w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 transition-all font-bold"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-white border-t border-divider sm:justify-between items-center gap-4">
                    <div className="hidden sm:flex flex-col">
                        <span className="text-xs text-text-secondary font-bold uppercase tracking-widest">Total Harga</span>
                        <span className="text-xl font-black text-primary tracking-tight">
                            {formatCurrency(calculateTotalPrice())}
                        </span>
                    </div>
                    <Button
                        onClick={handleConfirm}
                        disabled={!canConfirm}
                        className="w-full sm:w-auto h-14 px-10 rounded-2xl font-black text-lg bg-primary hover:bg-primary-dark shadow-lg shadow-primary/25 transition-all duration-300 transform active:scale-95 disabled:opacity-50"
                    >
                        <span className="sm:hidden mr-auto">{formatCurrency(calculateTotalPrice())}</span>
                        <span className="ml-auto sm:ml-0">Tambah Pesanan</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
