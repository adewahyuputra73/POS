"use client";

import { cn } from "@/lib/utils";

interface ModeToggleProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ModeToggle<T extends string>({
  options,
  value,
  onChange,
  className,
}: ModeToggleProps<T>) {
  return (
    <div className={cn("inline-flex bg-background border border-border rounded-xl p-0.5", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
            value === option.value
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
