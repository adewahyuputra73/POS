/**
 * Service methods untuk halaman customer order.
 * Menggunakan pubClient → /api/pub/* → Next.js proxy → BE (dengan auth server-side).
 * Tidak ada token yang dipegang browser.
 */
import pubClient from "@/lib/api/pub-client";
import { mapApiProduct } from "@/features/products/services/product-service";
import type { Product } from "@/features/products/types";
import type { StoreInfo } from "@/features/store-settings/types";
import type { Outlet } from "@/features/outlets/types";
import type { Table, Area } from "@/features/tables/types";
import type { CheckoutRequest } from "@/features/orders/types";
import type { CreatePreorderRequest, Preorder, PreorderOrderType } from "@/features/preorders/types";

export const pubProductService = {
  async list(): Promise<Product[]> {
    const response = await pubClient.get<any>("/products");
    const payload = response.data.data;
    const items: any[] = payload?.products ?? payload ?? [];
    return items.map(mapApiProduct);
  },
};

export const pubStoreService = {
  async my(): Promise<StoreInfo | null> {
    try {
      const response = await pubClient.get<any>("/stores/my");
      return response.data.data ?? null;
    } catch {
      return null;
    }
  },
};

export const pubOutletService = {
  async list(): Promise<Outlet[]> {
    try {
      const response = await pubClient.get<any>("/outlets");
      const payload = response.data.data;
      const items: Outlet[] = Array.isArray(payload) ? payload : (payload?.outlets ?? []);
      return items.filter((o) => o.is_active !== false);
    } catch {
      return [];
    }
  },
};

export const pubTableService = {
  async areas(): Promise<Area[]> {
    try {
      const response = await pubClient.get<any>("/tables/areas");
      const payload = response.data.data;
      return Array.isArray(payload) ? payload : [];
    } catch {
      return [];
    }
  },

  async list(): Promise<Table[]> {
    try {
      const response = await pubClient.get<any>("/tables");
      const payload = response.data.data;
      return Array.isArray(payload) ? payload : (payload?.data ?? payload?.tables ?? []);
    } catch {
      return [];
    }
  },

  async scan(qrToken: string): Promise<Table | null> {
    try {
      const response = await pubClient.get<any>(`/tables/scan/${qrToken}`);
      return response.data.data ?? null;
    } catch {
      return null;
    }
  },
};

export const pubOrderService = {
  async checkout(storeId: string, data: {
    name: string;
    phone: string;
    order_type: string;
    table_number?: string;
    items: { product_id: string; qty: number; note?: string }[];
    payments: { method: string; amount: number }[];
    scheduled_at?: string;
    notes?: string;
  }): Promise<any> {
    const response = await pubClient.post<any>(`/orders/customer/${storeId}`, data);
    return response.data.data;
  },

  async detail(id: string): Promise<any> {
    const response = await pubClient.get<any>(`/orders/${id}`);
    return response.data.data;
  },
};

export const pubPreorderService = {
  async slots(
    storeId: string,
    date: string,
    orderType: PreorderOrderType,
    tableId?: string
  ): Promise<string[]> {
    try {
      const params: Record<string, string> = { store_id: storeId, date, order_type: orderType };
      if (tableId) params.table_id = tableId;
      const qs = new URLSearchParams(params).toString();
      const response = await pubClient.get<any>(`/preorders/slots?${qs}`);
      const data = response.data.data;
      if (!Array.isArray(data)) return [];
      if (data.length === 0) return [];
      if (typeof data[0] === "string") return data as string[];
      return (data as { time: string }[]).map((s) => s.time);
    } catch {
      return [];
    }
  },

  async create(data: CreatePreorderRequest): Promise<Preorder> {
    const response = await pubClient.post<any>("/preorders", data, {
      headers: { "x-be-path": "/preorders/" },
    });
    return response.data.data;
  },
};

export const pubCustomerService = {
  async createReview(
    customerId: string,
    data: { order_id: string; rating: number; comment: string }
  ): Promise<void> {
    await pubClient.post(`/customers/${customerId}/reviews`, data);
  },
};
