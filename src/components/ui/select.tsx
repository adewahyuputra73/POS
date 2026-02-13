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

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange: onValueChange || (() => {}), open, setOpen, disabled }}>
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
          "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform", open && "rotate-180")} />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

// SelectValue
interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const { value, open } = useSelectContext();
  // We store the display text in a data attribute on the selected item
  const [displayText, setDisplayText] = React.useState('');
  const selectCtx = useSelectContext();

  // Find the matching option text by searching DOM after render
  React.useEffect(() => {
    if (!value) { setDisplayText(''); return; }
    // This is handled by SelectItem setting data attributes
  }, [value]);

  return (
    <span className={cn("truncate", !value && "text-gray-400")}>
      {value ? (displayText || value) : placeholder}
    </span>
  );
}

// SelectContent
interface SelectContentProps {
  children: React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

export function SelectContent({ children, align = 'start', className }: SelectContentProps) {
  const { open } = useSelectContext();
  if (!open) return null;

  return (
    <div className={cn(
      "absolute z-50 mt-1 w-full min-w-[8rem] rounded-lg border border-border bg-white shadow-lg",
      "max-h-60 overflow-y-auto py-1",
      "animate-in fade-in-0 zoom-in-95",
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
  const { value: selectedValue, onValueChange, setOpen } = useSelectContext();
  const isSelected = selectedValue === value;

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
        isSelected ? "bg-primary/5 text-primary font-medium" : "text-gray-700 hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
}
