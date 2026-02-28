"use client";

import { cn } from "@/lib/utils";

interface TabViewProps<T extends string> {
  tabs: { value: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function TabView<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabViewProps<T>) {
  return (
    <div className={cn("inline-flex bg-background rounded-xl p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-all",
            activeTab === tab.value
              ? "bg-surface text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
