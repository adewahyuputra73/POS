/**
 * ProductVariantsSection
 * --------------------------------------
 * UI for managing variants attached to ONE specific product (per-product
 * variant CRUD), as opposed to the global variant pool.
 *
 * Data is mocked client-side via `useProductVariantsMockStore` while the
 * Golang backend is being built. Drop-in replace mutators with API calls
 * once the endpoints exist.
 */
import { useState } from "react";
import { Plus, Pencil, Trash2, Layers, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { VariantModal } from "./variant-modal";
import { useProductVariantsMockStore } from "../stores/product-variants-mock-store";
import type { Variant, VariantFormData } from "../types";

// Stable empty array reference — DO NOT inline `[]` inside selectors.
// Returning a fresh array each render makes Zustand/React's
// useSyncExternalStore think the snapshot changed every render, which
// triggers an infinite re-render loop ("Maximum update depth exceeded").
const EMPTY_VARIANTS: Variant[] = [];

interface ProductVariantsSectionProps {
  /** Product ID. Pass `null` if the product hasn't been saved yet. */
  productId: string | null;
}

export function ProductVariantsSection({ productId }: ProductVariantsSectionProps) {
  // Select only the slot for this product. Returns the existing array
  // reference (stable across renders) or undefined; we coalesce to a
  // module-level constant so the result reference is stable too.
  const variantsForProduct = useProductVariantsMockStore((s) =>
    productId ? s.variantsByProduct[productId] : undefined
  );
  const variants: Variant[] = variantsForProduct ?? EMPTY_VARIANTS;

  const add = useProductVariantsMockStore((s) => s.add);
  const update = useProductVariantsMockStore((s) => s.update);
  const remove = useProductVariantsMockStore((s) => s.remove);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Variant | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Variant | null>(null);

  // For unsaved products, ask user to save first.
  if (!productId) {
    return (
      <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-light border border-warning/30">
        <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-text-primary">Simpan produk dulu</p>
          <p className="text-text-secondary">
            Varian khusus produk hanya bisa ditambahkan setelah produk berhasil disimpan.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = (data: VariantFormData, variantId?: number) => {
    if (variantId) update(productId, variantId, data);
    else add(productId, data);
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Layers className="h-4 w-4 text-brand-500 shrink-0" />
          <span className="text-sm font-medium text-text-primary truncate">
            Varian Khusus Produk Ini
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-500 font-semibold">
            {variants.length}
          </span>
        </div>
        <Button
          size="sm"
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Tambah Varian
        </Button>
      </div>

      <p className="text-xs text-text-secondary -mt-1">
        Varian di sini berlaku <strong>hanya untuk produk ini</strong>. Untuk varian
        yang dipakai banyak produk, pakai pool global di bawah.
      </p>

      {/* Empty state */}
      {variants.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-8 text-center bg-background/40">
          <Layers className="h-8 w-8 mx-auto mb-2 text-text-disabled" />
          <p className="text-sm text-text-secondary">
            Belum ada varian khusus untuk produk ini.
          </p>
          <p className="text-xs text-text-disabled mt-1">
            Klik <span className="font-semibold text-brand-500">Tambah Varian</span>{" "}
            untuk membuat varian baru.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((v) => {
            const minPrice =
              v.options.length > 0
                ? Math.min(...v.options.map((o) => o.price))
                : 0;
            const maxPrice =
              v.options.length > 0
                ? Math.max(...v.options.map((o) => o.price))
                : 0;
            return (
              <div
                key={v.id}
                className="flex items-start justify-between gap-3 p-3 border border-border rounded-lg hover:border-brand-500/50 transition-colors bg-background/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-text-primary truncate">
                      {v.name}
                    </p>
                    {v.isRequired && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-error-light text-error font-bold uppercase tracking-wider">
                        Wajib
                      </span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-background text-text-secondary uppercase font-bold tracking-wider">
                      {v.sourceType === "custom" ? "Custom" : "Dari Produk"}
                    </span>
                    {v.maxOptions && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-background text-text-secondary uppercase font-bold tracking-wider">
                        Max {v.maxOptions}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {v.options.length} opsi
                    {v.options.length > 0 && (
                      <>
                        {" "}
                        •{" "}
                        {minPrice === maxPrice
                          ? formatCurrency(minPrice)
                          : `${formatCurrency(minPrice)} – ${formatCurrency(maxPrice)}`}
                      </>
                    )}
                  </p>
                  {v.options.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {v.options.slice(0, 5).map((o) => (
                        <span
                          key={o.id}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20"
                        >
                          {o.name}
                        </span>
                      ))}
                      {v.options.length > 5 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-background text-text-secondary">
                          +{v.options.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(v);
                      setModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-brand-500 transition-colors"
                    title="Ubah"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(v)}
                    className="p-2 rounded-lg hover:bg-error-light text-text-secondary hover:text-error transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Variant create/edit modal (reuses existing global VariantModal) */}
      <VariantModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        variant={editing}
      />

      {/* Delete confirmation */}
      {pendingDelete && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={() => setPendingDelete(null)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-text-primary mb-2">
                Hapus Varian?
              </h3>
              <p className="text-text-secondary mb-6">
                Hapus varian <strong>{pendingDelete.name}</strong> dari produk ini?
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setPendingDelete(null)}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  className="bg-error hover:bg-error/90"
                  onClick={() => {
                    remove(productId, pendingDelete.id);
                    setPendingDelete(null);
                  }}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
