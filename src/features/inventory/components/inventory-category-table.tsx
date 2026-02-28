"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, FolderOpen } from "lucide-react";
import { InventoryCategory } from "../types";

interface InventoryCategoryTableProps {
  categories: InventoryCategory[];
  onEdit: (category: InventoryCategory) => void;
}

export function InventoryCategoryTable({ categories, onEdit }: InventoryCategoryTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  if (categories.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <FolderOpen className="h-12 w-12 text-text-disabled mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Belum ada kategori</h3>
        <p className="text-sm text-text-secondary">Klik tombol &quot;Tambah Kategori&quot; untuk membuat kategori baru</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead>NAMA KATEGORI</TableHead>
            <TableHead>TERAKHIR DIPERBARUI</TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="hover:bg-background/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <span className="font-medium text-text-primary">{category.name}</span>
                    {category.isDefault && (
                      <span className="ml-2 px-2 py-0.5 rounded text-xs bg-background text-text-secondary">Default</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-text-secondary text-sm">{formatDate(category.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => onEdit(category)}
                    disabled={category.isDefault}
                    className="h-8 w-8 text-text-secondary hover:text-amber-600 disabled:opacity-30"
                  >
                    <Pencil className="h-4 w-4" />
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
