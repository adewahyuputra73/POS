"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/stores";
import { Avatar, Button } from "@/components/ui";
import { CommandPalette } from "./command-palette";
import { cn } from "@/lib/utils";
import { notificationService } from "@/features/notifications/services/notification-service";
import type { Notification } from "@/features/notifications/types";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  CheckCheck,
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari lalu`;
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.list({ limit: 15 });
      setItems(res.notifications ?? []);
      setUnreadCount(res.unread_count ?? 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch { /* silent */ }
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
    setMarkingAll(false);
  };

  return (
    <div className="absolute right-0 mt-3 w-96 max-w-[calc(100vw-2rem)] bg-surface rounded-2xl shadow-2xl border border-border z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-divider">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-text-primary">Notifikasi</h3>
          {unreadCount > 0 && (
            <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button onClick={handleMarkAll} disabled={markingAll}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50">
              {markingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
              Tandai semua dibaca
            </button>
          )}
          <button onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background transition-colors text-text-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-divider">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <Bell className="h-8 w-8 text-text-disabled" />
            <p className="text-sm font-medium text-text-secondary">Tidak ada notifikasi</p>
          </div>
        ) : (
          items.map((item) => (
            <button key={item.id} onClick={() => !item.is_read && handleMarkRead(item.id)}
              className={cn(
                "w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-background/60 transition-colors",
                !item.is_read && "bg-primary/[0.03]"
              )}>
              {/* Unread dot */}
              <div className={cn(
                "h-2 w-2 rounded-full mt-1.5 shrink-0",
                item.is_read ? "bg-transparent" : "bg-primary"
              )} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm leading-snug",
                  item.is_read ? "text-text-secondary font-normal" : "text-text-primary font-semibold"
                )}>
                  {item.title}
                </p>
                {item.body && (
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{item.body}</p>
                )}
                <p className="text-[10px] text-text-disabled mt-1.5">{timeAgo(item.createdAt)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { setSidebarMobileOpen, sidebarCollapsed } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch unread count on mount
  useEffect(() => {
    notificationService.list({ limit: 1 }).then((res) => {
      setUnreadCount(res.unread_count ?? 0);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
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
          <div className="hidden sm:block">
            <CommandPalette />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setNotifOpen((o) => !o); if (!notifOpen) setUnreadCount(0); }}
              className="relative group rounded-xl hover:bg-background"
            >
              <Bell className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-0.5 rounded-full bg-error text-white text-[9px] font-bold flex items-center justify-center border-2 border-surface">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </div>

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
