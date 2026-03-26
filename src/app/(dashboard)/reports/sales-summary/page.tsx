"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { useToast } from "@/components/ui";
import {
  DateRangePicker,
  ExportButton,
  KPICard
} from "@/features/reports/components";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { reportService } from "@/features/reports/services/report-service";
import type { ReportSummary } from "@/features/reports/types";
import {
  ShoppingCart,
  Receipt,
  TrendingUp,
  DollarSign,
  QrCode,
  CreditCard,
  Banknote,
  Wallet,
  Search,
} from "lucide-react";

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function PaymentIcon({ method }: { method: string }) {
  const m = method.toUpperCase();
  if (m === "CASH") return <Banknote className="h-4 w-4 text-green-600" />;
  if (m === "QRIS") return <QrCode className="h-4 w-4 text-purple-600" />;
  if (m === "TRANSFER") return <CreditCard className="h-4 w-4 text-blue-600" />;
  return <Wallet className="h-4 w-4 text-text-secondary" />;
}

export default function SalesSummaryPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState({ startDate: firstOfMonth, endDate: today });
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [paymentSearch, setPaymentSearch] = useState("");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await reportService.summary({
        start_date: toDateStr(dateRange.startDate),
        end_date: toDateStr(dateRange.endDate),
      });
      setSummary(data);
    } catch {
      showToast("Gagal memuat laporan ringkasan", "error");
    } finally {
      setLoading(false);
    }
  }, [dateRange, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const salesDetails = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Penjualan Kotor", value: summary.gross_sales },
      { label: "Diskon", value: -summary.discount_total },
      { label: "Refund", value: -summary.refund_total },
      { label: "Penjualan Bersih", value: summary.net_sales },
    ];
  }, [summary]);

  const paymentMethods = useMemo(() => {
    if (!summary) return [];
    const breakdown = summary.payment_summary?.breakdown ?? {};
    return Object.entries(breakdown).map(([method, total]) => ({ method, total }));
  }, [summary]);

  const filteredPaymentMethods = useMemo(() => {
    if (!paymentSearch) return paymentMethods;
    return paymentMethods.filter((pm) =>
      pm.method.toLowerCase().includes(paymentSearch.toLowerCase())
    );
  }, [paymentMethods, paymentSearch]);

  const handleExport = async () => {
    if (!summary) return;
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      exportService.addMetadataSheet({
        title: "Laporan Ringkasan Penjualan",
        period: `${dateRange.startDate.toLocaleDateString("id-ID")} - ${dateRange.endDate.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: "Semua",
      });

      exportService.addSummarySheet([
        { label: "Total Transaksi", value: formatNumber(summary.total_transactions) },
        { label: "Penjualan Kotor", value: formatCurrency(summary.gross_sales) },
        { label: "Rata-rata / Transaksi", value: formatCurrency(summary.average_transaction) },
        { label: "Penjualan Bersih", value: formatCurrency(summary.net_sales) },
      ]);

      exportService.addDataSheet({
        name: "Rincian Penjualan",
        columns: [
          { header: "Keterangan", key: "label", width: 40 },
          { header: "Nilai", key: "value", width: 30, style: { numFmt: "#,##0" } },
        ],
        data: salesDetails.map((item) => ({ label: item.label, value: Math.abs(item.value) })),
      });

      exportService.addDataSheet({
        name: "Metode Pembayaran",
        columns: [
          { header: "Metode", key: "method", width: 30 },
          { header: "Total Nilai", key: "total", width: 30, style: { numFmt: "#,##0" } },
        ],
        data: paymentMethods,
      });

      await exportService.download(`Ringkasan_Penjualan_${new Date().getTime()}`);
      showToast("Laporan berhasil diekspor", "success");
    } catch {
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Penjualan"
        description="Lihat ringkasan penjualan berdasarkan periode"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Ringkasan Penjualan" },
        ]}
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-surface rounded-xl border border-border shadow-card">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <div className="flex-1" />
        <ExportButton onClick={handleExport} isLoading={isExporting} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : !summary ? (
        <div className="flex items-center justify-center h-40 text-text-secondary text-sm">
          Tidak ada data untuk periode ini
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Transaksi"
              value={formatNumber(summary.total_transactions)}
              icon={ShoppingCart}
              iconColor="text-primary"
              iconBgColor="bg-primary-light"
            />
            <KPICard
              title="Penjualan Kotor"
              value={formatCurrency(summary.gross_sales)}
              icon={DollarSign}
              iconColor="text-success"
              iconBgColor="bg-success-light"
            />
            <KPICard
              title="Rata-rata / Transaksi"
              value={formatCurrency(summary.average_transaction)}
              icon={TrendingUp}
              iconColor="text-warning"
              iconBgColor="bg-warning-light"
            />
            <KPICard
              title="Penjualan Bersih"
              value={formatCurrency(summary.net_sales)}
              icon={Receipt}
              iconColor="text-primary"
              iconBgColor="bg-primary-light"
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Details */}
            <div className="bg-surface rounded-xl border border-border shadow-card p-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Rincian Penjualan</h3>
              <div className="space-y-0">
                {salesDetails.map((item, index) => {
                  const isTotal = item.label === "Penjualan Bersih";
                  const isNegative = item.value < 0;
                  return (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between py-3 ${
                        index < salesDetails.length - 1 ? "border-b border-divider" : ""
                      } ${isTotal ? "bg-primary-light -mx-5 px-5 mt-2 rounded-b-xl" : ""}`}
                    >
                      <span className={`text-sm ${isTotal ? "font-bold text-text-primary" : "text-text-secondary"}`}>
                        {item.label}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isTotal ? "text-primary text-base" : isNegative ? "text-error" : "text-text-primary"
                      }`}>
                        {isNegative ? `(${formatCurrency(Math.abs(item.value))})` : formatCurrency(item.value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-surface rounded-xl border border-border shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Metode Pembayaran</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg">
                  <Search className="h-4 w-4 text-text-secondary" />
                  <input
                    type="text"
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    placeholder="Cari..."
                    className="bg-transparent border-none outline-none text-sm w-24 placeholder:text-text-secondary text-text-primary"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="text-left py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Metode</th>
                      <th className="text-right py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPaymentMethods.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-8 text-center text-sm text-text-secondary">
                          Tidak ada data pembayaran
                        </td>
                      </tr>
                    ) : (
                      filteredPaymentMethods.map((pm) => (
                        <tr key={pm.method} className="border-b border-divider last:border-0">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <PaymentIcon method={pm.method} />
                              <span className="text-sm text-text-primary">{pm.method}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm font-semibold text-text-primary">
                            {formatCurrency(pm.total)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
