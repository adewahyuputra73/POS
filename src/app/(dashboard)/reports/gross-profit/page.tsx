"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { Badge, useToast } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { OutletSelector } from "@/features/reports/components/outlet-selector";
import { TabView } from "@/features/reports/components/tab-view";
import { MarginFilter } from "@/features/reports/components/margin-filter";
import { KPICard } from "@/features/reports/components/kpi-card";
import { DataTable } from "@/features/reports/components/data-table";
import { ExportButton } from "@/features/reports/components/export-button";
import { DollarSign, ShoppingCart, TrendingUp, Percent } from "lucide-react";

type TabType = "menu" | "variant" | "category";
type MarginOperator = "<=" | ">=" | "=";

// Mock data for menu tab
const mockMenuData = [
  { id: 1, name: "Kopi Susu Gula Aren", category: "Minuman", sold: 156, grossSales: 4680000, netSales: 4368000, hpp: 1560000, grossProfit: 2808000, margin: 64.3 },
  { id: 2, name: "Es Teh Manis", category: "Minuman", sold: 234, grossSales: 2340000, netSales: 2184000, hpp: 468000, grossProfit: 1716000, margin: 78.6 },
  { id: 3, name: "Nasi Goreng Spesial", category: "Makanan", sold: 89, grossSales: 2670000, netSales: 2492000, hpp: 1068000, grossProfit: 1424000, margin: 57.1 },
  { id: 4, name: "Matcha Latte", category: "Minuman", sold: 78, grossSales: 2730000, netSales: 2548000, hpp: 936000, grossProfit: 1612000, margin: 63.3 },
  { id: 5, name: "Croissant", category: "Snack", sold: 45, grossSales: 675000, netSales: 630000, hpp: 180000, grossProfit: 450000, margin: 71.4 },
  { id: 6, name: "Americano", category: "Minuman", sold: 167, grossSales: 2505000, netSales: 2337000, hpp: 668000, grossProfit: 1669000, margin: 71.4 },
];

// Mock data for variant tab
const mockVariantData = [
  { id: 1, optionName: "Size", variantName: "Large", sold: 234, grossSales: 4680000, netSales: 4368000, hpp: 1404000, grossProfit: 2964000, margin: 67.9 },
  { id: 2, optionName: "Size", variantName: "Medium", sold: 189, grossSales: 2835000, netSales: 2645000, hpp: 756000, grossProfit: 1889000, margin: 71.4 },
  { id: 3, optionName: "Size", variantName: "Small", sold: 156, grossSales: 1560000, netSales: 1456000, hpp: 468000, grossProfit: 988000, margin: 67.9 },
  { id: 4, optionName: "Sugar Level", variantName: "Normal", sold: 312, grossSales: 4680000, netSales: 4368000, hpp: 1248000, grossProfit: 3120000, margin: 71.4 },
  { id: 5, optionName: "Sugar Level", variantName: "Less Sugar", sold: 178, grossSales: 2670000, netSales: 2492000, hpp: 712000, grossProfit: 1780000, margin: 71.4 },
  { id: 6, optionName: "Ice Level", variantName: "Normal Ice", sold: 289, grossSales: 4335000, netSales: 4045000, hpp: 1156000, grossProfit: 2889000, margin: 71.4 },
];

