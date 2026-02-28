"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Search, X, Plus } from "lucide-react";
import { SupplierTable } from "@/features/inventory/components/supplier-table";
import { SupplierModal } from "@/features/inventory/components/supplier-modal";
import { mockSuppliers, filterSuppliers } from "@/features/inventory/mock-data";
import { Supplier, SupplierFormData, SupplierFilters } from "@/features/inventory/types";

export default function SuppliersPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [filters, setFilters] = useState<SupplierFilters>({ search: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = useMemo(() => filterSuppliers(suppliers, filters), [suppliers, filters]);

  const handleOpenModal = (supplier?: Supplier) => {
    setEditingSupplier(supplier || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSubmit = (data: SupplierFormData) => {
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === editingSupplier.id
            ? { ...s, ...data, updatedAt: new Date().toISOString() }
            : s
        )
      );
      showToast(`Supplier "${data.name}" berhasil diubah`, "success");
    } else {
      const newSupplier: Supplier = {
        id: Math.max(0, ...suppliers.map((s) => s.id)) + 1,
        ...data,
        materialCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      showToast(`Supplier "${data.name}" berhasil ditambahkan`, "success");
    }
    handleCloseModal();
  };

  const handleDetail = (supplier: Supplier) => {
    router.push(`/inventory/suppliers/${supplier.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supplier"
        description="Kelola daftar supplier bahan dasar"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Supplier" },
        ]}
        actions={
          <Button onClick={() => handleOpenModal()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Tambah Supplier
          </Button>
        }
      />

      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Cari supplier..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={filters.search ? (
              <button onClick={() => setFilters({ search: '' })} className="text-text-disabled hover:text-text-secondary">
                <X className="h-4 w-4" />
              </button>
            ) : undefined}
          />
        </div>
      </div>

      <SupplierTable
        suppliers={filteredSuppliers}
        onEdit={handleOpenModal}
        onDetail={handleDetail}
      />

      <SupplierModal
        open={modalOpen}
        onClose={handleCloseModal}
        supplier={editingSupplier}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
