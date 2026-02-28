"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Input,
} from "@/components/ui";
import { useToast } from "@/components/ui";
import {
  Bell,
  Save,
  ToggleLeft,
  ToggleRight,
  Volume2,
  Mail,
  AlertTriangle,
  ShoppingCart,
  Star,
  BarChart3,
  XCircle,
} from "lucide-react";
import { NotificationSettings as NotificationSettingsType } from "../types";

interface NotificationSettingsFormProps {
  settings: NotificationSettingsType;
  onSave: (data: NotificationSettingsType) => void;
}

export function NotificationSettingsForm({
  settings,
  onSave,
}: NotificationSettingsFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [local, setLocal] = useState<NotificationSettingsType>({ ...settings });

  const handleToggle = (field: keyof NotificationSettingsType) => {
    setLocal((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(local);
    showToast("Pengaturan notifikasi berhasil disimpan", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* General Notification Channels */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Saluran Notifikasi</CardTitle>
              <CardDescription>Pilih cara Anda menerima notifikasi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={Mail}
            iconColor="text-primary"
            iconBg="bg-primary-light"
            label="Notifikasi Email"
            description="Terima notifikasi penting melalui email"
            enabled={local.email_notifications as boolean}
            onToggle={() => handleToggle("email_notifications")}
          />
          <ToggleRow
            icon={Bell}
            iconColor="text-warning"
            iconBg="bg-warning-light"
            label="Notifikasi Push"
            description="Terima notifikasi langsung di browser"
            enabled={local.push_notifications as boolean}
            onToggle={() => handleToggle("push_notifications")}
          />
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Peringatan & Notifikasi</CardTitle>
          <CardDescription>Atur jenis notifikasi yang ingin Anda terima</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={AlertTriangle}
            iconColor="text-warning"
            iconBg="bg-warning-light"
            label="Peringatan Stok Rendah"
            description="Dapatkan notifikasi saat stok produk menipis"
            enabled={local.low_stock_alert as boolean}
            onToggle={() => handleToggle("low_stock_alert")}
          />
          {local.low_stock_alert && (
            <div className="pl-14">
              <Input
                label="Batas Minimum Stok"
                type="number"
                value={local.low_stock_threshold.toString()}
                onChange={(e) =>
                  setLocal((prev) => ({
                    ...prev,
                    low_stock_threshold: parseInt(e.target.value) || 0,
                  }))
                }
                helperText="Notifikasi akan dikirim saat stok di bawah angka ini"
                placeholder="10"
              />
            </div>
          )}
          <ToggleRow
            icon={ShoppingCart}
            iconColor="text-success"
            iconBg="bg-success-light"
            label="Pesanan Baru"
            description="Notifikasi saat ada pesanan baru masuk"
            enabled={local.new_order_notification as boolean}
            onToggle={() => handleToggle("new_order_notification")}
          />
          <ToggleRow
            icon={XCircle}
            iconColor="text-error"
            iconBg="bg-error-light"
            label="Transaksi Void"
            description="Notifikasi saat ada transaksi yang dibatalkan"
            enabled={local.void_transaction_alert as boolean}
            onToggle={() => handleToggle("void_transaction_alert")}
          />
          <ToggleRow
            icon={Star}
            iconColor="text-yellow-500"
            iconBg="bg-yellow-50"
            label="Ulasan Pelanggan"
            description="Notifikasi saat ada ulasan baru dari pelanggan"
            enabled={local.customer_review_alert as boolean}
            onToggle={() => handleToggle("customer_review_alert")}
          />
        </CardContent>
      </Card>

      {/* Report Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laporan Otomatis</CardTitle>
          <CardDescription>Jadwalkan pengiriman laporan ke email Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={BarChart3}
            iconColor="text-primary"
            iconBg="bg-primary-light"
            label="Laporan Harian"
            description="Kirim ringkasan penjualan harian setiap pagi"
            enabled={local.daily_report_email as boolean}
            onToggle={() => handleToggle("daily_report_email")}
          />
          <ToggleRow
            icon={BarChart3}
            iconColor="text-success"
            iconBg="bg-success-light"
            label="Laporan Mingguan"
            description="Kirim laporan penjualan mingguan setiap Senin"
            enabled={local.weekly_report_email as boolean}
            onToggle={() => handleToggle("weekly_report_email")}
          />
        </CardContent>
      </Card>

      {/* Sound */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suara</CardTitle>
          <CardDescription>Atur suara notifikasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={Volume2}
            iconColor="text-primary"
            iconBg="bg-primary-light"
            label="Suara Notifikasi"
            description="Mainkan suara saat menerima notifikasi"
            enabled={local.sound_enabled as boolean}
            onToggle={() => handleToggle("sound_enabled")}
          />
          {local.sound_enabled && (
            <div className="pl-14">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Volume ({local.sound_volume}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={local.sound_volume}
                onChange={(e) =>
                  setLocal((prev) => ({
                    ...prev,
                    sound_volume: parseInt(e.target.value),
                  }))
                }
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          <Save className="h-4 w-4" />
          Simpan Notifikasi
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
        </div>
      </div>
      <button type="button" onClick={onToggle} className="flex-shrink-0">
        {enabled ? (
          <ToggleRight className="h-7 w-7 text-success" />
        ) : (
          <ToggleLeft className="h-7 w-7 text-text-disabled" />
        )}
      </button>
    </div>
  );
}
