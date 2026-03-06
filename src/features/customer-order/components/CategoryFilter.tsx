"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/features/products/types";

interface CategoryFilterProps {
    categories: Category[];
    selectedCategoryId: number | null;
    onSelectCategory: (id: number | null) => void;
}

export function CategoryFilter({
    categories,
    selectedCategoryId,
    onSelectCategory,
}: CategoryFilterProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
            <button
                onClick={() => onSelectCategory(null)}
                className={cn(
                    "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 shadow-sm",
                    selectedCategoryId === null
                        ? "bg-primary border-primary text-white shadow-primary/20 scale-105"
                        : "bg-white border-divider text-text-secondary hover:border-primary-light hover:text-primary"
                )}
            >
                Semua
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelectCategory(category.id)}
                    className={cn(
                        "whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 shadow-sm",
                        selectedCategoryId === category.id
                            ? "bg-primary border-primary text-white shadow-primary/20 scale-105"
                            : "bg-white border-divider text-text-secondary hover:border-primary-light hover:text-primary"
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
}
