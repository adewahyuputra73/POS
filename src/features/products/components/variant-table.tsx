"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Variant, VariantOption } from "../types";
import { StatusToggle } from "./status-toggle";
import { 
  Edit2, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Layers,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Package,
  AlertCircle,
} from "lucide-react";

interface VariantTableProps {
  variants: Variant[];
  onEdit: (variant: Variant) => void;
  onDelete: (variant: Variant) => void;
  onToggleStatus: (variant: Variant) => void;
  isLoading?: boolean;
}

type SortKey = "name" | "options" | "appliedProductCount";
type SortOrder = "asc" | "desc";

export function VariantTable({
  variants,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: VariantTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortKey) {
        case "options":
          aVal = a.options.length;
          bVal = b.options.length;
          break;
        case "appliedProductCount":
          aVal = a.appliedProductCount;
          bVal = b.appliedProductCount;
          break;
        default:
          aVal = a[sortKey];
          bVal = b[sortKey];
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" 
        ? (aVal as number) - (bVal as number) 
        : (bVal as number) - (aVal as number);
    });
  }, [variants, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedVariants.length / pageSize);
  const paginatedVariants = sortedVariants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return null;
    return sortOrder === "asc" 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="bg-surface rounded-xl border border-border p-8">
        <div className="flex items-center justify-center gap-3 text-text-secondary">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Memuat data...</span>
        </div>
      </div>
    );
  }

  if (variants.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Layers className="h-12 w-12 mx-auto text-text-secondary mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Belum Ada Varian
        </h3>
        <p className="text-sm text-text-secondary">
          Klik tombol Tambah Varian untuk menambahkan varian baru
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-background border-b border-border">
              <th 
                className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Nama Varian
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase">
                Status Pemilihan
              </th>
              <th 
                className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("options")}
              >
                <div className="flex items-center justify-center gap-1">
                  Total Opsi
                  <SortIcon columnKey="options" />
                </div>
              </th>
              <th 
                className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("appliedProductCount")}
              >
                <div className="flex items-center justify-center gap-1">
                  Penerapan
                  <SortIcon columnKey="appliedProductCount" />
                </div>
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase">
                Aktif
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase w-24">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedVariants.map((variant) => {
              const activeOptions = variant.options.filter(o => o.isActive).length;
              
              return (
                <tr 
                  key={variant.id} 
                  className="border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                        <Layers className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{variant.name}</p>
                        <p className="text-xs text-text-secondary">
                          {variant.sourceType === 'product' ? 'Dari Buku Menu' : 'Opsi Kustom'}
                          {variant.maxOptions && ` • Maks ${variant.maxOptions} pilihan`}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Required Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md",
                      variant.isRequired 
                        ? "bg-primary-light text-primary"
                        : "bg-background text-text-secondary"
                    )}>
                      {variant.isRequired ? (
                        <>
                          <Check className="h-3 w-3" />
                          Wajib
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3" />
                          Tidak Wajib
                        </>
                      )}
                    </span>
                  </td>
                  
                  {/* Options Count */}
                  <td className="px-4 py-3 text-center">
                    <div>
                      <p className="font-medium text-text-primary">
                        {variant.options.length}
                      </p>
                      {activeOptions < variant.options.length && (
                        <p className="text-xs text-text-secondary">
                          {activeOptions} aktif
                        </p>
                      )}
                    </div>
                  </td>
                  
                  {/* Applied Products */}
                  <td className="px-4 py-3 text-center">
                    {variant.appliedProductCount > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-success-light text-success">
                        <Package className="h-3 w-3" />
                        {variant.appliedProductCount} Produk
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-warning-light text-warning">
                        <AlertCircle className="h-3 w-3" />
                        Belum Diterapkan
                      </span>
                    )}
                  </td>
                  
                  {/* Active Status */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <StatusToggle
                        checked={variant.isActive}
                        onChange={() => onToggleStatus(variant)}
                        size="sm"
                      />
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(variant)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(variant)}
                        className="p-2 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors"
                        title="Hapus"
                        disabled={variant.appliedProductCount > 0}
                      >
                        <Trash2 className={cn(
                          "h-4 w-4",
                          variant.appliedProductCount > 0 && "opacity-30"
                        )} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-text-secondary">
            Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, variants.length)} dari {variants.length} varian
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  page === currentPage
                    ? "bg-primary text-white"
                    : "hover:bg-background text-text-secondary"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
