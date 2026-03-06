import { ReactNode } from "react";
import { CustomerNavbar } from "@/features/customer-order/components/CustomerNavbar";
import { CustomerFooter } from "@/features/customer-order/components/CustomerFooter";

interface CustomerLayoutProps {
    children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-primary/20">
            <CustomerNavbar />
            <main className="flex-1">
                {children}
            </main>
            <CustomerFooter />
        </div>
    );
}
