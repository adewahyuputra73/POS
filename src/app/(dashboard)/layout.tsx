"use client";

import { ReactNode } from "react";
import { Sidebar, Header } from "@/components/layout";
import { useUIStore } from "@/stores";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div
        className={cn(
          "transition-layout min-h-screen flex flex-col",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <Header />
        
        {/* Adjusted padding and structure to avoid Header overlap */}
        <main className="flex-1 mt-16 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
