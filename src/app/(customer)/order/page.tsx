import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Loader2, RefreshCw, MapPin } from "lucide-react";
import { mockVariants } from "@/features/products/mock-data";
import type { Product, Variant } from "@/features/products";
import {
    CategoryFilter,
    ProductCard,
    VariantSelector,
    CartItemVariant
} from "@/features/customer-order";
import { pubProductService, pubStoreService, pubTableService } from "@/features/customer-order/services/pub-services";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { Input } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { StoreInfo } from "@/features/store-settings";

export default function OrderPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectingProduct, setSelectingProduct] = useState<Product | null>(null);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const addItem = useCustomerCartStore((state) => state.addItem);
    const subtotal = useCustomerCartStore((state) => state.getSubtotal());
    const itemCount = useCustomerCartStore((state) => state.getItemCount());
    const selectedTable = useCustomerCartStore((state) => state.selectedTable);
    const setSelectedTable = useCustomerCartStore((state) => state.setSelectedTable);
    const setQrToken = useCustomerCartStore((state) => state.setQrToken);

    // Fetch products from API
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await pubProductService.list();
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

    useEffect(() => {
        pubStoreService.my().then(setStoreInfo).catch(() => {});
    }, []);

    // QR scan: /order?t=TOKEN → find table from list → store in cart
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const qrToken = params.get("t");
        if (!qrToken) return;

        setQrToken(qrToken); // simpan token agar back-button bisa reconstruct URL

        // Jika table sudah ter-set dengan token yang sama, skip
        if (selectedTable?.qr_token === qrToken || selectedTable?.id === qrToken) return;

        // Cari table dari list berdasarkan qr_token atau id
        pubTableService.list().then((tables) => {
            const found = tables.find(
                (t) => t.qr_token === qrToken || t.id === qrToken
            );
            if (found) setSelectedTable(found);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        const isOutOfStock = (p: Product) => p.useStock && (p.stockQuantity ?? 0) <= 0;
        return products
            .filter((product) => {
                if (!product.isActive) return false;
                if (!searchQuery) return true;
                return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description?.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .sort((a, b) => {
                const catA = a.categoryName ?? "";
                const catB = b.categoryName ?? "";
                if (catA !== catB) return catA.localeCompare(catB, "id");
                const aOut = isOutOfStock(a) ? 1 : 0;
                const bOut = isOutOfStock(b) ? 1 : 0;
                if (aOut !== bOut) return aOut - bOut;
                return a.name.localeCompare(b.name, "id");
            });
    }, [products, searchQuery]);

    const groupedProducts = useMemo(() => {
        const groups = new Map<string, { categoryId: string; categoryName: string; products: Product[] }>();
        filteredProducts.forEach(product => {
            const key = product.categoryId ? String(product.categoryId) : "__none__";
            const name = product.categoryName ?? "Lainnya";
            if (!groups.has(key)) groups.set(key, { categoryId: key, categoryName: name, products: [] });
            groups.get(key)!.products.push(product);
        });
        return Array.from(groups.values());
    }, [filteredProducts]);

    const handleSelectCategory = (id: string | number | null) => {
        setSelectedCategoryId(id);
        if (id === null) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const el = document.getElementById(`category-${id}`);
            if (el) {
                const offset = 120; // account for sticky header height
                const top = el.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: "smooth" });
            }
        }
    };

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
                        <span className="italic" style={{ color: '#F59E0B' }}>{storeInfo?.name ?? ""}</span>
                    </h1>
                    <p className="max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {storeInfo?.address ?? ""}
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

            {/* Table badge — shown when QR scan detected */}
            {selectedTable && (
                <div className="container mx-auto px-4 pt-4 max-w-6xl">
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
                        style={{ backgroundColor: "#ECFDF5", borderColor: "#86EFAC" }}
                    >
                        <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#D1FAE5" }}>
                            <MapPin className="h-4 w-4" style={{ color: "#059669" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black" style={{ color: "#065F46" }}>
                                {selectedTable.name}
                                {selectedTable.area?.name ? ` · ${selectedTable.area.name}` : ""}
                            </p>
                            <p className="text-xs font-medium" style={{ color: "#059669" }}>
                                Meja terdeteksi dari QR · Kapasitas {selectedTable.capacity} kursi
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedTable(null)}
                            className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
                            style={{ color: "#059669", backgroundColor: "#D1FAE5" }}
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            )}

            {/* Menu Section */}
            <section className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                <div className="sticky top-16 z-40 pt-2 mb-8" style={{ backgroundColor: 'rgba(254,250,245,0.97)', backdropFilter: 'blur(8px)' }}>
                    <CategoryFilter
                        categories={activeCategories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={handleSelectCategory}
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
                ) : groupedProducts.length > 0 ? (
                    <div className="space-y-10">
                        {groupedProducts.map(({ categoryId, categoryName, products: groupItems }) => (
                            <div key={categoryName} id={`category-${categoryId}`}>
                                <div className="flex items-center gap-3 mb-5">
                                    <h2
                                        className="text-lg font-black tracking-tight"
                                        style={{ color: '#1C0A00' }}
                                    >
                                        {categoryName}
                                    </h2>
                                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(28,10,0,0.1)' }} />
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                                        {groupItems.length} menu
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                    {groupItems.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAdd={() => handleAddClick(product)}
                                        />
                                    ))}
                                </div>
                            </div>
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
            {mounted && itemCount > 0 && (
                <div className="fixed bottom-6 left-0 right-0 px-4 md:px-0 flex justify-center z-50 pointer-events-none">
                    <Link
                        to="/order/cart"
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
