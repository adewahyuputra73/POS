"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg active:scale-[0.98]";

    const variants = {
      primary:
        "bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-sm",
      secondary:
        "bg-secondary text-white hover:bg-secondary-light focus:ring-secondary",
      outline:
        "border border-border bg-transparent text-text-primary hover:bg-background focus:ring-primary",
      ghost:
        "bg-transparent text-text-secondary hover:bg-background hover:text-text-primary focus:ring-primary",
      destructive:
        "bg-error text-white hover:bg-red-700 focus:ring-error shadow-sm",
      success:
        "bg-success text-white hover:bg-green-700 focus:ring-success shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
