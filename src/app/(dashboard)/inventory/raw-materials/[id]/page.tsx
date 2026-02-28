"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { ArrowLeft, Plus, Minus, FlaskConical } from "lucide-react";
import { StockLogTable } from "@/features/inventory/components/stock-log-table";
import { RecipeSection } from "@/features/inventory/components/recipe-section";
import { AddStockModal } from "@/features/inventory/components/add-stock-modal";
import { ReduceStockModal } from "@/features/inventory/components/reduce-stock-modal";
import { SelectMaterialModal } from "@/features/inventory/components/select-material-modal";
import {
  mockRawMaterials,
  mockStockLogs,
  mockSuppliers,
  getStockLogsForMaterial,
} from "@/features/inventory/mock-data";
import { StockLog, AddStockData, ReduceStockData, RecipeIngredient } from "@/features/inventory/types";

const statusConfig = {
  available: { label: 'Masih Ada', class: 'bg-green-50 text-green-700 border-green-200' },
  low: { label: 'Menipis', class: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  empty: { label: 'Habis', class: 'bg-red-50 text-red-700 border-red-200' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function RawMaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const materialId = Number(params.id);
  const material = mockRawMaterials.find((m) => m.id === materialId);

  const [logs, setLogs] = useState<StockLog[]>(getStockLogsForMaterial(materialId));
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [reduceStockOpen, setReduceStockOpen] = useState(false);
  const [selectMaterialOpen, setSelectMaterialOpen] = useState(false);

  // Mock recipe for semi-finished
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>(() => {
    if (material?.type === 'semi_finished') {
      // mock recipe ingredients for semi-finished materials
      if (materialId === 10) {
        return [
          { id: 1, materialId: 6, materialName: 'Bawang Merah', materialType: 'raw', quantity: 100, unit: 'gram', pricePerUnit: 35, totalPrice: 3500 },
          { id: 2, materialId: 7, materialName: 'Bawang Putih', materialType: 'raw', quantity: 50, unit: 'gram', pricePerUnit: 30, totalPrice: 1500 },
          { id: 3, materialId: 8, materialName: 'Cabai Merah', materialType: 'raw', quantity: 30, unit: 'gram', pricePerUnit: 75, totalPrice: 2250 },
        ];
      }
    }
    return [];
  });

  const totalHpp = useMemo(() => ingredients.reduce((sum, i) => sum + i.totalPrice, 0), [ingredients]);

  if (!material) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Bahan Tidak Ditemukan"
          description="Bahan yang Anda cari tidak ditemukan"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Bahan Dasar", href: "/inventory/raw-materials" },
            { label: "Detail" },
          ]}
        />
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Button variant="outline" onClick={() => router.back()}>Kembali</Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[material.status];

  const handleAddStock = (data: AddStockData) => {
    const newLog: StockLog = {
      id: Date.now(),
      materialId,
      description: 'Penambahan Stok',
      notes: data.notes,
      purchasePrice: data.price,
      quantity: data.quantity,
      newStock: material.currentStock + data.quantity,
      stockValue: (material.currentStock + data.quantity) * material.hpp,
      mutationType: 'addition',
      supplierId: data.supplierId,
      supplierName: mockSuppliers.find((s) => s.id === data.supplierId)?.name,
      createdAt: new Date().toISOString(),
      userName: 'Admin',
    };
    setLogs((prev) => [newLog, ...prev]);
    setAddStockOpen(false);
    showToast(`Stok berhasil ditambah ${data.quantity} ${material.baseUnit}`, "success");
  };

  const handleReduceStock = (data: ReduceStockData) => {
    const newLog: StockLog = {
      id: Date.now(),
      materialId,
      description: 'Pengurangan Manual',
      notes: data.notes,
      purchasePrice: 0,
      quantity: -data.quantity,
      newStock: material.currentStock - data.quantity,
      stockValue: (material.currentStock - data.quantity) * material.hpp,
      mutationType: 'reduction',
      createdAt: new Date().toISOString(),
      userName: 'Admin',
    };
    setLogs((prev) => [newLog, ...prev]);
    setReduceStockOpen(false);
    showToast(`Stok berhasil dikurangi ${data.quantity} ${material.baseUnit}`, "success");
  };

  const handleAddIngredients = (materialIds: number[]) => {
    const newIngredients: RecipeIngredient[] = materialIds.map((id) => {
      const m = mockRawMaterials.find((mat) => mat.id === id)!;
      return {
        id: Date.now() + id,
        materialId: id,
        materialName: m.name,
        materialType: m.type,
        quantity: 1,
        unit: m.baseUnit,
        pricePerUnit: m.hpp,
        totalPrice: m.hpp,
      };
    });
    setIngredients((prev) => [...prev, ...newIngredients]);
    setSelectMaterialOpen(false);
    showToast(`${materialIds.length} bahan berhasil ditambahkan ke resep`, "success");
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setIngredients((prev) => prev.filter((i) => i.id !== ingredientId));
  };

  const handleUpdateQuantity = (ingredientId: number, quantity: number) => {
    setIngredients((prev) =>
      prev.map((i) =>
        i.id === ingredientId
          ? { ...i, quantity, totalPrice: quantity * i.pricePerUnit }
          : i
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={material.name}
        description={`${material.type === 'raw' ? 'Bahan Mentah' : 'Bahan Setengah Jadi'} · ${material.categoryName}`}
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Bahan Dasar", href: "/inventory/raw-materials" },
          { label: material.name },
        ]}
        actions={
          <Button variant="outline" onClick={() => router.back()} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        }
      />

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Stok Saat Ini</p>
          <p className="text-xl font-bold text-text-primary">{new Intl.NumberFormat('id-ID').format(material.currentStock)} {material.baseUnit}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Nilai Stok</p>
          <p className="text-xl font-bold text-text-primary">{formatCurrency(material.stockValue)}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Batas Bawah</p>
          <p className="text-xl font-bold text-text-primary">{new Intl.NumberFormat('id-ID').format(material.stockLimit)} {material.baseUnit}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Status</p>
          <span className={cn("inline-flex px-3 py-1 rounded-full text-sm font-medium border", status.class)}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setAddStockOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Tambah Stok
        </Button>
        <Button
          variant="outline"
          onClick={() => setReduceStockOpen(true)}
          disabled={material.currentStock === 0}
          className="gap-1.5"
        >
          <Minus className="h-4 w-4" />
          Kurangi Stok
        </Button>
      </div>

      {/* Recipe (only for semi-finished) */}
      {material.type === 'semi_finished' && (
        <RecipeSection
          ingredients={ingredients}
          totalHpp={totalHpp}
          onAddIngredient={() => setSelectMaterialOpen(true)}
          onRemoveIngredient={handleRemoveIngredient}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}

      {/* Stock Logs */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-3">Riwayat Arus Stok</h3>
        <StockLogTable logs={logs} />
      </div>

      {/* Modals */}
      <AddStockModal
        open={addStockOpen}
        onClose={() => setAddStockOpen(false)}
        materialName={material.name}
        baseUnit={material.baseUnit}
        suppliers={mockSuppliers}
        onSubmit={handleAddStock}
      />
      <ReduceStockModal
        open={reduceStockOpen}
        onClose={() => setReduceStockOpen(false)}
        materialName={material.name}
        baseUnit={material.baseUnit}
        currentStock={material.currentStock}
        onSubmit={handleReduceStock}
      />
      {material.type === 'semi_finished' && (
        <SelectMaterialModal
          open={selectMaterialOpen}
          onClose={() => setSelectMaterialOpen(false)}
          materials={mockRawMaterials}
          excludeIds={[material.id, ...ingredients.map((i) => i.materialId)]}
          onSelect={handleAddIngredients}
        />
      )}
    </div>
  );
}
