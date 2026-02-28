"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
} from "@/components/ui";
import { useToast } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  QrCode,
  Save,
  ToggleLeft,
  ToggleRight,
  Percent,
} from "lucide-react";
import { PaymentMethodConfig, PAYMENT_TYPE_LABELS } from "../types";

const TYPE_ICONS: Record<string, React.ElementType> = {
  cash: Banknote,
  bank_transfer: Building2,
  e_wallet: Smartphone,
  qris: QrCode,
  credit_card: CreditCard,
  debit_card: CreditCard,
};

interface PaymentMethodsConfigProps {
  methods: PaymentMethodConfig[];
  onSave: (methods: PaymentMethodConfig[]) => void;
}

export function PaymentMethodsConfig({ methods, onSave }: PaymentMethodsConfigProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localMethods, setLocalMethods] = useState<PaymentMethodConfig[]>([...methods]);

  const handleToggle = (id: string) => {
    setLocalMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_enabled: !m.is_enabled } : m))
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(localMethods);
    showToast("Metode pembayaran berhasil diperbarui", "success");
    setIsSubmitting(false);
  };

  // Group by type
  const grouped = localMethods.reduce<Record<string, PaymentMethodConfig[]>>((acc, m) => {
    if (!acc[m.type]) acc[m.type] = [];
    acc[m.type].push(m);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-purple" />
          </div>
          <div>
            <CardTitle className="text-base">Metode Pembayaran</CardTitle>
            <CardDescription>Kelola metode pembayaran yang tersedia di toko</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(grouped).map(([type, typeMethods]) => {
          const TypeIcon = TYPE_ICONS[type] || CreditCard;
          return (
            <div key={type}>
              <div className="flex items-center gap-2 mb-3">
                <TypeIcon className="h-4 w-4 text-text-secondary" />
                <h4 className="text-sm font-semibold text-text-primary">
                  {PAYMENT_TYPE_LABELS[type as keyof typeof PAYMENT_TYPE_LABELS]}
                </h4>
                <Badge className="bg-background text-text-secondary text-[10px]">
                  {typeMethods.filter((m) => m.is_enabled).length}/{typeMethods.length} aktif
                </Badge>
              </div>

              <div className="space-y-2">
                {typeMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border transition-all",
                      method.is_enabled
                        ? "bg-surface border-border"
                        : "bg-background border-divider"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          method.is_enabled ? "bg-primary-light" : "bg-background"
                        )}
                      >
                        <TypeIcon
                          className={cn(
                            "h-5 w-5",
                            method.is_enabled ? "text-primary" : "text-text-disabled"
                          )}
                        />
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-semibold",
                            method.is_enabled ? "text-text-primary" : "text-text-secondary"
                          )}
                        >
                          {method.name}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5">
                          {method.account_number && (
                            <span className="text-xs text-text-secondary">
                              {method.account_number}
                            </span>
                          )}
                          {(method.fee_percentage !== undefined && method.fee_percentage > 0) && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-text-secondary">
                              <Percent className="h-3 w-3" />
                              Fee {method.fee_percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleToggle(method.id)}>
                      {method.is_enabled ? (
                        <ToggleRight className="h-7 w-7 text-success" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-text-disabled" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex justify-end pt-2 border-t border-divider">
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            <Save className="h-4 w-4" />
            Simpan Metode Pembayaran
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
