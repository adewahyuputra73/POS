import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle2, Circle } from "lucide-react";
import { DELIVERY_STATUS_MAP } from "../types";
import type { BiteshipOrderStatus, BiteshipTrackingEvent } from "../types";

// Ordered status steps for visual progress
const STATUS_STEPS: BiteshipOrderStatus[] = [
  "confirmed",
  "allocated",
  "picking_up",
  "picked",
  "dropping_off",
  "delivered",
];

interface Props {
  currentStatus: BiteshipOrderStatus;
  history?: BiteshipTrackingEvent[];
}

function getStepIndex(status: BiteshipOrderStatus): number {
  return STATUS_STEPS.indexOf(status);
}

export function DeliveryStatusTimeline({ currentStatus, history = [] }: Props) {
  const currentIndex = getStepIndex(currentStatus);
  const statusInfo = DELIVERY_STATUS_MAP[currentStatus];

  const isTerminal = currentStatus === "cancelled" || currentStatus === "rejected";

  return (
    <div
      className="rounded-[22px] p-5"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1.5px solid rgba(124,74,30,0.1)",
        boxShadow: "0 2px 12px rgba(28,10,0,0.04)",
      }}
    >
      {/* Current status badge */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-[13px] font-black uppercase tracking-wider" style={{ color: "#1C0A00" }}>
          Status Pengiriman
        </p>
        <span
          className="text-xs font-black px-3 py-1 rounded-full"
          style={{
            backgroundColor: statusInfo?.bg ?? "#F3F4F6",
            color: statusInfo?.color ?? "#6B7280",
          }}
        >
          {statusInfo?.label ?? currentStatus}
        </span>
      </div>

      {/* Terminal state notice */}
      {isTerminal ? (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-2xl"
          style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}
        >
          <Circle className="h-4 w-4 shrink-0" />
          <p className="text-sm font-bold">
            {currentStatus === "cancelled" ? "Pesanan dibatalkan" : "Pesanan ditolak driver"}
          </p>
        </div>
      ) : (
        /* Progress steps */
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[18px] top-5 bottom-5 w-0.5"
            style={{ backgroundColor: "rgba(124,74,30,0.1)" }}
          />

          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              const stepInfo = DELIVERY_STATUS_MAP[step];

              return (
                <div key={step} className="flex items-start gap-4 py-3">
                  {/* Icon */}
                  <div className="relative z-10 shrink-0">
                    {done ? (
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: active ? stepInfo.color : "#E8F5E9",
                          border: `2px solid ${active ? stepInfo.color : "#A5D6A7"}`,
                        }}
                      >
                        <CheckCircle2
                          className="h-4 w-4"
                          style={{ color: active ? "#FFFFFF" : "#4CAF50" }}
                        />
                      </div>
                    ) : (
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "#F9FAFB",
                          border: "2px solid #E5E7EB",
                        }}
                      >
                        <div className="h-2 w-2 rounded-full bg-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="pt-1.5">
                    <p
                      className="text-sm font-black"
                      style={{ color: done ? "#1C0A00" : "#9CA3AF" }}
                    >
                      {stepInfo.label}
                    </p>
                    {active && (
                      <p className="text-[11px] font-medium mt-0.5" style={{ color: "#9C7D58" }}>
                        Status saat ini
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event history */}
      {history.length > 0 && (
        <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(124,74,30,0.08)" }}>
          <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: "#9C7D58" }}>
            Riwayat Pengiriman
          </p>
          <div className="space-y-2">
            {history.map((event, idx) => {
              let dateFormatted = event.updated_at;
              try {
                dateFormatted = format(parseISO(event.updated_at), "d MMM yyyy · HH:mm", {
                  locale: id,
                });
              } catch {
                // keep raw
              }

              return (
                <div key={idx} className="flex gap-3">
                  <div
                    className="h-1.5 w-1.5 rounded-full shrink-0 mt-2"
                    style={{ backgroundColor: "#D97706" }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1C0A00" }}>
                      {event.note}
                    </p>
                    <p className="text-[11px]" style={{ color: "#9C7D58" }}>
                      {dateFormatted}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
