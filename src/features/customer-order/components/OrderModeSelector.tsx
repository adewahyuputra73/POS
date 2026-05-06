import { UtensilsCrossed, ShoppingBag, CalendarClock } from "lucide-react";
import type { OrderMode } from "../types";

interface OrderModeSelectorProps {
    onSelect: (mode: OrderMode) => void;
}

const MODES: { mode: OrderMode; label: string; desc: string; icon: React.ElementType }[] = [
    {
        mode: "dine_in",
        label: "Dine-In",
        desc: "Makan di tempat, pilih meja",
        icon: UtensilsCrossed,
    },
    {
        mode: "pre_order",
        label: "Pre-Order",
        desc: "Pesan & ambil langsung",
        icon: ShoppingBag,
    },
    {
        mode: "reservation",
        label: "Reservasi",
        desc: "Pesan meja terlebih dahulu",
        icon: CalendarClock,
    },
];

export function OrderModeSelector({ onSelect }: OrderModeSelectorProps) {
    return (
        <div className="w-full max-w-lg mx-auto space-y-3">
            {MODES.map(({ mode, label, desc, icon: Icon }) => (
                <button
                    key={mode}
                    onClick={() => onSelect(mode)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] group"
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "rgba(124,74,30,0.15)",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "#F59E0B";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,158,11,0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(124,74,30,0.15)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ backgroundColor: "#FEF3C7" }}
                    >
                        <Icon className="h-5 w-5" style={{ color: "#92400E" }} />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-sm font-black tracking-tight" style={{ color: "#1C0A00" }}>
                            {label}
                        </p>
                        <p className="text-xs font-medium mt-0.5" style={{ color: "#9C7D58" }}>
                            {desc}
                        </p>
                    </div>
                    <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                        style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </button>
            ))}
        </div>
    );
}
