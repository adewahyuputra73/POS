import { useEffect, useState } from "react";
import {
  Phone,
  MapPin,
  Calendar,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Receipt,
  User,
  CreditCard,
  UtensilsCrossed,
} from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { invoiceService } from "../services/invoice-service";
import type { InvoiceOrder, InvoiceStoreInfo } from "../types";

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Tunai",
  CASH: "Tunai",
  qris: "QRIS",
  QRIS: "QRIS",
  transfer: "Transfer Bank",
  TRANSFER: "Transfer Bank",
  edc: "EDC",
  EDC: "EDC",
  ewallet: "E-Wallet",
  E_WALLET: "E-Wallet",
  gofood: "GoFood",
  GOFOOD: "GoFood",
  grabfood: "GrabFood",
  GRABFOOD: "GrabFood",
  shopeefood: "ShopeeFood",
  SHOPEEFOOD: "ShopeeFood",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  DINE_IN: "Makan di Tempat",
  dine_in: "Makan di Tempat",
  TAKEAWAY: "Bawa Pulang",
  takeaway: "Bawa Pulang",
  DELIVERY: "Pesan Antar",
  delivery: "Pesan Antar",
  qr_order: "Pesanan QR",
  QR_ORDER: "Pesanan QR",
};

interface InvoiceViewProps {
  orderId: string;
}

