"use client";

import { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronUp, ChevronDown, Eye,
  ChevronLeft, ChevronRight, BookOpen,
} from "lucide-react";
import { Recipe } from "../types";

interface RecipeTableProps {
  recipes: Recipe[];
  activeType: 'menu' | 'variant';
  onDetail: (recipe: Recipe) => void;
}

type SortField = 'name' | 'totalHpp' | 'ingredientCount' | 'updatedAt';
type SortDirection = 'asc' | 'desc';
const ITEMS_PER_PAGE = 10;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function RecipeTable({ recipes, activeType, onDetail }: RecipeTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const sortedRecipes = useMemo(() => {
    return [...recipes].sort((a, b) => {
      let c = 0;
      switch (sortField) {
        case 'name': c = a.targetName.localeCompare(b.targetName); break;
        case 'totalHpp': c = a.totalHpp - b.totalHpp; break;
        case 'ingredientCount': c = a.ingredientCount - b.ingredientCount; break;
        case 'updatedAt': c = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(); break;
      }
      return sortDirection === 'asc' ? c : -c;
    });
  }, [recipes, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRecipes = sortedRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  if (recipes.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <BookOpen className="h-12 w-12 text-text-disabled mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text-primary mb-2">Belum ada resep</h3>
        <p className="text-sm text-text-secondary">Resep akan muncul setelah produk atau varian ditambahkan</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-background/50">
            <TableHead className="cursor-pointer hover:bg-background transition-colors" onClick={() => handleSort('name')}>
              <div className="flex items-center gap-2">
                {activeType === 'menu' ? 'NAMA PRODUK' : 'NAMA OPSI'} <SortIcon field="name" />
              </div>
            </TableHead>
            {activeType === 'menu' && <TableHead>KATEGORI</TableHead>}
            <TableHead className="cursor-pointer hover:bg-background transition-colors text-right" onClick={() => handleSort('totalHpp')}>
              <div className="flex items-center justify-end gap-2">HPP <SortIcon field="totalHpp" /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-background transition-colors text-center" onClick={() => handleSort('ingredientCount')}>
              <div className="flex items-center justify-center gap-2">JUMLAH BAHAN <SortIcon field="ingredientCount" /></div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-background transition-colors" onClick={() => handleSort('updatedAt')}>
              <div className="flex items-center gap-2">TERAKHIR DIPERBARUI <SortIcon field="updatedAt" /></div>
            </TableHead>
            <TableHead className="text-center">STATUS</TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedRecipes.map((recipe) => (
            <TableRow key={recipe.id} className="hover:bg-background/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-rose-600" />
                  </div>
                  <span className="font-medium text-text-primary">{recipe.targetName}</span>
                </div>
              </TableCell>
              {activeType === 'menu' && <TableCell className="text-sm text-text-secondary">{recipe.categoryName || '-'}</TableCell>}
              <TableCell className="text-right text-sm font-medium text-text-primary">{formatCurrency(recipe.totalHpp)}</TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-sm font-medium",
                  recipe.ingredientCount > 0 ? "bg-rose-50 text-rose-700" : "bg-background text-text-secondary"
                )}>
                  {recipe.ingredientCount} Bahan
                </span>
              </TableCell>
              <TableCell className="text-sm text-text-secondary">{formatDate(recipe.updatedAt)}</TableCell>
              <TableCell className="text-center">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  recipe.status === 'active' ? "bg-green-50 text-green-700" : "bg-background text-text-secondary"
                )}>
                  {recipe.status === 'active' ? 'Aktif' : 'Draft'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Button variant="ghost" size="icon" onClick={() => onDetail(recipe)} className="h-8 w-8 text-text-secondary hover:text-rose-600">
                    <Eye className="h-4 w-4" />
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
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, recipes.length)} dari {recipes.length} resep
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
