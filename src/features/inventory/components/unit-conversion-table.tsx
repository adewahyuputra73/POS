"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronUp, ChevronDown, Pencil, Trash2,
  ChevronLeft, ChevronRight, Ruler,
} from "lucide-react";
import { UnitConversion } from "../types";

interface UnitConversionTableProps {
  conversions: UnitConversion[];
  onEdit: (conversion: UnitConversion) => void;
  onDelete: (conversionId: number) => void;
}

type SortField = 'name' | 'unitCount' | 'linkedMaterialCount' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function UnitConversionTable({
  conversions,
  onEdit,
  onDelete,
}: UnitConversionTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedConversions = useMemo(() => {
    return [...conversions].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'unitCount':
          comparison = a.units.length - b.units.length;
          break;
        case 'linkedMaterialCount':
          comparison = a.linkedMaterialCount - b.linkedMaterialCount;
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [conversions, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedConversions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedConversions = sortedConversions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  if (conversions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <Ruler className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada konversi unit</h3>
        <p className="text-sm text-gray-500">
          Klik tombol &quot;Tambah Konversi Unit&quot; untuk membuat konversi baru
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
                NAMA KONVERSI UNIT
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 transition-colors text-center"
              onClick={() => handleSort('unitCount')}
            >
              <div className="flex items-center justify-center gap-2">
                TOTAL UNIT KONVERSI
                <SortIcon field="unitCount" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 transition-colors text-center"
              onClick={() => handleSort('linkedMaterialCount')}
            >
              <div className="flex items-center justify-center gap-2">
                BAHAN DASAR TERHUBUNG
                <SortIcon field="linkedMaterialCount" />
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('updatedAt')}
            >
              <div className="flex items-center gap-2">
                TERAKHIR DIPERBARUI
                <SortIcon field="updatedAt" />
              </div>
            </TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedConversions.map((conversion) => (
            <TableRow key={conversion.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Ruler className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{conversion.name}</span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {conversion.units.map(u => u.name).join(' · ')}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                  {conversion.units.length} Unit
                </span>
              </TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
                  conversion.linkedMaterialCount > 0
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                )}>
                  {conversion.linkedMaterialCount} Bahan
                </span>
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {formatDate(conversion.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(conversion)}
                    className="h-8 w-8 text-gray-500 hover:text-blue-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(conversion.id)}
                    disabled={conversion.linkedMaterialCount > 0}
                    className="h-8 w-8 text-gray-500 hover:text-red-600 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-gray-500">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, conversions.length)} dari {conversions.length} konversi
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
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
              variant="outline" size="sm"
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
