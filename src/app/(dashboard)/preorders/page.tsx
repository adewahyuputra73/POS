import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, Button, Input, Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import {
  Calendar, Clock, Plus, User, Phone, Loader2, X, Trash2,
  UtensilsCrossed, ShoppingBag,
} from "lucide-react";
import { preorderService } from "@/features/preorders";
import type { Preorder, CreatePosPreorderRequest, PreorderItem, PreorderOrderType } from "@/features/preorders";
import { productService } from "@/features/products/services/product-service";
import { tableService } from "@/features/tables/services/table-service";
import type { Product } from "@/features/products/types";
import type { Table } from "@/features/tables/types";
import { formatCurrency } from "@/lib/utils/format";

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatScheduled(iso: string) {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:   { label: "Menunggu",   cls: "bg-warning-light text-warning" },
  confirmed: { label: "Dikonfirmasi", cls: "bg-primary-light text-primary" },
  cancelled: { label: "Dibatalkan", cls: "bg-error-light text-error" },
  done:      { label: "Selesai",    cls: "bg-success-light text-success" },
};

// ── POS Pre-Order Modal ───────────────────────────────────────────────────────

interface PosModalProps {
  products: Product[];
  tables: Table[];
  onClose: () => void;
  onSave: (data: CreatePosPreorderRequest) => Promise<void>;
}

