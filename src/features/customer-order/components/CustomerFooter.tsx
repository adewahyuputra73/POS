import { mockStoreInfo } from "@/features/store-settings/mock-data";

export function CustomerFooter() {
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
                            {mockStoreInfo.name}
                        </h3>
                        <p className="text-sm max-w-md leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            {mockStoreInfo.address}
                        </p>
                    </div>
                    <div className="md:text-right">
                        <h4 className="text-sm font-bold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            Hubungi Kami
                        </h4>
                        <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{mockStoreInfo.phone}</p>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{mockStoreInfo.email}</p>
                    </div>
                </div>
                <div className="pt-8 text-center" style={{ borderTop: '1px solid rgba(245,158,11,0.12)' }}>
                    <p className="text-xs tracking-wider uppercase font-bold" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        &copy; {new Date().getFullYear()} Fere POS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
