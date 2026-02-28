"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Globe, Bell, Printer, Shield, Monitor } from "lucide-react";
import {
  GeneralSettingsForm,
  NotificationSettingsForm,
  PrinterSettingsForm,
  SecuritySettingsForm,
  DisplaySettingsForm,
} from "@/features/settings/components";
import { useSettingsStore } from "@/stores/settingsStore";
import { useUIStore } from "@/stores/uiStore";
import type {
  GeneralSettings,
  NotificationSettings,
  PrinterSettings as PrinterSettingsType,
  SecuritySettings,
  DisplaySettings,
} from "@/features/settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // Use persisted Zustand stores instead of local useState
  const general = useSettingsStore((s) => s.general);
  const notifications = useSettingsStore((s) => s.notifications);
  const printer = useSettingsStore((s) => s.printer);
  const security = useSettingsStore((s) => s.security);
  const display = useSettingsStore((s) => s.display);

  const updateGeneral = useSettingsStore((s) => s.updateGeneral);
  const updateNotifications = useSettingsStore((s) => s.updateNotifications);
  const updatePrinter = useSettingsStore((s) => s.updatePrinter);
  const updateSecurity = useSettingsStore((s) => s.updateSecurity);
  const updateDisplay = useSettingsStore((s) => s.updateDisplay);

  // Theme and sidebar are stored in useUIStore (used by ThemeProvider and Sidebar)
  const setTheme = useUIStore((s) => s.setTheme);
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const theme = useUIStore((s) => s.theme);

  const handleSaveDisplay = (data: DisplaySettings) => {
    // Sync theme and sidebar to the UI store so they actually take effect
    setTheme(data.theme);
    setSidebarCollapsed(data.sidebar_collapsed);
    updateDisplay(data);
  };

  // Build the display settings with current values from UI store
  const currentDisplay: DisplaySettings = {
    ...display,
    theme,
    sidebar_collapsed: sidebarCollapsed,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola semua pengaturan aplikasi Anda"
        breadcrumbs={[{ label: "Pengaturan" }, { label: "Settings" }]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="printer">
            <Printer className="h-4 w-4" />
            Printer
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4" />
            Keamanan
          </TabsTrigger>
          <TabsTrigger value="display">
            <Monitor className="h-4 w-4" />
            Tampilan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="max-w-3xl">
            <GeneralSettingsForm
              settings={general}
              onSave={updateGeneral}
            />
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="max-w-3xl">
            <NotificationSettingsForm
              settings={notifications}
              onSave={updateNotifications}
            />
          </div>
        </TabsContent>

        <TabsContent value="printer">
          <div className="max-w-3xl">
            <PrinterSettingsForm
              settings={printer}
              onSave={updatePrinter}
            />
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="max-w-3xl">
            <SecuritySettingsForm
              settings={security}
              onSave={updateSecurity}
            />
          </div>
        </TabsContent>

        <TabsContent value="display">
          <div className="max-w-3xl">
            <DisplaySettingsForm
              settings={currentDisplay}
              onSave={handleSaveDisplay}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
