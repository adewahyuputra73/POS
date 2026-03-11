import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { LoginRequest, LoginResponse, RegisterRequest, VerifyOtpRequest, ForgotPasswordRequest } from "../types";
import { ApiResponse } from "@/types";

// Auth service functions
export const authService = {
  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.LOGIN,
      data
    );
    return response.data.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Get current user
   */
  async me(): Promise<LoginResponse["user"]> {
    const response = await apiClient.get<ApiResponse<LoginResponse["user"]>>(
      ENDPOINTS.AUTH.ME
    );
    return response.data.data;
  },

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data
    );
    return response.data.data;
  },

  /**
   * Verify OTP code
   */
  async verifyOtp(data: VerifyOtpRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      data
    );
    return response.data.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      ENDPOINTS.AUTH.REGISTER,
      data
    );
    return response.data.data;
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      ENDPOINTS.AUTH.REFRESH
    );
    return response.data.data;
  },
};
