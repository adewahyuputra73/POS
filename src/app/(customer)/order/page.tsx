"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { mockProducts, mockCategories, mockVariants } from "@/features/products/mock-data";
import { Product, Variant } from "@/features/products/types";
import {
    CategoryFilter,
    ProductCard,
    VariantSelector,
    CartItemVariant
} from "@/features/customer-order";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils/format";
import { mockStoreInfo } from "@/features/store-settings/mock-data";

export default function OrderPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectingProduct, setSelectingProduct] = useState<Product | null>(null);

    const addItem = useCustomerCartStore((state) => state.addItem);
    const subtotal = useCustomerCartStore((state) => state.getSubtotal());
    const itemCount = useCustomerCartStore((state) => state.getItemCount());

    const filteredProducts = useMemo(() => {
        return mockProducts.filter((product) => {
            const matchesCategory = selectedCategoryId === null || product.categoryId === selectedCategoryId;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategoryId, searchQuery]);

    const activeCategories = useMemo(() => {
        return mockCategories.filter(c => c.isActive);
    }, []);

    const handleAddClick = (product: Product) => {
        // Check if product has variants
        if (product.variantIds && product.variantIds.length > 0) {
            setSelectingProduct(product);
        } else {
            addItem(product, 1, []);
        }
    };

    const handleVariantConfirm = (quantity: number, selectedVariants: CartItemVariant[], notes: string) => {
        if (selectingProduct) {
            addItem(selectingProduct, quantity, selectedVariants, notes);
        }
    };

    // Get variants for the currently selecting product
    const currentVariants = useMemo(() => {
        if (!selectingProduct) return [];
        return selectingProduct.variantIds
            .map(id => mockVariants.find(v => v.id === id))
            .filter((v): v is Variant => !!v && v.isActive);
    }, [selectingProduct]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)]">
            {/* Hero / Banner section */}
            <section className="bg-slate-950 text-white py-12 px-4 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[60px]" />
                </div>

                <div className="container mx-auto relative z-10 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                        Selamat Datang di <span className="text-primary italic">{mockStoreInfo.name}</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed mb-8">
                        {mockStoreInfo.description}
                    </p>

                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <Input
                            type="text"
                            placeholder="Cari menu favorit Anda..."
                            className="pl-14 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus-visible:ring-primary focus-visible:border-primary transition-all text-base placeholder:text-slate-600 border-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Menu Section */}
            <section className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm pt-2 mb-8">
                    <CategoryFilter
                        categories={activeCategories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAdd={() => handleAddClick(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-6">
                            <Search className="h-10 w-10 text-text-disabled" />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Menu Tidak Ditemukan</h3>
                        <p className="text-text-secondary max-w-xs">Maaf, kami tidak menemukan menu yang Anda cari. Coba kata kunci lain.</p>
                    </div>
                )}
            </section>

            {/* Floating Cart Button (only on mobile/tablet) */}
            {itemCount > 0 && (
                <div className="fixed bottom-6 left-0 right-0 px-4 md:px-0 flex justify-center z-50 pointer-events-none">
                    <a
                        href="/order/cart"
                        className="pointer-events-auto flex items-center gap-4 bg-primary text-white pl-6 pr-4 py-4 rounded-3xl shadow-2xl shadow-primary/30 transform hover:scale-105 active:scale-95 transition-all duration-300 w-full max-w-md group"
                    >
                        <div className="flex-1 flex flex-col items-start leading-none">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Keranjang</span>
                            <span className="font-bold">{itemCount} Pesanan</span>
                        </div>
                        <div className="h-px w-8 bg-white/20 rotate-90" />
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-black tracking-tight">{formatCurrency(subtotal)}</span>
                            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </a>
                </div>
            )}

            {/* Variant Selector Modal */}
            {selectingProduct && (
                <VariantSelector
                    product={selectingProduct}
                    variants={currentVariants}
                    isOpen={!!selectingProduct}
                    onClose={() => setSelectingProduct(null)}
                    onConfirm={handleVariantConfirm}
                />
            )}
        </div>
    );
}