export function InvoiceView({ orderId }: InvoiceViewProps) {
  const [order, setOrder] = useState<InvoiceOrder | null>(null);
  const [store, setStore] = useState<InvoiceStoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const [orderData, storeData] = await Promise.all([
          invoiceService.getOrder(orderId),
          invoiceService.getStore(),
        ]);
        setOrder(orderData);
        setStore(storeData);
      } catch (err: any) {
        console.error("Gagal memuat invoice:", err);
        setError(
          err?.response?.status === 404
            ? "Invoice tidak ditemukan. Pastikan link yang Anda buka sudah benar."
            : "Gagal memuat invoice. Silakan coba lagi."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId]);

  const handlePrint = () => window.print();

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Invoice ${order?.invoiceNumber ?? order?.orderNumber} - ${store?.name ?? "Toko"}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link invoice berhasil disalin!");
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "#FEFAF5" }}
      >
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "#FEF3C7" }}
        >
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#D97706" }} />
        </div>
        <p className="text-sm font-semibold" style={{ color: "#9C7D58" }}>
          Memuat invoice...
        </p>
      </div>
    );
  }

  // ── Error ──
  if (error || !order) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-6 text-center"
        style={{ backgroundColor: "#FEFAF5" }}
      >
        <div
          className="h-20 w-20 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: "#FEE2E2" }}
        >
          <AlertCircle className="h-10 w-10" style={{ color: "#DC2626" }} />
        </div>
        <div>
          <h2
            className="text-xl font-black font-[family-name:var(--font-fraunces)] mb-2"
            style={{ color: "#1C0A00" }}
          >
            Oops!
          </h2>
          <p className="text-sm max-w-sm" style={{ color: "#9C7D58" }}>
            {error ?? "Invoice tidak ditemukan."}
          </p>
        </div>
      </div>
    );
  }

  const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const invoiceLabel = order.invoiceNumber ?? order.orderNumber;
  const isPaid = order.status === "PAID" || order.paymentStatus === "PAID";

  return (
    <div className="min-h-screen pb-12 print:pb-0" style={{ backgroundColor: "#FEFAF5" }}>
      {/* ── Hero Header ── */}
      <div
        className="relative overflow-hidden print:bg-white"
        style={{ backgroundColor: "#1C0A00" }}
      >
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] opacity-30 print:hidden" style={{ backgroundColor: "#D4790A" }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-[60px] opacity-20 print:hidden" style={{ backgroundColor: "#7C2D12" }} />

        <div className="relative container mx-auto px-4 py-8 max-w-2xl">
          {/* Action bar */}
          <div className="flex items-center justify-between mb-6 print:hidden">
            <div className="flex items-center gap-2.5">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
              >
                <Receipt className="h-4.5 w-4.5" style={{ color: "#F59E0B" }} />
              </div>
              <h1
                className="text-base font-black font-[family-name:var(--font-fraunces)]"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Invoice
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: "rgba(245,158,11,0.08)",
                  border: "1.5px solid rgba(245,158,11,0.2)",
                  color: "#F59E0B",
                }}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 active:scale-95"
                style={{
                  backgroundColor: "#F59E0B",
                  color: "#1C0A00",
                  boxShadow: "0 8px 24px rgba(245,158,11,0.28)",
                }}
              >
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </div>
          </div>

          {/* Store info + Invoice number */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                className="text-2xl sm:text-3xl font-black font-[family-name:var(--font-fraunces)] tracking-tight print:text-xl"
                style={{ color: "#F59E0B" }}
              >
                {store?.name ?? "Toko"}
              </h2>
              {store?.address && (
                <p
                  className="text-sm mt-2 flex items-start gap-1.5"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  {store.address}
                </p>
              )}
              {store?.owner?.phone_number && (
                <p
                  className="text-sm mt-1 flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {store.owner.phone_number}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-[10px] font-black uppercase tracking-[0.18em]"
                style={{ color: "rgba(245,158,11,0.5)" }}
              >
                Invoice
              </p>
              <p
                className="text-sm sm:text-base font-black mt-1 leading-tight"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                #{invoiceLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl -mt-1">
        {/* ── Invoice Card ── */}
        <div
          className="rounded-[22px] overflow-hidden print:shadow-none print:border-none print:rounded-none"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1.5px solid rgba(124,74,30,0.1)",
            boxShadow: "0 2px 12px rgba(28,10,0,0.04)",
          }}
        >
          {/* ── Meta Grid ── */}
          <div className="px-6 sm:px-8 py-5" style={{ backgroundColor: "#FFF8EE" }}>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "#9C7D58" }}
                >
                  Tanggal
                </p>
                <p
                  className="text-sm font-bold flex items-center gap-1.5"
                  style={{ color: "#1C0A00" }}
                >
                  <Calendar className="h-3.5 w-3.5 shrink-0 print:hidden" style={{ color: "#D97706" }} />
                  {formatDateTime(order.orderDate)}
                </p>
              </div>
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "#9C7D58" }}
                >
                  Pembayaran
                </p>
                <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#1C0A00" }}>
                  <CreditCard className="h-3.5 w-3.5 shrink-0 print:hidden" style={{ color: "#D97706" }} />
                  {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </p>
              </div>
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "#9C7D58" }}
                >
                  Pelanggan
                </p>
                <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#1C0A00" }}>
                  <User className="h-3.5 w-3.5 shrink-0 print:hidden" style={{ color: "#D97706" }} />
                  {order.customerName}
                </p>
                {order.customerPhone !== "-" && (
                  <p className="text-xs mt-0.5 ml-5" style={{ color: "#9C7D58" }}>
                    {order.customerPhone}
                  </p>
                )}
              </div>
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mb-1"
                  style={{ color: "#9C7D58" }}
                >
                  Tipe Pesanan
                </p>
                <p className="text-sm font-bold flex items-center gap-1.5" style={{ color: "#1C0A00" }}>
                  <UtensilsCrossed className="h-3.5 w-3.5 shrink-0 print:hidden" style={{ color: "#D97706" }} />
                  {ORDER_TYPE_LABELS[order.fulfillmentType] ?? order.fulfillmentType}
                </p>
              </div>
            </div>
          </div>

          {/* ── Items ── */}
          <div className="px-6 sm:px-8 py-6">
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <ShoppingBag className="h-3.5 w-3.5" style={{ color: "#D97706" }} />
              </div>
              <h3
                className="text-[13px] font-black uppercase tracking-wider"
                style={{ color: "#1C0A00" }}
              >
                Detail Pesanan
              </h3>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
              >
                {totalQty} item
              </span>
            </div>

            {/* Table Header */}
            <div
              className="grid grid-cols-[1fr_auto_auto] gap-x-4 pb-3 text-[10px] font-black uppercase tracking-[0.15em]"
              style={{
                color: "#9C7D58",
                borderBottom: "1.5px solid rgba(124,74,30,0.1)",
              }}
            >
              <span>Produk</span>
              <span className="text-center w-12">Qty</span>
              <span className="text-right w-24">Subtotal</span>
            </div>

            {/* Items */}
            <div>
              {order.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-3.5 items-start"
                  style={{
                    borderBottom:
                      idx < order.items.length - 1
                        ? "1px solid rgba(124,74,30,0.08)"
                        : "none",
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "#1C0A00" }}>
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-xs" style={{ color: "#9C7D58" }}>
                        {item.variantName}
                      </p>
                    )}
                    <p className="text-xs mt-0.5" style={{ color: "#9C7D58" }}>
                      {formatCurrency(item.price)}
                      {item.discount > 0 && (
                        <span className="ml-1.5" style={{ color: "#DC2626" }}>
                          -{formatCurrency(item.discount)}
                        </span>
                      )}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] italic mt-0.5" style={{ color: "#D97706" }}>
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <span
                    className="text-sm font-bold text-center w-12"
                    style={{ color: "#6B4C2A" }}
                  >
                    {item.quantity}x
                  </span>
                  <span
                    className="text-sm font-black text-right w-24"
                    style={{ color: "#1C0A00" }}
                  >
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Totals ── */}
          <div
            className="px-6 sm:px-8 py-5 space-y-2.5"
            style={{
              backgroundColor: "#FFF8EE",
              borderTop: "1.5px solid rgba(124,74,30,0.1)",
            }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: "#9C7D58" }}>Subtotal</span>
              <span className="font-bold" style={{ color: "#1C0A00" }}>
                {formatCurrency(order.subtotal)}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9C7D58" }}>Diskon</span>
                <span className="font-bold" style={{ color: "#DC2626" }}>
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}

            {order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9C7D58" }}>
                  {store?.tax_name ?? "Pajak"}
                  {store?.tax_rate ? ` (${store.tax_rate}%)` : ""}
                </span>
                <span className="font-bold" style={{ color: "#1C0A00" }}>
                  {formatCurrency(order.tax)}
                </span>
              </div>
            )}

            {order.serviceFee > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9C7D58" }}>Service Fee</span>
                <span className="font-bold" style={{ color: "#1C0A00" }}>
                  {formatCurrency(order.serviceFee)}
                </span>
              </div>
            )}

            {order.additionalFee > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9C7D58" }}>Biaya Tambahan</span>
                <span className="font-bold" style={{ color: "#1C0A00" }}>
                  {formatCurrency(order.additionalFee)}
                </span>
              </div>
            )}

            {order.shippingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9C7D58" }}>Ongkos Kirim</span>
                <span className="font-bold" style={{ color: "#1C0A00" }}>
                  {formatCurrency(order.shippingFee)}
                </span>
              </div>
            )}

            {order.rounding !== 0 && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "#9C7D58" }}>Pembulatan</span>
                <span
                  className="font-bold"
                  style={{ color: order.rounding < 0 ? "#DC2626" : "#1C0A00" }}
                >
                  {order.rounding < 0 ? "-" : ""}
                  {formatCurrency(Math.abs(order.rounding))}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div
              className="flex justify-between items-center pt-3"
              style={{ borderTop: "1.5px solid rgba(124,74,30,0.12)" }}
            >
              <span className="text-sm font-black uppercase tracking-wider" style={{ color: "#1C0A00" }}>
                Total
              </span>
              <span className="text-2xl font-black" style={{ color: "#F59E0B" }}>
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
          </div>

          {/* ── Payment Status + Footer ── */}
          <div
            className="px-6 sm:px-8 py-5 text-center"
            style={{ borderTop: "1.5px solid rgba(124,74,30,0.1)" }}
          >
            {/* Status badge */}
            {isPaid ? (
              <div className="mb-3">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black"
                  style={{ backgroundColor: "#ECFDF5", color: "#059669" }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Pembayaran Lunas
                </div>
                {order.paidAt && (
                  <p className="text-[11px] mt-1.5" style={{ color: "#9C7D58" }}>
                    Dibayar pada {formatDateTime(order.paidAt)}
                  </p>
                )}
              </div>
            ) : (
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-black mb-3"
                style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
              >
                <Clock className="h-4 w-4" />
                Belum Dibayar
              </div>
            )}

            {order.cashierName !== "-" && (
              <p className="text-xs font-medium" style={{ color: "#9C7D58" }}>
                Kasir: {order.cashierName}
              </p>
            )}
            {store?.tax_id_number && (
              <p className="text-xs mt-1" style={{ color: "#9C7D58" }}>
                NPWP: {store.tax_id_number}
              </p>
            )}

            {/* Thank you */}
            <div
              className="mt-4 pt-4"
              style={{ borderTop: "1.5px dashed rgba(124,74,30,0.12)" }}
            >
              <p className="text-xs font-bold" style={{ color: "#6B4C2A" }}>
                Terima kasih atas kunjungan Anda!
              </p>
              <p className="text-[10px] mt-1" style={{ color: "#9C7D58" }}>
                Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan.
              </p>
            </div>
          </div>
        </div>

        {/* ── Branding (print:hidden) ── */}
        <div className="text-center mt-6 print:hidden">
          <p
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "rgba(124,74,30,0.3)" }}
          >
            Powered by <span style={{ color: "rgba(124,74,30,0.5)" }}>Kodeka POS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
