import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  StoreInfo,
  OperatingHours,
  TaxSettings,
  ReceiptSettings,
  PaymentMethodConfig,
} from "@/features/store-settings/types";
import {
  mockStoreInfo,
  mockOperatingHours,
  mockTaxSettings,
  mockReceiptSettings,
  mockPaymentMethods,
} from "@/features/store-settings/mock-data";

interface StoreSettingsState {
  // Data
  storeInfo: StoreInfo;
  operatingHours: OperatingHours[];
  taxSettings: TaxSettings;
  receiptSettings: ReceiptSettings;
  paymentMethods: PaymentMethodConfig[];

  // Actions
  updateStoreInfo: (data: Partial<StoreInfo>) => void;
  updateOperatingHours: (data: OperatingHours[]) => void;
  updateTaxSettings: (data: TaxSettings) => void;
  updateReceiptSettings: (data: ReceiptSettings) => void;
  updatePaymentMethods: (data: PaymentMethodConfig[]) => void;
  resetAll: () => void;
}

export const useStoreSettingsStore = create<StoreSettingsState>()(
  persist(
    (set) => ({
      storeInfo: mockStoreInfo,
      operatingHours: mockOperatingHours,
      taxSettings: mockTaxSettings,
      receiptSettings: mockReceiptSettings,
      paymentMethods: mockPaymentMethods,

      updateStoreInfo: (data) =>
        set((state) => ({
          storeInfo: { ...state.storeInfo, ...data },
        })),
      updateOperatingHours: (data) => set({ operatingHours: data }),
      updateTaxSettings: (data) => set({ taxSettings: data }),
      updateReceiptSettings: (data) => set({ receiptSettings: data }),
      updatePaymentMethods: (data) => set({ paymentMethods: data }),
      resetAll: () =>
        set({
          storeInfo: mockStoreInfo,
          operatingHours: mockOperatingHours,
          taxSettings: mockTaxSettings,
          receiptSettings: mockReceiptSettings,
          paymentMethods: mockPaymentMethods,
        }),
    }),
    {
      name: "fere-pos-store-settings",
    }
  )
);
