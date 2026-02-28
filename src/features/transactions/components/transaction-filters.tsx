"use client";

import {
  TransactionFilters,
  OrderStatus,
  PaymentMethod,
  FulfillmentType,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  FULFILLMENT_TYPE_LABELS,
} from "../types";
import { X, RotateCcw } from "lucide-react";

interface TransactionFilterBarProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  totalResults: number;
  totalOrders: number;
}

export function TransactionFilterBar({
  filters,
  onFiltersChange,
  totalResults,
  totalOrders,
}: TransactionFilterBarProps) {
  const hasActiveFilters =
    filters.status !== "all" ||
    filters.paymentMethod !== "all" ||
    filters.fulfillmentType !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const resetFilters = () => {
    onFiltersChange({
      ...filters,
      status: "all",
      paymentMethod: "all",
      fulfillmentType: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({ ...filters, status: e.target.value as OrderStatus | "all" })
            }
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface min-w-[140px]"
          >
            <option value="all">Semua Status</option>
            {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((key) => (
              <option key={key} value={key}>
                {ORDER_STATUS_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Pembayaran
          </label>
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              onFiltersChange({ ...filters, paymentMethod: e.target.value as PaymentMethod | "all" })
            }
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface min-w-[140px]"
          >
            <option value="all">Semua Metode</option>
            {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((key) => (
              <option key={key} value={key}>
                {PAYMENT_METHOD_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Fulfillment Type Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Tipe Pemenuhan
          </label>
          <select
            value={filters.fulfillmentType}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                fulfillmentType: e.target.value as FulfillmentType | "all",
              })
            }
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface min-w-[160px]"
          >
            <option value="all">Semua Tipe</option>
            {(Object.keys(FULFILLMENT_TYPE_LABELS) as FulfillmentType[]).map((key) => (
              <option key={key} value={key}>
                {FULFILLMENT_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Date From */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
          />
        </div>

        {/* Date To */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
            className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
          />
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-transparent uppercase tracking-wider">
              Reset
            </label>
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-sm font-medium text-error hover:bg-error-light rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Active filter count */}
      {(hasActiveFilters || filters.search) && (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>
            Menampilkan {totalResults} dari {totalOrders} transaksi
          </span>
        </div>
      )}
    </div>
  );
}
