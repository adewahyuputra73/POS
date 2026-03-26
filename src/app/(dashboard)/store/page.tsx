"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Store, Clock, Receipt, CreditCard } from "lucide-react";
import {
  StoreInfoForm,
  OperatingHoursForm,
  TaxReceiptSettingsForm,
  PaymentMethodsConfig,
} from "@/features/store-settings/components";
import { useStoreSettingsStore } from "@/stores/storeSettingsStore";
import { storeSettingsService } from "@/features/store-settings/services/store-settings-service";
import type {
  UpdateStoreRequest,
  OperatingHours,
  TaxSettings,
  ReceiptSettings as ReceiptSettingsType,
  PaymentMethodConfig,
} from "@/features/store-settings";

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = useState("store-info");
  const [loadingStore, setLoadingStore] = useState(true);

  const storeInfo = useStoreSettingsStore((s) => s.storeInfo);
  const operatingHours = useStoreSettingsStore((s) => s.operatingHours);
  const taxSettings = useStoreSettingsStore((s) => s.taxSettings);
  const receiptSettings = useStoreSettingsStore((s) => s.receiptSettings);
  const paymentMethods = useStoreSettingsStore((s) => s.paymentMethods);

  const updateStoreInfo = useStoreSettingsStore((s) => s.updateStoreInfo);
  const updateOperatingHours = useStoreSettingsStore((s) => s.updateOperatingHours);
  const updateTaxSettings = useStoreSettingsStore((s) => s.updateTaxSettings);
  const updateReceiptSettings = useStoreSettingsStore((s) => s.updateReceiptSettings);
  const updatePaymentMethods = useStoreSettingsStore((s) => s.updatePaymentMethods);

  // Load real store data from API on mount
  useEffect(() => {
    storeSettingsService.my()
      .then((data) => updateStoreInfo(data))
      .catch(() => {}) // keep existing Zustand data if API fails
      .finally(() => setLoadingStore(false));
  }, [updateStoreInfo]);

  // Save name + address to API, then update Zustand
  const handleSaveStoreInfo = async (data: UpdateStoreRequest) => {
    await storeSettingsService.update(data);
    updateStoreInfo(data);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Settings"
        description="Kelola pengaturan dan konfigurasi toko Anda"
        breadcrumbs={[{ label: "Pengaturan" }, { label: "Store Settings" }]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="store-info">
            <Store className="h-4 w-4" />
            Informasi Toko
          </TabsTrigger>
          <TabsTrigger value="operating-hours">
            <Clock className="h-4 w-4" />
            Jam Operasional
          </TabsTrigger>
          <TabsTrigger value="tax-receipt">
            <Receipt className="h-4 w-4" />
            Pajak & Struk
          </TabsTrigger>
          <TabsTrigger value="payment-methods">
            <CreditCard className="h-4 w-4" />
            Pembayaran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store-info">
          {loadingStore ? (
            <div className="flex items-center justify-center h-40">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <StoreInfoForm store={storeInfo} onSave={handleSaveStoreInfo} />
          )}
        </TabsContent>

        <TabsContent value="operating-hours">
          <div className="max-w-3xl">
            <OperatingHoursForm hours={operatingHours} onSave={updateOperatingHours} />
          </div>
        </TabsContent>

        <TabsContent value="tax-receipt">
          <div className="max-w-3xl">
            <TaxReceiptSettingsForm
              taxSettings={taxSettings}
              receiptSettings={receiptSettings}
              onSaveTax={updateTaxSettings}
              onSaveReceipt={updateReceiptSettings}
            />
          </div>
        </TabsContent>

        <TabsContent value="payment-methods">
          <div className="max-w-3xl">
            <PaymentMethodsConfig
              methods={paymentMethods}
              onSave={updatePaymentMethods}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
