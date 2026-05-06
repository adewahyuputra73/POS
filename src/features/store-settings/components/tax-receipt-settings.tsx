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
  Save,
  ToggleLeft,
  ToggleRight,
  Percent,
} from "lucide-react";
import type { StoreFees, FeeType } from "../types";

interface TaxReceiptSettingsFormProps {
  storeFees: StoreFees;
  onSaveFees: (data: StoreFees) => Promise<void>;
}

export function TaxReceiptSettingsForm({
  storeFees,
  onSaveFees,
}: TaxReceiptSettingsFormProps) {
  const { showToast } = useToast();
  const [fees, setFees] = useState<StoreFees>({ ...storeFees });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveFees(fees);
      showToast("Pengaturan biaya berhasil disimpan", "success");
    } catch {
      showToast("Gagal menyimpan pengaturan biaya", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tax */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-warning-light flex items-center justify-center">
              <Percent className="h-5 w-5 text-warning" />
            </div>
            <div>
              <CardTitle className="text-base">Pengaturan Pajak & Biaya</CardTitle>
              <CardDescription>Konfigurasi pajak, biaya layanan, dan biaya tambahan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Tax toggle */}
          <ToggleRow
            label="Aktifkan Pajak"
            description="Terapkan pajak pada setiap transaksi"
            enabled={fees.tax_is_active}
            onToggle={() => setFees((prev) => ({ ...prev, tax_is_active: !prev.tax_is_active }))}
          />

          {/* Service fee */}
          <div className="border-t border-divider pt-5">
            <ToggleRow
              label="Biaya Layanan (Service Charge)"
              description="Terapkan biaya layanan pada setiap transaksi"
              enabled={fees.service_fee_is_active}
              onToggle={() => setFees((prev) => ({ ...prev, service_fee_is_active: !prev.service_fee_is_active }))}
            />
            {fees.service_fee_is_active && (
              <div className="pl-4 border-l-2 border-primary/20 mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Tipe Biaya Layanan</label>
                  <FeeTypeSelector
                    value={fees.service_fee_type}
                    onChange={(v) => setFees((prev) => ({ ...prev, service_fee_type: v }))}
                  />
                </div>
                <Input
                  label={fees.service_fee_type === "percentage" ? "Persentase Biaya Layanan (%)" : "Nominal Biaya Layanan (Rp)"}
                  type="number"
                  value={fees.service_fee_percentage.toString()}
                  onChange={(e) =>
                    setFees((prev) => ({ ...prev, service_fee_percentage: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder={fees.service_fee_type === "percentage" ? "5" : "5000"}
                />
              </div>
            )}
          </div>

          {/* Additional fee */}
          <div className="border-t border-divider pt-5">
            <ToggleRow
              label="Biaya Tambahan"
              description="Terapkan biaya tambahan seperti biaya kemasan, dll"
              enabled={fees.additional_fee_is_active}
              onToggle={() => setFees((prev) => ({ ...prev, additional_fee_is_active: !prev.additional_fee_is_active }))}
            />
            {fees.additional_fee_is_active && (
              <div className="pl-4 border-l-2 border-primary/20 mt-4 space-y-4">
                <Input
                  label="Nama Biaya Tambahan"
                  value={fees.additional_fee_name}
                  onChange={(e) => setFees((prev) => ({ ...prev, additional_fee_name: e.target.value }))}
                  placeholder="Biaya Kemasan"
                />
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Tipe Biaya Tambahan</label>
                  <FeeTypeSelector
                    value={fees.additional_fee_type}
                    onChange={(v) => setFees((prev) => ({ ...prev, additional_fee_type: v }))}
                  />
                </div>
                <Input
                  label={fees.additional_fee_type === "percentage" ? "Persentase (%)" : "Nominal (Rp)"}
                  type="number"
                  value={fees.additional_fee_nominal.toString()}
                  onChange={(e) =>
                    setFees((prev) => ({ ...prev, additional_fee_nominal: parseFloat(e.target.value) || 0 }))
                  }
                  placeholder={fees.additional_fee_type === "percentage" ? "5" : "2000"}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} isLoading={isSaving}>
              <Save className="h-4 w-4" />
              Simpan Biaya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeeTypeSelector({ value, onChange }: { value: FeeType; onChange: (v: FeeType) => void }) {
  return (
    <div className="flex gap-3">
      {(["percentage", "nominal"] as FeeType[]).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
            value === type
              ? "bg-primary text-white border-primary"
              : "bg-surface text-text-secondary border-border hover:border-primary"
          }`}
        >
          {type === "percentage" ? "Persentase (%)" : "Nominal (Rp)"}
        </button>
      ))}
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
