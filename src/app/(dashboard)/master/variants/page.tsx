"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import {
  MasterVariantTable,
  AddOptionsMenu,
} from "@/features/master";
import {
  mockMasterVariants,
  filterMasterVariants,
  getMasterVariantStats,
} from "@/features/master/mock-data";
import { MasterVariant, MasterVariantFilters } from "@/features/master/types";

type StatusTab = 'all' | 'active' | 'inactive';

export default function MasterVariantsPage() {
  const { showToast } = useToast();
  
  // State
  const [variants, setVariants] = useState<MasterVariant[]>(mockMasterVariants);
  const [filters, setFilters] = useState<MasterVariantFilters>({
    status: 'all',
    search: '',
  });
  const [activeTab, setActiveTab] = useState<StatusTab>('all');

  // Computed
  const stats = useMemo(() => getMasterVariantStats(variants), [variants]);
  
  const filteredVariants = useMemo(() => {
    return filterMasterVariants(variants, {
      ...filters,
      status: activeTab,
    });
  }, [variants, filters, activeTab]);

  // Handlers
  const handleEdit = (variant: MasterVariant) => {
    // TODO: Open edit modal
    showToast(`Edit "${variant.name}" - Coming soon`, "info");
  };

  const handleToggleStatus = (variantId: number, isActive: boolean) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.id === variantId
          ? { ...v, isActive, updatedAt: new Date().toISOString() }
          : v
      )
    );
    const variant = variants.find((v) => v.id === variantId);
    showToast(
      `Master varian "${variant?.name}" ${isActive ? "diaktifkan" : "dinonaktifkan"}`,
      "success"
    );
  };

  const handleAddNew = () => {
    showToast("Tambah Master Varian - Coming soon", "info");
  };

  const handleImport = () => {
    showToast(`Impor dari Outlet - Coming soon`, "info");
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
        title="Master Varian"
        description="Kelola varian global yang bisa digunakan di semua outlet"
        breadcrumbs={[
          { label: "Master", href: "/master" },
          { label: "Varian" },
        ]}
        actions={
          <AddOptionsMenu
            label="Tambah Master Varian"
            importLabel="Impor Varian dari Outlet"
            onAddNew={handleAddNew}
            onImport={handleImport}
          />
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Tab Filters */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
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
              placeholder="Cari nama varian..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              leftIcon={<Search className="h-4 w-4" />}
              rightIcon={
                filters.search ? (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                    className="text-gray-400 hover:text-gray-600"
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
      <MasterVariantTable
        variants={filteredVariants}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
