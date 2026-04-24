export interface Role {
  id: string;
  name: string;
  description: string;
  // Daftar permission string yang dimiliki role ini (misal: "orders:read", "products:write")
  permissions?: string[];
  // Status aktif role — false berarti role tidak bisa di-assign ke staff baru
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  // Opsional saat create — BE bisa set default [] jika tidak dikirim
  permissions?: string[];
  is_active?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  is_active?: boolean;
}

export interface AssignRoleRequest {
  store_id: string;   // ← WAJIB untuk assign (berbeda dari remove)
  admin_id: string;
  role_id: string;
}

// POST /roles/remove — payload TIDAK ada store_id (berbeda dari /roles/assign)
export interface RemoveRoleRequest {
  admin_id: string;
  role_id: string;
}
