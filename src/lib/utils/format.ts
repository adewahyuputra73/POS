import { format, formatDistanceToNow, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";

/** Tambahkan titik setiap 3 digit tanpa bergantung locale browser */
function addDots(num: number): string {
  return String(Math.round(num)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format currency to Indonesian Rupiah — "Rp 50.000"
 * Menggunakan regex manual agar konsisten di semua browser & Node.js
 */
export function formatCurrency(amount: number): string {
  return `Rp ${addDots(amount ?? 0)}`;
}

/**
 * Format number with thousand separator — "1.250.000"
 */
export function formatNumber(num: number): string {
  return addDots(num ?? 0);
}

/**
 * Format date to Indonesian format
 */
export function formatDate(date: Date | string | null | undefined, formatStr: string = "dd MMM yyyy"): string {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return "-";
  return format(dateObj, formatStr, { locale: localeID });
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (isNaN(dateObj.getTime())) return "-";
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: localeID });
}

/**
 * Format datetime with time
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, "dd MMM yyyy, HH:mm");
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
