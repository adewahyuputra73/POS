// Tables Module Types

// NOTE: Area fields are guessed — adjust when actual response is known
export interface Area {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAreaRequest {
  name: string;
}

export type UpdateAreaRequest = CreateAreaRequest;

// NOTE: Table fields are guessed — adjust when actual response is known
export interface Table {
  id: string;
  area_id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  qr_code: string;
  created_at: string;
  updated_at: string;
}

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export interface TableListParams {
  area_id?: string;
}

// NOTE: TableSummary fields are guessed — adjust when actual response is known
export interface TableSummary {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
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

// NOTE: ScanTableResponse fields are guessed — adjust when actual response is known
export interface ScanTableResponse {
  id: string;
  name: string;
  area_name: string;
  status: TableStatus;
}
