"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { useToast } from "@/components/ui";
import {
  DateRangePicker,
  ExportButton,
  KPICard,
} from "@/features/reports/components";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { reportService } from "@/features/reports/services/report-service";
import type { ReportProductItem } from "@/features/reports/types";
import { ShoppingCart, DollarSign, Search, X } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

const CHART_COLOR = "#2196F3";

export default function ProductSalesPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dateRange, setDateRange] = useState({ startDate: firstOfMonth, endDate: today });
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState<ReportProductItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tableSearch, setTableSearch] = useState("");
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reportService.products({
        start_date: toDateStr(dateRange.startDate),
        end_date: toDateStr(dateRange.endDate),
      });
      setAllProducts(res?.data ?? []);
    } catch {
      showToast("Gagal memuat laporan produk", "error");
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  }, [dateRange, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive unique categories from data
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      if (tableSearch) {
        const s = tableSearch.toLowerCase();
        if (
          !product.name.toLowerCase().includes(s) &&
          !(product.category ?? "").toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [allProducts, selectedCategories, tableSearch]);

  const totalItemsSold = filteredProducts.reduce((acc, p) => acc + p.total_qty, 0);
  const totalGrossSales = filteredProducts.reduce((acc, p) => acc + p.total_revenue, 0);

  const chartData = useMemo(() =>
    [...filteredProducts]
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 10)
      .map((p) => ({
        name: p.name.length > 16 ? p.name.slice(0, 16) + "…" : p.name,
        revenue: p.total_revenue,
      })),
    [filteredProducts]
  );

  const hasActiveFilters = selectedCategories.length > 0 || !!tableSearch;

  const resetAllFilters = () => {
    setSelectedCategories([]);
    setTableSearch("");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      exportService.addMetadataSheet({
        title: "Laporan Penjualan Produk",
        period: `${dateRange.startDate.toLocaleDateString("id-ID")} - ${dateRange.endDate.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: "Semua",
      });

      exportService.addDataSheet({
        name: "Data Penjualan Produk",
        columns: [
          { header: "Nama Produk", key: "name", width: 35 },
          { header: "Kategori", key: "category", width: 20 },
          { header: "Item Terjual", key: "total_qty", width: 15, style: { numFmt: "#,##0" } },
          { header: "Total Penjualan", key: "total_revenue", width: 25, style: { numFmt: "#,##0" } },
        ],
        data: filteredProducts,
      });

      await exportService.download(`Penjualan_Produk_${new Date().getTime()}`);
      showToast(`Laporan diekspor (${filteredProducts.length} produk)`, "success");
    } catch {
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penjualan Produk"
        description="Analisis penjualan per produk berdasarkan periode"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Penjualan Produk" },
        ]}
      />

      {/* Filter Bar */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategories[0] ?? ""}
              onChange={(e) =>
                setSelectedCategories(e.target.value ? [e.target.value] : [])
              }
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <div className="flex-1" />
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-sm font-medium text-error hover:text-error/80 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              Reset Filter
            </button>
          )}
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
              value={formatNumber(totalItemsSold)}
              icon={ShoppingCart}
              iconColor="text-primary"
              iconBgColor="bg-primary-light"
              subtitle={`Dari ${filteredProducts.length} produk`}
            />
            <KPICard
              title="Total Penjualan"
              value={formatCurrency(totalGrossSales)}
              icon={DollarSign}
              iconColor="text-success"
              iconBgColor="bg-success-light"
              subtitle="Berdasarkan periode yang dipilih"
            />
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-surface rounded-xl border border-border shadow-card p-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Top {chartData.length} Produk berdasarkan Penjualan
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 16, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E0E0" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: "#757575" }}
                      tickFormatter={(v) =>
                        new Intl.NumberFormat("id-ID", {
                          notation: "compact",
                          maximumFractionDigits: 1,
                        }).format(v)
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
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #E0E0E0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" fill={CHART_COLOR} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="bg-surface rounded-xl border border-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-divider flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Detail Penjualan Produk</h3>
                <p className="text-sm text-text-secondary">{filteredProducts.length} produk</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg">
                <Search className="h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Cari produk..."
                  className="bg-transparent border-none outline-none text-sm w-40 placeholder:text-text-secondary text-text-primary"
                />
                {tableSearch && (
                  <button onClick={() => setTableSearch("")} className="text-text-secondary hover:text-text-primary">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Nama Produk</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Kategori</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Item Terjual</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total Penjualan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center">
                        <Search className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                        <p className="text-sm text-text-secondary">Tidak ada produk ditemukan</p>
                        {hasActiveFilters && (
                          <button onClick={resetAllFilters} className="text-sm font-medium text-primary hover:text-primary-dark mt-2">
                            Reset Filter
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.product_id} className="border-b border-divider last:border-0 hover:bg-background/50 transition-colors">
                        <td className="px-5 py-4 text-sm font-medium text-text-primary">{product.name}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-primary-light text-primary">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-right text-text-primary font-medium">
                          {formatNumber(product.total_qty)}
                        </td>
                        <td className="px-5 py-4 text-sm text-right font-semibold text-success">
                          {formatCurrency(product.total_revenue)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                {filteredProducts.length > 0 && (
                  <tfoot className="bg-primary-light">
                    <tr>
                      <td colSpan={2} className="px-5 py-4 text-sm font-bold text-text-primary">Total</td>
                      <td className="px-5 py-4 text-sm text-right font-bold text-text-primary">{formatNumber(totalItemsSold)}</td>
                      <td className="px-5 py-4 text-sm text-right font-bold text-primary">{formatCurrency(totalGrossSales)}</td>
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
