"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, X } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ 
  value, 
  onChange, 
  options,
  placeholder = "Pilih...",
  className
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedLabels = options.filter(opt => value.includes(opt.value));

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 min-h-[40px] border border-border rounded-lg bg-surface",
          "hover:border-primary/50 transition-colors",
          "text-sm font-medium text-text-primary min-w-[180px] justify-between w-full"
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedLabels.length === 0 ? (
            <span className="text-text-secondary">{placeholder}</span>
          ) : selectedLabels.length <= 2 ? (
            selectedLabels.map(opt => (
              <span 
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-light text-primary text-xs font-medium rounded"
              >
                {opt.label}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-primary-dark" 
                  onClick={(e) => removeOption(opt.value, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-text-primary">{selectedLabels.length} dipilih</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-text-secondary transition-transform flex-shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-surface border border-border rounded-lg shadow-card z-50 min-w-full w-max max-h-64 overflow-y-auto py-1">
          {options.map((option) => {
            const isSelected = value.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-3",
                  "hover:bg-primary-light hover:text-primary transition-colors",
                  isSelected ? "bg-primary-light text-primary" : "text-text-primary"
                )}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
