"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Product } from "@/features/products/types";
import { formatCurrency } from "@/lib/utils/format";

interface ProductCardProps {
    product: Product;
    onAdd: () => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-divider shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col h-full">
            <div className="relative aspect-square w-full overflow-hidden bg-background">
                {primaryImage ? (
                    <Image
                        src={primaryImage.url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-disabled bg-slate-100">
                        <span className="text-sm font-bold opacity-50 uppercase tracking-widest">{product.name.charAt(0)}</span>
                    </div>
                )}

                {!product.isActive && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white px-4 py-1.5 rounded-full text-xs font-black text-black uppercase tracking-tighter">Habis</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex-1 mb-4">
                    <h3 className="text-base font-bold text-text-primary line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed h-8">
                        {product.description || "Tidak ada deskripsi."}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {product.comparePrice && (
                            <span className="text-[10px] text-text-disabled line-through font-bold">
                                {formatCurrency(product.comparePrice)}
                            </span>
                        )}
                        <span className="text-lg font-black text-primary tracking-tight">
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAdd();
                        }}
                        disabled={!product.isActive}
                        className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
                    >
                        <Plus className="h-5 w-5 stroke-[3px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
