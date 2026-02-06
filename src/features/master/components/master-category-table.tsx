"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronUp, 
  ChevronDown, 
  Pencil,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { MasterCategory } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";

interface MasterCategoryTableProps {
  categories: MasterCategory[];
  onEdit: (category: MasterCategory) => void;
  onToggleStatus: (categoryId: number, isActive: boolean) => void;
}

type SortField = 'name' | 'productCount' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function MasterCategoryTable({
  categories,
  onEdit,
  onToggleStatus,
}: MasterCategoryTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sort categories
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'productCount':
          comparison = a.productCount - b.productCount;
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [categories, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = sortedCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada master kategori</h3>
        <p className="text-sm text-gray-500">
          Klik tombol &quot;Tambah Master Kategori&quot; untuk membuat kategori baru
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                NAMA KATEGORI
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors text-center"
              onClick={() => handleSort('productCount')}
            >
              <div className="flex items-center justify-center gap-2">
                MASTER PRODUK
                <SortIcon field="productCount" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('updatedAt')}
            >
              <div className="flex items-center gap-2">
                TERAKHIR DIUBAH
                <SortIcon field="updatedAt" />
              </div>
            </TableHead>
            <TableHead className="text-center">STATUS</TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCategories.map((category) => (
            <TableRow key={category.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
                  category.productCount > 0 
                    ? "bg-purple-50 text-purple-700"
                    : "bg-gray-100 text-gray-500"
                )}>
                  {category.productCount} Produk
                </span>
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {formatDate(category.updatedAt)}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <StatusToggle
                    checked={category.isActive}
                    onChange={(checked) => onToggleStatus(category.id, checked)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(category)}
                    className="h-8 w-8 text-gray-500 hover:text-purple-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-gray-500">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, categories.length)} dari {categories.length} kategori
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-[32px]"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
