import { ReactNode } from "react";
import { Fraunces } from "next/font/google";
import { CustomerNavbar } from "@/features/customer-order/components/CustomerNavbar";
import { CustomerFooter } from "@/features/customer-order/components/CustomerFooter";

const fraunces = Fraunces({
    subsets: ["latin"],
    axes: ["WONK"],
    weight: "variable",
    variable: "--font-fraunces",
    display: "swap",
});

interface CustomerLayoutProps {
    children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
    return (
        <div className={`min-h-screen flex flex-col bg-background font-sans selection:bg-[#F59E0B]/20 ${fraunces.variable}`}>
            <CustomerNavbar />
            <main className="flex-1">
                {children}
            </main>
            <CustomerFooter />
        </div>
    );
}
