"use client";

import { ToastProvider } from "@/components/ui";
import { ThemeProvider } from "@/components/providers/theme-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </ToastProvider>
  );
}
