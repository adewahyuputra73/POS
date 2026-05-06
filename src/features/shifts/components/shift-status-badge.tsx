interface ShiftStatusBadgeProps {
  status: string;
}

export function ShiftStatusBadge({ status }: ShiftStatusBadgeProps) {
  const s = (status ?? "").toUpperCase();
  if (s === "OPEN" || s === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      Ditutup
    </span>
  );
}
