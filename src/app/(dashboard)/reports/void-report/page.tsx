"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Badge, useToast } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { ModeToggle } from "@/features/reports/components/mode-toggle";
import { KPICard } from "@/features/reports/components/kpi-card";
import { DataTable } from "@/features/reports/components/data-table";
import { ExportButton } from "@/features/reports/components/export-button";
import { XCircle, DollarSign, User, Package } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type ViewMode = "total" | "date";

// Mock staff options
const mockStaffOptions = [
  { value: "all", label: "Semua Staff" },
  { value: "john", label: "John Doe" },
  { value: "jane", label: "Jane Smith" },
  { value: "ahmad", label: "Ahmad Rizky" },
];

// Mock void data
const mockVoidData = [
  { id: 1, date: "2026-02-01", time: "14:43", staffName: "John Doe", product: "Kopi Susu Gula Aren", category: "Minuman", qty: 1, price: 30000 },
  { id: 2, date: "2026-02-01", time: "15:22", staffName: "Jane Smith", product: "Nasi Goreng Spesial", category: "Makanan", qty: 1, price: 35000 },
  { id: 3, date: "2026-02-01", time: "16:05", staffName: "N/A", product: "Es Teh Manis", category: "Minuman", qty: 2, price: 20000 },
  { id: 4, date: "2026-01-31", time: "10:15", staffName: "Ahmad Rizky", product: "Croissant", category: "Snack", qty: 1, price: 25000 },
  { id: 5, date: "2026-01-31", time: "12:33", staffName: "John Doe", product: "Matcha Latte", category: "Minuman", qty: 1, price: 38000 },
  { id: 6, date: "2026-01-30", time: "09:45", staffName: "N/A", product: "Americano", category: "Minuman", qty: 1, price: 25000 },
  { id: 7, date: "2026-01-30", time: "14:20", staffName: "Jane Smith", product: "Sandwich", category: "Makanan", qty: 1, price: 28000 },
  { id: 8, date: "2026-01-29", time: "11:00", staffName: "Ahmad Rizky", product: "Cappuccino", category: "Minuman", qty: 2, price: 60000 },
];

// Mock chart data - total view
const mockTotalChartData = [
  { name: "Minuman", value: 173000, count: 6 },
  { name: "Makanan", value: 63000, count: 2 },
  { name: "Snack", value: 25000, count: 1 },
];

// Mock chart data - date view
const mockDateChartData = [
  { date: "29 Jan", value: 60000, count: 1 },
  { date: "30 Jan", value: 53000, count: 2 },
  { date: "31 Jan", value: 63000, count: 2 },
  { date: "01 Feb", value: 85000, count: 3 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function VoidReportPage() {
  const [dateRange, setDateRange] = useState(() => ({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }));
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("total");
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  // Filter data by staff
  const filteredData = useMemo(() => {
    if (selectedStaff === "all") return mockVoidData;
    const staffLabel = mockStaffOptions.find((s) => s.value === selectedStaff)?.label;
    return mockVoidData.filter((item) => item.staffName === staffLabel);
  }, [selectedStaff]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        count: acc.count + item.qty,
        amount: acc.amount + item.price,
      }),
      { count: 0, amount: 0 }
    );
  }, [filteredData]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      // 1. Metadata Sheet
      exportService.addMetadataSheet({
        title: "Laporan Pembatalan / Void",
        period: `${dateRange.startDate?.toLocaleDateString("id-ID")} - ${dateRange.endDate?.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: "Semua Outlet", // This page doesn't have outlet selector in mock, assuming filtered by staff/date
      });

      // 2. Data Sheet
      exportService.addDataSheet({
        name: "Data Void",
        columns: [
          { header: "Tanggal", key: "date", width: 15 },
          { header: "Jam", key: "time", width: 10 },
          { header: "Staff", key: "staffName", width: 20 },
          { header: "Produk", key: "product", width: 30 },
          { header: "Kategori", key: "category", width: 20 },
          { header: "Jumlah", key: "qty", width: 10, style: { numFmt: '#,##0' } },
          { header: "Harga", key: "price", width: 15, style: { numFmt: '#,##0' } },
        ],
        data: filteredData
      });

      // Download
      await exportService.download(`Laporan_Void_${new Date().getTime()}`);

      showToast("Laporan void berhasil diekspor", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      key: "date",
      header: "Tanggal",
      sortable: true,
      render: (row: typeof mockVoidData[0]) => (
        <span className="font-medium">{row.date}</span>
      ),
    },
    {
      key: "time",
      header: "Jam",
      render: (row: typeof mockVoidData[0]) => (
        <span className="text-text-secondary">{row.time}</span>
      ),
    },
    {
      key: "staffName",
      header: "Staff",
      sortable: true,
      render: (row: typeof mockVoidData[0]) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-light rounded-lg">
            <User className="h-3 w-3 text-primary" />
          </div>
          <span className={row.staffName === "N/A" ? "text-text-secondary italic" : ""}>
            {row.staffName}
          </span>
        </div>
      ),
    },
    {
      key: "product",
      header: "Produk",
      sortable: true,
      render: (row: typeof mockVoidData[0]) => (
        <span className="font-medium">{row.product}</span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      sortable: true,
      render: (row: typeof mockVoidData[0]) => (
        <Badge variant="secondary" size="sm">{row.category}</Badge>
      ),
    },
    {
      key: "qty",
      header: "Jumlah",
      sortable: true,
      className: "text-center",
      render: (row: typeof mockVoidData[0]) => (
        <span className="font-semibold">{row.qty}</span>
      ),
    },
    {
      key: "price",
      header: "Harga",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVoidData[0]) => (
        <span className="font-semibold text-error">{formatCurrency(row.price)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Pembatalan / Void"
        description="Laporan transaksi yang dibatalkan"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laporan", href: "/reports" },
          { label: "Pembatalan / Void" },
        ]}
        actions={
          <ExportButton
            onClick={handleExport}
            isLoading={isExporting}
          />
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border border-border">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        
        {/* Staff Filter */}
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {mockStaffOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        {/* View Mode Toggle */}
        <ModeToggle
          options={[
            { value: "total" as ViewMode, label: "Total View" },
            { value: "date" as ViewMode, label: "Date View" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="Total Void"
          value={totals.count.toLocaleString("id-ID")}
          subtitle="item dibatalkan"
          icon={XCircle}
          className="bg-error-light/20"
        />
        <KPICard
          title="Jumlah Nominal Void"
          value={formatCurrency(totals.amount)}
          subtitle="kerugian pembatalan"
          icon={DollarSign}
          className="bg-error-light/20"
        />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {viewMode === "total" ? "Void per Kategori" : "Tren Void Harian"}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "total" ? (
              <BarChart data={mockTotalChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [value ? formatCurrency(value) : formatCurrency(0), "Nominal"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#F44336"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <LineChart data={mockDateChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip
                  formatter={(value: number | undefined) => [value ? formatCurrency(value) : formatCurrency(0), "Nominal"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E5E7EB",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#F44336"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#F44336" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Detail Pembatalan
        </h3>
        <DataTable
          data={filteredData}
          columns={columns}
          searchable
          searchPlaceholder="Cari produk atau staff..."
          searchKeys={["product", "staffName", "category"]}
          emptyMessage="Tidak ada data pembatalan"
          pageSize={10}
        />
      </div>
    </div>
  );
}
