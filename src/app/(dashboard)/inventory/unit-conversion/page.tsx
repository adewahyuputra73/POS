"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Search, X, Plus } from "lucide-react";
import { UnitConversionTable } from "@/features/inventory/components/unit-conversion-table";
import { UnitConversionModal } from "@/features/inventory/components/unit-conversion-modal";
import {
  mockUnitConversions,
  filterUnitConversions,
} from "@/features/inventory/mock-data";
import { UnitConversion, UnitConversionFormData, UnitConversionFilters } from "@/features/inventory/types";

export default function UnitConversionPage() {
  const { showToast } = useToast();

  const [conversions, setConversions] = useState<UnitConversion[]>(mockUnitConversions);
  const [filters, setFilters] = useState<UnitConversionFilters>({ search: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingConversion, setEditingConversion] = useState<UnitConversion | null>(null);

  const filteredConversions = useMemo(() => filterUnitConversions(conversions, filters), [conversions, filters]);

  const handleOpenModal = (conversion?: UnitConversion) => {
    setEditingConversion(conversion || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingConversion(null);
  };

  const handleSubmit = (data: UnitConversionFormData) => {
    if (editingConversion) {
      setConversions((prev) =>
        prev.map((c) =>
          c.id === editingConversion.id
            ? {
                ...c,
                name: data.name,
                units: data.units.map((u, i) => ({ ...u, id: c.units[i]?.id || Date.now() + i })),
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      showToast(`Konversi unit "${data.name}" berhasil diubah`, "success");
    } else {
      const newConversion: UnitConversion = {
        id: Math.max(0, ...conversions.map((c) => c.id)) + 1,
        name: data.name,
        units: data.units.map((u, i) => ({ ...u, id: Date.now() + i })),
        linkedMaterialCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversions((prev) => [...prev, newConversion]);
      showToast(`Konversi unit "${data.name}" berhasil ditambahkan`, "success");
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    const conv = conversions.find((c) => c.id === id);
    if (conv && conv.linkedMaterialCount > 0) {
      showToast("Tidak bisa menghapus konversi yang masih terhubung dengan bahan", "error");
      return;
    }
    setConversions((prev) => prev.filter((c) => c.id !== id));
    showToast(`Konversi unit "${conv?.name}" berhasil dihapus`, "success");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Konversi Unit"
        description="Kelola konversi satuan untuk bahan dasar inventory"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Konversi Unit" },
        ]}
        actions={
          <Button onClick={() => handleOpenModal()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Tambah Konversi Unit
          </Button>
        }
      />

      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Cari konversi unit..."
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

      <UnitConversionTable
        conversions={filteredConversions}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
      />

      <UnitConversionModal
        open={modalOpen}
        onClose={handleCloseModal}
        conversion={editingConversion}
        onSubmit={handleSubmit}
        existingNames={conversions.map((c) => c.name)}
      />
    </div>
  );
}
