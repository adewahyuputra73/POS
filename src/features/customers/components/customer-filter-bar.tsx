"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { CustomerFilters, CustomerSegment, LastVisitFilter, TotalSpentFilter } from "../types";
import { monthOptions } from "../mock-data";

interface CustomerFilterBarProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  totalResults: number;
}

export function CustomerFilterBar({ filters, onFiltersChange, totalResults }: CustomerFilterBarProps) {
  const segmentLabels: Record<string, string> = { all: "Semua Tipe", hot: "🔥 Hot", warm: "🌤 Warm", boil: "❄️ Boil" };
  const lastVisitLabels: Record<string, string> = { all: "Semua Waktu", today: "Hari Ini", this_week: "Minggu Ini", this_month: "Bulan Ini" };
  const totalSpentLabels: Record<string, string> = { all: "Semua", gt: "> Rp 1.000.000", lt: "< Rp 500.000" };

  const getBirthdayLabel = (val: number | null) => {
    if (val === null) return "Semua Bulan";
    return monthOptions.find(m => m.value === val)?.label || String(val);
  };

  const hasActiveFilters = filters.segment !== 'all' || filters.birthdayMonth !== null ||
    filters.totalSpent !== 'all' || filters.lastVisit !== 'all';

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
        <Filter className="h-4 w-4 text-gray-400" />

        {/* Tipe (Segment) */}
        <Select
          value={filters.segment}
          onValueChange={(v: string) => onFiltersChange({ ...filters, segment: v as CustomerSegment | 'all' })}
        >
          <SelectTrigger className={`w-36 h-9 text-xs ${filters.segment !== 'all' ? 'border-primary bg-primary/5' : ''}`}>
            <SelectValue>{segmentLabels[filters.segment]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="hot">🔥 Hot</SelectItem>
            <SelectItem value="warm">🌤 Warm</SelectItem>
            <SelectItem value="boil">❄️ Boil</SelectItem>
          </SelectContent>
        </Select>

        {/* Terakhir Datang */}
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

        {/* Ulang Tahun */}
        <Select
          value={filters.birthdayMonth !== null ? filters.birthdayMonth.toString() : 'all'}
          onValueChange={(v: string) => onFiltersChange({ ...filters, birthdayMonth: v === 'all' ? null : parseInt(v) })}
        >
          <SelectTrigger className={`w-36 h-9 text-xs ${filters.birthdayMonth !== null ? 'border-primary bg-primary/5' : ''}`}>
            <SelectValue>{getBirthdayLabel(filters.birthdayMonth)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bulan</SelectItem>
            {monthOptions.map(m => (
              <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
            ))}
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
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-9 text-xs text-gray-500 hover:text-gray-700 gap-1">
            <X className="h-3.5 w-3.5" /> Reset Filter
          </Button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-500">
        Menampilkan <span className="font-semibold text-gray-700">{totalResults}</span> pelanggan
      </p>
    </div>
  );
}
