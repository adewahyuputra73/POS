"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  Search,
  Command,
  X,
  LayoutDashboard,
  FileBarChart,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  User,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/stores";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  href?: string;
  icon: React.ElementType;
  category: "navigation" | "reports" | "settings" | "actions";
  keywords: string[];
  action?: () => void;
}

const SEARCH_ITEMS: SearchItem[] = [
  // Navigation
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Lihat ringkasan toko",
    href: "/dashboard",
    icon: LayoutDashboard,
    category: "navigation",
    keywords: ["home", "beranda", "overview", "ringkasan"],
  },
  {
    id: "products",
    title: "Produk",
    description: "Kelola produk toko",
    href: "/products",
    icon: Package,
    category: "navigation",
    keywords: ["barang", "item", "menu", "makanan", "minuman"],
  },
  {
    id: "categories",
    title: "Kategori",
    description: "Atur kategori produk",
    href: "/categories",
    icon: FolderTree,
    category: "navigation",
    keywords: ["group", "kelompok", "jenis"],
  },
  {
    id: "transactions",
    title: "Transaksi",
    description: "Riwayat transaksi",
    href: "/transactions",
    icon: ShoppingCart,
    category: "navigation",
    keywords: ["order", "pesanan", "penjualan", "sales", "invoice"],
  },
  {
    id: "customers",
    title: "Pelanggan",
    description: "Data pelanggan",
    href: "/customers",
    icon: Users,
    category: "navigation",
    keywords: ["customer", "pembeli", "user", "member"],
  },
  {
    id: "payments",
    title: "Pembayaran",
    description: "Metode pembayaran",
    href: "/payments",
    icon: CreditCard,
    category: "navigation",
    keywords: ["payment", "bayar", "transfer", "qris", "tunai", "cash"],
  },
  // Reports
  {
    id: "reports",
    title: "Laporan",
    description: "Lihat semua laporan",
    href: "/reports",
    icon: FileBarChart,
    category: "reports",
    keywords: ["report", "statistik", "analitik", "data"],
  },
  {
    id: "sales-summary",
    title: "Ringkasan Penjualan",
    description: "Laporan ringkasan penjualan",
    href: "/reports/sales-summary",
    icon: FileBarChart,
    category: "reports",
    keywords: ["laporan", "report", "sales", "penjualan", "summary"],
  },
  {
    id: "product-sales",
    title: "Penjualan Produk",
    description: "Laporan per produk",
    href: "/reports/product-sales",
    icon: Package,
    category: "reports",
    keywords: ["laporan", "report", "product", "produk", "item"],
  },
  {
    id: "category-sales",
    title: "Kategori Produk",
    description: "Penjualan per kategori",
    href: "/reports/category-sales",
    icon: FolderTree,
    category: "reports",
    keywords: ["laporan", "report", "kategori", "category"],
  },
  {
    id: "stock-flow",
    title: "Arus Stok",
    description: "Laporan pergerakan stok",
    href: "/reports/stock-flow",
    icon: Package,
    category: "reports",
    keywords: ["laporan", "report", "stok", "inventory", "bahan"],
  },
  {
    id: "gross-profit",
    title: "Laba Kotor",
    description: "Analisis laba kotor",
    href: "/reports/gross-profit",
    icon: CreditCard,
    category: "reports",
    keywords: ["laporan", "report", "profit", "laba", "margin", "hpp"],
  },
  {
    id: "void-report",
    title: "Pembatalan / Void",
    description: "Laporan transaksi batal",
    href: "/reports/void-report",
    icon: ShoppingCart,
    category: "reports",
    keywords: ["laporan", "report", "void", "batal", "cancel"],
  },
  {
    id: "send-report",
    title: "Kirim Laporan",
    description: "Jadwal pengiriman laporan",
    href: "/reports/send-report",
    icon: FileBarChart,
    category: "reports",
    keywords: ["laporan", "report", "email", "kirim", "schedule"],
  },
  {
    id: "download-report",
    title: "Unduh Laporan",
    description: "Download laporan Excel",
    href: "/reports/download-report",
    icon: FileBarChart,
    category: "reports",
    keywords: ["laporan", "report", "download", "unduh", "excel", "export"],
  },
  {
    id: "order-history",
    title: "Riwayat Pesanan",
    description: "Riwayat semua pesanan",
    href: "/reports/order-history",
    icon: ShoppingCart,
    category: "reports",
    keywords: ["laporan", "report", "order", "pesanan", "history", "riwayat"],
  },
  // Settings
  {
    id: "store-settings",
    title: "Pengaturan Toko",
    description: "Atur informasi toko",
    href: "/store-settings",
    icon: Settings,
    category: "settings",
    keywords: ["setting", "config", "konfigurasi", "outlet"],
  },
  {
    id: "settings",
    title: "Pengaturan",
    description: "Pengaturan aplikasi",
    href: "/settings",
    icon: Settings,
    category: "settings",
    keywords: ["setting", "config", "akun", "preferensi"],
  },
  {
    id: "profile",
    title: "Profil Saya",
    description: "Lihat profil akun",
    href: "/profile",
    icon: User,
    category: "settings",
    keywords: ["akun", "account", "user", "saya"],
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  navigation: "Navigasi",
  reports: "Laporan",
  settings: "Pengaturan",
  actions: "Aksi",
};

