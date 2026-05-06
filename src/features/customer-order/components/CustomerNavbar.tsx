import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { useCustomerCartStore } from "@/stores/customer-cart-store";
import { APP_NAME } from "@/lib/constants";

export function CustomerNavbar() {
    const itemCount = useCustomerCartStore((state) => state.getItemCount());
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-divider shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/order" className="flex items-center gap-2 group">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-300" style={{ backgroundColor: '#F8FAFC' }}>
                        <Store className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-[700] tracking-tight text-text-primary font-[family-name:var(--font-fraunces)]">
                            {APP_NAME}
                        </span>
                    </div>
                </Link>

                <Link
                    to="/order/cart"
                    className="relative p-2.5 rounded-full hover:bg-[#0E6B30] text-text-primary hover:text-[#16A34A] transition-all duration-200"
                >
                    <ShoppingCart className="h-6 w-6" />
                    {mounted && itemCount > 0 && (
                        <span className="absolute top-0 right-0 h-5 w-5 bg-error text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                            {itemCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
