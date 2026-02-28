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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Globe, Save, Clock } from "lucide-react";
import {
  GeneralSettings as GeneralSettingsType,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  DATE_FORMAT_OPTIONS,
} from "../types";

interface GeneralSettingsFormProps {
  settings: GeneralSettingsType;
  onSave: (data: GeneralSettingsType) => void;
}

export function GeneralSettingsForm({ settings, onSave }: GeneralSettingsFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [local, setLocal] = useState<GeneralSettingsType>({ ...settings });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(local);
    showToast("Pengaturan umum berhasil disimpan", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Bahasa & Wilayah</CardTitle>
              <CardDescription>Atur preferensi bahasa dan zona waktu</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Bahasa
              </label>
              <Select
                value={local.language}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, language: val as "id" | "en" }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.flag} {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Zona Waktu
              </label>
              <Select
                value={local.timezone}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, timezone: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih zona waktu" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Format Tanggal
              </label>
              <Select
                value={local.date_format}
                onValueChange={(val) => setLocal((prev) => ({ ...prev, date_format: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih format" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMAT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label} ({opt.example})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Format Waktu
              </label>
              <div className="flex gap-3">
                {(["24h", "12h"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, time_format: fmt }))}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2",
                      local.time_format === fmt
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-primary border-border hover:border-primary"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    {fmt === "24h" ? "24 Jam" : "12 Jam"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mata Uang</CardTitle>
          <CardDescription>Atur format mata uang yang digunakan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Mata Uang"
              value={local.currency}
              onChange={(e) => setLocal((prev) => ({ ...prev, currency: e.target.value }))}
              placeholder="IDR"
            />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Posisi Simbol
              </label>
              <div className="flex gap-3">
                {(["before", "after"] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, currency_position: pos }))}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all",
                      local.currency_position === pos
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-primary border-border hover:border-primary"
                    )}
                  >
                    {pos === "before" ? "Rp 10.000" : "10.000 Rp"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Pemisah Ribuan
              </label>
              <div className="flex gap-3">
                {([".", ","] as const).map((sep) => (
                  <button
                    key={sep}
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, thousand_separator: sep }))}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all",
                      local.thousand_separator === sep
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-primary border-border hover:border-primary"
                    )}
                  >
                    {sep === "." ? "10.000" : "10,000"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Pemisah Desimal
              </label>
              <div className="flex gap-3">
                {([",", "."] as const).map((sep) => (
                  <button
                    key={sep}
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, decimal_separator: sep }))}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all",
                      local.decimal_separator === sep
                        ? "bg-primary text-white border-primary"
                        : "bg-surface text-text-primary border-border hover:border-primary"
                    )}
                  >
                    {sep === "," ? "0,50" : "0.50"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          <Save className="h-4 w-4" />
          Simpan Pengaturan Umum
        </Button>
      </div>
    </div>
  );
}
