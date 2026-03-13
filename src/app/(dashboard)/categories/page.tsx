"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Plus, Search, X } from "lucide-react";
import {
  CategoryTable,
  CategoryModal,
} from "@/features/categories";
import {
  mockCategories,
  mockProductsForPicker,
  filterCategories,
  getCategoryStats,
} from "@/features/categories/mock-data";
import { Category, CategoryFormData, CategoryFilters } from "@/features/categories/types";

type StatusTab = 'all' | 'active' | 'inactive';

export default function CategoriesPage() {
  const { showToast } = useToast();
  
  // State
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [filters, setFilters] = useState<CategoryFilters>({
    status: 'all',
    search: '',
  });
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Computed
  const stats = useMemo(() => getCategoryStats(categories), [categories]);
  
  const filteredCategories = useMemo(() => {
    return filterCategories(categories, {
      ...filters,
      status: activeTab,
    });
  }, [categories, filters, activeTab]);

  // Handlers
  const handleOpenModal = (category?: Category) => {
    setEditingCategory(category || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      // Update existing category
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: data.name,
                is_active: data.is_active,
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      showToast(`Kategori "${data.name}" berhasil diubah`, "success");
    } else {
      // Add new category
      const newCategory: Category = {
        id: crypto.randomUUID(),
        store_id: 'store-1',
        name: data.name,
        is_active: data.is_active,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      showToast(`Kategori "${data.name}" berhasil ditambahkan`, "success");
    }
    handleCloseModal();
  };

  const handleToggleStatus = (categoryId: string, is_active: boolean) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, is_active, updatedAt: new Date().toISOString() }
          : c
      )
    );
    const category = categories.find((c) => c.id === categoryId);
    showToast(`Kategori "${category?.name}" ${is_active ? "diaktifkan" : "dinonaktifkan"}`, "success");
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      showToast(`Kategori "${categoryToDelete.name}" berhasil dihapus`, "success");
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
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
        title="Kategori"
        description="Kelola kategori produk untuk outlet Anda"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kategori
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tab Filters */}
          <div className="flex gap-1 p-1 bg-background rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-surface text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.key
                      ? "bg-primary text-white"
                      : "bg-background text-text-secondary"
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
                    className="text-text-disabled hover:text-text-secondary"
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
      <CategoryTable
        categories={filteredCategories}
        onEdit={handleOpenModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        products={mockProductsForPicker}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Kategori &quot;{categoryToDelete?.name}&quot; akan dihapus. Produk di dalam
              kategori ini tidak akan ikut terhapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
