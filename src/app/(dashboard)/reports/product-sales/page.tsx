"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { 
  DateRangePicker, 
  OutletSelector, 
  ExportButton, 
  KPICard,
  MultiSelect,
  AggregationToggle
} from "@/features/reports/components";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ShoppingCart, DollarSign, Search, X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Mock data
const mockChartData = [
  { date: "01 Jan", "Nasi Goreng": 45, "Mie Goreng": 32, "Es Teh": 78 },
  { date: "02 Jan", "Nasi Goreng": 52, "Mie Goreng": 28, "Es Teh": 85 },
  { date: "03 Jan", "Nasi Goreng": 38, "Mie Goreng": 41, "Es Teh": 62 },
  { date: "04 Jan", "Nasi Goreng": 61, "Mie Goreng": 35, "Es Teh": 91 },
  { date: "05 Jan", "Nasi Goreng": 55, "Mie Goreng": 48, "Es Teh": 73 },
  { date: "06 Jan", "Nasi Goreng": 67, "Mie Goreng": 52, "Es Teh": 88 },
  { date: "07 Jan", "Nasi Goreng": 72, "Mie Goreng": 45, "Es Teh": 95 },
];

const mockProducts = [
  { outlet: "Outlet Utama", product_name: "Nasi Goreng Spesial", category: "Makanan", item_sold: 390, total_sales: 11700000 },
  { outlet: "Outlet Utama", product_name: "Mie Goreng Seafood", category: "Makanan", item_sold: 281, total_sales: 8430000 },
  { outlet: "Outlet Utama", product_name: "Es Teh Manis", category: "Minuman", item_sold: 572, total_sales: 2860000 },
  { outlet: "Outlet Cabang 1", product_name: "Nasi Goreng Spesial", category: "Makanan", item_sold: 245, total_sales: 7350000 },
  { outlet: "Outlet Cabang 1", product_name: "Ayam Bakar", category: "Makanan", item_sold: 189, total_sales: 9450000 },
  { outlet: "Outlet Cabang 2", product_name: "Es Jeruk", category: "Minuman", item_sold: 312, total_sales: 1560000 },
  { outlet: "Outlet Cabang 2", product_name: "Cappuccino", category: "Minuman", item_sold: 198, total_sales: 5940000 },
  { outlet: "Outlet Cabang 2", product_name: "Mie Ayam", category: "Makanan", item_sold: 276, total_sales: 6900000 },
];

const mockFilterOptions = {
  outlets: [
    { value: "1", label: "Outlet Utama" },
    { value: "2", label: "Outlet Cabang 1" },
    { value: "3", label: "Outlet Cabang 2" },
  ],
  products: [
    { value: "p1", label: "Nasi Goreng Spesial" },
    { value: "p2", label: "Mie Goreng Seafood" },
    { value: "p3", label: "Es Teh Manis" },
    { value: "p4", label: "Ayam Bakar" },
    { value: "p5", label: "Es Jeruk" },
    { value: "p6", label: "Cappuccino" },
    { value: "p7", label: "Mie Ayam" },
  ],
  categories: [
    { value: "c1", label: "Makanan" },
    { value: "c2", label: "Minuman" },
    { value: "c3", label: "Snack" },
  ],
};

const CHART_COLORS = ["#2196F3", "#4CAF50", "#FF9800", "#9C27B0", "#E91E63"];

type AggregationMode = 'total' | 'hourly' | 'daily' | 'weekly' | 'monthly';

// Map filter values to actual names
const productMap: Record<string, string> = {
  p1: "Nasi Goreng Spesial",
  p2: "Mie Goreng Seafood",
  p3: "Es Teh Manis",
  p4: "Ayam Bakar",
  p5: "Es Jeruk",
  p6: "Cappuccino",
  p7: "Mie Ayam",
};

const categoryMap: Record<string, string> = {
  c1: "Makanan",
  c2: "Minuman",
  c3: "Snack",
};

const outletMap: Record<string, string> = {
  "1": "Outlet Utama",
  "2": "Outlet Cabang 1",
  "3": "Outlet Cabang 2",
};

