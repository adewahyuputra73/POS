"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/stores";
import { Avatar, Button } from "@/components/ui";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import Link from "next/link";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setSidebarMobileOpen, sidebarCollapsed } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 bg-surface/80 backdrop-blur-md border-b border-divider transition-layout",
        sidebarCollapsed ? "lg:left-20" : "lg:left-60",
        "left-0"
      )}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSidebarMobileOpen(true)}
            className="lg:hidden p-2 -ml-2 text-text-secondary hover:bg-background rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Command Palette Search */}
          <div className="hidden sm:block">
            <CommandPalette />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative group rounded-xl hover:bg-background">
            <Bell className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-error rounded-full border-2 border-surface ring-2 ring-error/20" />
          </Button>

          <div className="h-8 w-[1px] bg-border mx-2" />

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="group flex items-center gap-3 p-1 pr-2 hover:bg-background rounded-xl transition-all"
            >
              <Avatar
                src={user?.avatar}
                alt={user?.name || "Admin User"}
                size="sm"
                className="ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-text-primary leading-none">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[10px] text-text-secondary font-medium mt-1 uppercase tracking-wider">
                  {user?.role || "Global Admin"}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 text-text-secondary transition-transform duration-200",
                  dropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-surface rounded-2xl shadow-xl border border-border py-2.5 z-50 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 mb-1 border-b border-divider">
                  <p className="text-sm font-bold text-text-primary leading-none">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-text-secondary font-medium mt-1.5">{user?.email || "admin@ferepos.com"}</p>
                </div>

                <div className="px-2 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-primary-light hover:text-primary rounded-lg transition-all"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">Profil Saya</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-text-primary hover:bg-warning-light hover:text-warning rounded-lg transition-all"
                  >
                    <div className="h-8 w-8 rounded-lg bg-warning-light flex items-center justify-center">
                      <Settings className="h-4 w-4 text-warning" />
                    </div>
                    <span className="font-medium">Pengaturan</span>
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-divider px-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error-light rounded-lg w-full transition-all"
                  >
                    <div className="h-8 w-8 rounded-lg bg-error-light flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-error" />
                    </div>
                    <span className="font-bold">Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
