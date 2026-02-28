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
import { cn } from "@/lib/utils";
import { Clock, Save, ToggleLeft, ToggleRight, Copy } from "lucide-react";
import { OperatingHours, DAY_LABELS } from "../types";

interface OperatingHoursFormProps {
  hours: OperatingHours[];
  onSave: (hours: OperatingHours[]) => void;
}

export function OperatingHoursForm({ hours, onSave }: OperatingHoursFormProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localHours, setLocalHours] = useState<OperatingHours[]>([...hours]);

  const handleToggleDay = (index: number) => {
    setLocalHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, is_open: !h.is_open } : h))
    );
  };

  const handleTimeChange = (index: number, field: "open_time" | "close_time", value: string) => {
    setLocalHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const handleCopyToAll = (index: number) => {
    const source = localHours[index];
    setLocalHours((prev) =>
      prev.map((h) => ({
        ...h,
        open_time: source.open_time,
        close_time: source.close_time,
        is_open: source.is_open,
      }))
    );
    showToast("Jam operasional disalin ke semua hari", "info");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(localHours);
    showToast("Jam operasional berhasil diperbarui", "success");
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Jam Operasional</CardTitle>
            <CardDescription>Atur jam buka dan tutup toko Anda</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {localHours.map((hour, index) => (
            <div
              key={hour.day}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl transition-colors",
                hour.is_open ? "bg-background" : "bg-background"
              )}
            >
              {/* Day name */}
              <div className="w-24 flex-shrink-0">
                <span className={cn(
                  "text-sm font-semibold",
                  hour.is_open ? "text-text-primary" : "text-text-secondary"
                )}>
                  {DAY_LABELS[hour.day]}
                </span>
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => handleToggleDay(index)}
                className="flex-shrink-0"
              >
                {hour.is_open ? (
                  <ToggleRight className="h-7 w-7 text-success" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-text-disabled" />
                )}
              </button>

              {/* Time inputs */}
              {hour.is_open ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={hour.open_time}
                    onChange={(e) => handleTimeChange(index, "open_time", e.target.value)}
                    className="h-9 px-3 text-sm bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <span className="text-xs text-text-secondary font-medium">s/d</span>
                  <input
                    type="time"
                    value={hour.close_time}
                    onChange={(e) => handleTimeChange(index, "close_time", e.target.value)}
                    className="h-9 px-3 text-sm bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyToAll(index)}
                    className="ml-1 p-1.5 text-text-secondary hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                    title="Salin ke semua hari"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm text-text-secondary italic">Tutup</span>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleSubmit} isLoading={isSubmitting}>
            <Save className="h-4 w-4" />
            Simpan Jam Operasional
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
