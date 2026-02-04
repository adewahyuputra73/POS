"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Tag,
  Wallet,
  X,
  FileText,
  Layers,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Laporan",
    href: "/reports",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    label: "Produk",
    href: "/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Varian",
    href: "/products/variants",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    label: "Kategori",
    href: "/categories",
    icon: <Tag className="h-5 w-5" />,
  },
  {
    label: "Transaksi",
    href: "/transactions",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    label: "Pelanggan",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Pembayaran",
    href: "/payments",
    icon: <Wallet className="h-5 w-5" />,
  },
];

const bottomNavItems: NavItem[] = [
  {
    label: "Store Settings",
    href: "/store",
    icon: <Store className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, sidebarMobileOpen, toggleSidebar, setSidebarMobileOpen } =
    useUIStore();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/" || pathname === "/dashboard";
    
    // For /products, only match exact path, not /products/variants
    if (href === "/products") {
      return pathname === "/products";
    }
    
    return pathname.startsWith(href);
  };

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      onClick={() => setSidebarMobileOpen(false)}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-0.5",
        isActive(item.href)
          ? "bg-primary text-white"
          : "text-gray-400 hover:text-white hover:bg-secondary-light",
        sidebarCollapsed && "justify-center px-2"
      )}
    >
      <div className={cn(
        "transition-transform duration-200 group-hover:scale-105",
        sidebarCollapsed ? "" : "min-w-[20px]"
      )}>
        {item.icon}
      </div>
      {!sidebarCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
    </Link>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-5">
      {/* Logo */}
      <div
        className={cn(
          "flex items-center px-5 mb-8 transition-layout",
          sidebarCollapsed ? "justify-center px-0" : "gap-3"
        )}
      >
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-primary flex items-center justify-center">
          <Store className="h-5 w-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white leading-tight">{APP_NAME}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3",
          sidebarCollapsed && "hidden"
        )}>Menu Utama</p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 mt-auto pt-4 border-t border-secondary-light">
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3",
          sidebarCollapsed && "hidden"
        )}>Pengaturan</p>
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      {/* Collapse Button (Desktop) */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-white border border-divider shadow-sm text-gray-400 hover:text-primary hover:border-primary transition-all z-50 focus:outline-none"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40",
          "bg-secondary transition-layout",
          sidebarCollapsed ? "lg:w-20" : "lg:w-60"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 bg-secondary lg:hidden shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          sidebarMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarMobileOpen(false)}
          className="absolute right-3 top-5 p-2 text-gray-400 hover:text-white hover:bg-secondary-light rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
