import { Plus } from "lucide-react";
import { Product } from "@/features/products/types";
import { formatCurrency } from "@/lib/utils/format";

interface ProductCardProps {
    product: Product;
    onAdd: () => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
    const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
    const isOutOfStock = !product.isActive || (product.useStock && (product.stockQuantity ?? 0) <= 0);

    return (
        <div className={`bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-divider shadow-card transition-all duration-300 group flex flex-col h-full ${isOutOfStock ? 'opacity-60' : 'hover:shadow-card-hover'}`}>
            <div className="relative aspect-[5/4] md:aspect-[4/3] lg:aspect-[4/3] w-full overflow-hidden bg-[#FEF3C7]">
                {primaryImage ? (
                    <img
                        src={primaryImage.url}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale' : 'group-hover:scale-110'}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs md:text-sm font-bold opacity-50 uppercase tracking-widest" style={{ color: '#D97706' }}>{product.name.charAt(0)}</span>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-black text-black uppercase tracking-tighter">Stok Habis</span>
                    </div>
                )}
            </div>

            <div className="p-2.5 md:p-4 flex flex-col flex-1">
                <div className="flex-1 mb-2 md:mb-3">
                    <h3 className={`text-xs md:text-sm font-bold line-clamp-1 mb-0.5 md:mb-1 transition-colors ${isOutOfStock ? '' : 'group-hover:text-[#D97706]'}`} style={{ color: '#1C1108' }}>
                        {product.name}
                    </h3>
                    <p className="text-[10px] md:text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {product.description || "Tidak ada deskripsi."}
                    </p>
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        {product.comparePrice && (
                            <span className="text-[9px] md:text-[10px] text-text-disabled line-through font-bold">
                                {formatCurrency(product.comparePrice)}
                            </span>
                        )}
                        <span className="text-sm md:text-base font-black tracking-tight" style={{ color: '#1C0A00' }}>
                            {formatCurrency(product.price)}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            if (!isOutOfStock) onAdd();
                        }}
                        disabled={isOutOfStock}
                        className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-110 active:scale-95"
                        style={{ backgroundColor: isOutOfStock ? '#9CA3AF' : '#F59E0B', color: '#1C0A00', boxShadow: isOutOfStock ? 'none' : '0 4px 12px rgba(245,158,11,0.35)' }}
                        onMouseEnter={(e) => { if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#D97706'; }}
                        onMouseLeave={(e) => { if (!isOutOfStock) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F59E0B'; }}
                    >
                        <Plus className="h-4 w-4 md:h-5 md:w-5 stroke-[3px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
