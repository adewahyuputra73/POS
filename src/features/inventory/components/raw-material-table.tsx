"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronUp, ChevronDown, Pencil, Eye,
  ChevronLeft, ChevronRight, FlaskConical,
} from "lucide-react";
import { RawMaterial } from "../types";

interface RawMaterialTableProps {
  materials: RawMaterial[];
  onEdit: (material: RawMaterial) => void;
  onDetail: (material: RawMaterial) => void;
}

type SortField = 'name' | 'categoryName' | 'stockValue' | 'currentStock' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

const statusConfig = {
  available: { label: 'Masih Ada', class: 'bg-green-50 text-green-700' },
  low: { label: 'Menipis', class: 'bg-yellow-50 text-yellow-700' },
  empty: { label: 'Habis', class: 'bg-red-50 text-red-700' },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatNumber(value: number, unit: string) {
  return `${new Intl.NumberFormat('id-ID').format(value)} ${unit}`;
}

export function RawMaterialTable({
  materials,
  onEdit,
  onDetail,
}: RawMaterialTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedMaterials = useMemo(() => {
    return [...materials].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'categoryName': comparison = a.categoryName.localeCompare(b.categoryName); break;
        case 'stockValue': comparison = a.stockValue - b.stockValue; break;
        case 'currentStock': comparison = a.currentStock - b.currentStock; break;
        case 'updatedAt': comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [materials, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedMaterials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMaterials = sortedMaterials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  if (materials.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada bahan dasar</h3>
        <p className="text-sm text-gray-500">
          Klik tombol &quot;Tambah Bahan Dasar&quot; untuk membuat bahan baru
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('name')}>
              <div className="flex items-center gap-2">NAMA BAHAN DASAR <SortIcon field="name" /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('categoryName')}>
              <div className="flex items-center gap-2">KATEGORI <SortIcon field="categoryName" /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => handleSort('stockValue')}>
              <div className="flex items-center justify-end gap-2">TOTAL HARGA <SortIcon field="stockValue" /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('updatedAt')}>
              <div className="flex items-center gap-2">TERAKHIR DIPERBARUI <SortIcon field="updatedAt" /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-100 transition-colors text-right" onClick={() => handleSort('currentStock')}>
              <div className="flex items-center justify-end gap-2">STOK SAAT INI <SortIcon field="currentStock" /></div>
            </TableHead>
            <TableHead className="text-center">STATUS</TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedMaterials.map((material) => {
            const status = statusConfig[material.status];
            return (
              <TableRow key={material.id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      material.type === 'raw' ? "bg-emerald-100" : "bg-orange-100"
                    )}>
                      <FlaskConical className={cn(
                        "h-5 w-5",
                        material.type === 'raw' ? "text-emerald-600" : "text-orange-600"
                      )} />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{material.name}</span>
                      <p className="text-xs text-gray-500 mt-0.5">{material.baseUnit}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{material.categoryName}</span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(material.stockValue)}</span>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {formatDate(material.updatedAt)}
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-medium text-gray-900">{formatNumber(material.currentStock, material.baseUnit)}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-medium", status.class)}>
                    {status.label}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onDetail(material)} className="h-8 w-8 text-gray-500 hover:text-blue-600">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(material)} className="h-8 w-8 text-gray-500 hover:text-emerald-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-gray-500">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, materials.length)} dari {materials.length} bahan
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={currentPage === page ? "primary" : "outline"} size="sm" onClick={() => setCurrentPage(page)} className="min-w-[32px]">
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
