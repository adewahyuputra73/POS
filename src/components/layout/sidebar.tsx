"use client";

import { useRef, useEffect, useCallback } from "react";
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
  Warehouse,
  FlaskConical,
  Ruler,
  FolderOpen,
  Truck,
  BookOpen,
  TrendingUp,
  Star,
  Ticket,
  Coins,
  MapPin,
  LayoutGrid,
  Armchair,
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
    label: "Pembayaran",
    href: "/payments",
    icon: <Wallet className="h-5 w-5" />,
  },
];

// Master menu items
const masterNavItems: NavItem[] = [
  {
    label: "Master Produk",
    href: "/master/products",
    icon: <Package className="h-5 w-5" />,
  },
  {
    label: "Master Varian",
    href: "/master/variants",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    label: "Master Kategori",
    href: "/master/categories",
    icon: <Tag className="h-5 w-5" />,
  },
];

// Pelanggan menu items
const pelangganNavItems: NavItem[] = [
  {
    label: "Pelanggan",
    href: "/customers",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Ulasan",
    href: "/customers/reviews",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Voucher",
    href: "/customers/vouchers",
    icon: <Ticket className="h-5 w-5" />,
  },
  {
    label: "Koin",
    href: "/customers/coins",
    icon: <Coins className="h-5 w-5" />,
  },
];

// Manajemen Meja menu items
const mejaNavItems: NavItem[] = [
  {
    label: "Tata Letak",
    href: "/table-management/layout",
    icon: <LayoutGrid className="h-5 w-5" />,
  },
  {
    label: "Area",
    href: "/table-management/area",
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    label: "Meja",
    href: "/table-management/tables",
    icon: <Armchair className="h-5 w-5" />,
  },
];

// Inventory menu items
const inventoryNavItems: NavItem[] = [
  {
    label: "Arus Stok",
    href: "/inventory/stock-flow",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    label: "Bahan Dasar",
    href: "/inventory/raw-materials",
    icon: <FlaskConical className="h-5 w-5" />,
  },
  {
    label: "Konversi Unit",
    href: "/inventory/unit-conversion",
    icon: <Ruler className="h-5 w-5" />,
  },
  {
    label: "Kategori",
    href: "/inventory/categories",
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    label: "Supplier",
    href: "/inventory/suppliers",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    label: "Resep",
    href: "/inventory/recipes",
    icon: <BookOpen className="h-5 w-5" />,
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

  // Scroll position persistence
  const navRef = useRef<HTMLElement>(null);
  const scrollPositionRef = useRef(0);

  // Track scroll position continuously
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      scrollPositionRef.current = nav.scrollTop;
    };

    nav.addEventListener("scroll", handleScroll, { passive: true });
    return () => nav.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore scroll position after pathname change triggers re-render
  useEffect(() => {
    const nav = navRef.current;
    if (nav && scrollPositionRef.current > 0) {
      requestAnimationFrame(() => {
        nav.scrollTop = scrollPositionRef.current;
      });
    }
  }, [pathname]);

  const isActive = useCallback((href: string) => {
    if (href === "/dashboard") return pathname === "/" || pathname === "/dashboard";
    
    // For /products, only match exact path, not /products/variants
    if (href === "/products") {
      return pathname === "/products";
    }

    // For /customers, only match exact path, not sub-routes
    if (href === "/customers") {
      return pathname === "/customers";
    }
    
    return pathname.startsWith(href);
  }, [pathname]);

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      onClick={() => setSidebarMobileOpen(false)}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-0.5",
        isActive(item.href)
          ? "bg-primary text-white"
          : "text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-primary hover:bg-secondary-light dark:hover:bg-gray-100",
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

  const renderSidebarContent = () => (
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
            <span className="font-bold text-lg text-white dark:text-secondary leading-tight">{APP_NAME}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Admin Panel</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="flex-1 px-3 space-y-0.5 overflow-y-auto sidebar-nav">
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3",
          sidebarCollapsed && "hidden"
        )}>Menu Utama</p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Master Section */}
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3 mt-6",
          sidebarCollapsed && "hidden"
        )}>Master</p>
        {masterNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Inventory Section */}
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3 mt-6",
          sidebarCollapsed && "hidden"
        )}>Inventory</p>
        {inventoryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Pelanggan Section */}
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3 mt-6",
          sidebarCollapsed && "hidden"
        )}>Pelanggan</p>
        {pelangganNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Manajemen Meja Section */}
        <p className={cn(
          "text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3 mt-6",
          sidebarCollapsed && "hidden"
        )}>Manajemen Meja</p>
        {mejaNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 mt-auto pt-4 border-t border-secondary-light dark:border-gray-200">
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
        className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-surface dark:bg-white border border-divider dark:border-gray-300 shadow-sm text-text-disabled hover:text-primary hover:border-primary transition-all z-50 focus:outline-none"
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
          "bg-secondary dark:bg-white dark:border-r dark:border-gray-200 transition-layout",
          sidebarCollapsed ? "lg:w-20" : "lg:w-60"
        )}
      >
        {renderSidebarContent()}
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
          "fixed inset-y-0 left-0 z-50 w-60 bg-secondary dark:bg-white lg:hidden shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          sidebarMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarMobileOpen(false)}
          className="absolute right-3 top-5 p-2 text-gray-400 hover:text-white dark:hover:text-primary hover:bg-secondary-light dark:hover:bg-gray-100 rounded-lg"
        >
          <X className="h-5 w-5" />
        </button>
        {renderSidebarContent()}
      </aside>
    </>
  );
}
