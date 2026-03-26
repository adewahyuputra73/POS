export interface Outlet {
  id: string;
  store_id: string;
  name: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  phone_number?: string;
  is_active: boolean;
  operating_hours?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOutletRequest {
  name: string;
  address: string;
  phone_number?: string;
}

export interface UpdateOutletRequest {
  name?: string;
  address?: string;
  phone_number?: string;
}
