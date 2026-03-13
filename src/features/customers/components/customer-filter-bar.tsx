"use client";

import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { CustomerFilters, LastVisitFilter, TotalSpentFilter } from "../types";

interface CustomerFilterBarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  totalResults: number;
}

export function CustomerFilterBar({ filters, onFiltersChange, totalResults }: CustomerFilterBarProps) {
  const lastVisitLabels: Record<string, string> = { all: "Semua Waktu", today: "Hari Ini", this_week: "Minggu Ini", this_month: "Bulan Ini" };
  const totalSpentLabels: Record<string, string> = { all: "Semua", gt: "> Rp 1.000.000", lt: "< Rp 500.000" };

  const hasActiveFilters = filters.totalSpent !== 'all' || filters.lastVisit !== 'all';

  const clearAll = () => {
    onFiltersChange({
      search: filters.search,
      segment: 'all',
      lastVisit: 'all',
      birthdayMonth: null,
      totalSpent: 'all',
      productId: null,
    });
  };

  return (
    <div className="space-y-3">
      {/* Filter Chips Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-text-disabled" />

        {/* Order Terakhir */}
        <Select
          value={filters.lastVisit}
          onValueChange={(v: string) => onFiltersChange({ ...filters, lastVisit: v as LastVisitFilter })}
        >
          <SelectTrigger className={`w-40 h-9 text-xs ${filters.lastVisit !== 'all' ? 'border-primary bg-primary/5' : ''}`}>
            <SelectValue>{lastVisitLabels[filters.lastVisit]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Waktu</SelectItem>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="this_week">Minggu Ini</SelectItem>
            <SelectItem value="this_month">Bulan Ini</SelectItem>
          </SelectContent>
        </Select>

        {/* Total Belanja */}
        <Select
          value={filters.totalSpent}
          onValueChange={(v: string) => onFiltersChange({ ...filters, totalSpent: v as TotalSpentFilter, totalSpentMin: v === 'gt' ? 1000000 : undefined, totalSpentMax: v === 'lt' ? 500000 : undefined })}
        >
          <SelectTrigger className={`w-36 h-9 text-xs ${filters.totalSpent !== 'all' ? 'border-primary bg-primary/5' : ''}`}>
            <SelectValue>{totalSpentLabels[filters.totalSpent]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="gt">&gt; Rp 1.000.000</SelectItem>
            <SelectItem value="lt">&lt; Rp 500.000</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-xs text-text-secondary hover:text-text-primary gap-1">
            <X className="h-3.5 w-3.5" /> Reset Filter
          </Button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-text-secondary">
        Menampilkan <span className="font-semibold text-text-primary">{totalResults}</span> pelanggan
      </p>
    </div>
  );
}
