"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: { id: string | number; name: string }[];
    selectedCategoryId: string | number | null;
    onSelectCategory: (id: string | number | null) => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
    "Makanan": "🍽️",
    "Minuman": "🥤",
    "Snack":   "🍟",
    "Dessert": "🍰",
    "Paket":   "🎁",
};

export function CategoryFilter({
    categories,
    selectedCategoryId,
    onSelectCategory,
}: CategoryFilterProps) {
    const isAllActive = selectedCategoryId === null;

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar">
            <button
                onClick={() => onSelectCategory(null)}
                className={cn(
                    "whitespace-nowrap flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 shrink-0"
                )}
                style={isAllActive
                    ? { backgroundColor: '#1C0A00', borderColor: '#F59E0B', color: '#F59E0B' }
                    : { backgroundColor: '#FFFFFF', borderColor: '#E5D5C0', color: '#6B4C2A' }
                }
            >
                <span className="text-base leading-none">✨</span>
                <span>Semua</span>
            </button>

            {categories.map((category) => {
                const isActive = selectedCategoryId === category.id;
                const emoji = CATEGORY_EMOJI[category.name] ?? "🍴";
                return (
                    <button
                        key={category.id}
                        onClick={() => onSelectCategory(category.id)}
                        className={cn(
                            "whitespace-nowrap flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 border-2 shrink-0"
                        )}
                        style={isActive
                            ? { backgroundColor: '#1C0A00', borderColor: '#F59E0B', color: '#F59E0B' }
                            : { backgroundColor: '#FFFFFF', borderColor: '#E5D5C0', color: '#6B4C2A' }
                        }
                    >
                        <span className="text-base leading-none">{emoji}</span>
                        <span>{category.name}</span>
                    </button>
                );
            })}
        </div>
    );
}
