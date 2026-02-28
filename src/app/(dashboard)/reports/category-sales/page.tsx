"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Button, Badge, useToast } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { OutletSelector } from "@/features/reports/components/outlet-selector";
import { KPICard } from "@/features/reports/components/kpi-card";
import { DataTable } from "@/features/reports/components/data-table";
import { ExportButton } from "@/features/reports/components/export-button";
import { Download, FolderTree, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for categories
const mockCategories = [
  { id: 1, name: "Minuman", color: "#2196F3" },
  { id: 2, name: "Makanan", color: "#4CAF50" },
  { id: 3, name: "Snack", color: "#FF9800" },
  { id: 4, name: "Dessert", color: "#E91E63" },
  { id: 5, name: "Tanpa Kategori", color: "#9E9E9E" },
];

// Mock trend data per date per category
const generateTrendData = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    
    dates.push({
      date: dateStr,
      Minuman: Math.floor(Math.random() * 2000000) + 500000,
      Makanan: Math.floor(Math.random() * 1500000) + 400000,
      Snack: Math.floor(Math.random() * 800000) + 200000,
      Dessert: Math.floor(Math.random() * 600000) + 100000,
      "Tanpa Kategori": Math.floor(Math.random() * 200000) + 50000,
    });
  }
  return dates;
};

// Mock table data
const mockTableData = [
  { id: 1, name: "Minuman", itemSold: 234, totalSales: 8750000 },
  { id: 2, name: "Makanan", itemSold: 189, totalSales: 6420000 },
  { id: 3, name: "Snack", itemSold: 156, totalSales: 2340000 },
  { id: 4, name: "Dessert", itemSold: 98, totalSales: 1960000 },
  { id: 5, name: "Tanpa Kategori", itemSold: 23, totalSales: 345000 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function CategorySalesPage() {
  const [dateRange, setDateRange] = useState(() => ({
    startDate: new Date(),
    endDate: new Date(),
  }));
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const trendData = useMemo(() => generateTrendData(), []);

  // Calculate totals
  const totals = useMemo(() => {
    return mockTableData.reduce(
      (acc, row) => ({
        itemSold: acc.itemSold + row.itemSold,
        totalSales: acc.totalSales + row.totalSales,
      }),
      { itemSold: 0, totalSales: 0 }
    );
  }, []);

  // Previous period comparison (mock)
  const previousPeriod = {
    itemSold: 650,
    totalSales: 17500000,
  };

  const itemChange = ((totals.itemSold - previousPeriod.itemSold) / previousPeriod.itemSold) * 100;
  const salesChange = ((totals.totalSales - previousPeriod.totalSales) / previousPeriod.totalSales) * 100;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      // 1. Metadata Sheet
      exportService.addMetadataSheet({
        title: "Laporan Penjualan Kategori",
        period: `${dateRange.startDate?.toLocaleDateString("id-ID")} - ${dateRange.endDate?.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: selectedOutlet === "all" ? "Semua Outlet" : selectedOutlet === "outlet-1" ? "Cabang Pusat" : "Cabang BSD",
      });

      // 2. Data Sheet
      exportService.addDataSheet({
        name: "Data Penjualan Kategori",
        columns: [
          { header: "No", key: "no", width: 8 },
          { header: "Nama Kategori", key: "name", width: 30 },
          { header: "Item Terjual", key: "itemSold", width: 20, style: { numFmt: '#,##0' } },
          { header: "Total Penjualan", key: "totalSales", width: 25, style: { numFmt: '#,##0' } },
        ],
        data: mockTableData.map((item, index) => ({
          no: index + 1,
          name: item.name,
          itemSold: item.itemSold,
          totalSales: item.totalSales,
        }))
      });

      // Download
      await exportService.download(`Penjualan_Kategori_${new Date().getTime()}`);

      showToast("Laporan kategori produk berhasil diekspor", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      key: "no",
      header: "No",
      className: "w-16",
      render: (_: unknown, index: number) => (
        <span className="font-medium text-text-secondary">{index + 1}</span>
      ),
    },
    {
      key: "name",
      header: "Nama Kategori",
      sortable: true,
      render: (row: typeof mockTableData[0]) => (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: mockCategories.find((c) => c.name === row.name)?.color }}
          />
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: "itemSold",
      header: "Item Terjual",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockTableData[0]) => (
        <span className="font-semibold">{row.itemSold.toLocaleString("id-ID")}</span>
      ),
    },
    {
      key: "totalSales",
      header: "Total Penjualan",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockTableData[0]) => (
        <span className="font-semibold text-success">{formatCurrency(row.totalSales)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Kategori Produk"
        description="Performa penjualan berdasarkan kategori produk"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laporan", href: "/reports" },
          { label: "Kategori Produk" },
        ]}
        actions={
          <ExportButton
            onClick={handleExport}
            isLoading={isExporting}
          />
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-surface rounded-xl border border-border">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <OutletSelector
          value={selectedOutlet}
          onChange={setSelectedOutlet}
          options={[
            { value: "outlet-1", label: "Cabang Pusat" },
            { value: "outlet-2", label: "Cabang BSD" },
          ]}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="Item Terjual"
          value={totals.itemSold.toLocaleString("id-ID")}
          icon={FolderTree}
          subtitle={`${itemChange > 0 ? "+" : ""}${itemChange.toFixed(1)}% vs periode sebelumnya`}
        />
        <KPICard
          title="Total Penjualan Kotor"
          value={formatCurrency(totals.totalSales)}
          icon={TrendingUp}
          subtitle={`${salesChange > 0 ? "+" : ""}${salesChange.toFixed(1)}% vs periode sebelumnya`}
        />
      </div>

      {/* Chart */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Tren Penjualan per Kategori
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <Tooltip
                formatter={(value: number | undefined) => value ? formatCurrency(value) : formatCurrency(0)}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              {mockCategories.map((cat) => (
                <Line
                  key={cat.id}
                  type="monotone"
                  dataKey={cat.name}
                  stroke={cat.color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: cat.color }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Penjualan per Kategori
        </h3>
        <DataTable
          data={mockTableData}
          columns={columns}
          searchable
          searchPlaceholder="Cari kategori..."
          searchKeys={["name"]}
          emptyMessage="Tidak ada data kategori"
        />
      </div>
    </div>
  );
}
