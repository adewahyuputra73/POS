/**
 * Service untuk data invoice (data real dari API, bukan mock).
 * Menggunakan pubClient → /api/pub/* → Next.js proxy → BE.
 * Halaman invoice customer bersifat publik (tanpa login browser).
 *
 * Endpoint BE yang dipakai:
 * - GET /invoices                       → list semua invoice (dashboard)
 * - GET /invoices/:id                   → detail invoice by invoice_id
 * - GET /invoices/order/:orderId        → detail invoice by order_id (halaman invoice customer)
 * - GET /orders/:id                     → detail order (items, customer, kasir)
 * - GET /stores/my                      → info toko untuk header invoice
 */
import pubClient from "@/lib/api/pub-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Invoice,
  InvoiceListParams,
  InvoiceListResult,
  InvoiceOrder,
  InvoiceStoreInfo,
} from "../types";

/** Map raw BE invoice record → Invoice */
function mapInvoice(raw: any): Invoice {
  return {
    id: raw.id,
    orderId: raw.order_id,
    orderNumber: raw.order?.order_number ?? "-",
    orderType: raw.order?.order_type ?? "-",
    invoiceNumber: raw.invoice_number ?? "-",
    subtotal: Number(raw.subtotal ?? 0),
    discount: Number(raw.discount ?? 0),
    tax: Number(raw.tax ?? 0),
    serviceFee: Number(raw.service_fee ?? 0),
    additionalFee: Number(raw.additional_fee ?? 0),
    deliveryFee: Number(raw.delivery_fee ?? 0),
    rounding: Number(raw.rounding ?? 0),
    totalAmount: Number(raw.total_amount ?? 0),
    status: raw.status ?? "-",
    paidAt: raw.paid_at ?? undefined,
    isVoid: Boolean(raw.is_void),
    createdAt: raw.createdAt ?? raw.created_at ?? "",
    payments: raw.order?.payments ?? [],
  };
}

/**
 * Gabungkan data order (items, customer, kasir) dengan data invoice
 * (invoice_number, rounding, additional_fee, status, paid_at) → InvoiceOrder.
 */
function mergeOrderWithInvoice(orderData: any, invoiceData: any | null): InvoiceOrder {
  const embeddedInvoice = orderData?.invoice ?? null;
  const invoice = invoiceData ?? embeddedInvoice;
  const customer = orderData?.customer;
  const kasir = orderData?.kasirDetail;

  return {
    id: orderData.id,
    orderNumber: orderData.order_number ?? "-",
    invoiceId: invoice?.id ?? undefined,
    invoiceNumber: invoice?.invoice_number ?? undefined,
    customerName: customer?.name ?? "Pelanggan",
    customerPhone: customer?.phone ?? "-",
    fulfillmentType: orderData.order_type ?? "-",
    orderDate: orderData.createdAt ?? orderData.created_at ?? "",
    completedAt: orderData.completed_at ?? undefined,
    paidAt: invoice?.paid_at ?? undefined,
    totalPrice: Number(invoice?.total_amount ?? orderData.total_amount ?? 0),
    subtotal: Number(invoice?.subtotal ?? orderData.subtotal ?? 0),
    discount: Number(invoice?.discount ?? orderData.discount ?? 0),
    tax: Number(invoice?.tax ?? orderData.tax ?? 0),
    serviceFee: Number(invoice?.service_fee ?? orderData.service_fee ?? 0),
    additionalFee: Number(invoice?.additional_fee ?? orderData.additional_fee ?? 0),
    shippingFee: Number(invoice?.delivery_fee ?? orderData.delivery_fee ?? 0),
    rounding: Number(invoice?.rounding ?? orderData.rounding ?? 0),
    paymentMethod: orderData.payments?.[0]?.payment_method ?? "-",
    paymentStatus: orderData.payment_status ?? "-",
    fulfillmentStatus: orderData.fulfillment_status ?? "-",
    status: invoice?.status ?? orderData.payment_status ?? "-",
    isVoid: Boolean(invoice?.is_void),
    items: (orderData.items ?? []).map((item: any) => ({
      id: item.id,
      productName: item.product?.name ?? "-",
      variantName: item.variant?.name ?? undefined,
      quantity: Number(item.qty ?? 0),
      price: Number(item.price ?? 0),
      discount: Number(item.discount ?? 0),
      subtotal: Number(
        item.subtotal ?? Number(item.price ?? 0) * Number(item.qty ?? 0)
      ),
      notes: item.note ?? undefined,
    })),
    cashierName: kasir?.full_name ?? "-",
    notes: orderData.notes ?? undefined,
    payments: orderData.payments ?? [],
  };
}

export const invoiceService = {
  /**
   * Ambil detail invoice untuk halaman /invoice/[orderId].
   * Memanggil /orders/:id + /invoices/order/:orderId secara paralel.
   * Jika invoice belum dibuat di BE, fallback pakai data dari order saja.
   */
  async getOrder(orderId: string): Promise<InvoiceOrder> {
    const [orderRes, invoiceRes] = await Promise.allSettled([
      pubClient.get<any>(ENDPOINTS.ORDERS.DETAIL(orderId)),
      pubClient.get<any>(ENDPOINTS.INVOICES.BY_ORDER(orderId)),
    ]);

    if (orderRes.status !== "fulfilled") {
      throw orderRes.reason;
    }

    const orderData = orderRes.value.data.data ?? orderRes.value.data;
    const invoiceData =
      invoiceRes.status === "fulfilled"
        ? invoiceRes.value.data.data ?? invoiceRes.value.data
        : null;

    return mergeOrderWithInvoice(orderData, invoiceData);
  },

  /** Ambil list invoice (dashboard / laporan) */
  async list(params: InvoiceListParams = {}): Promise<InvoiceListResult> {
    const response = await pubClient.get<any>(ENDPOINTS.INVOICES.LIST, { params });
    const payload = response.data.data ?? response.data;
    return {
      total: Number(payload.total ?? 0),
      page: Number(payload.page ?? 1),
      limit: Number(payload.limit ?? 20),
      data: (payload.data ?? []).map(mapInvoice),
    };
  },

  /** Ambil detail invoice by invoice_id */
  async getById(invoiceId: string): Promise<Invoice> {
    const response = await pubClient.get<any>(ENDPOINTS.INVOICES.DETAIL(invoiceId));
    const data = response.data.data ?? response.data;
    return mapInvoice(data);
  },

  /** Ambil detail invoice by order_id (raw, tanpa merge order detail) */
  async getByOrderId(orderId: string): Promise<Invoice> {
    const response = await pubClient.get<any>(ENDPOINTS.INVOICES.BY_ORDER(orderId));
    const data = response.data.data ?? response.data;
    return mapInvoice(data);
  },

  /** Ambil info toko untuk header invoice */
  async getStore(): Promise<InvoiceStoreInfo | null> {
    try {
      const response = await pubClient.get<any>("/stores/my");
      return response.data.data ?? null;
    } catch {
      return null;
    }
  },
};
