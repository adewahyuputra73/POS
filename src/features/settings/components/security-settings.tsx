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
  Shield,
  Save,
  ToggleLeft,
  ToggleRight,
  Lock,
  Clock,
  Key,
  AlertTriangle,
  Fingerprint,
  Globe,
  X,
  Plus,
} from "lucide-react";
import { SecuritySettings as SecuritySettingsType } from "../types";

interface SecuritySettingsFormProps {
  settings: SecuritySettingsType;
  onSave: (data: SecuritySettingsType) => void;
}

export function SecuritySettingsForm({ settings, onSave }: SecuritySettingsFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [local, setLocal] = useState<SecuritySettingsType>({ ...settings });
  const [newIp, setNewIp] = useState("");

  const handleToggle = (field: keyof SecuritySettingsType) => {
    setLocal((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleAddIp = () => {
    if (!newIp.trim()) return;
    if (local.ip_whitelist.includes(newIp.trim())) {
      showToast("IP sudah ada dalam daftar", "warning");
      return;
    }
    setLocal((prev) => ({
      ...prev,
      ip_whitelist: [...prev.ip_whitelist, newIp.trim()],
    }));
    setNewIp("");
  };

  const handleRemoveIp = (ip: string) => {
    setLocal((prev) => ({
      ...prev,
      ip_whitelist: prev.ip_whitelist.filter((i) => i !== ip),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(local);
    showToast("Pengaturan keamanan berhasil disimpan", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Session & Login */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-error-light flex items-center justify-center">
              <Shield className="h-5 w-5 text-error" />
            </div>
            <div>
              <CardTitle className="text-base">Sesi & Login</CardTitle>
              <CardDescription>Atur keamanan sesi dan batas login</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Batas Waktu Sesi (menit)"
              type="number"
              value={local.session_timeout.toString()}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  session_timeout: parseInt(e.target.value) || 30,
                }))
              }
              helperText="Otomatis logout setelah tidak aktif"
              placeholder="30"
              leftIcon={<Clock className="h-4 w-4" />}
            />
            <Input
              label="Maksimal Percobaan Login"
              type="number"
              value={local.max_login_attempts.toString()}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  max_login_attempts: parseInt(e.target.value) || 5,
                }))
              }
              helperText="Akun dikunci setelah gagal berulang kali"
              placeholder="5"
              leftIcon={<Key className="h-4 w-4" />}
            />
            <Input
              label="Durasi Penguncian (menit)"
              type="number"
              value={local.lockout_duration.toString()}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  lockout_duration: parseInt(e.target.value) || 15,
                }))
              }
              helperText="Berapa lama akun dikunci setelah gagal login"
              placeholder="15"
              leftIcon={<Lock className="h-4 w-4" />}
            />
          </div>

          <div className="border-t border-divider pt-4">
            <ToggleRow
              icon={Clock}
              label="Logout Otomatis saat Idle"
              description="Otomatis logout ketika tidak ada aktivitas"
              enabled={local.auto_logout_on_idle}
              onToggle={() => handleToggle("auto_logout_on_idle")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Permission Protections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proteksi Aksi</CardTitle>
          <CardDescription>Wajibkan password untuk aksi sensitif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={AlertTriangle}
            label="Password untuk Void Transaksi"
            description="Minta password saat membatalkan transaksi"
            enabled={local.require_password_for_void}
            onToggle={() => handleToggle("require_password_for_void")}
          />
          <ToggleRow
            icon={Lock}
            label="Password untuk Diskon"
            description="Minta password saat memberikan diskon"
            enabled={local.require_password_for_discount}
            onToggle={() => handleToggle("require_password_for_discount")}
          />
          <ToggleRow
            icon={Key}
            label="Password untuk Refund"
            description="Minta password saat memproses pengembalian dana"
            enabled={local.require_password_for_refund}
            onToggle={() => handleToggle("require_password_for_refund")}
          />
        </CardContent>
      </Card>

      {/* Advanced Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keamanan Lanjutan</CardTitle>
          <CardDescription>Fitur keamanan tambahan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <ToggleRow
            icon={Fingerprint}
            label="Autentikasi Dua Faktor (2FA)"
            description="Tambahkan lapisan keamanan ekstra dengan kode verifikasi"
            enabled={local.two_factor_enabled}
            onToggle={() => handleToggle("two_factor_enabled")}
          />

          <div className="border-t border-divider pt-4">
            <ToggleRow
              icon={Globe}
              label="IP Whitelist"
              description="Hanya izinkan akses dari alamat IP tertentu"
              enabled={local.ip_whitelist_enabled}
              onToggle={() => handleToggle("ip_whitelist_enabled")}
            />

            {local.ip_whitelist_enabled && (
              <div className="ml-12 mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="192.168.1.100"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddIp())}
                  />
                  <Button type="button" size="icon" onClick={handleAddIp}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {local.ip_whitelist.length > 0 && (
                  <div className="space-y-1.5">
                    {local.ip_whitelist.map((ip) => (
                      <div
                        key={ip}
                        className="flex items-center justify-between px-3 py-2 bg-background rounded-lg"
                      >
                        <span className="text-sm font-mono text-text-primary">{ip}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIp(ip)}
                          className="text-text-secondary hover:text-error transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          <Save className="h-4 w-4" />
          Simpan Keamanan
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-text-secondary" />
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
