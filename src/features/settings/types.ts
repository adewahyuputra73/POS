// Settings feature types

export interface GeneralSettings {
  language: Language;
  timezone: string;
  date_format: string;
  time_format: "12h" | "24h";
  currency: string;
  currency_position: "before" | "after";
  thousand_separator: "." | ",";
  decimal_separator: "," | ".";
  default_page_size: number;
}

export type Language = "id" | "en";

export const LANGUAGE_OPTIONS = [
  { value: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export const TIMEZONE_OPTIONS = [
  { value: "Asia/Jakarta", label: "WIB (UTC+7)" },
  { value: "Asia/Makassar", label: "WITA (UTC+8)" },
  { value: "Asia/Jayapura", label: "WIT (UTC+9)" },
];

export const DATE_FORMAT_OPTIONS = [
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY", example: "15/01/2025" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY", example: "01/15/2025" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD", example: "2025-01-15" },
  { value: "dd MMM yyyy", label: "DD MMM YYYY", example: "15 Jan 2025" },
];

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  low_stock_alert: boolean;
  low_stock_threshold: number;
  new_order_notification: boolean;
  daily_report_email: boolean;
  weekly_report_email: boolean;
  void_transaction_alert: boolean;
  customer_review_alert: boolean;
  sound_enabled: boolean;
  sound_volume: number;
}

export interface PrinterSettings {
  default_printer: string;
  kitchen_printer: string;
  auto_print_receipt: boolean;
  auto_print_kitchen: boolean;
  print_copies: number;
  printer_type: "thermal" | "inkjet" | "laser";
  connection_type: "usb" | "network" | "bluetooth";
  printer_ip?: string;
  printer_port?: number;
}

export const PRINTER_TYPE_OPTIONS = [
  { value: "thermal", label: "Thermal" },
  { value: "inkjet", label: "Inkjet" },
  { value: "laser", label: "Laser" },
];

export const CONNECTION_TYPE_OPTIONS = [
  { value: "usb", label: "USB" },
  { value: "network", label: "Jaringan / IP" },
  { value: "bluetooth", label: "Bluetooth" },
];

export interface SecuritySettings {
  session_timeout: number; // minutes
  require_password_for_void: boolean;
  require_password_for_discount: boolean;
  require_password_for_refund: boolean;
  max_login_attempts: number;
  lockout_duration: number; // minutes
  two_factor_enabled: boolean;
  ip_whitelist_enabled: boolean;
  ip_whitelist: string[];
  auto_logout_on_idle: boolean;
}

export interface DisplaySettings {
  theme: "light" | "dark" | "system";
  sidebar_collapsed: boolean;
  compact_mode: boolean;
  show_product_images: boolean;
  products_per_page: number;
  table_density: "comfortable" | "compact";
  animation_enabled: boolean;
}

export const THEME_OPTIONS = [
  { value: "light", label: "Terang", icon: "Sun" },
  { value: "dark", label: "Gelap", icon: "Moon" },
  { value: "system", label: "Ikuti Sistem", icon: "Monitor" },
];
