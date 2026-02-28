"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ArrowLeft, Plus, Phone, MapPin, CreditCard, Clock } from "lucide-react";
import { SupplierMaterialTable } from "@/features/inventory/components/supplier-material-table";
import { AddSupplierMaterialModal } from "@/features/inventory/components/add-supplier-material-modal";
import {
  mockSuppliers,
  mockRawMaterials,
  getSupplierMaterials,
} from "@/features/inventory/mock-data";
import { SupplierMaterial, SupplierMaterialFormData } from "@/features/inventory/types";

export default function SupplierDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const supplierId = Number(params.id);
  const supplier = mockSuppliers.find((s) => s.id === supplierId);

  const [materials, setMaterials] = useState<SupplierMaterial[]>(getSupplierMaterials(supplierId));
  const [addModalOpen, setAddModalOpen] = useState(false);

  if (!supplier) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Supplier Tidak Ditemukan"
          description="Supplier yang Anda cari tidak ditemukan"
          breadcrumbs={[{ label: "Inventory" }, { label: "Supplier", href: "/inventory/suppliers" }, { label: "Detail" }]}
        />
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Button variant="outline" onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    );
  }

  const handleAddMaterial = (data: SupplierMaterialFormData) => {
    const mat = mockRawMaterials.find((m) => m.id === data.materialId);
    const newItem: SupplierMaterial = {
      id: Date.now(),
      supplierId,
      materialId: data.materialId,
      materialName: mat?.name || '',
      categoryName: mat?.categoryName || '',
      purchaseQty: data.purchaseQty,
      purchaseUnit: data.purchaseUnit,
      pricePerUnit: data.pricePerUnit,
      minOrder: data.minOrder,
      isPrimary: data.isPrimary,
      includePpn: data.includePpn,
    };
    setMaterials((prev) => [...prev, newItem]);
    setAddModalOpen(false);
    showToast(`Bahan "${mat?.name}" berhasil ditambahkan`, "success");
  };

  const handleDeleteMaterial = (materialId: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    showToast("Bahan berhasil dihapus dari supplier", "success");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={supplier.name}
        description="Detail dan daftar bahan supplier"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Supplier", href: "/inventory/suppliers" },
          { label: supplier.name },
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Button>
        }
      />

      {/* Supplier Info */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Informasi Supplier</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-text-disabled mt-0.5" />
            <div>
              <p className="text-xs text-text-secondary">No. Telepon</p>
              <p className="text-sm font-medium text-text-primary">{supplier.phone || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-text-disabled mt-0.5" />
            <div>
              <p className="text-xs text-text-secondary">Alamat</p>
              <p className="text-sm font-medium text-text-primary">{supplier.address || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-text-disabled mt-0.5" />
            <div>
              <p className="text-xs text-text-secondary">Tempo Pembayaran</p>
              <p className="text-sm font-medium text-text-primary">{supplier.paymentTerm || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CreditCard className="h-5 w-5 text-text-disabled mt-0.5" />
            <div>
              <p className="text-xs text-text-secondary">Tipe Pembayaran</p>
              <p className="text-sm font-medium text-text-primary capitalize">{supplier.paymentType || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Materials */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-text-primary">Daftar Bahan</h3>
          <Button onClick={() => setAddModalOpen(true)} className="gap-1.5" size="sm">
            <Plus className="h-4 w-4" /> Tambah Bahan
          </Button>
        </div>
        <SupplierMaterialTable
          materials={materials}
          onEdit={() => {}}
          onDelete={handleDeleteMaterial}
        />
      </div>

      <AddSupplierMaterialModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        materials={mockRawMaterials}
        excludeMaterialIds={materials.map((m) => m.materialId)}
        onSubmit={handleAddMaterial}
      />
    </div>
  );
}
