import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import DashboardErrorBoundary from "./error";
import { Sidebar, Header } from "@/components/layout";
import { useUIStore, useAuthStore } from "@/stores";
import { cn } from "@/lib/utils";

export default function DashboardLayout() {
  const { sidebarCollapsed } = useUIStore();
  const { isAuthenticated, token } = useAuthStore();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !token) {
      navigate("/login", { replace: true });
    }
  }, [mounted, isAuthenticated, token, navigate]);

  if (!mounted || !isAuthenticated || !token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div
        className={cn(
          "transition-layout min-h-screen flex flex-col",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <Header />

        <main className="flex-1 mt-16 p-4 lg:p-8 max-w-[1600px] mx-auto w-full">
          <DashboardErrorBoundary>
            <Outlet />
          </DashboardErrorBoundary>
        </main>
      </div>
    </div>
  );
}
