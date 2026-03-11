// Auth feature types
export interface LoginRequest {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "cashier" | "manager";
    avatar?: string;
    phone?: string;
  };
  token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface RegisterRequest {
  full_name: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}

export interface VerifyOtpRequest {
  phone_number: string;
  otp_code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
