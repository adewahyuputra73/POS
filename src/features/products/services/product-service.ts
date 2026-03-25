import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types";
import type { Product, ChannelPrice, CreateProductRequest, UpdateProductRequest, UpdateStockRequest, UpdatePriceRequest, BulkDeleteRequest, BulkStatusRequest, StockHistory, ProductListParams } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Maps API response to frontend Product type.
 * Handles confirmed API shape from GET /products.
 */
function mapApiProduct(raw: any): Product {
  // Channel prices: API returns raw.prices[] with channel "POS"/"GOFOOD" etc.
  const rawPrices: any[] = raw.prices ?? raw.channel_prices ?? raw.channelPrices ?? [];
  const channelPrices: ChannelPrice[] = rawPrices.map((cp: any) => ({
    channel: (cp.channel as string).toLowerCase() as ChannelPrice['channel'],
    price: Number(cp.price ?? 0),
  }));

  // compare_price lives inside prices[], take from first entry
  const comparePrice = rawPrices[0]?.compare_price != null
    ? Number(rawPrices[0].compare_price)
    : undefined;

  // useStock from stock_type (API confirmed) or fallback to use_stock boolean
  const useStock = raw.stock_type === "LIMITED"
    ? true
    : raw.stock_type === "UNLIMITED"
    ? false
    : (raw.use_stock ?? raw.useStock ?? false);

  return {
    id: raw.id,
    name: raw.name ?? "",
    description: raw.description ?? undefined,
    price: Number(raw.price ?? 0),
    comparePrice,
    categoryId: raw.category_id ?? raw.categoryId ?? undefined,
    categoryName: raw.category_name ?? raw.categoryName ?? raw.category?.name ?? undefined,
    isActive: raw.is_active ?? raw.isActive ?? true,
    barcode: raw.barcode ?? undefined,
    sku: raw.sku ?? undefined,
    useStock,
    stockQuantity: raw.stock_qty ?? raw.stock_quantity ?? raw.stockQuantity ?? undefined,
    stockLimit: raw.stock_limit ?? raw.stockLimit ?? undefined,
    taxId: raw.taxId ?? raw.tax_id ?? undefined,
    serviceFeeId: raw.serviceFeeId ?? raw.service_fee_id ?? undefined,
    takeawayFee: raw.takeaway_fee != null ? Number(raw.takeaway_fee) : raw.takeawayFee,
    useDimension: raw.use_dimension ?? raw.useDimension ?? false,
    weight: raw.weight ?? undefined,
    // API uses dimension_length/width/height
    length: raw.dimension_length ?? raw.length ?? undefined,
    width: raw.dimension_width ?? raw.width ?? undefined,
    height: raw.dimension_height ?? raw.height ?? undefined,
    images: (raw.images ?? []).map((img: any) => ({
      id: img.id,
      // API confirmed: image_url field
      url: img.image_url ?? img.url ?? "",
      isPrimary: img.is_primary ?? img.isPrimary ?? false,
    })),
    channelPrices,
    variantIds: raw.variant_ids ?? raw.variantIds ?? [],
    createdAt: raw.created_at ?? raw.createdAt ?? "",
    updatedAt: raw.updated_at ?? raw.updatedAt ?? "",
  };
}

export const productService = {
  async list(params?: ProductListParams): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.LIST,
      { params }
    );
    // API confirmed: response.data = { status, message, data: { products: [], pagination: {} } }
    const payload = response.data.data;
    const items: any[] = payload?.products ?? payload ?? [];
    return items.map(mapApiProduct);
  },

  async detail(id: string | number): Promise<Product> {
    const response = await apiClient.get<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.DETAIL(id)
    );
    return mapApiProduct(response.data.data);
  },

  async create(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.CREATE,
      data
    );
    return mapApiProduct(response.data.data);
  },

  async toggleStatus(id: string | number): Promise<Product> {
    const response = await apiClient.patch<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.TOGGLE_STATUS(id)
    );
    return mapApiProduct(response.data.data);
  },

  async update(id: string | number, data: UpdateProductRequest): Promise<Product> {
    const response = await apiClient.put<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.UPDATE(id),
      data
    );
    return mapApiProduct(response.data.data);
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(id));
  },

  async updateStock(id: string | number, data: UpdateStockRequest): Promise<Product> {
    const response = await apiClient.post<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.STOCK(id),
      data
    );
    return mapApiProduct(response.data.data);
  },

  async stockHistory(id: string | number): Promise<StockHistory[]> {
    const response = await apiClient.get<ApiResponse<StockHistory[]>>(
      ENDPOINTS.PRODUCTS.STOCK_HISTORY(id)
    );
    return response.data.data;
  },

  async prices(id: string | number): Promise<ChannelPrice[]> {
    const response = await apiClient.get<ApiResponse<ChannelPrice[]>>(
      ENDPOINTS.PRODUCTS.PRICES(id)
    );
    return response.data.data;
  },

  async updatePrice(id: string | number, data: UpdatePriceRequest): Promise<Product> {
    const response = await apiClient.put<ApiResponse<any>>(
      ENDPOINTS.PRODUCTS.PRICES(id),
      data
    );
    return mapApiProduct(response.data.data);
  },

  async bulkDelete(data: BulkDeleteRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.PRODUCTS.BULK_DELETE, data);
  },

  async bulkStatus(data: BulkStatusRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.PRODUCTS.BULK_STATUS, data);
  },
};
