"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type MarginOperator = "<=" | ">=" | "=";

interface MarginFilterProps {
  operator: MarginOperator;
  value: number | null;
  onOperatorChange: (op: MarginOperator) => void;
  onValueChange: (val: number | null) => void;
  className?: string;
}

export function MarginFilter({
  operator,
  value,
  onOperatorChange,
  onValueChange,
  className,
}: MarginFilterProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const operators: { value: MarginOperator; label: string }[] = [
    { value: ">=", label: "≥" },
    { value: "<=", label: "≤" },
    { value: "=", label: "=" },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-text-secondary font-medium whitespace-nowrap">
        Margin Laba
      </span>
      
      {/* Operator Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-3 py-2 bg-surface border border-border rounded-lg text-sm font-medium hover:border-primary/30 transition-colors"
        >
          {operators.find(op => op.value === operator)?.label || operator}
          <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
        </button>
        
        {dropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setDropdownOpen(false)} 
            />
            <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-20 min-w-[60px]">
              {operators.map(op => (
                <button
                  key={op.value}
                  onClick={() => {
                    onOperatorChange(op.value);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-sm text-left hover:bg-background transition-colors first:rounded-t-lg last:rounded-b-lg",
                    operator === op.value && "bg-primary-light text-primary font-medium"
                  )}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Value Input */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onValueChange(e.target.value ? Number(e.target.value) : null)}
          placeholder="0"
          className="w-20 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          min={0}
          max={100}
        />
        <span className="text-sm text-text-secondary font-medium">%</span>
      </div>
    </div>
  );
}
