"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Loader2, RefreshCw } from "lucide-react";
import { mockVariants } from "@/features/products/mock-data";
import { Product, Variant } from "@/features/products/types";
import { productService } from "@/features/products/services/product-service";
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
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectingProduct, setSelectingProduct] = useState<Product | null>(null);

    const addItem = useCustomerCartStore((state) => state.addItem);
    const subtotal = useCustomerCartStore((state) => state.getSubtotal());
    const itemCount = useCustomerCartStore((state) => state.getItemCount());

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await productService.list();
            setProducts(data);
        } catch {
            setError("Gagal memuat menu. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Derive categories from products
    const activeCategories = useMemo(() => {
        const catMap = new Map<string, string>();
        products.forEach(p => {
            if (p.isActive && p.categoryId && p.categoryName) {
                catMap.set(String(p.categoryId), p.categoryName);
            }
        });
        return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            if (!product.isActive) return false;
            const matchesCategory = selectedCategoryId === null || String(product.categoryId) === String(selectedCategoryId);
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategoryId, searchQuery]);

    const handleAddClick = (product: Product) => {
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
        <div className="flex flex-col min-h-[calc(100vh-64px)]" style={{ backgroundColor: '#FEFAF5' }}>
            {/* Hero / Banner section */}
            <section className="text-white py-14 px-4 relative overflow-hidden" style={{ backgroundColor: '#1C0A00' }}>
                {/* Grain texture */}
                <div
                    className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                        backgroundSize: '128px 128px',
                    }}
                />
                {/* Warm glows */}
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] opacity-25 pointer-events-none" style={{ backgroundColor: '#D4790A' }} />
                <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: '#7C2D12' }} />

                <div className="container mx-auto relative z-10 max-w-5xl text-center">
                    <h1 className="text-4xl md:text-5xl font-[700] mb-4 leading-[1.15] tracking-tight font-[family-name:var(--font-fraunces)]">
                        Selamat Datang di{" "}
                        <span className="italic" style={{ color: '#F59E0B' }}>{mockStoreInfo.name}</span>
                    </h1>
                    <p className="max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {mockStoreInfo.description}
                    </p>

                    <div className="relative max-w-xl mx-auto group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        </div>
                        <Input
                            type="text"
                            placeholder="Cari menu favorit Anda..."
                            className="pl-14 h-14 text-white rounded-2xl transition-all text-base border-2 focus-visible:ring-[#F59E0B] focus-visible:border-[#F59E0B]"
                            style={{
                                backgroundColor: 'rgba(42,18,0,0.6)',
                                borderColor: 'rgba(124,74,30,0.4)',
                            }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Menu Section */}
            <section className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                <div className="sticky top-16 z-40 pt-2 mb-8" style={{ backgroundColor: 'rgba(254,250,245,0.97)', backdropFilter: 'blur(8px)' }}>
                    <CategoryFilter
                        categories={activeCategories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                    />
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin mb-4" style={{ color: '#D97706' }} />
                        <p className="text-text-secondary">Memuat menu...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FEE2E2' }}>
                            <RefreshCw className="h-10 w-10" style={{ color: '#DC2626' }} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Gagal Memuat</h3>
                        <p className="text-text-secondary max-w-xs mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-colors"
                            style={{ backgroundColor: '#D97706' }}
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : filteredProducts.length > 0 ? (
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
                        <div className="h-20 w-20 rounded-3xl flex items-center justify-center mb-6" style={{ backgroundColor: '#FEF3C7' }}>
                            <Search className="h-10 w-10" style={{ color: '#D97706' }} />
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Menu Tidak Ditemukan</h3>
                        <p className="text-text-secondary max-w-xs">Maaf, kami tidak menemukan menu yang Anda cari. Coba kata kunci lain.</p>
                    </div>
                )}
            </section>

            {/* Floating Cart Button */}
            {itemCount > 0 && (
                <div className="fixed bottom-6 left-0 right-0 px-4 md:px-0 flex justify-center z-50 pointer-events-none">
                    <Link
                        href="/order/cart"
                        className="pointer-events-auto flex items-center gap-4 text-white pl-6 pr-3 py-3.5 rounded-3xl transform hover:scale-105 active:scale-95 transition-all duration-300 w-full max-w-md group"
                        style={{ backgroundColor: '#1C0A00', boxShadow: '0 20px 60px rgba(28,10,0,0.5)' }}
                    >
                        <div className="flex-1 flex flex-col items-start leading-none">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: 'rgba(245,158,11,0.6)' }}>Keranjang</span>
                            <span className="font-bold text-sm">{itemCount} Pesanan</span>
                        </div>
                        <div className="h-px w-8 rotate-90" style={{ backgroundColor: 'rgba(245,158,11,0.2)' }} />
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-black tracking-tight" style={{ color: '#F59E0B' }}>{formatCurrency(subtotal)}</span>
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center transition-colors" style={{ backgroundColor: '#F59E0B', color: '#1C0A00' }}>
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </Link>
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
