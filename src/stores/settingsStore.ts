import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GeneralSettings,
  NotificationSettings,
  PrinterSettings,
  SecuritySettings,
  DisplaySettings,
} from "@/features/settings/types";
import {
  mockGeneralSettings,
  mockNotificationSettings,
  mockPrinterSettings,
  mockSecuritySettings,
  mockDisplaySettings,
} from "@/features/settings/mock-data";

interface SettingsState {
  // Data
  general: GeneralSettings;
  notifications: NotificationSettings;
  printer: PrinterSettings;
  security: SecuritySettings;
  display: DisplaySettings;

  // Actions
  updateGeneral: (data: GeneralSettings) => void;
  updateNotifications: (data: NotificationSettings) => void;
  updatePrinter: (data: PrinterSettings) => void;
  updateSecurity: (data: SecuritySettings) => void;
  updateDisplay: (data: DisplaySettings) => void;
  resetAll: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      general: mockGeneralSettings,
      notifications: mockNotificationSettings,
      printer: mockPrinterSettings,
      security: mockSecuritySettings,
      display: mockDisplaySettings,

      updateGeneral: (data) => set({ general: data }),
      updateNotifications: (data) => set({ notifications: data }),
      updatePrinter: (data) => set({ printer: data }),
      updateSecurity: (data) => set({ security: data }),
      updateDisplay: (data) => set({ display: data }),
      resetAll: () =>
        set({
          general: mockGeneralSettings,
          notifications: mockNotificationSettings,
          printer: mockPrinterSettings,
          security: mockSecuritySettings,
          display: mockDisplaySettings,
        }),
    }),
    {
      name: "fere-pos-settings",
    }
  )
);
