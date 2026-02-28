"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PaymentTable } from "@/features/payments/components/payment-table";
import { PaymentMethodBreakdown } from "@/features/payments/components/payment-method-breakdown";
import { CashRegisterTable } from "@/features/payments/components/cash-register-table";
import {
  PaymentFilters,
  PaymentMethodType,
  PaymentStatus,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/features/payments/types";
import {
  mockPayments,
  mockCashRegisterLogs,
  filterPayments,
  getPaymentMethodSummary,
  getPaymentStats,
} from "@/features/payments/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
  Search,
  Download,
  Wallet,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  X,
} from "lucide-react";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("payments");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<PaymentFilters>({
    search: "",
    paymentMethod: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Computed
  const mergedFilters = useMemo(
    () => ({ ...filters, search: searchQuery }),
    [filters, searchQuery]
  );

  const filteredPayments = useMemo(
    () => filterPayments(mockPayments, mergedFilters),
    [mergedFilters]
  );

  const methodSummary = useMemo(
    () => getPaymentMethodSummary(filteredPayments),
    [filteredPayments]
  );

  const stats = useMemo(() => getPaymentStats(mockPayments), []);

  const hasActiveFilters =
    searchQuery !== "" ||
    filters.paymentMethod !== "all" ||
    filters.status !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      search: "",
      paymentMethod: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const statCards = [
    {
      label: "Total Pembayaran",
      value: formatNumber(stats.totalPayments),
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Pendapatan",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Berhasil",
      value: formatNumber(stats.successCount),
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Menunggu",
      value: formatNumber(stats.pendingCount),
      subValue: formatCurrency(stats.totalPending),
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Gagal",
      value: formatNumber(stats.failedCount),
      icon: XCircle,
      color: "text-error",
      bg: "bg-error/10",
    },
    {
      label: "Refund",
      value: formatNumber(stats.refundedCount),
      subValue: formatCurrency(stats.totalRefunded),
      icon: RotateCcw,
      color: "text-info",
      bg: "bg-info/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Pembayaran"
        description="Kelola catatan pembayaran dan metode pembayaran outlet Anda"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Pembayaran" },
        ]}
        actions={
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" /> Ekspor
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-border p-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  stat.bg
                )}
              >
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-text-primary truncate">
                  {stat.value}
                </p>
                <p className="text-[11px] text-text-secondary font-medium">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payments">Catatan Pembayaran</TabsTrigger>
          <TabsTrigger value="methods">Metode Pembayaran</TabsTrigger>
          <TabsTrigger value="cashier">Catatan Kasir</TabsTrigger>
        </TabsList>

        {/* Tab: Payments */}
        <TabsContent value="payments">
          <div className="space-y-4 mt-4">
            {/* Search & Filters */}
            <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, telepon, atau nomor faktur..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-end gap-3">
                {/* Payment Method */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Metode
                  </label>
                  <select
                    value={filters.paymentMethod}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        paymentMethod: e.target.value as PaymentMethodType | "all",
                      })
                    }
                    className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface min-w-[140px]"
                  >
                    <option value="all">Semua Metode</option>
                    {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethodType[]).map(
                      (key) => (
                        <option key={key} value={key}>
                          {PAYMENT_METHOD_LABELS[key]}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        status: e.target.value as PaymentStatus | "all",
                      })
                    }
                    className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface min-w-[140px]"
                  >
                    <option value="all">Semua Status</option>
                    {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map(
                      (key) => (
                        <option key={key} value={key}>
                          {PAYMENT_STATUS_LABELS[key]}
                        </option>
                      )
                    )}
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
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                    className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
                  />
                </div>

                {/* Reset */}
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-2 text-sm font-medium text-error hover:bg-error-light rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="text-sm text-text-secondary">
                  Menampilkan {filteredPayments.length} dari{" "}
                  {mockPayments.length} pembayaran
                </div>
              )}
            </div>

            {/* Payment Table */}
            <PaymentTable payments={filteredPayments} />
          </div>
        </TabsContent>

        {/* Tab: Methods Breakdown */}
        <TabsContent value="methods">
          <div className="mt-4">
            <PaymentMethodBreakdown summary={methodSummary} />
          </div>
        </TabsContent>

        {/* Tab: Cash Register */}
        <TabsContent value="cashier">
          <div className="mt-4">
            <CashRegisterTable logs={mockCashRegisterLogs} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
