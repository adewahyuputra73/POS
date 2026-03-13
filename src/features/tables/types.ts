// Tables Module Types

// CONFIRMED from GET /tables/areas
export interface Area {
  id: string;
  store_id: string;
  outlet_id: string | null;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  tables: Table[];
}

export interface CreateAreaRequest {
  name: string;
}

export type UpdateAreaRequest = CreateAreaRequest;

// CONFIRMED from GET /tables
export interface Table {
  id: string;
  store_id: string;
  area_id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  qr_code: string;
  qr_token: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  area?: {
    id: string;
    name: string;
  };
}

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "UNAVAILABLE";

export interface TableListParams {
  area_id?: string;
}

export interface TableSummary {
  AVAILABLE: number;
  OCCUPIED: number;
  RESERVED: number;
  UNAVAILABLE: number;
  total: number;
}

export interface CreateTableRequest {
  area_id: string;
  name: string;
  capacity: number;
}

export interface UpdateTableRequest {
  name?: string;
  capacity?: number;
}

export interface UpdateTableStatusRequest {
  status: TableStatus;
}

// CONFIRMED from GET /tables/scan/:id
export interface ScanTableResponse {
  id: string;
  store_id: string;
  area_id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  qr_token: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  area: {
    name: string;
  };
}
