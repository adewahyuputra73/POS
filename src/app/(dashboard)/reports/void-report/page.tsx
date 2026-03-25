"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { useToast } from "@/components/ui";
import { DateRangePicker, ExportButton } from "@/features/reports/components";
import { formatCurrency } from "@/lib/utils";
import { reportService } from "@/features/reports/services/report-service";
import type { ReportOrderItem } from "@/features/reports/types";
import { XCircle, DollarSign } from "lucide-react";

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDateTime(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function isVoid(order: ReportOrderItem): boolean {
  const s = (order.fulfillment_status ?? "").toUpperCase();
  return s === "VOID" || s === "VOIDED" || s === "CANCELLED" || s === "CANCELED";
}

export default function VoidReportPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState({ startDate: firstOfMonth, endDate: today });
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [orders, setOrders] = useState<ReportOrderItem[]>([]);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.orders({
        start_date: toDateStr(dateRange.startDate),
        end_date: toDateStr(dateRange.endDate),
        limit: 200,
        page: 1,
      });
      const voids = (res?.data ?? []).filter(isVoid);
      setOrders(voids);
    } catch {
      showToast("Gagal memuat laporan void", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(o =>
      o.order_number.toLowerCase().includes(q) ||
      (o.fulfillment_status ?? "").toLowerCase().includes(q)
    );
  }, [orders, search]);

  const totalAmount = filtered.reduce((acc, o) => acc + Number(o.total_amount), 0);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();
      exportService.addMetadataSheet({
        title: "Laporan Pembatalan / Void",
        period: `${dateRange.startDate.toLocaleDateString("id-ID")} - ${dateRange.endDate.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: "Semua",
      });
      exportService.addDataSheet({
        name: "Data Void",
        columns: [
          { header: "No. Order", key: "order_number", width: 20 },
          { header: "Tanggal", key: "createdAt", width: 25 },
          { header: "Tipe", key: "order_type", width: 15 },
          { header: "Status", key: "fulfillment_status", width: 15 },
          { header: "Total", key: "total_amount", width: 20, style: { numFmt: "#,##0" } },
        ],
        data: filtered.map(o => ({
          order_number: o.order_number,
          createdAt: formatDateTime(o.createdAt),
          order_type: o.order_type,
          fulfillment_status: o.fulfillment_status,
          total_amount: Number(o.total_amount),
        })),
      });
      await exportService.download(`Laporan_Void_${Date.now()}`);
      showToast(`Laporan diekspor (${filtered.length} order)`, "success");
    } catch {
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pembatalan / Void"
        description="Laporan transaksi yang dibatalkan"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Pembatalan / Void" },
        ]}
      />

      {/* Filter Bar */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <div className="flex-1" />
          <ExportButton onClick={handleExport} isLoading={isExporting} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{filtered.length}</p>
                <p className="text-xs text-text-secondary">Total Order Void</p>
              </div>
            </div>
            <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{formatCurrency(totalAmount)}</p>
                <p className="text-xs text-text-secondary">Nominal Void</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-divider flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Detail Pembatalan</h3>
                <p className="text-sm text-text-secondary">{filtered.length} order void</p>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari no. order..."
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">No. Order</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Tanggal</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Tipe</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <XCircle className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Tidak ada order void di periode ini</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr key={o.id} className="border-b border-divider last:border-0 hover:bg-background/50 transition-colors">
                        <td className="px-5 py-3 text-sm font-mono font-medium text-text-primary">{o.order_number}</td>
                        <td className="px-5 py-3 text-xs text-text-secondary whitespace-nowrap">{formatDateTime(o.createdAt)}</td>
                        <td className="px-5 py-3 text-sm text-text-secondary">{o.order_type || "-"}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-md bg-red-50 text-red-700">
                            {o.fulfillment_status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm text-right font-semibold text-error">
                          {formatCurrency(Number(o.total_amount))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
