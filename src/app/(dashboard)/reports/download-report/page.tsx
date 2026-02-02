"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Button, Badge, useToast } from "@/components/ui";
import { DateRangePicker } from "@/features/reports/components/date-range-picker";
import { 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  ShoppingCart,
  Wallet,
  Package,
  Calendar,
} from "lucide-react";

type ReportType = "order" | "balance" | "item" | "daily-product";

interface ReportOption {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const reportOptions: ReportOption[] = [
  {
    id: "order",
    title: "Ekspor Berdasarkan Pesanan",
    description: "1 baris = 1 order. Termasuk info pelanggan, pembayaran, kasir.",
    icon: ShoppingCart,
    color: "primary",
  },
  {
    id: "balance",
    title: "Laporan Saldo",
    description: "Aktivitas saldo kasir: buka kasir, ganti kasir, penutupan.",
    icon: Wallet,
    color: "success",
  },
  {
    id: "item",
    title: "Ekspor Berdasarkan Item",
    description: "1 baris = 1 item dalam order. Detail produk dan varian.",
    icon: Package,
    color: "warning",
  },
  {
    id: "daily-product",
    title: "Penjualan Harian Berdasarkan Produk",
    description: "Agregasi per hari per produk. Cocok untuk analisis tren.",
    icon: Calendar,
    color: "error",
  },
];

export default function DownloadReportPage() {
  const [dateRange, setDateRange] = useState(() => ({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  }));
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  // Calculate date range in days
  const daysDiff = Math.ceil(
    (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isDateRangeValid = daysDiff <= 90 && daysDiff > 0;

  const handleExport = async () => {
    if (!selectedType) {
      setError("Pilih tipe laporan terlebih dahulu");
      return;
    }
    if (!isDateRangeValid) {
      setError("Rentang tanggal maksimal 90 hari");
      return;
    }

    setError(null);
    setIsExporting(true);
    setExportSuccess(false);

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsExporting(false);
    setExportSuccess(true);
    showToast(`Laporan ${selectedType} berhasil diunduh`, "success");

    // Reset after 3 seconds
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    if (!isSelected) return "border-border hover:border-gray-300";
    
    switch (color) {
      case "primary":
        return "border-primary bg-primary-light/30 ring-2 ring-primary/20";
      case "success":
        return "border-success bg-success-light/30 ring-2 ring-success/20";
      case "warning":
        return "border-warning bg-warning-light/30 ring-2 ring-warning/20";
      case "error":
        return "border-error bg-error-light/30 ring-2 ring-error/20";
      default:
        return "border-primary bg-primary-light/30 ring-2 ring-primary/20";
    }
  };

  const getIconBgClass = (color: string) => {
    switch (color) {
      case "primary":
        return "bg-primary-light text-primary";
      case "success":
        return "bg-success-light text-success";
      case "warning":
        return "bg-warning-light text-warning";
      case "error":
        return "bg-error-light text-error";
      default:
        return "bg-primary-light text-primary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Unduh Laporan"
        description="Download laporan dalam format Excel (.xlsx)"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Laporan", href: "/reports" },
          { label: "Unduh Laporan" },
        ]}
      />

      {/* Date Range */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Pilih Rentang Tanggal
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setError(null);
            }}
          />
          <div className="flex items-center gap-2">
            <Badge variant={isDateRangeValid ? "success" : "error"} size="sm">
              {daysDiff} hari
            </Badge>
            {!isDateRangeValid && (
              <span className="text-xs text-error">Maksimal 90 hari</span>
            )}
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Pilih Tipe Laporan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportOptions.map((option) => {
            const isSelected = selectedType === option.id;
            const Icon = option.icon;

            return (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedType(option.id);
                  setError(null);
                }}
                className={`p-4 rounded-xl border-2 text-left transition-all ${getColorClasses(
                  option.color,
                  isSelected
                )}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getIconBgClass(option.color)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-text-primary">
                        {option.title}
                      </h4>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="bg-white p-6 rounded-xl border border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Ekspor Laporan
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              File akan langsung terunduh setelah proses selesai
            </p>
          </div>

          <Button
            onClick={handleExport}
            disabled={!selectedType || !isDateRangeValid || isExporting}
            className="gap-2"
            size="lg"
          >
            {isExporting ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-5 w-5" />
                Ekspor Laporan
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-error-light rounded-lg flex items-center gap-2 text-error">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Success */}
        {exportSuccess && (
          <div className="mt-4 p-3 bg-success-light rounded-lg flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              Laporan berhasil diekspor! File sedang diunduh...
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-background/50 p-4 rounded-xl border border-border">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary-light rounded-lg">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">
              Tentang File Export
            </h4>
            <ul className="mt-2 space-y-1 text-sm text-text-secondary">
              <li>• Format file: Excel (.xlsx)</li>
              <li>• Nama file otomatis berdasarkan tipe dan tanggal</li>
              <li>• Data sesuai dengan filter yang dipilih</li>
              <li>• File aman dan siap digunakan untuk analisis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
