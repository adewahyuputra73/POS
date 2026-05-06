import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  StoreInfo,
  OperatingHours,
  PaymentMethodConfig,
} from "@/features/store-settings/types";

interface StoreSettingsState {
  storeInfo: StoreInfo | null;
  operatingHours: OperatingHours[];
  paymentMethods: PaymentMethodConfig[];

  updateStoreInfo: (data: Partial<StoreInfo>) => void;
  updateOperatingHours: (data: OperatingHours[]) => void;
  updatePaymentMethods: (data: PaymentMethodConfig[]) => void;
  resetAll: () => void;
}

const DEFAULT_STATE = {
  storeInfo: null,
  operatingHours: [] as OperatingHours[],
  paymentMethods: [] as PaymentMethodConfig[],
};

export const useStoreSettingsStore = create<StoreSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      updateStoreInfo: (data) =>
        set((state) => ({
          storeInfo: state.storeInfo
            ? { ...state.storeInfo, ...data }
            : (data as StoreInfo),
        })),
      updateOperatingHours: (data) => set({ operatingHours: data }),
      updatePaymentMethods: (data) => set({ paymentMethods: data }),
      resetAll: () => set(DEFAULT_STATE),
    }),
    {
      name: "kodeone-pos-store-settings",
    }
  )
);
