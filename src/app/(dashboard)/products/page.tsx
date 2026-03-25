"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { AxiosError } from "axios";
import { PageHeader } from "@/components/layout";
import { Button, useToast } from "@/components/ui";
import { ProductTable } from "@/features/products/components/product-table";
import { ProductModal } from "@/features/products/components/product-modal";
import { Product, ProductFormData } from "@/features/products/types";
import { productService } from "@/features/products/services/product-service";
import { categoryService } from "@/features/categories/services/category-service";
import { cn } from "@/lib/utils";
import {
  Plus,
  Search,
  X,
  Package,
} from "lucide-react";

type TabStatus = "all" | "active" | "inactive";

export default function ProductsPage() {
  const { showToast } = useToast();

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string }[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // Filter state
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [productData, categoryData] = await Promise.all([
        productService.list(),
        categoryService.list().catch(() => []),
      ]);
      setProducts(productData);
      // categoryService returns Category[] with id, name, is_active
      const cats = Array.isArray(categoryData)
        ? (categoryData as any[]).map((c) => ({ id: String(c.id), name: c.name }))
        : [];
      setApiCategories(cats);
    } catch {
      showToast("Gagal memuat data produk", "error");
    } finally {
      setIsFetching(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive categories from products
  const derivedCategories = useMemo(() => {
    const catMap = new Map<string, string>();
    products.forEach(p => {
      if (p.categoryId && p.categoryName) {
        catMap.set(String(p.categoryId), p.categoryName);
      }
    });
    return Array.from(catMap.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
  }), [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (activeTab === 'active' && !p.isActive) return false;
      if (activeTab === 'inactive' && p.isActive) return false;
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(search) &&
            !p.sku?.toLowerCase().includes(search) &&
            !p.barcode?.toLowerCase().includes(search)) {
          return false;
        }
      }
      if (selectedCategory && String(p.categoryId) !== selectedCategory) return false;
      return true;
    });
  }, [products, activeTab, searchQuery, selectedCategory]);

  // Handlers
  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (data: ProductFormData, productId?: string) => {
    setIsLoading(true);
    try {
      // Build prices array — API uses uppercase channel names
      const prices = [
        { channel: "POS", price: data.price },
        ...(data.channelPrices.gofood > 0
          ? [{ channel: "GOFOOD", price: data.channelPrices.gofood }]
          : []),
        ...(data.channelPrices.grabfood > 0
          ? [{ channel: "GRABFOOD", price: data.channelPrices.grabfood }]
          : []),
        ...(data.channelPrices.shopeefood > 0
          ? [{ channel: "SHOPEEFOOD", price: data.channelPrices.shopeefood }]
          : []),
      ];

      const payload = {
        name: data.name,
        price: data.price,
        prices,
        unit: "Pcs",
        is_active: data.isActive,
        ...(data.categoryId ? { category_id: data.categoryId } : {}),
        stock_type: data.useStock ? "LIMITED" as const : "UNLIMITED" as const,
        ...(data.useStock ? { stock_qty: data.stockQuantity } : {}),
        ...(data.useStock && data.stockLimit ? { stock_limit: data.stockLimit } : {}),
        ...(data.description ? { description: data.description } : {}),
      };
      console.log("[save product] payload:", JSON.stringify(payload, null, 2));
      if (productId) {
        await productService.update(productId, payload);
        showToast("Produk berhasil diperbarui", "success");
      } else {
        await productService.create(payload);
        showToast("Produk berhasil ditambahkan", "success");
      }
      await fetchData();
      handleCloseModal();
    } catch (err) {
      const apiErr = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      const apiMsg = apiErr.response?.data?.message;
      const apiErrors = apiErr.response?.data?.errors;
      const status = apiErr.response?.status;
      console.error("[save product] status:", status, "body:", apiErr.response?.data);
      const detail = apiErrors
        ? Object.values(apiErrors).flat().join(", ")
        : apiMsg ?? "Periksa konsol untuk detail error";
      showToast(`Gagal menyimpan: ${detail}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (product: Product) => {
    // Optimistic update
    setProducts(prev => prev.map(p =>
      p.id === product.id ? { ...p, isActive: !p.isActive } : p
    ));
    try {
      await productService.toggleStatus(product.id);
      showToast(
        product.isActive
          ? `${product.name} tidak dijual`
          : `${product.name} aktif dijual`,
        "success"
      );
    } catch {
      // Revert on failure
      setProducts(prev => prev.map(p =>
        p.id === product.id ? { ...p, isActive: product.isActive } : p
      ));
      showToast("Gagal mengubah status produk", "error");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    setDeleteConfirmProduct(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmProduct) return;
    try {
      await productService.delete(deleteConfirmProduct.id);
      // Re-fetch from API to confirm actual deletion (not just optimistic removal)
      await fetchData();
      showToast(`${deleteConfirmProduct.name} berhasil dihapus`, "success");
    } catch (err) {
      const apiErr = err as AxiosError<{ message?: string }>;
      const status = apiErr.response?.status;
      const apiMsg = apiErr.response?.data?.message;
      console.error("[delete product] status:", status, "body:", apiErr.response?.data);
      showToast(`Gagal menghapus: ${apiMsg ?? `HTTP ${status}`}`, "error");
    } finally {
      setDeleteConfirmProduct(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setActiveTab("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory || activeTab !== "all";

  const tabs: { id: TabStatus; label: string }[] = [
    { id: "all", label: "Semua" },
    { id: "active", label: "Aktif" },
    { id: "inactive", label: "Tidak Aktif" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Produk"
        description="Kelola daftar produk untuk outlet Anda"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Produk
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              )}
            >
              {tab.label}
              <span className={cn(
                "ml-2 px-2 py-0.5 text-xs rounded-full",
                activeTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-background text-text-secondary"
              )}>
                {tabCounts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk, SKU, atau barcode..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || undefined)}
            className="px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Semua Kategori</option>
            {derivedCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 text-sm font-medium text-error hover:bg-error-light rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Active Filters Info */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
            <Package className="h-4 w-4" />
            <span>
              Menampilkan {filteredProducts.length} dari {products.length} produk
            </span>
          </div>
        )}
      </div>

      {/* Product Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleOpenModal}
        onDelete={handleDeleteProduct}
        onToggleStatus={handleToggleStatus}
        isLoading={isFetching}
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        isLoading={isLoading}
        categories={apiCategories}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDeleteConfirmProduct(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Hapus Produk?
              </h3>
              <p className="text-text-secondary mb-6">
                Apakah Anda yakin ingin menghapus <strong>{deleteConfirmProduct.name}</strong>?
                Produk akan dihapus secara permanen.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirmProduct(null)}>
                  Batal
                </Button>
                <Button variant="primary" onClick={confirmDelete} className="bg-error hover:bg-error/90">
                  Hapus Produk
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
