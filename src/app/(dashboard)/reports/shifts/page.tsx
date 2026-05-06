import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { useToast } from "@/components/ui";
import { DateRangePicker, ExportButton, KPICard } from "@/features/reports/components";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { reportService } from "@/features/reports/services/report-service";
import type { ReportShiftItem } from "@/features/reports/types";
import { Clock, ShoppingCart, DollarSign, Banknote } from "lucide-react";

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatDateTime(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  open:   { label: "Buka",   className: "bg-success-light text-success" },
  closed: { label: "Tutup",  className: "bg-background text-text-secondary" },
  active: { label: "Aktif",  className: "bg-primary-light text-primary" },
};

export default function ShiftsReportPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState({ startDate: firstOfMonth, endDate: today });
  const [shifts, setShifts] = useState<ReportShiftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.shifts({
        start_date: toDateStr(dateRange.startDate),
        end_date: toDateStr(dateRange.endDate),
      });
      setShifts(res?.data ?? []);
    } catch {
      showToast("Gagal memuat laporan shift", "error");
      setShifts([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalOrders   = shifts.reduce((a, s) => a + s.total_orders, 0);
  const totalSales    = shifts.reduce((a, s) => a + s.total_sales, 0);
  const totalCash     = shifts.reduce((a, s) => a + s.cash_sales, 0);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Shifts belum punya endpoint export khusus — generate dari data yang sudah ada
      const { ExcelExportService } = await import("@/lib/excel-export");
      const svc = new ExcelExportService();
      svc.addMetadataSheet({
        title: "Laporan Shift",
        period: `${dateRange.startDate.toLocaleDateString("id-ID")} - ${dateRange.endDate.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: "Semua",
      });
      svc.addDataSheet({
        name: "Data Shift",
        columns: [
          { header: "No. Shift",       key: "shift_number",   width: 12 },
          { header: "Kasir",           key: "cashier",        width: 25 },
          { header: "Waktu Buka",      key: "start_time",     width: 22 },
          { header: "Waktu Tutup",     key: "end_time",       width: 22 },
          { header: "Status",          key: "status",         width: 12 },
          { header: "Modal Awal",      key: "opening_cash",   width: 18, style: { numFmt: "#,##0" } },
          { header: "Modal Akhir",     key: "closing_cash",   width: 18, style: { numFmt: "#,##0" } },
          { header: "Total Pesanan",   key: "total_orders",   width: 16, style: { numFmt: "#,##0" } },
          { header: "Total Penjualan", key: "total_sales",    width: 22, style: { numFmt: "#,##0" } },
          { header: "Penjualan Tunai", key: "cash_sales",     width: 22, style: { numFmt: "#,##0" } },
          { header: "Non-Tunai",       key: "non_cash_sales", width: 22, style: { numFmt: "#,##0" } },
        ],
        data: shifts.map((s) => ({
          ...s,
          start_time: formatDateTime(s.start_time),
          end_time:   formatDateTime(s.end_time),
        })),
      });
      await svc.download(`Laporan_Shift_${Date.now()}`);
      showToast("Laporan shift berhasil diekspor", "success");
    } catch {
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Shift"
        description="Rekap shift kasir berdasarkan periode"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Laporan Shift" },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="Total Shift"
              value={formatNumber(shifts.length)}
              icon={Clock}
              iconColor="text-primary"
              iconBgColor="bg-primary-light"
              subtitle="Shift dalam periode ini"
            />
            <KPICard
              title="Total Pesanan"
              value={formatNumber(totalOrders)}
              icon={ShoppingCart}
              iconColor="text-warning"
              iconBgColor="bg-warning-light"
              subtitle="Dari semua shift"
            />
            <KPICard
              title="Total Penjualan"
              value={formatCurrency(totalSales)}
              icon={DollarSign}
              iconColor="text-success"
              iconBgColor="bg-success-light"
              subtitle="Gross sales semua shift"
            />
            <KPICard
              title="Penjualan Tunai"
              value={formatCurrency(totalCash)}
              icon={Banknote}
              iconColor="text-info"
              iconBgColor="bg-info-light"
              subtitle="Cash dari semua shift"
            />
          </div>

          {/* Table */}
          <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-divider">
              <h3 className="text-lg font-semibold text-text-primary">Detail Shift</h3>
              <p className="text-sm text-text-secondary">{shifts.length} shift</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Shift</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Kasir</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Waktu Buka</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Waktu Tutup</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Modal Awal</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Pesanan</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total Penjualan</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Tunai</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Non-Tunai</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-5 py-12 text-center">
                        <Clock className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Tidak ada data shift untuk periode ini</p>
                      </td>
                    </tr>
                  ) : (
                    shifts.map((shift) => {
                      const statusInfo = STATUS_LABELS[shift.status?.toLowerCase()] ?? { label: shift.status, className: "bg-background text-text-secondary" };
                      return (
                        <tr key={shift.id} className="border-b border-divider last:border-0 hover:bg-background/50 transition-colors">
                          <td className="px-4 py-4 text-sm font-bold text-primary">#{shift.shift_number}</td>
                          <td className="px-4 py-4 text-sm text-text-primary">{shift.cashier}</td>
                          <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap">{formatDateTime(shift.start_time)}</td>
                          <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap">{formatDateTime(shift.end_time)}</td>
                          <td className="px-4 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-right text-text-primary">{formatCurrency(shift.opening_cash)}</td>
                          <td className="px-4 py-4 text-sm text-right font-medium text-text-primary">{formatNumber(shift.total_orders)}</td>
                          <td className="px-4 py-4 text-sm text-right font-semibold text-success">{formatCurrency(shift.total_sales)}</td>
                          <td className="px-4 py-4 text-sm text-right text-text-primary">{formatCurrency(shift.cash_sales)}</td>
                          <td className="px-4 py-4 text-sm text-right text-text-primary">{formatCurrency(shift.non_cash_sales)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {shifts.length > 0 && (
                  <tfoot className="bg-primary-light">
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-sm font-bold text-text-primary">Total</td>
                      <td className="px-4 py-4 text-sm text-right font-bold text-text-primary">{formatNumber(totalOrders)}</td>
                      <td className="px-4 py-4 text-sm text-right font-bold text-primary">{formatCurrency(totalSales)}</td>
                      <td className="px-4 py-4 text-sm text-right font-bold text-text-primary">{formatCurrency(totalCash)}</td>
                      <td className="px-4 py-4 text-sm text-right font-bold text-text-primary">{formatCurrency(shifts.reduce((a, s) => a + s.non_cash_sales, 0))}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
