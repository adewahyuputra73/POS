"use client";

import { Button } from "@/components/ui";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ExportButton({ onClick, isLoading = false, className, disabled }: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn("gap-2", className)}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      <span>Ekspor</span>
    </Button>
  );
}
