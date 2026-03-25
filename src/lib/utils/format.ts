import { format, formatDistanceToNow, parseISO } from "date-fns";
import { id as localeID } from "date-fns/locale";

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with thousand separator
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("id-ID").format(num);
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
