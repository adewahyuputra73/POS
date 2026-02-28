"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { useToast } from "@/components/ui";
import { 
  DateRangePicker, 
  OutletSelector, 
  ExportButton, 
  KPICard 
} from "@/features/reports/components";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { 
  ShoppingCart, 
  Receipt, 
  TrendingUp, 
  DollarSign,
  Utensils,
  QrCode,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  Search,
} from "lucide-react";

// Types
interface SalesSummaryData {
  outlet_name: string;
  item_sold: number;
  total_order: number;
  avg_per_transaction: number;
  total_sales: number;
  total_dine_in: number;
  total_qr_order: number;
  total_delivery: number;
}

// Mock data for development
const mockSalesSummaryByOutlet: Record<string, SalesSummaryData> = {
  all: {
    outlet_name: "Semua Outlet",
    item_sold: 3741,
    total_order: 1167,
    avg_per_transaction: 156000,
    total_sales: 182052000,
    total_dine_in: 85500000,
    total_qr_order: 54600000,
    total_delivery: 41952000,
  },
  "1": {
    outlet_name: "Outlet Utama",
    item_sold: 1247,
    total_order: 389,
    avg_per_transaction: 156000,
    total_sales: 60684000,
    total_dine_in: 28500000,
    total_qr_order: 18200000,
    total_delivery: 13984000,
  },
  "2": {
    outlet_name: "Outlet Cabang 1",
    item_sold: 1124,
    total_order: 351,
    avg_per_transaction: 148000,
    total_sales: 51948000,
    total_dine_in: 24000000,
    total_qr_order: 16400000,
    total_delivery: 11548000,
  },
  "3": {
    outlet_name: "Outlet Cabang 2",
    item_sold: 1370,
    total_order: 427,
    avg_per_transaction: 163000,
    total_sales: 69420000,
    total_dine_in: 33000000,
    total_qr_order: 20000000,
    total_delivery: 16420000,
  },
};

const mockSalesDetails = [
  { label: "Faktur Penjualan", value: 62500000 },
  { label: "Diskon", value: -1200000 },
  { label: "Sub Total Setelah Diskon", value: 61300000 },
  { label: "Refund", value: -616000 },
  { label: "Penjualan Bersih", value: 60684000 },
  { label: "Pajak", value: 6068400 },
  { label: "Service Charge", value: 3034200 },
  { label: "Pembulatan", value: -400 },
  { label: "Total Penjualan", value: 69786200 },
];

const mockPaymentMethods = [
  { method: "Tunai", order_count: 156, total: 24300000 },
  { method: "Transfer Bank", order_count: 89, total: 13850000 },
  { method: "QRIS", order_count: 67, total: 10420000 },
  { method: "EDC (Debit/Credit)", order_count: 45, total: 7010000 },
  { method: "GoFood", order_count: 18, total: 2800000 },
  { method: "GrabFood", order_count: 14, total: 2304000 },
];

const mockOutlets = [
  { value: "1", label: "Outlet Utama" },
  { value: "2", label: "Outlet Cabang 1" },
  { value: "3", label: "Outlet Cabang 2" },
];

