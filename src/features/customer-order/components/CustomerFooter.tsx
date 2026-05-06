import { useEffect, useState } from "react";
import { pubStoreService } from "@/features/customer-order/services/pub-services";
import type { StoreInfo } from "@/features/store-settings/types";

export function CustomerFooter() {
    const [store, setStore] = useState<StoreInfo | null>(null);

    useEffect(() => {
        pubStoreService.my().then((data) => {
            if (data) setStore(data);
        });
    }, []);

    const storeName = store?.name ?? "Toko Kami";
    const storeAddress = store?.address ?? "";
    const storePhone = store?.owner?.phone_number ?? "-";

    return (
        <footer
            className="py-12 px-4"
            style={{
                backgroundColor: '#1C0A00',
                borderTop: '1px solid rgba(245,158,11,0.2)',
            }}
        >
            <div className="container mx-auto max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
                    <div>
                        <h3
                            className="text-lg font-bold mb-3 font-[family-name:var(--font-fraunces)] italic"
                            style={{ color: '#F59E0B' }}
                        >
                            {storeName}
                        </h3>
                        {storeAddress && (
                            <p className="text-sm max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                                {storeAddress}
                            </p>
                        )}
                    </div>
                    <div className="md:text-right">
                        <h4 className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Hubungi Kami
                        </h4>
                        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{storePhone}</p>
                    </div>
                </div>
                <div className="pt-8 text-center" style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
                    <p className="text-xs tracking-wider uppercase font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        &copy; {new Date().getFullYear()} Kodeka POS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
