"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  FileBarChart, 
  Package, 
  FolderTree, 
  TrendingUp, 
  DollarSign, 
  XCircle, 
  Mail, 
  Download, 
  History 
} from "lucide-react";

interface ReportsLayoutProps {
  children: React.ReactNode;
}

const reportNavItems = [
  {
    label: "Ringkasan Penjualan",
    href: "/reports/sales-summary",
    icon: FileBarChart,
  },
  {
    label: "Penjualan Produk",
    href: "/reports/product-sales",
    icon: Package,
  },
  {
    label: "Kategori Produk",
    href: "/reports/category-sales",
    icon: FolderTree,
  },
  {
    label: "Arus Stok",
    href: "/reports/stock-flow",
    icon: TrendingUp,
  },
  {
    label: "Laba Kotor",
    href: "/reports/gross-profit",
    icon: DollarSign,
  },
  {
    label: "Pembatalan / Void",
    href: "/reports/void-report",
    icon: XCircle,
  },
  {
    label: "Kirim Laporan",
    href: "/reports/send-report",
    icon: Mail,
  },
  {
    label: "Unduh Laporan",
    href: "/reports/download-report",
    icon: Download,
  },
  {
    label: "Riwayat Pesanan",
    href: "/reports/order-history",
    icon: History,
  },
];

export default function ReportsLayout({ children }: ReportsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="border-b border-border bg-surface rounded-t-xl shadow-sm">
        <nav className="flex gap-0 overflow-x-auto scrollbar-hide">
          {reportNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  isActive
                    ? "text-primary border-primary bg-primary-light/50"
                    : "text-text-secondary border-transparent hover:text-text-primary hover:bg-background"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-text-secondary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
