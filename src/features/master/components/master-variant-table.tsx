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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ChevronUp, 
  ChevronDown, 
  Pencil,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { MasterVariant } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";

interface MasterVariantTableProps {
  variants: MasterVariant[];
  onEdit: (variant: MasterVariant) => void;
  onToggleStatus: (variantId: string, isActive: boolean) => void;
}

type SortField = 'name' | 'optionCount' | 'appliedProductCount' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function MasterVariantTable({
  variants,
  onEdit,
  onToggleStatus,
}: MasterVariantTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sort variants
  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'optionCount':
          comparison = a.options.length - b.options.length;
          break;
        case 'appliedProductCount':
          comparison = (a.appliedProductCount || 0) - (b.appliedProductCount || 0);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [variants, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedVariants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVariants = sortedVariants.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  if (variants.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Layers className="h-12 w-12 text-text-disabled mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Belum ada master varian</h3>
        <p className="text-sm text-text-secondary">
          Klik tombol &quot;Tambah Master Varian&quot; untuk membuat varian baru
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead 
              className="cursor-pointer hover:bg-background transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                NAMA VARIAN
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-background transition-colors text-center"
              onClick={() => handleSort('optionCount')}
            >
              <div className="flex items-center justify-center gap-2">
                OPSI
                <SortIcon field="optionCount" />
              </div>
            </TableHead>
            <TableHead>TIPE</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-background transition-colors text-center"
              onClick={() => handleSort('appliedProductCount')}
            >
              <div className="flex items-center justify-center gap-2">
                PRODUK TERKAIT
                <SortIcon field="appliedProductCount" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-background transition-colors"
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
          {paginatedVariants.map((variant) => (
            <TableRow key={variant.id} className="hover:bg-background/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{variant.name}</p>
                    <div className="flex gap-1 mt-1">
                      {variant.isMandatory && (
                        <Badge variant="default" className="text-[10px] bg-red-100 text-red-700 border-0">
                          Wajib
                        </Badge>
                      )}
                      {variant.maxSelection && (
                        <Badge variant="default" className="text-[10px] bg-background text-text-secondary border-0">
                          Max {variant.maxSelection}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
                  variant.options.length > 0 
                    ? "bg-indigo-50 text-indigo-700"
                    : "bg-background text-text-secondary"
                )}>
                  {variant.options.length} Opsi
                </span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="default"
                  className={cn(
                    "border-0",
                    variant.optionSource === 'custom' 
                      ? "bg-blue-50 text-blue-700" 
                      : "bg-purple-50 text-purple-700"
                  )}
                >
                  {variant.optionSource === 'custom' ? 'Custom' : 'Produk'}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
                  (variant.appliedProductCount || 0) > 0 
                    ? "bg-green-50 text-green-700"
                    : "bg-background text-text-secondary"
                )}>
                  {variant.appliedProductCount || 0} Produk
                </span>
              </TableCell>
              <TableCell className="text-text-secondary text-sm">
                {formatDate(variant.updatedAt.toString())}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <StatusToggle
                    checked={variant.status === 'ACTIVE'}
                    onChange={(checked) => onToggleStatus(variant.id, checked)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(variant)}
                    className="h-8 w-8 text-text-secondary hover:text-indigo-600"
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
          <p className="text-sm text-text-secondary">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, variants.length)} dari {variants.length} varian
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
