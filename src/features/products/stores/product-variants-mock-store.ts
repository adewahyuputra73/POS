/**
 * Per-product variants mock store.
 *
 * The Golang backend isn't ready yet, so per-product variant CRUD is
 * persisted client-side via Zustand + localStorage. When the BE is live,
 * swap the in-memory mutators with API calls (productService.variants.*).
 *
 * Storage key: kodeka-pos-product-variants-mock
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Variant, VariantFormData, VariantOption } from "../types";

interface ProductVariantsState {
  /** variantsByProduct[productId] = Variant[] (mock, persisted in localStorage) */
  variantsByProduct: Record<string, Variant[]>;

  // selectors / mutators
  getByProduct: (productId: string) => Variant[];
  add: (productId: string, data: VariantFormData) => Variant;
  update: (productId: string, variantId: number, data: VariantFormData) => void;
  remove: (productId: string, variantId: number) => void;
  clear: (productId: string) => void;
}

// ID generator that's stable across the session (doesn't reset on every call)
let __idSeq = Math.floor(Date.now() / 1000);
const nextId = () => ++__idSeq;

const buildOptions = (data: VariantFormData): VariantOption[] =>
  data.options.map((o, i) => ({
    id: o.id ?? nextId() + i,
    name: o.name,
    price: o.price,
    channelPrices: [
      { channel: "gofood", price: o.channelPrices.gofood },
      { channel: "grabfood", price: o.channelPrices.grabfood },
      { channel: "shopeefood", price: o.channelPrices.shopeefood },
    ],
    useStock: o.useStock,
    stockQuantity: o.stockQuantity,
    isActive: o.isActive,
    sourceProductId: o.sourceProductId,
  }));

export const useProductVariantsMockStore = create<ProductVariantsState>()(
  persist(
    (set, get) => ({
      variantsByProduct: {},

      getByProduct: (productId) => get().variantsByProduct[productId] ?? [],

      add: (productId, data) => {
        const now = new Date().toISOString();
        const variant: Variant = {
          id: nextId(),
          name: data.name,
          isRequired: data.isRequired,
          maxOptions: data.maxOptions ?? undefined,
          sourceType: data.sourceType,
          options: buildOptions(data),
          appliedProductCount: 1,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({
          variantsByProduct: {
            ...s.variantsByProduct,
            [productId]: [...(s.variantsByProduct[productId] ?? []), variant],
          },
        }));
        return variant;
      },

      update: (productId, variantId, data) => {
        set((s) => {
          const current = s.variantsByProduct[productId] ?? [];
          return {
            variantsByProduct: {
              ...s.variantsByProduct,
              [productId]: current.map((v) =>
                v.id !== variantId
                  ? v
                  : {
                      ...v,
                      name: data.name,
                      isRequired: data.isRequired,
                      maxOptions: data.maxOptions ?? undefined,
                      sourceType: data.sourceType,
                      options: buildOptions(data),
                      updatedAt: new Date().toISOString(),
                    }
              ),
            },
          };
        });
      },

      remove: (productId, variantId) => {
        set((s) => ({
          variantsByProduct: {
            ...s.variantsByProduct,
            [productId]: (s.variantsByProduct[productId] ?? []).filter(
              (v) => v.id !== variantId
            ),
          },
        }));
      },

      clear: (productId) => {
        set((s) => {
          const next = { ...s.variantsByProduct };
          delete next[productId];
          return { variantsByProduct: next };
        });
      },
    }),
    { name: "kodeka-pos-product-variants-mock" }
  )
);
