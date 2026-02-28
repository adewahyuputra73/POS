"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Button, useToast } from "@/components/ui";
import { Plus, Search } from "lucide-react";
import { MasterCategoryTable } from "@/features/master/components/master-category-table";
import { MasterCategoryForm } from "@/features/master/components/master-category-form";
import { mockMasterCategories } from "@/features/master/mock-data";
import { MasterCategory } from "@/features/master/types";

export default function MasterCategoryPage() {
  const [categories, setCategories] = useState<MasterCategory[]>(mockMasterCategories);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MasterCategory | null>(null);
  const { showToast } = useToast();

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: MasterCategory) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast("Kategori berhasil dihapus", "success");
    }
  };

  const handleSubmit = (data: Partial<MasterCategory>) => {
    if (editingCategory) {
      // Edit
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, ...data, updatedAt: new Date() }
            : c
        )
      );
      showToast("Perubahan berhasil disimpan", "success");
    } else {
      // Add
      const newCategory: MasterCategory = {
        id: `mc-${Date.now()}`,
        name: data.name || "",
        icon: data.icon || "Box",
        productsCount: 0,
        status: data.status || "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setCategories((prev) => [newCategory, ...prev]);
      showToast("Kategori baru berhasil ditambahkan", "success");
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori Master"
        description="Kelola kategori produk untuk seluruh outlet"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Master Data", href: "/master" },
          { label: "Kategori" },
        ]}
        actions={
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Kategori
          </Button>
        }
      />

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="p-4">
          <MasterCategoryTable
            data={filteredCategories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <MasterCategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={editingCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
