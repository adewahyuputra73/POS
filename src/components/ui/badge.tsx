import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "primary";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-background text-text-secondary border-border",
      primary: "bg-primary-light text-primary border-primary/20",
      success: "bg-success-light text-success border-success/20",
      warning: "bg-warning-light text-warning border-warning/20",
      error: "bg-error-light text-error border-error/20",
      info: "bg-info-light text-info border-info/20",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-2.5 py-1 text-xs",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-semibold rounded-md border",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
