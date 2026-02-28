"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { formatDateTime, formatRelativeTime, cn } from "@/lib/utils";
import {
  Activity,
  LogIn,
  Edit,
  Plus,
  Trash2,
  Download,
  Key,
  XCircle,
  Monitor,
  Globe,
} from "lucide-react";
import { ActivityLog } from "../types";

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Login: { icon: LogIn, color: "text-primary", bg: "bg-primary-light" },
  "Update Produk": { icon: Edit, color: "text-warning", bg: "bg-warning-light" },
  "Tambah Kategori": { icon: Plus, color: "text-success", bg: "bg-success-light" },
  "Hapus Produk": { icon: Trash2, color: "text-error", bg: "bg-error-light" },
  "Ubah Password": { icon: Key, color: "text-secondary", bg: "bg-background" },
  "Export Laporan": { icon: Download, color: "text-primary", bg: "bg-primary-light" },
  "Update Stok": { icon: Edit, color: "text-warning", bg: "bg-warning-light" },
  "Tambah Pelanggan": { icon: Plus, color: "text-success", bg: "bg-success-light" },
  "Void Transaksi": { icon: XCircle, color: "text-error", bg: "bg-error-light" },
};

interface ActivityLogListProps {
  logs: ActivityLog[];
}

export function ActivityLogList({ logs }: ActivityLogListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Log Aktivitas</CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Riwayat aktivitas terbaru di akun Anda
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-divider">
          {logs.map((log, index) => {
            const config = ACTION_CONFIG[log.action] || {
              icon: Activity,
              color: "text-text-secondary",
              bg: "bg-background",
            };
            const Icon = config.icon;

            return (
              <div
                key={log.id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-background/50 transition-colors"
              >
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
                      config.bg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  {index < logs.length - 1 && (
                    <div className="w-[2px] flex-1 bg-divider mt-2 min-h-[16px]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {log.action}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                        {log.description}
                      </p>
                    </div>
                    <span className="text-[11px] text-text-secondary whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(log.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
                      <Monitor className="h-3 w-3" />
                      {log.device}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
                      <Globe className="h-3 w-3" />
                      {log.ip_address}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {logs.length === 0 && (
          <div className="py-12 text-center">
            <Activity className="h-12 w-12 text-text-disabled mx-auto mb-3" />
            <p className="text-sm text-text-secondary">Belum ada aktivitas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
