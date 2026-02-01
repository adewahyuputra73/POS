"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Store, ChevronDown, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface OutletSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  showAllOption?: boolean;
}

export function OutletSelector({ 
  value, 
  onChange, 
  options,
  className,
  showAllOption = true 
}: OutletSelectorProps) {
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

  const allOptions = showAllOption 
    ? [{ value: "all", label: "Semua Outlet" }, ...options]
    : options;

  const selectedLabel = allOptions.find(opt => opt.value === value)?.label || "Pilih Outlet";

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 h-10 border border-border rounded-lg bg-white",
          "hover:border-primary/50 transition-colors",
          "text-sm font-medium text-text-primary min-w-[180px] justify-between"
        )}
      >
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-text-secondary transition-transform flex-shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-border rounded-lg shadow-card z-50 min-w-full w-max max-h-64 overflow-y-auto py-1">
          {allOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-3",
                "hover:bg-primary-light hover:text-primary transition-colors",
                value === option.value ? "bg-primary-light text-primary" : "text-text-primary"
              )}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
