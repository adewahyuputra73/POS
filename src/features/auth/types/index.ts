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
    role: "owner" | "kasir";
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

export interface ResendOtpRequest {
  phone_number: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  email?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface UpdatePinRequest {
  pin: string;
  pin_confirm: string;
}

export interface ForgotPasswordRequest {
  phone_number: string;
}

export interface ForgotPasswordResetRequest {
  reset_token: string;
  new_password: string;
}
