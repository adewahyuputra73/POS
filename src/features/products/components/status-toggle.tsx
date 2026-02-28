"use client";

import { cn } from "@/lib/utils";

interface StatusToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusToggle({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
}: StatusToggleProps) {
  const sizes = {
    sm: {
      track: "h-5 w-9",
      thumb: "h-3.5 w-3.5",
      translate: checked ? "translate-x-4" : "translate-x-0.5",
    },
    md: {
      track: "h-6 w-11",
      thumb: "h-4 w-4",
      translate: checked ? "translate-x-5" : "translate-x-1",
    },
  };

  const sizeConfig = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        "relative inline-flex items-center rounded-full transition-colors duration-200",
        sizeConfig.track,
        checked ? "bg-success" : "bg-border",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      <span
        className={cn(
          "inline-block rounded-full bg-white shadow-sm transition-transform duration-200",
          sizeConfig.thumb,
          sizeConfig.translate
        )}
      />
    </button>
  );
}