export function CommandPalette() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Add logout action
  const allItems: SearchItem[] = useMemo(() => [
    ...SEARCH_ITEMS,
    {
      id: "logout",
      title: "Keluar",
      description: "Logout dari aplikasi",
      icon: LogOut,
      category: "actions" as const,
      keywords: ["logout", "signout", "keluar", "exit"],
      action: () => {
        logout();
        router.push("/login");
      },
    },
  ], [logout, router]);

  // Filter results based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      return allItems;
    }

    const searchTerms = query.toLowerCase().split(" ");
    
    return allItems.filter((item) => {
      const searchableText = [
        item.title,
        item.description || "",
        ...item.keywords,
      ].join(" ").toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [query, allItems]);

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {};
    
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    return groups;
  }, [filteredItems]);

  // Flatten for keyboard navigation
  const flatItems = useMemo(() => {
    return Object.values(groupedItems).flat();
  }, [groupedItems]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened & prevent body scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard navigation within results
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < flatItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev > 0 ? prev - 1 : flatItems.length - 1
      );
    } else if (e.key === "Enter" && flatItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(flatItems[selectedIndex]);
    }
  }, [flatItems, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = resultsRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    // Execute action or navigate
    if (item.action) {
      item.action();
    } else if (item.href) {
      router.push(item.href);
    }

    // Close and reset
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  let currentFlatIndex = -1;

  // Modal content with Portal
  const modalContent = isOpen && mounted ? (
    <>
      {/* Full-Screen Backdrop - covers EVERYTHING including sidebar */}
      <div
        className="fixed inset-0 z-[100] bg-secondary/60 backdrop-blur-md transition-all duration-300"
        onClick={handleClose}
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Command Palette Modal - centered on screen */}
      <div 
        className="fixed inset-0 z-[101] flex items-start justify-center pt-[12vh] md:pt-[15vh] px-4 pointer-events-none"
      >
        <div
          className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "slideIn 0.25s ease-out",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Search Input */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-divider bg-gradient-to-r from-background to-surface">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Cari halaman, menu, atau aksi..."
              className="flex-1 bg-transparent outline-none text-base text-text-primary placeholder:text-text-secondary font-medium"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-text-secondary font-semibold">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            className="max-h-[50vh] overflow-y-auto p-3 bg-surface"
          >
            {flatItems.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-background rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-text-secondary opacity-50" />
                </div>
                <p className="text-sm text-text-secondary font-medium">
                  Tidak ditemukan hasil untuk
                </p>
                <p className="text-base text-text-primary font-semibold mt-1">
                  &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-3 last:mb-0">
                  <div className="px-3 py-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                    {CATEGORY_LABELS[category] || category}
                  </div>
                  <div className="space-y-1">
                    {items.map((item) => {
                      currentFlatIndex++;
                      const isSelected = currentFlatIndex === selectedIndex;
                      const Icon = item.icon;
                      const index = currentFlatIndex;

                      return (
                        <button
                          key={item.id}
                          data-index={index}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={cn(
                            "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-150",
                            isSelected
                              ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.01]"
                              : "hover:bg-background text-text-primary"
                          )}
                        >
                          <div
                            className={cn(
                              "p-2.5 rounded-xl transition-colors",
                              isSelected
                                ? "bg-white/20"
                                : "bg-primary/10"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                isSelected ? "text-white" : "text-primary"
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-semibold truncate",
                                isSelected ? "text-white" : "text-text-primary"
                              )}
                            >
                              {item.title}
                            </p>
                            {item.description && (
                              <p
                                className={cn(
                                  "text-xs truncate mt-0.5",
                                  isSelected
                                    ? "text-white/70"
                                    : "text-text-secondary"
                                )}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight
                            className={cn(
                              "h-4 w-4 transition-all",
                              isSelected 
                                ? "opacity-100 text-white translate-x-0" 
                                : "opacity-0 -translate-x-2"
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-divider bg-gradient-to-r from-background to-surface flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-surface border border-border rounded font-mono text-[10px] shadow-sm">↑</kbd>
                <kbd className="px-2 py-1 bg-surface border border-border rounded font-mono text-[10px] shadow-sm">↓</kbd>
                <span className="font-medium">Navigasi</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-2 py-1 bg-surface border border-border rounded font-mono text-[10px] shadow-sm">↵</kbd>
                <span className="font-medium">Pilih</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs text-text-secondary font-medium">
                {flatItems.length} hasil
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: scale(0.96) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
    </>
  ) : null;

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2.5 px-3.5 py-2 bg-background border border-border rounded-xl group hover:border-primary/30 hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      >
        <Search className="h-4 w-4 text-text-secondary group-hover:text-primary transition-colors" />
        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors w-40 lg:w-48 text-left font-medium">
          Cari halaman...
        </span>
        <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 bg-surface border border-border rounded text-[10px] text-text-secondary font-bold shadow-sm">
          <Command className="h-2.5 w-2.5" />
          <span>K</span>
        </div>
      </button>

      {/* Portal to body for full-screen coverage */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
