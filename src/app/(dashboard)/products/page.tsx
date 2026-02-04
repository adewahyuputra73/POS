"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Button, useToast } from "@/components/ui";
import { ProductTable } from "@/features/products/components/product-table";
import { ProductModal } from "@/features/products/components/product-modal";
import { Product, ProductStatusFilter, ProductFormData } from "@/features/products/types";
import { mockProducts, mockCategories, filterProducts } from "@/features/products/mock-data";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Filter,
  X,
  Package,
} from "lucide-react";

type TabStatus = "all" | "active" | "inactive";

export default function ProductsPage() {
  const { showToast } = useToast();
  
  // Data state
  const [products, setProducts] = useState<Product[]>(mockProducts);
  
  // Filter state
  const [activeTab, setActiveTab] = useState<TabStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tab counts
  const tabCounts = useMemo(() => ({
    all: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
  }), [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      status: activeTab,
      search: searchQuery,
      categoryId: selectedCategory,
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

  const handleSaveProduct = async (data: ProductFormData, productId?: number) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (productId) {
      // Update
      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { 
              ...p, 
              name: data.name,
              description: data.description,
              price: data.price,
              comparePrice: data.comparePrice || undefined,
              categoryId: data.categoryId || undefined,
              categoryName: mockCategories.find(c => c.id === data.categoryId)?.name,
              isActive: data.isActive,
              barcode: data.barcode || undefined,
              sku: data.sku || undefined,
              useStock: data.useStock,
              stockQuantity: data.stockQuantity,
              stockLimit: data.stockLimit,
              taxId: data.taxId || undefined,
              serviceFeeId: data.serviceFeeId || undefined,
              takeawayFee: data.takeawayFee || undefined,
              useDimension: data.useDimension,
              weight: data.weight || undefined,
              length: data.length || undefined,
              width: data.width || undefined,
              height: data.height || undefined,
              variantIds: data.variantIds,
              updatedAt: new Date().toISOString(),
            } 
          : p
      ));
      showToast("Produk berhasil diperbarui", "success");
    } else {
      // Create
      const newProduct: Product = {
        id: Math.max(...products.map(p => p.id)) + 1,
        name: data.name,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice || undefined,
        categoryId: data.categoryId || undefined,
        categoryName: mockCategories.find(c => c.id === data.categoryId)?.name,
        isActive: data.isActive,
        barcode: data.barcode || undefined,
        sku: data.sku || undefined,
        useStock: data.useStock,
        stockQuantity: data.stockQuantity,
        stockLimit: data.stockLimit,
        taxId: data.taxId || undefined,
        serviceFeeId: data.serviceFeeId || undefined,
        takeawayFee: data.takeawayFee || undefined,
        useDimension: data.useDimension,
        weight: data.weight || undefined,
        length: data.length || undefined,
        width: data.width || undefined,
        height: data.height || undefined,
        images: [],
        channelPrices: [
          { channel: 'pos', price: data.price },
          ...(data.channelPrices.gofood ? [{ channel: 'gofood' as const, price: data.channelPrices.gofood }] : []),
          ...(data.channelPrices.grabfood ? [{ channel: 'grabfood' as const, price: data.channelPrices.grabfood }] : []),
          ...(data.channelPrices.shopeefood ? [{ channel: 'shopeefood' as const, price: data.channelPrices.shopeefood }] : []),
        ],
        variantIds: data.variantIds,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProducts(prev => [newProduct, ...prev]);
      showToast("Produk berhasil ditambahkan", "success");
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleToggleStatus = async (product: Product) => {
    // Optimistic update
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, isActive: !p.isActive } : p
    ));
    
    showToast(
      product.isActive 
        ? `${product.name} tidak dijual` 
        : `${product.name} aktif dijual`,
      "success"
    );
  };

  const handleDeleteProduct = async (product: Product) => {
    setDeleteConfirmProduct(product);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmProduct) return;
    
    // Soft delete - just mark as inactive
    setProducts(prev => prev.map(p => 
      p.id === deleteConfirmProduct.id ? { ...p, isActive: false } : p
    ));
    
    showToast(`${deleteConfirmProduct.name} berhasil dihapus`, "success");
    setDeleteConfirmProduct(null);
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
      <div className="bg-white rounded-xl border border-border p-4">
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
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Semua Kategori</option>
            {mockCategories.map((cat) => (
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
      />

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDeleteConfirmProduct(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Hapus Produk?
              </h3>
              <p className="text-text-secondary mb-6">
                Apakah Anda yakin ingin menghapus <strong>{deleteConfirmProduct.name}</strong>? 
                Produk akan dipindahkan ke status Tidak Aktif dan tidak muncul di menu penjualan.
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
