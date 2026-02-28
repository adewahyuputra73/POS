"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Package } from "lucide-react";
import { SupplierMaterial } from "../types";

interface SupplierMaterialTableProps {
  materials: SupplierMaterial[];
  onEdit: (material: SupplierMaterial) => void;
  onDelete: (materialId: number) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function SupplierMaterialTable({ materials, onEdit, onDelete }: SupplierMaterialTableProps) {
  if (materials.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <Package className="h-12 w-12 text-text-disabled mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Belum ada bahan terhubung</h3>
        <p className="text-sm text-text-secondary">Klik &quot;Tambah Bahan&quot; untuk menghubungkan bahan ke supplier ini</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead>NAMA BAHAN</TableHead>
            <TableHead>KATEGORI</TableHead>
            <TableHead className="text-right">QTY PEMBELIAN</TableHead>
            <TableHead>SATUAN</TableHead>
            <TableHead className="text-right">HARGA</TableHead>
            <TableHead className="text-center">MIN ORDER</TableHead>
            <TableHead className="text-center">UTAMA</TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((m) => (
            <TableRow key={m.id} className="hover:bg-background/50">
              <TableCell>
                <span className="font-medium text-text-primary">{m.materialName}</span>
              </TableCell>
              <TableCell className="text-sm text-text-secondary">{m.categoryName}</TableCell>
              <TableCell className="text-right text-sm font-medium">{m.purchaseQty}</TableCell>
              <TableCell className="text-sm text-text-secondary">{m.purchaseUnit}</TableCell>
              <TableCell className="text-right text-sm font-medium text-text-primary">
                {formatCurrency(m.pricePerUnit)}
                {m.includePpn && <span className="text-xs text-text-disabled ml-1">(+PPN)</span>}
              </TableCell>
              <TableCell className="text-center text-sm text-text-secondary">{m.minOrder || '-'}</TableCell>
              <TableCell className="text-center">
                {m.isPrimary ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">Utama</span>
                ) : (
                  <span className="text-xs text-text-disabled">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(m)} className="h-8 w-8 text-text-secondary hover:text-indigo-600">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(m.id)} className="h-8 w-8 text-text-secondary hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
