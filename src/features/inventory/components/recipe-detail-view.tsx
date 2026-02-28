"use client";

import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus, Trash2, BookOpen, FlaskConical } from "lucide-react";
import { Recipe, RecipeIngredient } from "../types";

interface RecipeDetailViewProps {
  recipe: Recipe;
  onBack: () => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (ingredientId: number) => void;
  onUpdateQuantity: (ingredientId: number, quantity: number) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function RecipeDetailView({
  recipe, onBack, onAddIngredient, onRemoveIngredient, onUpdateQuantity,
}: RecipeDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-text-primary">{recipe.targetName}</h2>
          <p className="text-sm text-text-secondary">
            {recipe.targetType === 'menu' ? 'Resep Menu' : 'Resep Varian'}
            {recipe.categoryName && ` · ${recipe.categoryName}`}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Total HPP</p>
          <p className="text-xl font-bold text-text-primary">{formatCurrency(recipe.totalHpp)}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Jumlah Bahan</p>
          <p className="text-xl font-bold text-text-primary">{recipe.ingredientCount}</p>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm text-text-secondary mb-1">Status</p>
          <p className={`text-xl font-bold ${recipe.status === 'active' ? 'text-green-600' : 'text-text-secondary'}`}>
            {recipe.status === 'active' ? 'Aktif' : 'Draft'}
          </p>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h3 className="text-base font-semibold text-text-primary">Bahan Resep</h3>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={onAddIngredient}>
            <Plus className="h-4 w-4" />
            Tambah Bahan
          </Button>
        </div>

        {recipe.ingredients.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="h-10 w-10 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Belum ada bahan dalam resep ini</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-background/50">
                <TableHead>BAHAN</TableHead>
                <TableHead className="text-right">PEMAKAIAN</TableHead>
                <TableHead>SATUAN</TableHead>
                <TableHead className="text-right">HARGA/UNIT</TableHead>
                <TableHead className="text-right">TOTAL</TableHead>
                <TableHead className="text-center">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.ingredients.map((ing) => (
                <TableRow key={ing.id} className="hover:bg-background/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                        <FlaskConical className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-text-primary">{ing.materialName}</span>
                        <span className="block text-xs text-text-disabled">
                          {ing.materialType === 'raw' ? 'Mentah' : 'Setengah Jadi'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <input
                      type="number"
                      className="w-20 text-right text-sm px-2 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      value={ing.quantity}
                      onChange={(e) => onUpdateQuantity(ing.id, Number(e.target.value))}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">{ing.unit}</TableCell>
                  <TableCell className="text-right text-sm text-text-secondary">{formatCurrency(ing.pricePerUnit)}</TableCell>
                  <TableCell className="text-right text-sm font-medium text-text-primary">{formatCurrency(ing.totalPrice)}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => onRemoveIngredient(ing.id)} className="h-8 w-8 text-text-disabled hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-semibold text-text-primary">Total HPP</TableCell>
                <TableCell className="text-right font-bold text-text-primary">{formatCurrency(recipe.totalHpp)}</TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
