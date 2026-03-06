import { mockStoreInfo } from "@/features/store-settings/mock-data";

export function CustomerFooter() {
    return (
        <footer className="bg-surface border-t border-divider py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-text-primary mb-4">{mockStoreInfo.name}</h3>
                        <p className="text-text-secondary text-sm max-w-md leading-relaxed">
                            {mockStoreInfo.address}
                        </p>
                    </div>
                    <div className="md:text-right">
                        <h4 className="text-sm font-bold text-text-primary mb-2">Hubungi Kami</h4>
                        <p className="text-text-secondary text-sm">{mockStoreInfo.phone}</p>
                        <p className="text-text-secondary text-sm">{mockStoreInfo.email}</p>
                    </div>
                </div>
                <div className="pt-8 border-t border-divider text-center">
                    <p className="text-text-disabled text-xs tracking-wider uppercase font-bold">
                        &copy; {new Date().getFullYear()} Fere POS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
