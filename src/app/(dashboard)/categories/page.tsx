import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import {
  Button,
  Input,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  useToast,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Plus, Search, X } from "lucide-react";
import {
  CategoryTable,
  CategoryModal,
  categoryService,
} from "@/features/categories";
import type { Category, CategoryFormData, CategoryFilters, ProductForPicker } from "@/features/categories";
import { productService } from "@/features/products";
import { useAuthStore } from "@/stores";

type StatusTab = 'all' | 'active' | 'inactive';

export default function CategoriesPage() {
  const { showToast } = useToast();
  const user = useAuthStore((s) => s.user);
  const isOwner = user?.role === "owner";

  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductForPicker[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [filters, setFilters] = useState<CategoryFilters>({
    status: 'all',
    search: '',
  });
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [categoryData, productData] = await Promise.all([
        categoryService.list(),
        productService.list(),
      ]);
      setCategories(categoryData);
      setProducts(productData.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        categoryName: p.categoryName,
        isActive: p.isActive,
      })));
    } catch {
      showToast("Gagal memuat data kategori", "error");
    } finally {
      setIsFetching(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Computed
  const stats = useMemo(() => ({
    total: categories.length,
    active: categories.filter(c => c.is_active).length,
    inactive: categories.filter(c => !c.is_active).length,
  }), [categories]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = !filters.search ||
        c.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = activeTab === 'all' ||
        (activeTab === 'active' && c.is_active) ||
        (activeTab === 'inactive' && !c.is_active);
      return matchesSearch && matchesStatus;
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

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      let categoryId: string;
      if (editingCategory) {
        await categoryService.update(editingCategory.id, { name: data.name });
        categoryId = editingCategory.id;
        showToast(`Kategori "${data.name}" berhasil diubah`, "success");
      } else {
        const created = await categoryService.create({ name: data.name });
        categoryId = created.id;
        showToast(`Kategori "${data.name}" berhasil ditambahkan`, "success");
      }

      // Assign selected products to this category via PUT /products/{id}
      if (data.productIds.length > 0) {
        const results = await Promise.allSettled(
          data.productIds.map((pid) =>
            productService.update(pid, { category_id: categoryId })
          )
        );
        const failed = results.filter((r) => r.status === "rejected").length;
        if (failed > 0) {
          showToast(
            `${data.productIds.length - failed} produk dipindahkan ke kategori. ${failed} gagal.`,
            "warning"
          );
        } else if (data.productIds.length > 0) {
          showToast(`${data.productIds.length} produk berhasil dipindahkan ke kategori`, "success");
        }
      }

      await fetchData();
      handleCloseModal();
    } catch {
      showToast("Gagal menyimpan kategori", "error");
    }
  };

  const handleToggleStatus = async (categoryId: string, is_active: boolean) => {
    // Optimistic update on UI
    setCategories(prev =>
      prev.map(c => c.id === categoryId ? { ...c, is_active } : c)
    );
    const category = categories.find(c => c.id === categoryId);
    showToast(`Kategori "${category?.name}" ${is_active ? "diaktifkan" : "dinonaktifkan"}`, "success");

    // Cascade status to products in this category
    // Find products whose categoryName matches this category
    const affectedProducts = products.filter(
      (p) => p.categoryName === category?.name && p.isActive !== is_active
    );
    if (affectedProducts.length > 0) {
      await Promise.allSettled(
        affectedProducts.map((p) => productService.toggleStatus(p.id))
      );
      // Refresh to sync product statuses
      fetchData();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      showToast(`Kategori "${categoryToDelete.name}" berhasil dihapus`, "success");
    } catch {
      showToast("Gagal menghapus kategori", "error");
    } finally {
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
          isOwner ? (
            <Button onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Kategori
            </Button>
          ) : undefined
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
        onDelete={(category) => {
          setCategoryToDelete(category);
          setDeleteConfirmOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        readOnly={!isOwner}
      />

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        products={products}
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
