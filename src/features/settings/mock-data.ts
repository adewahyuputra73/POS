import {
  GeneralSettings,
  NotificationSettings,
  PrinterSettings,
  SecuritySettings,
  DisplaySettings,
} from "./types";

export const mockGeneralSettings: GeneralSettings = {
  language: "id",
  timezone: "Asia/Jakarta",
  date_format: "dd/MM/yyyy",
  time_format: "24h",
  currency: "IDR",
  currency_position: "before",
  thousand_separator: ".",
  decimal_separator: ",",
  default_page_size: 10,
};

export const mockNotificationSettings: NotificationSettings = {
  email_notifications: true,
  push_notifications: true,
  low_stock_alert: true,
  low_stock_threshold: 10,
  new_order_notification: true,
  daily_report_email: false,
  weekly_report_email: true,
  void_transaction_alert: true,
  customer_review_alert: true,
  sound_enabled: true,
  sound_volume: 70,
};

export const mockPrinterSettings: PrinterSettings = {
  default_printer: "EPSON TM-T82X",
  kitchen_printer: "Star TSP143III",
  auto_print_receipt: true,
  auto_print_kitchen: true,
  print_copies: 1,
  printer_type: "thermal",
  connection_type: "usb",
  printer_ip: undefined,
  printer_port: undefined,
};

export const mockSecuritySettings: SecuritySettings = {
  session_timeout: 30,
  require_password_for_void: true,
  require_password_for_discount: false,
  require_password_for_refund: true,
  max_login_attempts: 5,
  lockout_duration: 15,
  two_factor_enabled: false,
  ip_whitelist_enabled: false,
  ip_whitelist: [],
  auto_logout_on_idle: true,
};

export const mockDisplaySettings: DisplaySettings = {
  theme: "light",
  sidebar_collapsed: false,
  compact_mode: false,
  show_product_images: true,
  products_per_page: 10,
  table_density: "comfortable",
  animation_enabled: true,
};
