"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, Badge, useToast } from "@/components/ui";
import { Edit2, Trash2, Box, Coffee, Utensils, Cookie, HelpCircle } from "lucide-react";
import { MasterCategory } from "../types";

interface MasterCategoryTableProps {
  data: MasterCategory[];
  onEdit: (category: MasterCategory) => void;
  onDelete: (id: string) => void;
}

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case "Coffee": return <Coffee className="h-4 w-4" />;
    case "Utensils": return <Utensils className="h-4 w-4" />;
    case "Cookie": return <Cookie className="h-4 w-4" />;
    default: return <Box className="h-4 w-4" />;
  }
};

export function MasterCategoryTable({ data, onEdit, onDelete }: MasterCategoryTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kategori</TableHead>
            <TableHead>Jumlah Produk</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-text-secondary">
                Belum ada kategori master
              </TableCell>
            </TableRow>
          ) : (
            data.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-light/50 rounded-lg text-primary">
                      {getIcon(category.icon)}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{category.name}</p>
                      <p className="text-xs text-text-secondary">
                        ID: {category.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="gap-1">
                    <Box className="h-3 w-3" />
                    {category.productsCount} Produk
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={category.status === "ACTIVE" ? "success" : "secondary"}>
                    {category.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(category)}
                      className="h-8 w-8 text-text-secondary hover:text-primary hover:bg-primary-light"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(category.id)}
                      className="h-8 w-8 text-text-secondary hover:text-error hover:bg-error-light"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
