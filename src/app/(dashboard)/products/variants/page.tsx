"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Button, useToast } from "@/components/ui";
import { VariantTable } from "@/features/products/components/variant-table";
import { VariantModal } from "@/features/products/components/variant-modal";
import { Variant, VariantFormData, VariantOption } from "@/features/products/types";
import { mockVariants, filterVariants } from "@/features/products/mock-data";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  X,
  Layers,
} from "lucide-react";

export default function VariantsPage() {
  const { showToast } = useToast();
  
  // Data state
  const [variants, setVariants] = useState<Variant[]>(mockVariants);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [deleteConfirmVariant, setDeleteConfirmVariant] = useState<Variant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return filterVariants(variants, { search: searchQuery });
  }, [variants, searchQuery]);

  // Handlers
  const handleOpenModal = (variant?: Variant) => {
    setEditingVariant(variant || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingVariant(null);
  };

  const handleSaveVariant = async (data: VariantFormData, variantId?: number) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (variantId) {
      // Update
      setVariants(prev => prev.map(v => 
        v.id === variantId 
          ? { 
              ...v, 
              name: data.name,
              isRequired: data.isRequired,
              maxOptions: data.maxOptions || undefined,
              options: data.options.map((opt, idx) => ({
                id: opt.id || Date.now() + idx,
                name: opt.name,
                price: opt.price,
                channelPrices: opt.channelPrices ? [
                  { channel: 'gofood' as const, price: opt.channelPrices.gofood },
                  { channel: 'grabfood' as const, price: opt.channelPrices.grabfood },
                  { channel: 'shopeefood' as const, price: opt.channelPrices.shopeefood },
                ] : undefined,
                useStock: opt.useStock,
                stockQuantity: opt.stockQuantity,
                isActive: opt.isActive,
                sourceProductId: opt.sourceProductId,
              })),
              updatedAt: new Date().toISOString(),
            } 
          : v
      ));
      showToast("Varian berhasil diperbarui", "success");
    } else {
      // Create
      const newVariant: Variant = {
        id: Math.max(...variants.map(v => v.id)) + 1,
        name: data.name,
        isRequired: data.isRequired,
        maxOptions: data.maxOptions || undefined,
        sourceType: data.sourceType,
        options: data.options.map((opt, idx) => ({
          id: Date.now() + idx,
          name: opt.name,
          price: opt.price,
          channelPrices: opt.channelPrices ? [
            { channel: 'gofood' as const, price: opt.channelPrices.gofood },
            { channel: 'grabfood' as const, price: opt.channelPrices.grabfood },
            { channel: 'shopeefood' as const, price: opt.channelPrices.shopeefood },
          ] : undefined,
          useStock: opt.useStock,
          stockQuantity: opt.stockQuantity,
          isActive: opt.isActive,
          sourceProductId: opt.sourceProductId,
        })),
        appliedProductCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVariants(prev => [newVariant, ...prev]);
      showToast("Varian berhasil ditambahkan", "success");
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleToggleStatus = async (variant: Variant) => {
    // Optimistic update
    setVariants(prev => prev.map(v => 
      v.id === variant.id ? { ...v, isActive: !v.isActive } : v
    ));
    
    showToast(
      variant.isActive 
        ? `${variant.name} dinonaktifkan` 
        : `${variant.name} diaktifkan`,
      "success"
    );
  };

  const handleDeleteVariant = async (variant: Variant) => {
    if (variant.appliedProductCount > 0) {
      showToast("Tidak dapat menghapus varian yang sudah diterapkan ke produk", "error");
      return;
    }
    setDeleteConfirmVariant(variant);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmVariant) return;
    
    // Remove variant
    setVariants(prev => prev.filter(v => v.id !== deleteConfirmVariant.id));
    
    showToast(`${deleteConfirmVariant.name} berhasil dihapus`, "success");
    setDeleteConfirmVariant(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Varian"
        description="Kelola varian produk seperti ukuran, topping, dan level pedas"
        actions={
          <Button onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Varian
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama varian..."
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
        </div>

        {/* Results Info */}
        {searchQuery && (
          <div className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
            <Layers className="h-4 w-4" />
            <span>
              Menampilkan {filteredVariants.length} dari {variants.length} varian
            </span>
          </div>
        )}
      </div>

      {/* Variant Table */}
      <VariantTable
        variants={filteredVariants}
        onEdit={handleOpenModal}
        onDelete={handleDeleteVariant}
        onToggleStatus={handleToggleStatus}
      />

      {/* Variant Modal */}
      <VariantModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveVariant}
        variant={editingVariant}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmVariant && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setDeleteConfirmVariant(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Hapus Varian?
              </h3>
              <p className="text-text-secondary mb-6">
                Apakah Anda yakin ingin menghapus varian <strong>{deleteConfirmVariant.name}</strong>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirmVariant(null)}>
                  Batal
                </Button>
                <Button variant="primary" onClick={confirmDelete} className="bg-error hover:bg-error/90">
                  Hapus Varian
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
