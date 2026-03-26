// Profile feature types

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "kasir";
  avatar?: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female";
  joined_date: string;
  last_login: string;
  is_active: boolean;
  outlet_id?: string;
  outlet_name?: string;
}

export interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  gender?: "male" | "female";
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  ip_address: string;
  device: string;
  timestamp: string;
}

export const ROLE_LABELS: Record<string, string> = {
  admin: "Administrator",
  cashier: "Kasir",
  manager: "Manajer",
};

export const ROLE_COLORS: Record<string, string> = {
  admin: "bg-primary-light text-primary",
  cashier: "bg-success-light text-success",
  manager: "bg-warning-light text-warning",
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Laki-laki" },
  { value: "female", label: "Perempuan" },
];
