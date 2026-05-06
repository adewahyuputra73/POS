import { Badge } from "@/components/ui";
import type { StaffStatus } from "../types";

const STATUS_CONFIG: Record<StaffStatus, { label: string; className: string }> = {
  AKTIF: { label: "Aktif", className: "bg-success-light text-success" },
  NONAKTIF: { label: "Nonaktif", className: "bg-background text-text-secondary" },
  BELUM_REGISTRASI: { label: "Belum Registrasi", className: "bg-warning-light text-warning" },
};

interface StatusBadgeProps {
  status: StaffStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.NONAKTIF;
  return (
    <Badge className={`text-xs font-semibold ${config.className}`}>
      {config.label}
    </Badge>
  );
}
