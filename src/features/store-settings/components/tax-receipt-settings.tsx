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
import { cn } from "@/lib/utils";
import {
  Receipt,
  Save,
  ToggleLeft,
  ToggleRight,
  Percent,
  FileText,
} from "lucide-react";
import { TaxSettings, ReceiptSettings } from "../types";

interface TaxReceiptSettingsFormProps {
  taxSettings: TaxSettings;
  receiptSettings: ReceiptSettings;
  onSaveTax: (data: TaxSettings) => void;
  onSaveReceipt: (data: ReceiptSettings) => void;
}

export function TaxReceiptSettingsForm({
  taxSettings,
  receiptSettings,
  onSaveTax,
  onSaveReceipt,
}: TaxReceiptSettingsFormProps) {
  const { showToast } = useToast();
  const [tax, setTax] = useState<TaxSettings>({ ...taxSettings });
  const [receipt, setReceipt] = useState<ReceiptSettings>({ ...receiptSettings });
  const [isSavingTax, setIsSavingTax] = useState(false);
  const [isSavingReceipt, setIsSavingReceipt] = useState(false);

  const handleSaveTax = async () => {
    setIsSavingTax(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSaveTax(tax);
    showToast("Pengaturan pajak berhasil disimpan", "success");
    setIsSavingTax(false);
  };

  const handleSaveReceipt = async () => {
    setIsSavingReceipt(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSaveReceipt(receipt);
    showToast("Pengaturan struk berhasil disimpan", "success");
    setIsSavingReceipt(false);
  };

  return (
    <div className="space-y-6">
      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning-light flex items-center justify-center">
              <Percent className="h-5 w-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-base">Pengaturan Pajak</CardTitle>
              <CardDescription>Konfigurasi pajak dan biaya layanan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Tax toggle */}
          <ToggleRow
            label="Aktifkan Pajak"
            description="Terapkan pajak pada setiap transaksi"
            enabled={tax.is_tax_enabled}
            onToggle={() => setTax((prev) => ({ ...prev, is_tax_enabled: !prev.is_tax_enabled }))}
          />

          {tax.is_tax_enabled && (
            <div className="pl-4 border-l-2 border-primary/20 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nama Pajak"
                  value={tax.tax_name}
                  onChange={(e) => setTax((prev) => ({ ...prev, tax_name: e.target.value }))}
                  placeholder="PPN"
                />
                <Input
                  label="Tarif Pajak (%)"
                  type="number"
                  value={tax.tax_rate.toString()}
                  onChange={(e) => setTax((prev) => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
                  placeholder="11"
                />
              </div>
              <ToggleRow
                label="Pajak Inklusif"
                description="Harga produk sudah termasuk pajak"
                enabled={tax.is_tax_inclusive}
                onToggle={() => setTax((prev) => ({ ...prev, is_tax_inclusive: !prev.is_tax_inclusive }))}
              />
              <Input
                label="Nomor NPWP"
                value={tax.tax_id_number}
                onChange={(e) => setTax((prev) => ({ ...prev, tax_id_number: e.target.value }))}
                placeholder="XX.XXX.XXX.X-XXX.XXX"
              />
            </div>
          )}

          {/* Service charge */}
          <div className="border-t border-divider pt-5">
            <ToggleRow
              label="Biaya Layanan (Service Charge)"
              description="Terapkan biaya layanan pada setiap transaksi"
              enabled={tax.is_service_charge_enabled}
              onToggle={() => setTax((prev) => ({ ...prev, is_service_charge_enabled: !prev.is_service_charge_enabled }))}
            />
            {tax.is_service_charge_enabled && (
              <div className="pl-4 border-l-2 border-primary/20 mt-4">
                <Input
                  label="Tarif Biaya Layanan (%)"
                  type="number"
                  value={tax.service_charge_rate.toString()}
                  onChange={(e) => setTax((prev) => ({ ...prev, service_charge_rate: parseFloat(e.target.value) || 0 }))}
                  placeholder="5"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveTax} isLoading={isSavingTax}>
              <Save className="h-4 w-4" />
              Simpan Pajak
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-success-light flex items-center justify-center">
              <Receipt className="h-5 w-5 text-success" />
            </div>
            <div>
              <CardTitle className="text-base">Pengaturan Struk</CardTitle>
              <CardDescription>Kustomisasi tampilan struk pembayaran</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleRow
              label="Tampilkan Logo"
              enabled={receipt.show_logo}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_logo: !prev.show_logo }))}
            />
            <ToggleRow
              label="Tampilkan Nama Toko"
              enabled={receipt.show_store_name}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_store_name: !prev.show_store_name }))}
            />
            <ToggleRow
              label="Tampilkan Alamat"
              enabled={receipt.show_address}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_address: !prev.show_address }))}
            />
            <ToggleRow
              label="Tampilkan Telepon"
              enabled={receipt.show_phone}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_phone: !prev.show_phone }))}
            />
            <ToggleRow
              label="Tampilkan NPWP"
              enabled={receipt.show_tax_id}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_tax_id: !prev.show_tax_id }))}
            />
            <ToggleRow
              label="Tampilkan Nama Kasir"
              enabled={receipt.show_cashier_name}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_cashier_name: !prev.show_cashier_name }))}
            />
            <ToggleRow
              label="Tampilkan Nama Pelanggan"
              enabled={receipt.show_customer_name}
              onToggle={() => setReceipt((prev) => ({ ...prev, show_customer_name: !prev.show_customer_name }))}
            />
            <ToggleRow
              label="Cetak Otomatis"
              description="Cetak struk otomatis setelah transaksi selesai"
              enabled={receipt.auto_print}
              onToggle={() => setReceipt((prev) => ({ ...prev, auto_print: !prev.auto_print }))}
            />
          </div>

          <div className="border-t border-divider pt-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Ukuran Kertas
              </label>
              <div className="flex gap-3">
                {(["58mm", "80mm"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setReceipt((prev) => ({ ...prev, paper_size: size }))}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                      receipt.paper_size === size
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-primary border-border hover:border-primary"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Teks Header Struk</label>
              <textarea
                value={receipt.header_text}
                onChange={(e) => setReceipt((prev) => ({ ...prev, header_text: e.target.value }))}
                placeholder="Terima kasih atas kunjungan Anda!"
                rows={2}
                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Teks Footer Struk</label>
              <textarea
                value={receipt.footer_text}
                onChange={(e) => setReceipt((prev) => ({ ...prev, footer_text: e.target.value }))}
                placeholder="Barang yang sudah dibeli tidak dapat dikembalikan."
                rows={2}
                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSaveReceipt} isLoading={isSavingReceipt}>
              <Save className="h-4 w-4" />
              Simpan Struk
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
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
