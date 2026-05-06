import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/features/customer-order/types";
import { formatCurrency } from "@/lib/utils/format";

interface CartItemCardProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
    const primaryImage = item.product.images.find((img) => img.isPrimary) || item.product.images[0];

    return (
        <div
            className="flex gap-3 p-3 md:p-5 rounded-2xl md:rounded-3xl border group transition-all duration-300"
            style={{ backgroundColor: '#FFFFFF', borderColor: 'rgba(124,74,30,0.12)', boxShadow: '0 2px 8px rgba(28,10,0,0.04)' }}
        >
            {/* Image */}
            <div className="relative h-16 w-16 md:h-24 md:w-24 rounded-xl md:rounded-2xl overflow-hidden shrink-0" style={{ backgroundColor: '#FEF3C7' }}>
                {primaryImage ? (
                    <img
                        src={primaryImage.url}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-lg md:text-xl font-black" style={{ color: '#D97706', opacity: 0.3 }}>
                            {item.product.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm md:text-base font-black line-clamp-1 tracking-tight" style={{ color: '#1C0A00' }}>
                            {item.product.name}
                        </h3>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="p-1 md:p-1.5 rounded-lg transition-colors"
                            style={{ color: 'rgba(124,74,30,0.4)' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#DC2626')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(124,74,30,0.4)')}
                        >
                            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                    </div>

                    {item.selectedVariants.length > 0 && (
                        <p className="text-[10px] md:text-xs font-medium mt-0.5 md:mt-1" style={{ color: '#9C7D58' }}>
                            {item.selectedVariants.map(v => v.optionName).join(", ")}
                        </p>
                    )}

                    {item.notes && (
                        <div
                            className="mt-1.5 md:mt-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border"
                            style={{ backgroundColor: '#FFF8EE', borderColor: 'rgba(124,74,30,0.15)' }}
                        >
                            <p className="text-[10px] font-bold italic line-clamp-1" style={{ color: '#9C7D58' }}>
                                &ldquo;{item.notes}&rdquo;
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2 md:mt-3">
                    <span className="text-sm md:text-base font-black tracking-tight" style={{ color: '#1C0A00' }}>
                        {formatCurrency(item.subtotal)}
                    </span>

                    <div
                        className="flex items-center gap-2 md:gap-3 p-0.5 md:p-1 rounded-lg md:rounded-xl border"
                        style={{ backgroundColor: '#FFF8EE', borderColor: 'rgba(124,74,30,0.15)' }}
                    >
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 md:h-7 md:w-7 rounded-md md:rounded-lg flex items-center justify-center transition-all border"
                            style={{ backgroundColor: '#FFFFFF', color: '#6B4C2A', borderColor: 'rgba(124,74,30,0.2)' }}
                        >
                            <Minus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        </button>
                        <span className="text-xs md:text-sm font-black w-4 text-center" style={{ color: '#1C0A00' }}>
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 md:h-7 md:w-7 rounded-md md:rounded-lg flex items-center justify-center transition-all"
                            style={{ backgroundColor: '#F59E0B', color: '#1C0A00', boxShadow: '0 2px 8px rgba(245,158,11,0.3)' }}
                        >
                            <Plus className="h-3 w-3 md:h-3.5 md:w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
