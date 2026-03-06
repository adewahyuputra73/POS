"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/features/customer-order/types";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface CartItemCardProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
    const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];

    return (
        <div className="flex gap-4 p-5 bg-white rounded-3xl border border-divider shadow-sm group hover:shadow-md transition-all duration-300">
            <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-background shrink-0">
                {primaryImage ? (
                    <img
                        src={primaryImage.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-disabled bg-slate-100">
                        <span className="text-xl font-black opacity-30">{item.product.name.charAt(0)}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-base font-black text-text-primary line-clamp-1 tracking-tight">
                            {item.product.name}
                        </h3>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="p-1.5 text-text-disabled hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>

                    {item.selectedVariants.length > 0 && (
                        <p className="text-xs text-text-secondary font-medium mt-1">
                            {item.selectedVariants.map(v => v.optionName).join(", ")}
                        </p>
                    )}

                    {item.notes && (
                        <div className="mt-1.5 p-2 bg-background rounded-lg border border-divider/50">
                            <p className="text-[10px] text-text-secondary font-bold italic line-clamp-1">
                                "{item.notes}"
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-black text-primary tracking-tight">
                        {formatCurrency(item.subtotal)}
                    </span>

                    <div className="flex items-center gap-3 bg-background p-1 rounded-xl border border-divider">
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-lg bg-white text-text-primary flex items-center justify-center shadow-sm disabled:opacity-30 transition-all border border-divider"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 transition-all"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
