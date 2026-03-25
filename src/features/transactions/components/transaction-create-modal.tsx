"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Plus, Minus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { Button, useToast } from "@/components/ui";
import { orderService } from "@/features/orders/services/order-service";
import { productService } from "@/features/products/services/product-service";
import { tableService } from "@/features/tables/services/table-service";
import type { CheckoutRequest, OrderType, PaymentMethod } from "@/features/orders/types";
import type { Product } from "@/features/products/types";
import type { Table } from "@/features/tables/types";
import { formatCurrency } from "@/lib/utils/format";

interface CartItem {
  product: Product;
  qty: number;
  notes: string;
}

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const ORDER_TYPES: { value: OrderType; label: string }[] = [
  { value: "DINE_IN", label: "Dine In" },
  { value: "TAKEAWAY", label: "Takeaway" },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Tunai" },
  { value: "TRANSFER", label: "Transfer" },
  { value: "QRIS", label: "QRIS" },
];

export function TransactionCreateModal({ onClose, onSuccess }: Props) {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");
  const [tableId, setTableId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [cashGiven, setCashGiven] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductList, setShowProductList] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [prods, tbls] = await Promise.all([
          productService.list(),
          tableService.list().catch(() => [] as Table[]),
        ]);
        setProducts(prods.filter((p) => p.isActive));
        setTables(tbls);
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products.slice(0, 20);
    const q = productSearch.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [products, productSearch]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [cart]
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1, notes: "" }];
    });
    setProductSearch("");
    setShowProductList(false);
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function updateNotes(productId: string, notes: string) {
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, notes } : i))
    );
  }

  async function handleSubmit() {
    if (cart.length === 0) {
      showToast("Tambahkan minimal 1 produk", "error");
      return;
    }
    if (orderType === "DINE_IN" && !tableId) {
      showToast("Pilih meja terlebih dahulu", "error");
      return;
    }

    const payload: CheckoutRequest = {
      order_type: orderType,
      table_id: orderType === "DINE_IN" ? tableId : undefined,
      items: cart.map((i) => ({
        product_id: i.product.id,
        qty: i.qty,
        notes: i.notes || undefined,
      })),
      payment_method: paymentMethod,
      cash_given: paymentMethod === "CASH" && cashGiven ? Number(cashGiven) : undefined,
    };

    try {
      setSubmitting(true);
      await orderService.checkout(payload);
      showToast("Transaksi berhasil dibuat", "success");
      onSuccess();
    } catch {
      showToast("Gagal membuat transaksi", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Tambah Transaksi</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loadingData ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-7 w-7 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
            {/* Order Type */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Tipe Pesanan</label>
              <div className="flex gap-2">
                {ORDER_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setOrderType(t.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      orderType === t.value
                        ? "bg-primary text-white border-primary"
                        : "border-border text-text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table (DINE_IN only) */}
            {orderType === "DINE_IN" && (
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Meja</label>
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
                >
                  <option value="">-- Pilih Meja --</option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.area?.name ? `(${t.area.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Search */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Tambah Produk</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => { setProductSearch(e.target.value); setShowProductList(true); }}
                  onFocus={() => setShowProductList(true)}
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {showProductList && (
                  <div className="absolute z-10 top-full mt-1 w-full bg-surface border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-text-secondary">Produk tidak ditemukan</p>
                    ) : (
                      filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => addToCart(p)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 text-left"
                        >
                          <span className="text-sm text-text-primary">{p.name}</span>
                          <span className="text-sm font-medium text-primary">{formatCurrency(p.price)}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cart */}
            {cart.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">Item Pesanan</label>
                {cart.map((item) => (
                  <div key={item.product.id} className="border border-border rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-text-primary flex-1">{item.product.name}</span>
                      <span className="text-sm text-text-secondary">{formatCurrency(item.product.price * item.qty)}</span>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-error hover:text-error/80">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 border border-border rounded-lg">
                        <button onClick={() => updateQty(item.product.id, -1)} className="px-2 py-1 hover:bg-muted rounded-l-lg">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, 1)} className="px-2 py-1 hover:bg-muted rounded-r-lg">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={item.notes}
                        onChange={(e) => updateNotes(item.product.id, e.target.value)}
                        placeholder="Catatan (opsional)"
                        className="flex-1 text-xs border border-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">Metode Pembayaran</label>
              <div className="flex gap-2">
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPaymentMethod(m.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      paymentMethod === m.value
                        ? "bg-primary text-white border-primary"
                        : "border-border text-text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cash Given */}
            {paymentMethod === "CASH" && (
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Uang Diberikan <span className="text-text-secondary font-normal">(opsional)</span>
                </label>
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  placeholder="Nominal uang tunai"
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                {cashGiven && Number(cashGiven) >= total && total > 0 && (
                  <p className="text-xs text-success mt-1">
                    Kembalian: {formatCurrency(Number(cashGiven) - total)}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          <div>
            {cart.length > 0 && (
              <div>
                <p className="text-xs text-text-secondary">{cart.reduce((s, i) => s + i.qty, 0)} item</p>
                <p className="text-base font-bold text-text-primary">{formatCurrency(total)}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={submitting}>Batal</Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || cart.length === 0}
              className="gap-1.5"
            >
              {submitting ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <ShoppingBag className="h-4 w-4" />
              )}
              Buat Transaksi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