// Mock data for category tab
const mockCategoryData = [
  { id: 1, name: "Minuman", sold: 635, grossSales: 12255000, netSales: 11437000, hpp: 3632000, grossProfit: 7805000, margin: 68.2 },
  { id: 2, name: "Makanan", sold: 189, grossSales: 5670000, netSales: 5291000, hpp: 2268000, grossProfit: 3023000, margin: 57.1 },
  { id: 3, name: "Snack", sold: 156, grossSales: 2340000, netSales: 2184000, hpp: 624000, grossProfit: 1560000, margin: 71.4 },
  { id: 4, name: "Dessert", sold: 78, grossSales: 1560000, netSales: 1456000, hpp: 468000, grossProfit: 988000, margin: 67.9 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export default function GrossProfitPage() {
  const [dateRange, setDateRange] = useState(() => ({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }));
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const [activeTab, setActiveTab] = useState<TabType>("menu");
  const [marginOperator, setMarginOperator] = useState<MarginOperator>(">=");
  const [marginValue, setMarginValue] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { showToast } = useToast();

  const tabs = [
    { value: "menu" as TabType, label: "Menu" },
    { value: "variant" as TabType, label: "Varian" },
    { value: "category" as TabType, label: "Kategori" },
  ];

  // Get data based on active tab
  const rawData = useMemo(() => {
    switch (activeTab) {
      case "menu":
        return mockMenuData;
      case "variant":
        return mockVariantData;
      case "category":
        return mockCategoryData;
      default:
        return mockMenuData;
    }
  }, [activeTab]);

  // Filter by margin
  const filteredData = useMemo(() => {
    if (marginValue === null) return rawData;

    return rawData.filter((row) => {
      switch (marginOperator) {
        case ">=":
          return row.margin >= marginValue;
        case "<=":
          return row.margin <= marginValue;
        case "=":
          return Math.abs(row.margin - marginValue) < 0.1;
        default:
          return true;
      }
    });
  }, [rawData, marginOperator, marginValue]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    return filteredData.reduce(
      (acc, row) => ({
        grossSales: acc.grossSales + row.grossSales,
        netSales: acc.netSales + row.netSales,
        grossProfit: acc.grossProfit + row.grossProfit,
        sold: acc.sold + row.sold,
      }),
      { grossSales: 0, netSales: 0, grossProfit: 0, sold: 0 }
    );
  }, [filteredData]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      const tabLabel = activeTab === "menu" ? "Menu" : activeTab === "variant" ? "Varian" : "Kategori";

      // 1. Metadata Sheet
      exportService.addMetadataSheet({
        title: `Laporan Laba Kotor (${tabLabel})`,
        period: `${dateRange.startDate?.toLocaleDateString("id-ID")} - ${dateRange.endDate?.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin",
        outletName: selectedOutlet === "all" ? "Semua Outlet" : selectedOutlet === "outlet-1" ? "Cabang Pusat" : "Cabang BSD",
      });

      // 2. Data Sheet
      let columns = [];
      let data = filteredData;

      if (activeTab === "menu") {
        columns = [
          { header: "Nama Produk", key: "name", width: 30 },
          { header: "Kategori", key: "category", width: 20 },
          { header: "Terjual", key: "sold", width: 15, style: { numFmt: '#,##0' } },
          { header: "Penjualan Kotor", key: "grossSales", width: 20, style: { numFmt: '#,##0' } },
          { header: "Penjualan Bersih", key: "netSales", width: 20, style: { numFmt: '#,##0' } },
          { header: "HPP", key: "hpp", width: 20, style: { numFmt: '#,##0' } },
          { header: "Laba Kotor", key: "grossProfit", width: 20, style: { numFmt: '#,##0' } },
          { header: "Margin (%)", key: "margin", width: 15, style: { numFmt: '0.0"%"' } },
        ];
      } else if (activeTab === "variant") {
        columns = [
          { header: "Nama Opsi", key: "optionName", width: 20 },
          { header: "Nama Varian", key: "variantName", width: 20 },
          { header: "Terjual", key: "sold", width: 15, style: { numFmt: '#,##0' } },
          { header: "Penjualan Kotor", key: "grossSales", width: 20, style: { numFmt: '#,##0' } },
          { header: "Penjualan Bersih", key: "netSales", width: 20, style: { numFmt: '#,##0' } },
          { header: "HPP", key: "hpp", width: 20, style: { numFmt: '#,##0' } },
          { header: "Laba Kotor", key: "grossProfit", width: 20, style: { numFmt: '#,##0' } },
          { header: "Margin (%)", key: "margin", width: 15, style: { numFmt: '0.0"%"' } },
        ];
        // Cast to any to access variant properties safely
        data = filteredData.map(item => ({
          ...item,
          // Ensure optional properties are present if needed, though they are activeTab specific
        }));
      } else {
        columns = [
          { header: "Nama Kategori", key: "name", width: 30 },
          { header: "Terjual", key: "sold", width: 15, style: { numFmt: '#,##0' } },
          { header: "Penjualan Kotor", key: "grossSales", width: 20, style: { numFmt: '#,##0' } },
          { header: "Penjualan Bersih", key: "netSales", width: 20, style: { numFmt: '#,##0' } },
          { header: "HPP", key: "hpp", width: 20, style: { numFmt: '#,##0' } },
          { header: "Laba Kotor", key: "grossProfit", width: 20, style: { numFmt: '#,##0' } },
          { header: "Margin (%)", key: "margin", width: 15, style: { numFmt: '0.0"%"' } },
        ];
      }

      exportService.addDataSheet({
        name: `Data ${tabLabel}`,
        columns,
        data
      });

      // Download
      await exportService.download(`Laba_Kotor_${tabLabel}_${new Date().getTime()}`);

      showToast("Laporan laba kotor berhasil diekspor", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("Gagal mengekspor laporan", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Columns for menu tab
  const menuColumns = [
    {
      key: "name",
      header: "Nama Produk",
      sortable: true,
      render: (row: typeof mockMenuData[0]) => (
        <span className="font-medium">{row.name}</span>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      sortable: true,
      render: (row: typeof mockMenuData[0]) => (
        <Badge variant="secondary" size="sm">{row.category}</Badge>
      ),
    },
    {
      key: "sold",
      header: "Terjual",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockMenuData[0]) => (
        <span className="font-semibold">{row.sold.toLocaleString("id-ID")}</span>
      ),
    },
    {
      key: "grossSales",
      header: "Penjualan Kotor",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockMenuData[0]) => formatCurrency(row.grossSales),
    },
    {
      key: "netSales",
      header: "Penjualan Bersih",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockMenuData[0]) => formatCurrency(row.netSales),
    },
    {
      key: "hpp",
      header: "HPP",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockMenuData[0]) => (
        <span className="text-warning">{formatCurrency(row.hpp)}</span>
      ),
    },
    {
      key: "grossProfit",
      header: "Laba Kotor",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockMenuData[0]) => (
        <span className="text-success font-semibold">{formatCurrency(row.grossProfit)}</span>
      ),
    },
    {
      key: "margin",
      header: "Margin (%)",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockMenuData[0]) => (
        <Badge 
          variant={row.margin >= 60 ? "success" : row.margin >= 40 ? "warning" : "error"}
          size="sm"
        >
          {row.margin.toFixed(1)}%
        </Badge>
      ),
    },
  ];

  // Columns for variant tab
  const variantColumns = [
    {
      key: "optionName",
      header: "Nama Opsi Varian",
      sortable: true,
      render: (row: typeof mockVariantData[0]) => (
        <span className="font-medium">{row.optionName}</span>
      ),
    },
    {
      key: "variantName",
      header: "Nama Varian",
      sortable: true,
      render: (row: typeof mockVariantData[0]) => (
        <Badge variant="secondary" size="sm">{row.variantName}</Badge>
      ),
    },
    {
      key: "sold",
      header: "Terjual",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVariantData[0]) => (
        <span className="font-semibold">{row.sold.toLocaleString("id-ID")}</span>
      ),
    },
    {
      key: "grossSales",
      header: "Penjualan Kotor",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVariantData[0]) => formatCurrency(row.grossSales),
    },
    {
      key: "netSales",
      header: "Penjualan Bersih",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVariantData[0]) => formatCurrency(row.netSales),
    },
    {
      key: "hpp",
      header: "HPP",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVariantData[0]) => (
        <span className="text-warning">{formatCurrency(row.hpp)}</span>
      ),
    },
    {
      key: "grossProfit",
      header: "Laba Kotor",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVariantData[0]) => (
        <span className="text-success font-semibold">{formatCurrency(row.grossProfit)}</span>
      ),
    },
    {
      key: "margin",
      header: "Margin (%)",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockVariantData[0]) => (
        <Badge 
          variant={row.margin >= 60 ? "success" : row.margin >= 40 ? "warning" : "error"}
          size="sm"
        >
          {row.margin.toFixed(1)}%
        </Badge>
      ),
    },
  ];

  // Columns for category tab
  const categoryColumns = [
    {
      key: "name",
      header: "Nama Kategori",
      sortable: true,
      render: (row: typeof mockCategoryData[0]) => (
        <span className="font-medium">{row.name}</span>
      ),
    },
    {
      key: "sold",
      header: "Terjual",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockCategoryData[0]) => (
        <span className="font-semibold">{row.sold.toLocaleString("id-ID")}</span>
      ),
    },
    {
      key: "grossSales",
      header: "Penjualan Kotor",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockCategoryData[0]) => formatCurrency(row.grossSales),
    },
    {
      key: "netSales",
      header: "Penjualan Bersih",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockCategoryData[0]) => formatCurrency(row.netSales),
    },
    {
      key: "hpp",
      header: "HPP",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockCategoryData[0]) => (
        <span className="text-warning">{formatCurrency(row.hpp)}</span>
      ),
    },
    {
      key: "grossProfit",
      header: "Laba Kotor",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockCategoryData[0]) => (
        <span className="text-success font-semibold">{formatCurrency(row.grossProfit)}</span>
      ),
    },
    {
      key: "margin",
      header: "Margin (%)",
      sortable: true,
      className: "text-right",
      render: (row: typeof mockCategoryData[0]) => (
        <Badge 
          variant={row.margin >= 60 ? "success" : row.margin >= 40 ? "warning" : "error"}
          size="sm"
        >
          {row.margin.toFixed(1)}%
        </Badge>
      ),
    },
  ];

  const getColumns = () => {
    switch (activeTab) {
      case "menu":
        return menuColumns;
      case "variant":
        return variantColumns;
      case "category":
        return categoryColumns;
      default:
        return menuColumns;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Laba Kotor"
        description="Analisis laba kotor berdasarkan menu, varian, dan kategori"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laporan", href: "/reports" },
          { label: "Laba Kotor" },
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
        
        <div className="flex-1" />
        
        <MarginFilter
          operator={marginOperator}
          value={marginValue}
          onOperatorChange={setMarginOperator}
          onValueChange={setMarginValue}
        />
      </div>

      {/* Tab Switcher */}
      <TabView tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Penjualan Kotor"
          value={formatCurrency(kpis.grossSales)}
          icon={ShoppingCart}
        />
        <KPICard
          title="Penjualan Bersih"
          value={formatCurrency(kpis.netSales)}
          icon={DollarSign}
        />
        <KPICard
          title="Laba Kotor"
          value={formatCurrency(kpis.grossProfit)}
          icon={TrendingUp}
          className="bg-success-light/20"
        />
        <KPICard
          title={`Total Terjual (${activeTab === "menu" ? "Menu" : activeTab === "variant" ? "Varian" : "Kategori"})`}
          value={kpis.sold.toLocaleString("id-ID")}
          icon={Percent}
        />
      </div>

      {/* Data Table */}
      <div className="bg-surface p-6 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {activeTab === "menu" 
              ? "Penjualan per Menu" 
              : activeTab === "variant" 
              ? "Penjualan per Varian" 
              : "Penjualan per Kategori"}
          </h3>
          {marginValue !== null && (
            <Badge variant="primary" size="sm">
              Filter: Margin {marginOperator} {marginValue}%
            </Badge>
          )}
        </div>
        <DataTable
          data={filteredData as unknown as Record<string, unknown>[]}
          columns={getColumns() as unknown as { key: string; header: React.ReactNode; sortable?: boolean; className?: string; render?: (row: Record<string, unknown>, index: number) => React.ReactNode; }[]}
          searchable
          searchPlaceholder={`Cari ${activeTab}...`}
          searchKeys={["name", "optionName", "variantName", "category"]}
          emptyMessage="Tidak ada data"
          pageSize={10}
        />
      </div>
    </div>
  );
}