export default function ProductSalesPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [aggregationMode, setAggregationMode] = useState<AggregationMode>("daily");
  const [isExporting, setIsExporting] = useState(false);
  const [tableSearch, setTableSearch] = useState("");

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Outlet filter
      if (selectedOutlet !== "all") {
        const outletName = outletMap[selectedOutlet];
        if (product.outlet !== outletName) return false;
      }

      // Product filter
      if (selectedProducts.length > 0) {
        const productNames = selectedProducts.map(id => productMap[id]).filter(Boolean);
        if (!productNames.includes(product.product_name)) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const categoryNames = selectedCategories.map(id => categoryMap[id]).filter(Boolean);
        if (!categoryNames.includes(product.category)) return false;
      }

      // Table search
      if (tableSearch) {
        const search = tableSearch.toLowerCase();
        if (
          !product.product_name.toLowerCase().includes(search) &&
          !product.outlet.toLowerCase().includes(search) &&
          !product.category.toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedOutlet, selectedProducts, selectedCategories, tableSearch]);

  // Calculate totals based on filtered data
  const totalItemsSold = filteredProducts.reduce((acc, p) => acc + p.item_sold, 0);
  const totalGrossSales = filteredProducts.reduce((acc, p) => acc + p.total_sales, 0);

  // Check if any filter is active
  const hasActiveFilters = selectedOutlet !== "all" || selectedProducts.length > 0 || selectedCategories.length > 0 || tableSearch;

  const resetAllFilters = () => {
    setSelectedOutlet("all");
    setSelectedProducts([]);
    setSelectedCategories([]);
    setTableSearch("");
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Export product sales with:", { dateRange, selectedOutlet, selectedProducts, selectedCategories, aggregationMode });
    
    const filterInfo = [];
    if (selectedOutlet !== "all") filterInfo.push(`Outlet: ${outletMap[selectedOutlet]}`);
    if (selectedProducts.length > 0) filterInfo.push(`Produk: ${selectedProducts.length} dipilih`);
    if (selectedCategories.length > 0) filterInfo.push(`Kategori: ${selectedCategories.length} dipilih`);
    
    alert(`Export berhasil!\n${filterInfo.length > 0 ? filterInfo.join("\n") : "Semua Data"}\nTotal: ${filteredProducts.length} produk`);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penjualan Produk"
        description="Analisis penjualan per produk dengan berbagai filter"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Penjualan Produk" },
        ]}
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-border shadow-card p-4">
        <div className="flex flex-wrap items-start gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <OutletSelector 
            value={selectedOutlet} 
            onChange={setSelectedOutlet}
            options={mockFilterOptions.outlets}
          />
          <MultiSelect
            value={selectedProducts}
            onChange={setSelectedProducts}
            options={mockFilterOptions.products}
            placeholder="Semua Produk"
          />
          <MultiSelect
            value={selectedCategories}
            onChange={setSelectedCategories}
            options={mockFilterOptions.categories}
            placeholder="Semua Kategori"
          />
          <div className="flex-1" />
          <ExportButton onClick={handleExport} isLoading={isExporting} />
        </div>
        
        {/* Aggregation Mode */}
        <div className="mt-4 pt-4 border-t border-divider">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-secondary">Agregasi:</span>
              <AggregationToggle value={aggregationMode} onChange={setAggregationMode} />
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-sm font-medium text-error hover:text-error/80 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Reset Semua Filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-text-secondary">Filter aktif:</span>
          {selectedOutlet !== "all" && (
            <span className="px-2 py-1 bg-primary-light text-primary font-medium rounded-md flex items-center gap-1">
              {outletMap[selectedOutlet]}
              <button onClick={() => setSelectedOutlet("all")} className="hover:text-primary-dark">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedProducts.length > 0 && (
            <span className="px-2 py-1 bg-success-light text-success font-medium rounded-md flex items-center gap-1">
              {selectedProducts.length} Produk
              <button onClick={() => setSelectedProducts([])} className="hover:text-green-700">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedCategories.length > 0 && (
            <span className="px-2 py-1 bg-warning-light text-warning font-medium rounded-md flex items-center gap-1">
              {selectedCategories.length} Kategori
              <button onClick={() => setSelectedCategories([])} className="hover:text-orange-700">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

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
          title="Total Penjualan Kotor"
          value={formatCurrency(totalGrossSales)}
          icon={DollarSign}
          iconColor="text-success"
          iconBgColor="bg-success-light"
          subtitle="Sebelum diskon dan pajak"
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-border shadow-card p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Tren Penjualan Produk ({aggregationMode === 'daily' ? 'Harian' : aggregationMode === 'weekly' ? 'Mingguan' : aggregationMode === 'monthly' ? 'Bulanan' : aggregationMode === 'hourly' ? 'Per Jam' : 'Total'})</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: "#757575" }}
                axisLine={{ stroke: "#E0E0E0" }}
                tickLine={{ stroke: "#E0E0E0" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#757575" }}
                axisLine={{ stroke: "#E0E0E0" }}
                tickLine={{ stroke: "#E0E0E0" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="Nasi Goreng" 
                stroke={CHART_COLORS[0]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Mie Goreng" 
                stroke={CHART_COLORS[1]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="Es Teh" 
                stroke={CHART_COLORS[2]} 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-divider flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Detail Penjualan Produk</h3>
            <p className="text-sm text-text-secondary">{filteredProducts.length} produk ditemukan</p>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Outlet</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Nama Produk</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Kategori</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Item Terjual</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total Penjualan</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Search className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Tidak ada produk yang ditemukan</p>
                    <button onClick={resetAllFilters} className="text-sm font-medium text-primary hover:text-primary-dark mt-2">
                      Reset Filter
                    </button>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={index} className="border-b border-divider last:border-0 hover:bg-background/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-text-secondary">{product.outlet}</td>
                    <td className="px-5 py-4 text-sm font-medium text-text-primary">{product.product_name}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-primary-light text-primary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-right text-text-primary font-medium">{formatNumber(product.item_sold)}</td>
                    <td className="px-5 py-4 text-sm text-right font-semibold text-success">{formatCurrency(product.total_sales)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredProducts.length > 0 && (
              <tfoot className="bg-primary-light">
                <tr>
                  <td colSpan={3} className="px-5 py-4 text-sm font-bold text-text-primary">Total</td>
                  <td className="px-5 py-4 text-sm text-right font-bold text-text-primary">{formatNumber(totalItemsSold)}</td>
                  <td className="px-5 py-4 text-sm text-right font-bold text-primary">{formatCurrency(totalGrossSales)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
