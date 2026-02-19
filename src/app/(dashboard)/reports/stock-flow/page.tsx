"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Badge, useToast } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { OutletSelector } from "@/features/reports/components/outlet-selector";
import { ModeToggle } from "@/features/reports/components/mode-toggle";
import { DataTable } from "@/features/reports/components/data-table";
import { ExportButton } from "@/features/reports/components/export-button";
import { TrendingUp, Package, ArrowUp, ArrowDown, Minus } from "lucide-react";

// Mock data for stock flow
const mockStockFlowData = [
  {
    id: 1,
    name: "Kopi Arabica",
    type: "Bahan Baku",
    category: "Minuman",
    unit: "kg",
    start: 50,
    sales: 15,
    addition: 20,
    expense: 5,
    opname: 0,
    end: 50,
    startPrice: 2500000,
    salesPrice: 750000,
    additionPrice: 1000000,
    expensePrice: 250000,
    opnamePrice: 0,
    endPrice: 2500000,
  },
  {
    id: 2,
    name: "Susu Full Cream",
    type: "Bahan Baku",
    category: "Minuman",
    unit: "liter",
    start: 100,
    sales: 45,
    addition: 50,
    expense: 10,
    opname: -2,
    end: 93,
    startPrice: 1500000,
    salesPrice: 675000,
    additionPrice: 750000,
    expensePrice: 150000,
    opnamePrice: -30000,
    endPrice: 1395000,
  },
  {
    id: 3,
    name: "Gula Pasir",
    type: "Bahan Baku",
    category: "Bahan Dasar",
    unit: "kg",
    start: 25,
    sales: 8,
    addition: 15,
    expense: 2,
    opname: 0,
    end: 30,
    startPrice: 375000,
    salesPrice: 120000,
    additionPrice: 225000,
    expensePrice: 30000,
    opnamePrice: 0,
    endPrice: 450000,
  },
  {
    id: 4,
    name: "Es Batu",
    type: "Bahan Pendukung",
    category: "Minuman",
    unit: "pack",
    start: 200,
    sales: 120,
    addition: 150,
    expense: 30,
    opname: 5,
    end: 205,
    startPrice: 400000,
    salesPrice: 240000,
    additionPrice: 300000,
    expensePrice: 60000,
    opnamePrice: 10000,
    endPrice: 410000,
  },
  {
    id: 5,
    name: "Cup Plastik 16oz",
    type: "Kemasan",
    category: "Packaging",
    unit: "pcs",
    start: 500,
    sales: 234,
    addition: 300,
    expense: 50,
    opname: -16,
    end: 500,
    startPrice: 500000,
    salesPrice: 234000,
    additionPrice: 300000,
    expensePrice: 50000,
    opnamePrice: -16000,
    endPrice: 500000,
  },
  {
    id: 6,
    name: "Sedotan",
    type: "Kemasan",
    category: "Packaging",
    unit: "pcs",
    start: 1000,
    sales: 450,
    addition: 500,
    expense: 100,
    opname: 0,
    end: 950,
    startPrice: 200000,
    salesPrice: 90000,
    additionPrice: 100000,
    expensePrice: 20000,
    opnamePrice: 0,
    endPrice: 190000,
  },
];

const mockCategoryOptions = [
  { value: "all", label: "Semua Kategori" },
  { value: "minuman", label: "Minuman" },
  { value: "bahan-dasar", label: "Bahan Dasar" },
  { value: "packaging", label: "Packaging" },
];