export default function SalesSummaryPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [paymentSearch, setPaymentSearch] = useState("");
  const { showToast } = useToast();

  // Get data based on selected outlet
  const summaryData = useMemo(() => {
    return mockSalesSummaryByOutlet[selectedOutlet] || mockSalesSummaryByOutlet.all;
  }, [selectedOutlet]);

  // Filter payment methods based on search
  const filteredPaymentMethods = useMemo(() => {
    if (!paymentSearch) return mockPaymentMethods;
    return mockPaymentMethods.filter((pm) =>
      pm.method.toLowerCase().includes(paymentSearch.toLowerCase())
    );
  }, [paymentSearch]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Lazy load the service to ensure client-side execution
      const { ExcelExportService } = await import("@/lib/excel-export");
      const exportService = new ExcelExportService();

      // 1. Metadata Sheet
      exportService.addMetadataSheet({
        title: "Laporan Ringkasan Penjualan",
        period: `${dateRange.startDate?.toLocaleDateString("id-ID")} - ${dateRange.endDate?.toLocaleDateString("id-ID")}`,
        generatedAt: new Date().toLocaleString("id-ID"),
        generatedBy: "Admin", // TODO: Get from auth context
        outletName: summaryData.outlet_name,
      });

      // 2. Summary Sheet (KPIs)
      exportService.addSummarySheet([
        { label: "Item Terjual", value: formatNumber(summaryData.item_sold) },
        { label: "Total Pesanan", value: formatNumber(summaryData.total_order) },
        { label: "Rata-rata / Transaksi", value: formatCurrency(summaryData.avg_per_transaction) },
        { label: "Total Penjualan", value: formatCurrency(summaryData.total_sales) },
        { label: "Total Dine In", value: formatCurrency(summaryData.total_dine_in) },
        { label: "Total QR Order", value: formatCurrency(summaryData.total_qr_order) },
        { label: "Total Delivery", value: formatCurrency(summaryData.total_delivery) },
      ]);

      // 3. Details Sheet
      exportService.addDataSheet({
        name: "Rincian Penjualan",
        columns: [
          { header: "Keterangan", key: "label", width: 40 },
          { header: "Nilai", key: "value", width: 30, style: { numFmt: '#,##0' } },
        ],
        data: mockSalesDetails.map(item => ({
          label: item.label,
          value: item.value
        }))
      });

      // 4. Payment Methods Sheet
      exportService.addDataSheet({
        name: "Metode Pembayaran",
        columns: [
          { header: "Metode", key: "method", width: 30 },
          { header: "Jumlah Order", key: "order_count", width: 20 },
          { header: "Total Nilai", key: "total", width: 30, style: { numFmt: '#,##0' } },
        ],
        data: filteredPaymentMethods
      });

      // Download
      await exportService.download(`Ringkasan_Penjualan_${summaryData.outlet_name.replace(/\s+/g, "_")}_${new Date().getTime()}`);

      showToast(
        `Laporan ringkasan penjualan berhasil diekspor`,
        "success"
      );
    } catch (error) {
      console.error("Export failed:", error);
      showToast(
        "Gagal mengekspor laporan. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Penjualan"
        description="Lihat ringkasan penjualan berdasarkan periode dan outlet"
        breadcrumbs={[
          { label: "Laporan", href: "/reports" },
          { label: "Ringkasan Penjualan" },
        ]}
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-surface rounded-xl border border-border shadow-card">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <OutletSelector 
          value={selectedOutlet} 
          onChange={setSelectedOutlet}
          options={mockOutlets}
        />
        <div className="flex-1" />
        <ExportButton onClick={handleExport} isLoading={isExporting} />
      </div>

      {/* Active Filter Indicator */}
      {selectedOutlet !== "all" && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-secondary">Filter aktif:</span>
          <span className="px-2 py-1 bg-primary-light text-primary font-medium rounded-md">
            {summaryData.outlet_name}
          </span>
          <button 
            onClick={() => setSelectedOutlet("all")}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Reset
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Item Terjual"
          value={formatNumber(summaryData.item_sold)}
          icon={ShoppingCart}
          iconColor="text-primary"
          iconBgColor="bg-primary-light"
        />
        <KPICard
          title="Total Pesanan"
          value={formatNumber(summaryData.total_order)}
          icon={Receipt}
          iconColor="text-success"
          iconBgColor="bg-success-light"
        />
        <KPICard
          title="Rata-rata / Transaksi"
          value={formatCurrency(summaryData.avg_per_transaction)}
          icon={TrendingUp}
          iconColor="text-warning"
          iconBgColor="bg-warning-light"
        />
        <KPICard
          title="Total Penjualan"
          value={formatCurrency(summaryData.total_sales)}
          icon={DollarSign}
          iconColor="text-primary"
          iconBgColor="bg-primary-light"
        />
      </div>

      {/* Order Type Breakdown */}
      <div className="bg-surface rounded-xl border border-border shadow-card p-5">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Penjualan per Tipe Pesanan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Utensils className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Makan di Tempat</p>
              <p className="text-lg font-bold text-text-primary">{formatCurrency(summaryData.total_dine_in)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
            <div className="p-3 bg-blue-100 rounded-lg">
              <QrCode className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pesan via QR</p>
              <p className="text-lg font-bold text-text-primary">{formatCurrency(summaryData.total_qr_order)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-background rounded-lg">
            <div className="p-3 bg-green-100 rounded-lg">
              <Truck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pesan Antar</p>
              <p className="text-lg font-bold text-text-primary">{formatCurrency(summaryData.total_delivery)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Details */}
        <div className="bg-surface rounded-xl border border-border shadow-card p-5">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Rincian Penjualan</h3>
          <div className="space-y-0">
            {mockSalesDetails.map((item, index) => {
              const isTotal = item.label === "Total Penjualan";
              const isNegative = item.value < 0;
              return (
                <div 
                  key={item.label}
                  className={`flex items-center justify-between py-3 ${
                    index < mockSalesDetails.length - 1 ? "border-b border-divider" : ""
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
                  <th className="text-right py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Jumlah</th>
                  <th className="text-right py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredPaymentMethods.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-sm text-text-secondary">
                      Tidak ada metode pembayaran yang ditemukan
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
                      <td className="py-3 text-right text-sm text-text-secondary">{pm.order_count} order</td>
                      <td className="py-3 text-right text-sm font-semibold text-text-primary">{formatCurrency(pm.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for payment icons
function PaymentIcon({ method }: { method: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    "Tunai": <Banknote className="h-4 w-4 text-green-600" />,
    "Transfer Bank": <CreditCard className="h-4 w-4 text-blue-600" />,
    "QRIS": <QrCode className="h-4 w-4 text-purple-600" />,
    "EDC (Debit/Credit)": <CreditCard className="h-4 w-4 text-orange-600" />,
    "GoFood": <Smartphone className="h-4 w-4 text-green-500" />,
    "GrabFood": <Smartphone className="h-4 w-4 text-green-600" />,
  };
  
  return iconMap[method] || <Wallet className="h-4 w-4 text-text-secondary" />;
}
