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
  Badge,
} from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Printer,
  Save,
  ToggleLeft,
  ToggleRight,
  Wifi,
  Usb,
  Bluetooth,
  TestTube,
  CheckCircle2,
} from "lucide-react";
import {
  PrinterSettings as PrinterSettingsType,
  PRINTER_TYPE_OPTIONS,
  CONNECTION_TYPE_OPTIONS,
} from "../types";

interface PrinterSettingsFormProps {
  settings: PrinterSettingsType;
  onSave: (data: PrinterSettingsType) => void;
}

export function PrinterSettingsForm({ settings, onSave }: PrinterSettingsFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [local, setLocal] = useState<PrinterSettingsType>({ ...settings });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(local);
    showToast("Pengaturan printer berhasil disimpan", "success");
    setIsSubmitting(false);
  };

  const handleTestPrint = async () => {
    setIsTesting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    showToast("Test print berhasil! Periksa printer Anda.", "success");
    setIsTesting(false);
  };

  const CONNECTION_ICONS: Record<string, React.ElementType> = {
    usb: Usb,
    network: Wifi,
    bluetooth: Bluetooth,
  };

  return (
    <div className="space-y-6">
      {/* Printer Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple/10 flex items-center justify-center">
              <Printer className="h-5 w-5 text-purple" />
            </div>
            <div>
              <CardTitle className="text-base">Konfigurasi Printer</CardTitle>
              <CardDescription>Atur printer utama dan printer dapur</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Printer Utama (Kasir)"
              value={local.default_printer}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, default_printer: e.target.value }))
              }
              placeholder="Nama printer"
            />
            <Input
              label="Printer Dapur"
              value={local.kitchen_printer}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, kitchen_printer: e.target.value }))
              }
              placeholder="Nama printer dapur"
            />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Tipe Printer
              </label>
              <Select
                value={local.printer_type}
                onValueChange={(val) =>
                  setLocal((prev) => ({ ...prev, printer_type: val as PrinterSettingsType["printer_type"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe printer" />
                </SelectTrigger>
                <SelectContent>
                  {PRINTER_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              label="Jumlah Salinan"
              type="number"
              value={local.print_copies.toString()}
              onChange={(e) =>
                setLocal((prev) => ({
                  ...prev,
                  print_copies: parseInt(e.target.value) || 1,
                }))
              }
              placeholder="1"
            />
          </div>

          {/* Connection Type */}
          <div className="border-t border-divider pt-5">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Tipe Koneksi
            </label>
            <div className="grid grid-cols-3 gap-3">
              {CONNECTION_TYPE_OPTIONS.map((opt) => {
                const ConnIcon = CONNECTION_ICONS[opt.value] || Wifi;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setLocal((prev) => ({
                        ...prev,
                        connection_type: opt.value as PrinterSettingsType["connection_type"],
                      }))
                    }
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                      local.connection_type === opt.value
                        ? "bg-primary-light border-primary text-primary"
                        : "bg-surface border-border text-text-secondary hover:border-primary"
                    )}
                  >
                    <ConnIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Network settings */}
          {local.connection_type === "network" && (
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Alamat IP Printer"
                  value={local.printer_ip || ""}
                  onChange={(e) =>
                    setLocal((prev) => ({ ...prev, printer_ip: e.target.value }))
                  }
                  placeholder="192.168.1.100"
                />
                <Input
                  label="Port"
                  type="number"
                  value={local.printer_port?.toString() || ""}
                  onChange={(e) =>
                    setLocal((prev) => ({
                      ...prev,
                      printer_port: parseInt(e.target.value) || undefined,
                    }))
                  }
                  placeholder="9100"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Print */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cetak Otomatis</CardTitle>
          <CardDescription>Atur pencetakan otomatis setelah transaksi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-text-primary">Cetak Struk Otomatis</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Otomatis cetak struk setelah transaksi selesai
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLocal((prev) => ({ ...prev, auto_print_receipt: !prev.auto_print_receipt }))
              }
            >
              {local.auto_print_receipt ? (
                <ToggleRight className="h-7 w-7 text-success" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-text-disabled" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-background/50 transition-colors">
            <div>
              <p className="text-sm font-medium text-text-primary">Cetak Order Dapur Otomatis</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Otomatis cetak pesanan ke printer dapur
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setLocal((prev) => ({ ...prev, auto_print_kitchen: !prev.auto_print_kitchen }))
              }
            >
              {local.auto_print_kitchen ? (
                <ToggleRight className="h-7 w-7 text-success" />
              ) : (
                <ToggleLeft className="h-7 w-7 text-text-disabled" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleTestPrint} isLoading={isTesting}>
          <TestTube className="h-4 w-4" />
          Test Print
        </Button>
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          <Save className="h-4 w-4" />
          Simpan Printer
        </Button>
      </div>
    </div>
  );
}
