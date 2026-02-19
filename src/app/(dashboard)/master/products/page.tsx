"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import {
  MasterProductTable,
  MasterProductForm,
  AddOptionsMenu,
  ImportProductModal,
} from "@/features/master";
import {
  mockMasterProducts,
  mockMasterCategories,
  mockMasterVariants,
  mockOutlets,
  filterMasterProducts,
  getMasterProductStats,
} from "@/features/master/mock-data";
import { MasterProduct, MasterProductFilters } from "@/features/master/types";

type StatusTab = 'all' | 'active' | 'inactive';

export default function MasterProductsPage() {
  const { showToast } = useToast();
  
  // State
  const [products, setProducts] = useState<MasterProduct[]>(mockMasterProducts);
  const [filters, setFilters] = useState<MasterProductFilters>({
    status: 'all',
    search: '',
  });
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MasterProduct | null>(null);

  // Computed
  const stats = useMemo(() => getMasterProductStats(products), [products]);
  
  const filteredProducts = useMemo(() => {
    return filterMasterProducts(products, {
      ...filters,
      status: activeTab,
    });
  }, [products, filters, activeTab]);

  // Handlers
  const handleEdit = (product: MasterProduct) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (productId: string, isActive: boolean) => {
    const newStatus = isActive ? 'ACTIVE' : 'INACTIVE';
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, status: newStatus, updatedAt: new Date() }
          : p
      )
    );
    const product = products.find((p) => p.id === productId);
    showToast(
      `Master produk "${product?.name}" ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
      "success"
    );
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };
  
  const handleFormSubmit = (data: Omit<MasterProduct, "id" | "createdAt" | "updatedAt">) => {
    if (selectedProduct) {
      // Edit
      setProducts((prev) => 
        prev.map((p) => 
          p.id === selectedProduct.id 
            ? { ...p, ...data, updatedAt: new Date() }
            : p
        )
      );
      showToast(`Master produk "${data.name}" berhasil diperbarui`, "success");
    } else {
      // Add
      const newProduct: MasterProduct = {
        id: `mp-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast(`Master produk "${data.name}" berhasil dibuat`, "success");
    }
    setIsFormOpen(false);
  };

  // Import State
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleImport = () => {
    setIsImportOpen(true);
  };

  const handleImportSubmit = (newProducts: Partial<MasterProduct>[]) => {
    const imported: MasterProduct[] = newProducts.map((p, index) => ({
      id: `mp-imp-${Date.now()}-${index}`,
      name: p.name || "Imported Product",
      categoryId: "mc-1",
      basePrice: p.basePrice || 0,
      costPrice: 0,
       channelPrices: { goFood: 0, grabFood: 0, shopeeFood: 0 },
      trackStock: true,
      stock: 0,
      hasTax: false,
      hasServiceFee: false,
      variantIds: [],
      outletIds: [],
      ...p,
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as MasterProduct));

    setProducts(prev => [...imported, ...prev]);
    showToast(`Berhasil mengimpor ${imported.length} produk`, "success");
  };

  const tabs: { key: StatusTab; label: string; count: number }[] = [
    { key: 'all', label: 'Semua', count: stats.total },
    { key: 'active', label: 'Aktif', count: stats.active },
    { key: 'inactive', label: 'Tidak Aktif', count: stats.inactive },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Master Produk"
        description="Kelola produk global yang bisa digunakan di semua outlet"
        breadcrumbs={[
          { label: "Master", href: "/master" },
          { label: "Produk" },
        ]}
        actions={
          <AddOptionsMenu
            label="Tambah Master Produk"
            importLabel="Impor Produk dari Outlet"
            onAddNew={handleAddNew}
            onImport={handleImport}
          />
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tab Filters */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.key
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Cari nama produk..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              leftIcon={<Search className="h-4 w-4" />}
              rightIcon={
                filters.search ? (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <MasterProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
      
      {/* Form Dialog */}
      <MasterProductForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
        onSubmit={handleFormSubmit}
        categories={mockMasterCategories}
        variants={mockMasterVariants}
        outlets={mockOutlets}
      />

      <ImportProductModal 
        open={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImportSubmit}
      />
    </div>
  );
}
