"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@/components/ui";
import { useToast } from "@/components/ui";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import {
  Monitor,
  Sun,
  Moon,
  Save,
  ToggleLeft,
  ToggleRight,
  Image,
  LayoutGrid,
  Sparkles,
  Rows3,
  PanelLeftClose,
} from "lucide-react";
import { DisplaySettings as DisplaySettingsType, THEME_OPTIONS } from "../types";

const THEME_ICONS: Record<string, React.ElementType> = {
  Sun: Sun,
  Moon: Moon,
  Monitor: Monitor,
};

interface DisplaySettingsFormProps {
  settings: DisplaySettingsType;
  onSave: (data: DisplaySettingsType) => void;
}

export function DisplaySettingsForm({ settings, onSave }: DisplaySettingsFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [local, setLocal] = useState<DisplaySettingsType>({ ...settings });

  // Direct access to UI store for instant preview
  const setTheme = useUIStore((s) => s.setTheme);
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);

  const handleToggle = (field: keyof DisplaySettingsType) => {
    setLocal((prev) => {
      const newVal = !prev[field];
      // Schedule sidebar_collapsed update outside of setState to avoid
      // "Cannot update a component while rendering a different component"
      if (field === "sidebar_collapsed") {
        queueMicrotask(() => setSidebarCollapsed(newVal as boolean));
      }
      return { ...prev, [field]: newVal };
    });
  };

  const handleThemeChange = (theme: DisplaySettingsType["theme"]) => {
    setLocal((prev) => ({ ...prev, theme }));
    // Apply theme instantly for live preview
    setTheme(theme);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(local);
    showToast("Pengaturan tampilan berhasil disimpan", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
              <Monitor className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Tema</CardTitle>
              <CardDescription>Pilih tema tampilan aplikasi</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((opt) => {
              const ThemeIcon = THEME_ICONS[opt.icon] || Monitor;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleThemeChange(opt.value as DisplaySettingsType["theme"])}
                  className={cn(
                    "flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all",
                    local.theme === opt.value
                      ? "bg-primary-light border-primary"
                      : "bg-surface border-border hover:border-primary/50"
                  )}
                >
                  <ThemeIcon
                    className={cn(
                      "h-8 w-8",
                      local.theme === opt.value ? "text-primary" : "text-text-disabled"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      local.theme === opt.value ? "text-primary" : "text-text-secondary"
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-secondary mt-3">
            💡 Tema diterapkan langsung secara instan saat dipilih.
          </p>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Opsi Tampilan</CardTitle>
          <CardDescription>Sesuaikan tampilan sesuai preferensi Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            icon={PanelLeftClose}
            label="Sidebar Ringkas"
            description="Kecilkan sidebar menjadi ikon saja"
            enabled={local.sidebar_collapsed}
            onToggle={() => handleToggle("sidebar_collapsed")}
          />
          <ToggleRow
            icon={LayoutGrid}
            label="Mode Kompak"
            description="Tampilkan lebih banyak konten dengan spasi yang lebih rapat"
            enabled={local.compact_mode}
            onToggle={() => handleToggle("compact_mode")}
          />
          <ToggleRow
            icon={Image}
            label="Tampilkan Gambar Produk"
            description="Tampilkan gambar produk di tabel dan daftar"
            enabled={local.show_product_images}
            onToggle={() => handleToggle("show_product_images")}
          />
          <ToggleRow
            icon={Sparkles}
            label="Animasi"
            description="Aktifkan animasi transisi dan efek visual"
            enabled={local.animation_enabled}
            onToggle={() => handleToggle("animation_enabled")}
          />

          <div className="border-t border-divider pt-4">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Kepadatan Tabel
            </label>
            <div className="flex gap-3">
              {(["comfortable", "compact"] as const).map((density) => (
                <button
                  key={density}
                  type="button"
                  onClick={() => setLocal((prev) => ({ ...prev, table_density: density }))}
                  className={cn(
                    "flex items-center gap-2 flex-1 px-4 py-3 rounded-xl border transition-all",
                    local.table_density === density
                      ? "bg-primary-light border-primary text-primary"
                      : "bg-surface border-border text-text-secondary hover:border-primary"
                  )}
                >
                  <Rows3 className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {density === "comfortable" ? "Nyaman" : "Kompak"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-divider pt-4">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Produk per Halaman
            </label>
            <div className="flex gap-2">
              {[10, 25, 50, 100].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setLocal((prev) => ({ ...prev, products_per_page: size }))}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                    local.products_per_page === size
                      ? "bg-primary text-white border-primary"
                      : "bg-surface text-text-primary border-border hover:border-primary"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} isLoading={isSubmitting}>
          <Save className="h-4 w-4" />
          Simpan Tampilan
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
