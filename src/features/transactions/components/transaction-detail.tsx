"use client";

import { useState } from "react";
import { formatCurrency, formatDateTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Order,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VARIANT,
  PAYMENT_METHOD_LABELS,
  FULFILLMENT_TYPE_LABELS,
} from "../types";
import {
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  MessageSquare,
  FileText,
  Truck,
  CreditCard,
  Calendar,
  Clock,
  Package,
  CheckCircle2,
} from "lucide-react";

interface TransactionDetailProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus?: (orderId: string | number, status: string) => Promise<void>;
  onPay?: (order: Order) => void;
}

const STATUS_FLOW = [
  { value: "PROCESSING", label: "Diproses" },
  { value: "READY",      label: "Siap" },
  { value: "DELIVERED",  label: "Dikirim" },
  { value: "COMPLETED",  label: "Selesai" },
];

const STATUS_NEXT_ACTION: Record<string, { label: string; next: string; variant: "default" | "primary" | "outline" }> = {
  PROCESSING: { label: "Tandai Siap",    next: "READY",     variant: "default" },
  READY:      { label: "Tandai Dikirim", next: "DELIVERED", variant: "default" },
  DELIVERED:  { label: "Tandai Selesai", next: "COMPLETED", variant: "default" },
};

export function TransactionDetail({ order, onBack, onUpdateStatus, onPay }: TransactionDetailProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const nextAction = STATUS_NEXT_ACTION[order.fulfillmentStatus ?? ""] ?? null;
  const currentStepIdx = STATUS_FLOW.findIndex((s) => s.value === order.fulfillmentStatus);

  const handleStatusAction = async () => {
    if (!nextAction || !onUpdateStatus) return;
    setIsUpdating(true);
    await onUpdateStatus(order.id, nextAction.next);
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Transaksi
      </button>

      {/* Header */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-text-primary">
                {order.orderNumber}
              </h2>
              <Badge
                variant={ORDER_STATUS_VARIANT[order.status]}
                className="uppercase tracking-wider"
              >
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDateTime(order.orderDate)}
              </span>
              {order.completedAt && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  Selesai: {formatDateTime(order.completedAt)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Total</p>
            <p className="text-2xl font-bold text-text-primary">
              {formatCurrency(order.totalPrice)}
            </p>
          </div>
        </div>

        {/* Status progression */}
        {STATUS_FLOW.length > 0 && order.fulfillmentStatus && (
          <div className="mt-5 pt-5 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              {STATUS_FLOW.map((step, idx) => {
                const isDone = idx < currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.value} className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-center gap-1 min-w-0">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          isDone
                            ? "bg-success text-white"
                            : isCurrent
                            ? "bg-primary text-white"
                            : "bg-border text-text-disabled"
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                      </div>
                      <span
                        className={`text-[11px] font-medium text-center leading-none ${
                          isDone
                            ? "text-success"
                            : isCurrent
                            ? "text-primary"
                            : "text-text-disabled"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {idx < STATUS_FLOW.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mb-4 transition-colors ${
                          idx < currentStepIdx ? "bg-success" : "bg-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {nextAction && onUpdateStatus && (
              <div className="flex justify-end">
                <Button
                  onClick={handleStatusAction}
                  isLoading={isUpdating}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  {nextAction.label}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items Table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Daftar Item ({totalQty} item)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-center">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Diskon
                    </th>
                    <th className="px-6 py-3 text-[11px] font-bold text-text-secondary uppercase tracking-wider text-right">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-text-primary">
                          {item.productName}
                        </p>
                        {item.variantName && (
                          <p className="text-xs text-text-secondary mt-0.5">
                            {item.variantName}
                          </p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-warning mt-0.5 italic">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium text-text-primary">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-text-secondary">
                          {formatCurrency(item.price)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm text-error">
                          {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-text-primary">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="px-6 py-4 bg-background border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium text-text-primary">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Diskon</span>
                  <span className="font-medium text-error">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Pajak</span>
                  <span className="font-medium text-text-primary">{formatCurrency(order.tax)}</span>
                </div>
              )}
              {order.serviceFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Service Fee</span>
                  <span className="font-medium text-text-primary">{formatCurrency(order.serviceFee)}</span>
                </div>
              )}
              {order.shippingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Ongkos Kirim</span>
                  <span className="font-medium text-text-primary">{formatCurrency(order.shippingFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-base pt-2 border-t border-divider">
                <span className="font-bold text-text-primary">Total</span>
                <span className="font-bold text-text-primary">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info Cards */}
        <div className="space-y-6">
          {/* Konfirmasi Pembayaran — hanya tampil jika belum bayar */}
          {order.status === "unpaid" && onPay && (
            <div className="bg-success/5 rounded-xl border border-success/20 p-5">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-success" />
                Menunggu Pembayaran
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                Pesanan ini belum dibayar. Konfirmasi setelah customer melakukan pembayaran.
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-secondary">Total Tagihan</span>
                <span className="text-lg font-bold text-text-primary">{formatCurrency(order.totalPrice)}</span>
              </div>
              <Button
                onClick={() => onPay(order)}
                className="w-full gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Konfirmasi Pembayaran
              </Button>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-primary" />
              Informasi Pelanggan
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-secondary">Nama</p>
                <p className="text-sm font-semibold text-text-primary">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">No. Telepon</p>
                <p className="text-sm font-semibold text-text-primary">{order.customerPhone}</p>
              </div>
              {order.address && (
                <div>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Alamat
                  </p>
                  <p className="text-sm text-text-primary mt-0.5">{order.address}</p>
                </div>
              )}
              {order.customerNotes && (
                <div>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> Catatan
                  </p>
                  <p className="text-sm text-text-primary mt-0.5 italic">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Fulfillment */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-primary" />
              Pembayaran & Pemenuhan
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-secondary">Metode Pembayaran</p>
                <Badge variant="default" className="mt-1">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Tipe Pemenuhan</p>
                <p className="text-sm font-semibold text-text-primary mt-0.5">
                  {FULFILLMENT_TYPE_LABELS[order.fulfillmentType]}
                </p>
              </div>
              {order.courierName && (
                <div>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Truck className="h-3 w-3" /> Kurir
                  </p>
                  <p className="text-sm font-semibold text-text-primary mt-0.5">
                    {order.courierName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Operation Info */}
          <div className="bg-surface rounded-xl border border-border p-5">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-primary" />
              Info Operasional
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-secondary">Kasir</p>
                <p className="text-sm font-semibold text-text-primary">{order.cashierName}</p>
              </div>
              {order.shiftName && (
                <div>
                  <p className="text-xs text-text-secondary">Shift</p>
                  <p className="text-sm font-semibold text-text-primary">{order.shiftName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
