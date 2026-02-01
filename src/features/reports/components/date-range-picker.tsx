"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, X } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { id as localeID } from "date-fns/locale";

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const presets = [
  { label: "Hari Ini", getValue: () => ({ startDate: new Date(), endDate: new Date() }) },
  { label: "Kemarin", getValue: () => ({ startDate: subDays(new Date(), 1), endDate: subDays(new Date(), 1) }) },
  { label: "7 Hari Terakhir", getValue: () => ({ startDate: subDays(new Date(), 6), endDate: new Date() }) },
  { label: "30 Hari Terakhir", getValue: () => ({ startDate: subDays(new Date(), 29), endDate: new Date() }) },
  { label: "Minggu Ini", getValue: () => ({ startDate: startOfWeek(new Date(), { weekStartsOn: 1 }), endDate: endOfWeek(new Date(), { weekStartsOn: 1 }) }) },
  { label: "Bulan Ini", getValue: () => ({ startDate: startOfMonth(new Date()), endDate: endOfMonth(new Date()) }) },
];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
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

  const formatDateRange = () => {
    const start = format(value.startDate, "dd MMM yyyy", { locale: localeID });
    const end = format(value.endDate, "dd MMM yyyy", { locale: localeID });
    if (start === end) return start;
    return `${start} - ${end}`;
  };

  const handlePresetClick = (preset: typeof presets[0]) => {
    onChange(preset.getValue());
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 h-10 border border-border rounded-lg bg-white",
          "hover:border-primary/50 transition-colors",
          "text-sm font-medium text-text-primary min-w-[200px] justify-between"
        )}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{formatDateRange()}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-text-secondary transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-border rounded-lg shadow-card z-50 w-64 py-2">
          <div className="px-3 py-2 border-b border-divider">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Pilih Periode</p>
          </div>
          <div className="py-1">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-primary-light hover:text-primary transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-divider">
            <p className="text-xs text-text-secondary">Kustom (coming soon)</p>
          </div>
        </div>
      )}
    </div>
  );
}
