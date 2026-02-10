"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Plus } from "lucide-react";
import { InventoryCategoryTable } from "@/features/inventory/components/inventory-category-table";
import { InventoryCategoryModal } from "@/features/inventory/components/inventory-category-modal";
import { mockInventoryCategories } from "@/features/inventory/mock-data";
import { InventoryCategory, InventoryCategoryFormData } from "@/features/inventory/types";

export default function InventoryCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<InventoryCategory[]>(mockInventoryCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<InventoryCategory | null>(null);

  const handleOpenModal = (category?: InventoryCategory) => {
    setEditingCategory(category || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (data: InventoryCategoryFormData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name: data.name, updatedAt: new Date().toISOString() }
            : c
        )
      );
      showToast(`Kategori "${data.name}" berhasil diubah`, "success");
    } else {
      const newCategory: InventoryCategory = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        name: data.name,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      showToast(`Kategori "${data.name}" berhasil ditambahkan`, "success");
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori Inventory"
        description="Kelola kategori untuk mengelompokkan bahan dasar"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Kategori" },
        ]}
        actions={
          <Button onClick={() => handleOpenModal()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        }
      />

      <InventoryCategoryTable
        categories={categories}
        onEdit={handleOpenModal}
      />

      <InventoryCategoryModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        existingNames={categories.map((c) => c.name)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
