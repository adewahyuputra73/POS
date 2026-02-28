"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

// Select Context
interface SelectContextType {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  registerItem: (value: string, label: React.ReactNode) => void;
  itemLabels: Map<string, React.ReactNode>;
}

const SelectContext = React.createContext<SelectContextType | null>(null);
function useSelectContext() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be wrapped in <Select>");
  return ctx;
}

// Select Root
interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Select({ value = '', onValueChange, children, disabled }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const [, forceUpdate] = React.useState(0);
  const itemLabelsRef = React.useRef<Map<string, React.ReactNode>>(new Map());

  const registerItem = React.useCallback((itemValue: string, label: React.ReactNode) => {
    const current = itemLabelsRef.current.get(itemValue);
    if (current !== label) {
      itemLabelsRef.current.set(itemValue, label);
      // Force re-render so SelectValue can pick up the label
      forceUpdate((n) => n + 1);
    }
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: onValueChange || (() => {}),
        open,
        setOpen,
        disabled,
        registerItem,
        itemLabels: itemLabelsRef.current,
      }}
    >
      <div ref={ref} className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

// SelectTrigger
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, disabled } = useSelectContext();
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 text-text-disabled transition-transform", open && "rotate-180")} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// SelectValue
interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  const { value, itemLabels } = useSelectContext();

  // Try to get the label from registered items
  const registeredLabel = value ? itemLabels.get(value) : undefined;
  const displayValue = children || registeredLabel || value;

  return (
    <span className={cn("truncate", !value && "text-text-disabled")}>
      {displayValue || placeholder}
    </span>
  );
}

// SelectContent — always renders children (for label registration), hidden visually when closed
interface SelectContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

export function SelectContent({ children, align = 'start', className }: SelectContentProps) {
  const { open } = useSelectContext();

  return (
    <div className={cn(
      "absolute z-50 mt-1 w-full min-w-[8rem] rounded-lg border border-border bg-surface shadow-lg",
      "max-h-60 overflow-y-auto py-1",
      open ? "animate-in fade-in-0 zoom-in-95" : "hidden",
      align === 'end' && 'right-0',
      className
    )}>
      {children}
    </div>
  );
}

// SelectItem
interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SelectItem({ value, children, className, disabled }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen, registerItem } = useSelectContext();
  const isSelected = selectedValue === value;

  // Register this item's label so SelectValue can display it
  React.useEffect(() => {
    registerItem(value, children);
  }, [value, children, registerItem]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center px-3 py-2 text-sm cursor-pointer transition-colors",
        isSelected ? "bg-primary/5 text-primary font-medium" : "text-text-primary hover:bg-background",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