function PosPreorderModal({ products, tables, onClose, onSave }: PosModalProps) {
  const { showToast } = useToast();
  const [orderType, setOrderType] = useState<PreorderOrderType>("DINE_IN");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("");
  const [tableId, setTableId] = useState("");
  const [items, setItems] = useState<{ product_id: string; qty: number; name: string; price: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    const existing = items.find((i) => i.product_id === selectedProductId);
    if (existing) {
      setItems((prev) =>
        prev.map((i) => i.product_id === selectedProductId ? { ...i, qty: i.qty + 1 } : i)
      );
    } else {
      setItems((prev) => [...prev, { product_id: product.id, qty: 1, name: product.name, price: product.price }]);
    }
    setSelectedProductId("");
  };

  const removeItem = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.product_id !== productId));

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeItem(productId); return; }
    setItems((prev) => prev.map((i) => i.product_id === productId ? { ...i, qty } : i));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) { showToast("Pilih tanggal dan waktu jadwal", "error"); return; }
    if (items.length === 0) { showToast("Tambahkan minimal 1 item", "error"); return; }
    setIsSubmitting(true);
    try {
      await onSave({
        order_type: orderType,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        scheduled_at: `${date}T${time}:00`,
        table_id: orderType === "DINE_IN" && tableId ? tableId : undefined,
        items: items.map(({ product_id, qty }) => ({ product_id, qty })),
        payments: [],
      });
      showToast("Pre-order berhasil dibuat", "success");
      onClose();
    } catch {
      showToast("Gagal membuat pre-order", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-xl max-h-[92vh] overflow-y-auto">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">Buat Pre-Order (POS)</h2>
            <button onClick={onClose} className="p-1 hover:bg-background rounded-lg">
              <X className="h-4 w-4 text-text-secondary" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Tipe Pesanan */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Tipe Pesanan</label>
              <div className="flex gap-2">
                {(["DINE_IN", "TAKEAWAY"] as PreorderOrderType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOrderType(t)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors ${
                      orderType === t
                        ? "bg-primary-light border-primary text-primary"
                        : "bg-surface border-border text-text-secondary"
                    }`}
                  >
                    {t === "DINE_IN" ? <UtensilsCrossed className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                    {t === "DINE_IN" ? "Dine-In" : "Takeaway"}
                  </button>
                ))}
              </div>
            </div>

            {/* Pelanggan */}
            <Input
              label="Nama Pelanggan"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nama pelanggan"
              required
            />
            <Input
              label="No. Telepon Pelanggan"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="628xxxxxxxxxx"
              required
            />

            {/* Jadwal */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Tanggal</label>
                <input
                  type="date"
                  min={todayStr()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-surface text-text-primary outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Waktu</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-surface text-text-primary outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Meja — hanya DINE_IN */}
            {orderType === "DINE_IN" && tables.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">Meja (opsional)</label>
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-surface text-text-primary outline-none focus:border-primary"
                >
                  <option value="">-- Pilih meja --</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.area?.name ?? ""})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Tambah Item */}
            <div className="border-t border-divider pt-4">
              <p className="text-sm font-medium text-text-primary mb-2">Item Pesanan</p>
              <div className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-border px-3 text-sm bg-surface text-text-primary outline-none focus:border-primary"
                >
                  <option value="">-- Pilih produk --</option>
                  {products.filter((p) => p.isActive).map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — {formatCurrency(p.price)}</option>
                  ))}
                </select>
                <Button type="button" onClick={addItem} disabled={!selectedProductId} size="sm">
                  <Plus className="h-4 w-4" />
                  Tambah
                </Button>
              </div>

              {items.length > 0 && (
                <div className="mt-3 space-y-2">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-3 p-2.5 rounded-xl bg-background">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-xs text-text-secondary">{formatCurrency(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.product_id, item.qty - 1)}
                          className="h-6 w-6 rounded-lg border border-border text-sm font-bold flex items-center justify-center hover:bg-surface"
                        >−</button>
                        <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.product_id, item.qty + 1)}
                          className="h-6 w-6 rounded-lg border border-border text-sm font-bold flex items-center justify-center hover:bg-surface"
                        >+</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.product_id)}>
                        <Trash2 className="h-4 w-4 text-error" />
                      </button>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-divider">
                    <span className="text-sm font-semibold text-text-secondary">Total</span>
                    <span className="text-sm font-bold text-text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
              <Button type="submit" isLoading={isSubmitting}>
                <Calendar className="h-4 w-4" />
                Buat Pre-Order
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PreordersPage() {
  const { showToast } = useToast();
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadPreorders = useCallback(async () => {
    try {
      const data = await preorderService.list();
      setPreorders(data);
    } catch {
      showToast("Gagal memuat data pre-order", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPreorders();
    // Muat produk & meja untuk modal
    productService.list().then((res) => setProducts(res)).catch(() => {});
    tableService.list().then((res) => setTables(res)).catch(() => {});
  }, [loadPreorders]);

  const handleCreate = async (data: CreatePosPreorderRequest) => {
    await preorderService.createPos(data);
    await loadPreorders();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pre-Order"
        description="Kelola pemesanan terjadwal dari pelanggan"
        breadcrumbs={[{ label: "Pre-Order" }]}
        actions={
          <Button onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
            Buat Pre-Order
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : preorders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-12 w-12 text-text-disabled mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Belum ada pre-order.</p>
            <Button className="mt-4" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" />
              Buat Pre-Order Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {preorders.map((po) => {
            const statusInfo = STATUS_LABELS[po.status] ?? { label: po.status, cls: "bg-background text-text-secondary" };
            const name = po.customer_name ?? po.name ?? "—";
            const phone = po.customer_phone ?? po.phone ?? "—";
            return (
              <Card key={po.id}>
                <CardContent className="pt-5 pb-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{name}</p>
                      {po.order_number && (
                        <p className="text-xs text-text-secondary mt-0.5">#{po.order_number}</p>
                      )}
                    </div>
                    <Badge className={`text-xs ${statusInfo.cls}`}>{statusInfo.label}</Badge>
                  </div>

                  <div className="space-y-1 text-xs text-text-secondary">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{formatScheduled(po.scheduled_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {po.order_type === "DINE_IN"
                        ? <UtensilsCrossed className="h-3.5 w-3.5 flex-shrink-0" />
                        : <ShoppingBag className="h-3.5 w-3.5 flex-shrink-0" />}
                      <span>{po.order_type === "DINE_IN" ? "Dine-In" : "Takeaway"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showModal && (
        <PosPreorderModal
          products={products}
          tables={tables}
          onClose={() => setShowModal(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}
