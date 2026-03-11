export interface Outlet {
  id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOutletRequest {
  name: string;
  address: string;
}
