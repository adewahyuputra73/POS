"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronUp, ChevronDown, Pencil, Eye,
  ChevronLeft, ChevronRight, Truck,
} from "lucide-react";
import { Supplier } from "../types";

interface SupplierTableProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDetail: (supplier: Supplier) => void;
}

type SortField = 'name' | 'materialCount' | 'updatedAt';
type SortDirection = 'asc' | 'desc';
const ITEMS_PER_PAGE = 10;

export function SupplierTable({ suppliers, onEdit, onDetail }: SupplierTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'materialCount': comparison = a.materialCount - b.materialCount; break;
        case 'updatedAt': comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [suppliers, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedSuppliers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = sortedSuppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (suppliers.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Truck className="h-12 w-12 text-text-disabled mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Belum ada supplier</h3>
        <p className="text-sm text-text-secondary">Klik &quot;Tambah Supplier&quot; untuk menambahkan supplier baru</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead className="cursor-pointer hover:bg-background transition-colors" onClick={() => handleSort('name')}>
              <div className="flex items-center gap-2">NAMA SUPPLIER <SortIcon field="name" /></div>
            </TableHead>
            <TableHead>NO. TELP</TableHead>
            <TableHead>ALAMAT</TableHead>
            <TableHead className="cursor-pointer hover:bg-background transition-colors text-center" onClick={() => handleSort('materialCount')}>
              <div className="flex items-center justify-center gap-2">BAHAN TERHUBUNG <SortIcon field="materialCount" /></div>
            </TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSuppliers.map((supplier) => (
            <TableRow key={supplier.id} className="hover:bg-background/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">{supplier.name}</span>
                    {supplier.paymentTerm && (
                      <span className="block text-xs text-text-disabled">Tempo: {supplier.paymentTerm}</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-text-secondary">{supplier.phone || '-'}</TableCell>
              <TableCell className="text-sm text-text-secondary max-w-[200px] truncate">{supplier.address || '-'}</TableCell>
              <TableCell className="text-center">
                <span className="inline-flex px-2.5 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                  {supplier.materialCount} Bahan
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onDetail(supplier)} className="h-8 w-8 text-text-secondary hover:text-indigo-600">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(supplier)} className="h-8 w-8 text-text-secondary hover:text-indigo-600">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-text-secondary">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, suppliers.length)} dari {suppliers.length} supplier
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
