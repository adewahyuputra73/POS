import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8 items-end justify-between sm:flex", className)}>
      <div className="space-y-3">
        {/* Modern Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[11px] font-bold text-text-secondary uppercase tracking-widest">
          <Link href="/" className="hover:text-brand-600 transition-colors flex items-center gap-1">
            <Home className="h-3 w-3" />
            <span>Home</span>
          </Link>
          
          {(breadcrumbs || []).length > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          
          {(breadcrumbs || []).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-primary font-bold">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1.5 text-sm font-medium text-text-secondary max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  );
}
