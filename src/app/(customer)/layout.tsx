import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "@/features/customer-order/components/CustomerNavbar";
import { CustomerFooter } from "@/features/customer-order/components/CustomerFooter";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-[#F59E0B]/20" style={{ fontFamily: "var(--font-fraunces), sans-serif" }}>
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
