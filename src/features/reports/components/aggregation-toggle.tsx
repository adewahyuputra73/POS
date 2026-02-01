"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type AggregationMode = 'total' | 'hourly' | 'daily' | 'weekly' | 'monthly';

interface AggregationToggleProps {
  value: AggregationMode;
  onChange: (value: AggregationMode) => void;
  className?: string;
}

const modes: { value: AggregationMode; label: string }[] = [
  { value: 'total', label: 'Total' },
  { value: 'hourly', label: 'Per Jam' },
  { value: 'daily', label: 'Per Hari' },
  { value: 'weekly', label: 'Per Minggu' },
  { value: 'monthly', label: 'Per Bulan' },
];

export function AggregationToggle({ value, onChange, className }: AggregationToggleProps) {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-background rounded-lg", className)}>
      {modes.map((mode) => (
        <button
          key={mode.value}
          onClick={() => onChange(mode.value)}
          className={cn(
            "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            value === mode.value
              ? "bg-white text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
