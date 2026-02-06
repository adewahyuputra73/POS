"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import {
  MasterCategoryTable,
  MasterCategoryModal,
  ImportCategoryModal,
  AddOptionsMenu,
} from "@/features/master";
import {
  mockMasterCategories,
  mockMasterProducts,
  mockOutlets,
  filterMasterCategories,
  getMasterCategoryStats,
} from "@/features/master/mock-data";
import { MasterCategory, MasterCategoryFormData, MasterCategoryFilters } from "@/features/master/types";

type StatusTab = 'all' | 'active' | 'inactive';

export default function MasterCategoriesPage() {
  const { showToast } = useToast();
  
  // State
  const [categories, setCategories] = useState<MasterCategory[]>(mockMasterCategories);
  const [filters, setFilters] = useState<MasterCategoryFilters>({
    status: 'all',
    search: '',
  });
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MasterCategory | null>(null);

  // Computed
  const stats = useMemo(() => getMasterCategoryStats(categories), [categories]);
  
  const filteredCategories = useMemo(() => {
    return filterMasterCategories(categories, {
      ...filters,
      status: activeTab,
    });
  }, [categories, filters, activeTab]);

  // Handlers
  const handleOpenModal = (category?: MasterCategory) => {
    setEditingCategory(category || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (data: MasterCategoryFormData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: data.name,
                isActive: data.isActive,
                productIds: data.productIds,
                productCount: data.productIds.length,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      showToast(`Master kategori "${data.name}" berhasil diubah`, "success");
    } else {
      const newCategory: MasterCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: data.name,
        isActive: data.isActive,
        productIds: data.productIds,
        productCount: data.productIds.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      showToast(`Master kategori "${data.name}" berhasil ditambahkan`, "success");
    }
    handleCloseModal();
  };

  const handleToggleStatus = (categoryId: number, isActive: boolean) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, isActive, updatedAt: new Date().toISOString() }
          : c
      )
    );
    const category = categories.find((c) => c.id === categoryId);
    showToast(
      `Master kategori "${category?.name}" ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
      "success"
    );
  };

  const handleImport = (outletId: number, categoryIds: number[]) => {
    // In real app: fetch categories from outlet and create master categories
    const outlet = mockOutlets.find((o) => o.id === outletId);
    const importedCount = categoryIds.length;
    
    // Mock: add imported categories
    const newCategories = categoryIds.map((id, index) => ({
      id: Math.max(...categories.map((c) => c.id)) + index + 1,
      name: `Kategori Import ${id}`,
      isActive: true,
      productCount: 0,
      productIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    setCategories((prev) => [...prev, ...newCategories]);
    showToast(
      `${importedCount} kategori berhasil diimpor dari ${outlet?.name}`,
      "success"
    );
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
        title="Master Kategori"
        description="Kelola kategori global yang bisa digunakan di semua outlet"
        breadcrumbs={[
          { label: "Master", href: "/master" },
          { label: "Kategori" },
        ]}
        actions={
          <AddOptionsMenu
            label="Tambah Master Kategori"
            importLabel="Impor Kategori dari Outlet"
            onAddNew={() => handleOpenModal()}
            onImport={() => setImportModalOpen(true)}
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
                      ? "bg-purple-600 text-white"
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
              placeholder="Cari nama kategori..."
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
      <MasterCategoryTable
        categories={filteredCategories}
        onEdit={handleOpenModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal */}
      <MasterCategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        masterProducts={mockMasterProducts}
        onSubmit={handleSubmit}
      />

      {/* Import Modal */}
      <ImportCategoryModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        outlets={mockOutlets}
        onImport={handleImport}
      />
    </div>
  );
}
