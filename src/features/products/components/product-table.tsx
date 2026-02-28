"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { Product } from "../types";
import { StatusToggle } from "./status-toggle";
import { 
  Edit2, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
  isLoading?: boolean;
}

type SortKey = "name" | "price" | "stockQuantity" | "categoryName";
type SortOrder = "asc" | "desc";

export function ProductTable({
  products,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
}: ProductTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Sorting
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (sortKey === "stockQuantity") {
        aVal = a.useStock ? (a.stockQuantity ?? 0) : -1;
        bVal = b.useStock ? (b.stockQuantity ?? 0) : -1;
      }

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }

      return sortOrder === "asc" 
        ? (aVal as number) - (bVal as number) 
        : (bVal as number) - (aVal as number);
    });
  }, [products, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const paginatedProducts = sortedProducts.slice(
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

  const getStockStatus = (product: Product) => {
    if (!product.useStock) {
      return { label: "Tidak Aktif", color: "text-text-secondary" };
    }
    if ((product.stockQuantity ?? 0) === 0) {
      return { label: "Habis", color: "text-error" };
    }
    if ((product.stockQuantity ?? 0) <= (product.stockLimit ?? 0)) {
      return { label: "Hampir Habis", color: "text-warning" };
    }
    return { label: "Tersedia", color: "text-success" };
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

  if (products.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Package className="h-12 w-12 mx-auto text-text-secondary mb-3" />
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Belum Ada Produk
        </h3>
        <p className="text-sm text-text-secondary">
          Klik tombol Tambah Produk untuk menambahkan produk baru
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
              <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase w-16">
                Foto
              </th>
              <th 
                className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Nama Produk
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th 
                className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("categoryName")}
              >
                <div className="flex items-center gap-1">
                  Kategori
                  <SortIcon columnKey="categoryName" />
                </div>
              </th>
              <th 
                className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("price")}
              >
                <div className="flex items-center justify-end gap-1">
                  Harga
                  <SortIcon columnKey="price" />
                </div>
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase">
                Status Jual
              </th>
              <th 
                className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase cursor-pointer hover:text-primary"
                onClick={() => handleSort("stockQuantity")}
              >
                <div className="flex items-center justify-end gap-1">
                  Stok
                  <SortIcon columnKey="stockQuantity" />
                </div>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase w-24">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => {
              const stockStatus = getStockStatus(product);
              const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
              
              return (
                <tr 
                  key={product.id} 
                  className="border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                >
                  {/* Image */}
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 rounded-lg bg-background border border-border overflow-hidden flex items-center justify-center">
                      {primaryImage ? (
                        <img 
                          src={primaryImage.url} 
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-text-secondary" />
                      )}
                    </div>
                  </td>
                  
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-text-primary">{product.name}</p>
                      {product.sku && (
                        <p className="text-xs text-text-secondary">SKU: {product.sku}</p>
                      )}
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td className="px-4 py-3">
                    {product.categoryName ? (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-primary-light text-primary">
                        {product.categoryName}
                      </span>
                    ) : (
                      <span className="text-text-secondary text-sm">-</span>
                    )}
                  </td>
                  
                  {/* Price */}
                  <td className="px-4 py-3 text-right">
                    <div>
                      <p className="font-semibold text-text-primary">
                        {formatCurrency(product.price)}
                      </p>
                      {product.comparePrice && (
                        <p className="text-xs text-text-secondary line-through">
                          {formatCurrency(product.comparePrice)}
                        </p>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <StatusToggle
                        checked={product.isActive}
                        onChange={() => onToggleStatus(product)}
                        size="sm"
                      />
                    </div>
                  </td>
                  
                  {/* Stock */}
                  <td className="px-4 py-3 text-right">
                    {product.useStock ? (
                      <div>
                        <p className="font-medium text-text-primary">
                          {product.stockQuantity ?? 0}
                        </p>
                        <p className={cn("text-xs", stockStatus.color)}>
                          {stockStatus.label}
                        </p>
                      </div>
                    ) : (
                      <span className="text-text-secondary text-sm">-</span>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
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
            Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, products.length)} dari {products.length} produk
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
