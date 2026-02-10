"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { RecipeTable } from "@/features/inventory/components/recipe-table";
import { RecipeDetailView } from "@/features/inventory/components/recipe-detail-view";
import { AddRecipeIngredientModal } from "@/features/inventory/components/add-recipe-ingredient-modal";
import { useToast } from "@/components/ui/toast";
import {
  mockRecipes,
  mockRawMaterials,
  filterRecipes,
} from "@/features/inventory/mock-data";
import { Recipe, RecipeFilters, RecipeIngredient } from "@/features/inventory/types";

type TypeTab = 'menu' | 'variant';

export default function RecipesPage() {
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [activeTab, setActiveTab] = useState<TypeTab>('menu');
  const [filters, setFilters] = useState<RecipeFilters>({ type: 'menu', search: '' });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [addIngredientOpen, setAddIngredientOpen] = useState(false);

  const filteredRecipes = useMemo(() => {
    return filterRecipes(recipes, { ...filters, type: activeTab });
  }, [recipes, filters, activeTab]);

  const handleTabChange = (tab: TypeTab) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, type: tab, search: '' }));
  };

  const handleDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  const handleAddIngredients = (materialIds: number[]) => {
    if (!selectedRecipe) return;

    const newIngredients: RecipeIngredient[] = materialIds.map((id) => {
      const m = mockRawMaterials.find((mat) => mat.id === id)!;
      return {
        id: Date.now() + id,
        materialId: id,
        materialName: m.name,
        materialType: m.type,
        quantity: 1,
        unit: m.baseUnit,
        pricePerUnit: m.hpp,
        totalPrice: m.hpp,
      };
    });

    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRecipe.id) return r;
        const updatedIngredients = [...r.ingredients, ...newIngredients];
        return {
          ...r,
          ingredients: updatedIngredients,
          ingredientCount: updatedIngredients.length,
          totalHpp: updatedIngredients.reduce((sum, i) => sum + i.totalPrice, 0),
          updatedAt: new Date().toISOString(),
        };
      })
    );
    setSelectedRecipe((prev) => {
      if (!prev) return null;
      const updatedIngredients = [...prev.ingredients, ...newIngredients];
      return {
        ...prev,
        ingredients: updatedIngredients,
        ingredientCount: updatedIngredients.length,
        totalHpp: updatedIngredients.reduce((sum, i) => sum + i.totalPrice, 0),
      };
    });
    setAddIngredientOpen(false);
    showToast(`${materialIds.length} bahan berhasil ditambahkan ke resep`, "success");
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    if (!selectedRecipe) return;

    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRecipe.id) return r;
        const updatedIngredients = r.ingredients.filter((i) => i.id !== ingredientId);
        return {
          ...r,
          ingredients: updatedIngredients,
          ingredientCount: updatedIngredients.length,
          totalHpp: updatedIngredients.reduce((sum, i) => sum + i.totalPrice, 0),
        };
      })
    );
    setSelectedRecipe((prev) => {
      if (!prev) return null;
      const updatedIngredients = prev.ingredients.filter((i) => i.id !== ingredientId);
      return {
        ...prev,
        ingredients: updatedIngredients,
        ingredientCount: updatedIngredients.length,
        totalHpp: updatedIngredients.reduce((sum, i) => sum + i.totalPrice, 0),
      };
    });
  };

  const handleUpdateQuantity = (ingredientId: number, quantity: number) => {
    if (!selectedRecipe) return;

    const updateFn = (ingredients: RecipeIngredient[]) =>
      ingredients.map((i) =>
        i.id === ingredientId ? { ...i, quantity, totalPrice: quantity * i.pricePerUnit } : i
      );

    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id !== selectedRecipe.id) return r;
        const updatedIngredients = updateFn(r.ingredients);
        return {
          ...r,
          ingredients: updatedIngredients,
          totalHpp: updatedIngredients.reduce((sum, i) => sum + i.totalPrice, 0),
        };
      })
    );
    setSelectedRecipe((prev) => {
      if (!prev) return null;
      const updatedIngredients = updateFn(prev.ingredients);
      return {
        ...prev,
        ingredients: updatedIngredients,
        totalHpp: updatedIngredients.reduce((sum, i) => sum + i.totalPrice, 0),
      };
    });
  };

  // Detail View
  if (selectedRecipe) {
    return (
      <>
        <RecipeDetailView
          recipe={selectedRecipe}
          onBack={handleBack}
          onAddIngredient={() => setAddIngredientOpen(true)}
          onRemoveIngredient={handleRemoveIngredient}
          onUpdateQuantity={handleUpdateQuantity}
        />
        <AddRecipeIngredientModal
          open={addIngredientOpen}
          onClose={() => setAddIngredientOpen(false)}
          materials={mockRawMaterials}
          excludeIds={selectedRecipe.ingredients.map((i) => i.materialId)}
          onSelect={handleAddIngredients}
        />
      </>
    );
  }

  const tabs: { key: TypeTab; label: string }[] = [
    { key: 'menu', label: 'Menu' },
    { key: 'variant', label: 'Varian' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resep"
        description="Kelola resep dan komposisi bahan untuk menu dan varian"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Resep" },
        ]}
      />

      <div className="bg-white rounded-xl border border-border p-4 space-y-4">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              {tab.label}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                activeTab === tab.key ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
              )}>
                {recipes.filter((r) => r.targetType === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Cari resep..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={filters.search ? (
              <button onClick={() => setFilters((prev) => ({ ...prev, search: '' }))} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            ) : undefined}
          />
        </div>
      </div>

      <RecipeTable
        recipes={filteredRecipes}
        activeType={activeTab}
        onDetail={handleDetail}
      />
    </div>
  );
}
