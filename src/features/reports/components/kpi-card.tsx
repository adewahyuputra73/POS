import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  subtitle?: string;
  className?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary-light",
  subtitle,
  className,
}: KPICardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-border p-5 shadow-card",
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-text-primary truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2.5 rounded-lg flex-shrink-0", iconBgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        )}
      </div>
    </div>
  );
}
