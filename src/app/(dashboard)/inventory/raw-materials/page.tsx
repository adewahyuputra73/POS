"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Search, X, Plus } from "lucide-react";
import { RawMaterialTable } from "@/features/inventory/components/raw-material-table";
import { RawMaterialModal } from "@/features/inventory/components/raw-material-modal";
import {
  mockRawMaterials,
  mockInventoryCategories,
  mockUnitConversions,
  filterRawMaterials,
  getRawMaterialStats,
} from "@/features/inventory/mock-data";
import {
  RawMaterial,
  RawMaterialFormData,
  RawMaterialFilters,
  MaterialType,
  StockStatus,
} from "@/features/inventory/types";

type TypeTab = 'raw' | 'semi_finished';

export default function RawMaterialsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [materials, setMaterials] = useState<RawMaterial[]>(mockRawMaterials);
  const [activeTab, setActiveTab] = useState<TypeTab>('raw');
  const [filters, setFilters] = useState<RawMaterialFilters>({
    type: 'raw',
    search: '',
    categoryId: 'all',
    stockStatus: 'all',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);

  const stats = useMemo(() => getRawMaterialStats(materials, activeTab), [materials, activeTab]);

  const filteredMaterials = useMemo(() => {
    return filterRawMaterials(materials, { ...filters, type: activeTab });
  }, [materials, filters, activeTab]);

  const handleTabChange = (tab: TypeTab) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, type: tab, categoryId: 'all', stockStatus: 'all', search: '' }));
  };

  const handleOpenModal = (material?: RawMaterial) => {
    setEditingMaterial(material || null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingMaterial(null);
  };

  const handleSubmit = (data: RawMaterialFormData) => {
    const cat = mockInventoryCategories.find((c) => c.id === data.categoryId);
    const unit = mockUnitConversions.find((u) => u.id === data.unitConversionId);
    const baseU = unit?.units.find((u) => u.role === 'base');

    if (editingMaterial) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === editingMaterial.id
            ? {
                ...m, name: data.name, categoryId: data.categoryId,
                categoryName: cat?.name || '', unitConversionId: data.unitConversionId,
                unitConversionName: unit?.name || '', baseUnit: baseU?.name || '',
                estimatedProduction: data.estimatedProduction,
                stockLimit: data.stockLimit || 0, updatedAt: new Date().toISOString(),
              }
            : m
        )
      );
      showToast(`Bahan "${data.name}" berhasil diubah`, "success");
    } else {
      const newMaterial: RawMaterial = {
        id: Math.max(0, ...materials.map((m) => m.id)) + 1,
        name: data.name, type: data.type,
        categoryId: data.categoryId, categoryName: cat?.name || '',
        unitConversionId: data.unitConversionId, unitConversionName: unit?.name || '',
        baseUnit: baseU?.name || '', currentStock: 0, stockValue: 0,
        stockLimit: data.stockLimit || 0, estimatedProduction: data.estimatedProduction,
        status: 'empty', hpp: 0,
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setMaterials((prev) => [...prev, newMaterial]);
      showToast(`Bahan "${data.name}" berhasil ditambahkan`, "success");
    }
    handleCloseModal();
  };

  const handleDetail = (material: RawMaterial) => {
    router.push(`/inventory/raw-materials/${material.id}`);
  };

  const tabs: { key: TypeTab; label: string }[] = [
    { key: 'raw', label: 'Bahan Mentah' },
    { key: 'semi_finished', label: 'Bahan Setengah Jadi' },
  ];

  const stockStatusOptions: { value: StockStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Semua Status' },
    { value: 'available', label: 'Masih Ada' },
    { value: 'low', label: 'Menipis' },
    { value: 'empty', label: 'Habis' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bahan Dasar"
        description="Kelola bahan mentah dan bahan setengah jadi"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Bahan Dasar" },
        ]}
        actions={
          <Button onClick={() => handleOpenModal()} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Tambah Bahan Dasar
          </Button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 space-y-4">
        {/* Type Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                activeTab === tab.key ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
              )}>
                {tab.key === 'raw'
                  ? materials.filter((m) => m.type === 'raw').length
                  : materials.filter((m) => m.type === 'semi_finished').length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Cari bahan dasar..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              leftIcon={<Search className="h-4 w-4" />}
              rightIcon={filters.search ? (
                <button onClick={() => setFilters((prev) => ({ ...prev, search: '' }))} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              ) : undefined}
            />
          </div>

          {/* Category Filter */}
          <select
            className="h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
            value={filters.categoryId === 'all' ? 'all' : String(filters.categoryId)}
            onChange={(e) => setFilters((prev) => ({
              ...prev,
              categoryId: e.target.value === 'all' ? 'all' : Number(e.target.value),
            }))}
          >
            <option value="all">Semua Kategori</option>
            {mockInventoryCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <select
            className="h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
            value={filters.stockStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, stockStatus: e.target.value as StockStatus | 'all' }))}
          >
            {stockStatusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 text-sm">
          <span className="text-gray-500">Total: <strong className="text-gray-900">{stats.total}</strong></span>
          <span className="text-green-600">Masih Ada: <strong>{stats.available}</strong></span>
          <span className="text-yellow-600">Menipis: <strong>{stats.low}</strong></span>
          <span className="text-red-600">Habis: <strong>{stats.empty}</strong></span>
        </div>
      </div>

      {/* Table */}
      <RawMaterialTable
        materials={filteredMaterials}
        onEdit={handleOpenModal}
        onDetail={handleDetail}
      />

      {/* Modal */}
      <RawMaterialModal
        open={modalOpen}
        onClose={handleCloseModal}
        material={editingMaterial}
        materialType={activeTab}
        categories={mockInventoryCategories}
        unitConversions={mockUnitConversions}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