type ViewMode = "unit" | "price";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function StockFlowPage() {
  const [dateRange, setDateRange] = useState(() => ({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }));
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("unit");
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  // Filter data by category
  const filteredData = useMemo(() => {
    if (selectedCategory === "all") return mockStockFlowData;
    return mockStockFlowData.filter(
      (item) => item.category.toLowerCase().replace(" ", "-") === selectedCategory
    );
  }, [selectedCategory]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      // 1. Metadata Sheet
      exportService.addMetadataSheet({
        title: "Laporan Arus Stok",
        period: `${dateRange.startDate?.toLocaleDateString("id-ID")} - ${dateRange.endDate?.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: selectedOutlet === "all" ? "Semua Outlet" : selectedOutlet === "outlet-1" ? "Cabang Pusat" : "Cabang BSD",
      });

      // 2. Data Sheet
      exportService.addDataSheet({
        name: "Data Arus Stok",
        columns: [
          { header: "Nama Bahan", key: "name", width: 30 },
          { header: "Kategori", key: "category", width: 20 },
          { header: "Satuan", key: "unit", width: 10 },
          { header: "Awal", key: "start", width: 15, style: { numFmt: '#,##0' } },
          { header: "Penjualan", key: "sales", width: 15, style: { numFmt: '#,##0' } },
          { header: "Penambahan", key: "addition", width: 15, style: { numFmt: '#,##0' } },
          { header: "Pengeluaran", key: "expense", width: 15, style: { numFmt: '#,##0' } },
          { header: "Opname", key: "opname", width: 15, style: { numFmt: '#,##0' } },
          { header: "Akhir", key: "end", width: 15, style: { numFmt: '#,##0' } },
        ],
        data: filteredData.map(item => ({
          ...item,
          // If viewMode is price, map price fields
          ...(viewMode === "price" ? {
            start: item.startPrice,
            sales: item.salesPrice,
            addition: item.additionPrice,
            expense: item.expensePrice,
            opname: item.opnamePrice,
            end: item.endPrice,
          } : {})
        }))
      });

      // Download
      await exportService.download(`Arus_Stok_${new Date().getTime()}`);

      showToast("Laporan arus stok berhasil diekspor", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const renderStockValue = (value: number, priceValue: number) => {
    const displayValue = viewMode === "unit" ? value : priceValue;
    const isNegative = displayValue < 0;
    const isPositive = displayValue > 0;

    if (viewMode === "price") {
      return (
        <span className={isNegative ? "text-error" : isPositive ? "text-success" : ""}>
          {formatCurrency(displayValue)}
        </span>
      );
    }

    return (
      <span className={isNegative ? "text-error" : isPositive ? "text-success" : ""}>
        {displayValue.toLocaleString("id-ID")}
      </span>
    );
  };

  const renderChangeIndicator = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-success inline ml-1" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-error inline ml-1" />;
    return <Minus className="h-4 w-4 text-text-secondary inline ml-1" />;
  };

  const columns = [
    {
      key: "name",
      header: "Nama Bahan Dasar",
      sortable: true,
      render: (row: typeof mockStockFlowData[0]) => (
        <div>
          <p className="font-semibold text-text-primary">{row.name}</p>
          <p className="text-xs text-text-secondary">{row.type}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      sortable: true,
      render: (row: typeof mockStockFlowData[0]) => (
        <Badge variant="secondary" size="sm">
          {row.category}
        </Badge>
      ),
    },
    {
      key: "unit",
      header: "Satuan",
      className: "text-center",
      render: (row: typeof mockStockFlowData[0]) => (
        <span className="text-text-secondary">{row.unit}</span>
      ),
    },
    {
      key: "start",
      header: "Mulai",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockStockFlowData[0]) => (
        <span className="font-medium">{renderStockValue(row.start, row.startPrice)}</span>
      ),
    },
    {
      key: "sales",
      header: "Penjualan",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockStockFlowData[0]) => (
        <span className="text-warning font-medium">
          -{renderStockValue(row.sales, row.salesPrice)}
        </span>
      ),
    },
    {
      key: "addition",
      header: "Penambahan",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockStockFlowData[0]) => (
        <span className="text-success font-medium">
          +{renderStockValue(row.addition, row.additionPrice)}
        </span>
      ),
    },
    {
      key: "expense",
      header: "Pengeluaran",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockStockFlowData[0]) => (
        <span className="text-error font-medium">
          -{renderStockValue(row.expense, row.expensePrice)}
        </span>
      ),
    },
    {
      key: "opname",
      header: "Stok Opname",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockStockFlowData[0]) => {
        const value = viewMode === "unit" ? row.opname : row.opnamePrice;
        return (
          <span className={value !== 0 ? (value > 0 ? "text-success" : "text-error") : ""}>
            {value > 0 ? "+" : ""}{renderStockValue(row.opname, row.opnamePrice)}
            {renderChangeIndicator(value)}
          </span>
        );
      },
    },
    {
      key: "end",
      header: "Akhir",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockStockFlowData[0]) => (
        <span className="font-bold text-primary">
          {renderStockValue(row.end, row.endPrice)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Arus Stok"
        description="Laporan pergerakan stok bahan dasar"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laporan", href: "/reports" },
          { label: "Arus Stok" },
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
        <OutletSelector
          value={selectedOutlet}
          onChange={setSelectedOutlet}
          options={[
            { value: "outlet-1", label: "Cabang Pusat" },
            { value: "outlet-2", label: "Cabang BSD" },
          ]}
        />
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {mockCategoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex-1" />

        {/* View Mode Toggle */}
        <ModeToggle
          options={[
            { value: "unit" as ViewMode, label: "Satuan" },
            { value: "price" as ViewMode, label: "Harga (Rp)" },
          ]}
          value={viewMode}
          onChange={setViewMode}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Bahan</p>
              <p className="text-xl font-bold text-text-primary">{filteredData.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-light rounded-lg">
              <ArrowUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Penambahan</p>
              <p className="text-xl font-bold text-success">
                {viewMode === "unit"
                  ? filteredData.reduce((acc, r) => acc + r.addition, 0).toLocaleString("id-ID")
                  : formatCurrency(filteredData.reduce((acc, r) => acc + r.additionPrice, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-light rounded-lg">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Penjualan</p>
              <p className="text-xl font-bold text-warning">
                {viewMode === "unit"
                  ? filteredData.reduce((acc, r) => acc + r.sales, 0).toLocaleString("id-ID")
                  : formatCurrency(filteredData.reduce((acc, r) => acc + r.salesPrice, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-error-light rounded-lg">
              <ArrowDown className="h-5 w-5 text-error" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Pengeluaran</p>
              <p className="text-xl font-bold text-error">
                {viewMode === "unit"
                  ? filteredData.reduce((acc, r) => acc + r.expense, 0).toLocaleString("id-ID")
                  : formatCurrency(filteredData.reduce((acc, r) => acc + r.expensePrice, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Detail Arus Stok
        </h3>
        <DataTable
          data={filteredData}
          columns={columns}
          searchable
          searchPlaceholder="Cari bahan dasar..."
          searchKeys={["name", "category"]}
          emptyMessage="Tidak ada data stok"
          pageSize={10}
        />
      </div>
    </div>
  );
}
