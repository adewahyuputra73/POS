"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { useToast } from "@/components/ui";
import { DateRangePicker, ExportButton, KPICard } from "@/features/reports/components";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { reportService } from "@/features/reports/services/report-service";
import type { ReportProductItem } from "@/features/reports/types";
import { FolderTree, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

interface CategoryRow {
  name: string;
  itemSold: number;
  totalSales: number;
}

function groupByCategory(products: ReportProductItem[]): CategoryRow[] {
  const map: Record<string, CategoryRow> = {};
  for (const p of products) {
    const cat = p.category || "Tanpa Kategori";
    if (!map[cat]) map[cat] = { name: cat, itemSold: 0, totalSales: 0 };
    map[cat].itemSold += p.total_qty;
    map[cat].totalSales += p.total_revenue;
  }
  return Object.values(map).sort((a, b) => b.totalSales - a.totalSales);
}

export default function CategorySalesPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState({ startDate: firstOfMonth, endDate: today });
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.products({
        start_date: toDateStr(dateRange.startDate),
        end_date: toDateStr(dateRange.endDate),
      });
      setCategories(groupByCategory(res?.data ?? []));
    } catch {
      showToast("Gagal memuat laporan kategori", "error");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories.filter(c => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const totalItemSold = filtered.reduce((acc, c) => acc + c.itemSold, 0);
  const totalSales = filtered.reduce((acc, c) => acc + c.totalSales, 0);

  const chartData = categories.slice(0, 8).map(c => ({
    name: c.name.length > 14 ? c.name.slice(0, 14) + "…" : c.name,
    revenue: c.totalSales,
  }));

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();
      exportService.addMetadataSheet({
        title: "Laporan Penjualan Kategori",
        period: `${dateRange.startDate.toLocaleDateString("id-ID")} - ${dateRange.endDate.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: "Semua",
      });
      exportService.addDataSheet({
        name: "Data Penjualan Kategori",
        columns: [
          { header: "Nama Kategori", key: "name", width: 30 },
          { header: "Item Terjual", key: "itemSold", width: 15, style: { numFmt: "#,##0" } },
          { header: "Total Penjualan", key: "totalSales", width: 25, style: { numFmt: "#,##0" } },
        ],
        data: filtered,
      });
      await exportService.download(`Penjualan_Kategori_${Date.now()}`);
      showToast(`Laporan diekspor (${filtered.length} kategori)`, "success");
    } catch {
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kategori Produk"
        description="Performa penjualan berdasarkan kategori produk"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Kategori Produk" },
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
            <KPICard
              title="Item Terjual"
              value={formatNumber(totalItemSold)}
              icon={FolderTree}
              iconColor="text-primary"
              iconBgColor="bg-primary-light"
              subtitle={`Dari ${filtered.length} kategori`}
            />
            <KPICard
              title="Total Penjualan"
              value={formatCurrency(totalSales)}
              icon={TrendingUp}
              iconColor="text-success"
              iconBgColor="bg-success-light"
              subtitle="Berdasarkan periode yang dipilih"
            />
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-surface rounded-xl border border-border shadow-card p-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Top {chartData.length} Kategori berdasarkan Penjualan
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E0E0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#757575" }}
                      tickFormatter={(v) =>
                        new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(v)
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{ fontSize: 11, fill: "#757575" }}
                    />
                    <Tooltip
                      formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #E0E0E0", borderRadius: "8px" }}
                    />
                    <Bar dataKey="revenue" fill="#4CAF50" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-divider flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Penjualan per Kategori</h3>
                <p className="text-sm text-text-secondary">{filtered.length} kategori</p>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari kategori..."
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Nama Kategori</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Item Terjual</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-5 py-12 text-center">
                        <FolderTree className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Tidak ada data kategori</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((cat) => (
                      <tr key={cat.name} className="border-b border-divider last:border-0 hover:bg-background/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-text-primary">{cat.name}</td>
                        <td className="px-5 py-4 text-sm text-right text-text-primary font-medium">{formatNumber(cat.itemSold)}</td>
                        <td className="px-5 py-4 text-sm text-right font-semibold text-success">{formatCurrency(cat.totalSales)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filtered.length > 0 && (
                  <tfoot className="bg-primary-light">
                    <tr>
                      <td className="px-5 py-4 text-sm font-bold text-text-primary">Total</td>
                      <td className="px-5 py-4 text-sm text-right font-bold text-text-primary">{formatNumber(totalItemSold)}</td>
                      <td className="px-5 py-4 text-sm text-right font-bold text-primary">{formatCurrency(totalSales)}</td>
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
