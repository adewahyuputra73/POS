"use client";

import { formatCurrency, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import {
  PaymentMethodSummary,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_ICONS,
} from "../types";

interface PaymentMethodBreakdownProps {
  summary: PaymentMethodSummary[];
}

export function PaymentMethodBreakdown({ summary }: PaymentMethodBreakdownProps) {
  const maxAmount = Math.max(...summary.map((s) => s.totalAmount), 1);

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-sm font-bold text-text-primary">
          Ringkasan Metode Pembayaran
        </h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Breakdown pembayaran berdasarkan metode
        </p>
      </div>

      <div className="divide-y divide-border">
        {summary.map((item) => (
          <div
            key={item.method}
            className="px-6 py-4 hover:bg-background/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {PAYMENT_METHOD_ICONS[item.method]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {PAYMENT_METHOD_LABELS[item.method]}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {item.totalOrders} pesanan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">
                  {formatCurrency(item.totalAmount)}
                </p>
                <p className="text-xs text-text-secondary">
                  {item.percentage.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-background rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  item.totalAmount > 0 ? "bg-primary" : "bg-transparent"
                )}
                style={{
                  width: `${(item.totalAmount / maxAmount) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}

        {/* If all zero */}
        {summary.every((s) => s.totalAmount === 0) && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-text-secondary">
              Belum ada data pembayaran
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
