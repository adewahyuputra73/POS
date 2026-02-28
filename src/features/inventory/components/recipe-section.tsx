"use client";

import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, FlaskConical } from "lucide-react";
import { RecipeIngredient } from "../types";

interface RecipeSectionProps {
  ingredients: RecipeIngredient[];
  totalHpp: number;
  onAddIngredient: () => void;
  onRemoveIngredient: (ingredientId: number) => void;
  onUpdateQuantity: (ingredientId: number, quantity: number) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function RecipeSection({
  ingredients,
  totalHpp,
  onAddIngredient,
  onRemoveIngredient,
  onUpdateQuantity,
}: RecipeSectionProps) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
        <div>
          <h3 className="text-base font-semibold text-text-primary">Resep / Komposisi</h3>
          <p className="text-sm text-text-secondary mt-0.5">
            HPP Total: <strong className="text-text-primary">{formatCurrency(totalHpp)}</strong>
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onAddIngredient}>
          <Plus className="h-4 w-4" />
          Tambah Bahan
        </Button>
      </div>

      {ingredients.length === 0 ? (
        <div className="p-8 text-center">
          <FlaskConical className="h-10 w-10 text-text-disabled mx-auto mb-3" />
          <p className="text-sm text-text-secondary">Belum ada bahan dalam resep</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead>BAHAN</TableHead>
              <TableHead className="text-right">PEMAKAIAN</TableHead>
              <TableHead>SATUAN</TableHead>
              <TableHead className="text-right">HARGA/UNIT</TableHead>
              <TableHead className="text-right">TOTAL HARGA</TableHead>
              <TableHead className="text-center">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ing) => (
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
                <TableCell className="text-right text-sm text-text-secondary">
                  {formatCurrency(ing.pricePerUnit)}
                </TableCell>
                <TableCell className="text-right text-sm font-medium text-text-primary">
                  {formatCurrency(ing.totalPrice)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost" size="icon"
                    onClick={() => onRemoveIngredient(ing.id)}
                    className="h-8 w-8 text-text-disabled hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
