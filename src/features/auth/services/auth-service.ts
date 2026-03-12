import apiClient from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { LoginRequest, LoginResponse, RegisterRequest, VerifyOtpRequest, ResendOtpRequest, UpdateProfileRequest, ChangePasswordRequest, UpdatePinRequest, ForgotPasswordRequest, ForgotPasswordResetRequest } from "../types";
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
   * Get current user profile
   */
  async profile(): Promise<LoginResponse["user"]> {
    const response = await apiClient.get<ApiResponse<LoginResponse["user"]>>(
      ENDPOINTS.AUTH.PROFILE
    );
    return response.data.data;
  },

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileRequest): Promise<LoginResponse["user"]> {
    const response = await apiClient.put<ApiResponse<LoginResponse["user"]>>(
      ENDPOINTS.AUTH.PROFILE,
      data
    );
    return response.data.data;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
    return response.data.data;
  },

  /**
   * Update PIN
   */
  async updatePin(data: UpdatePinRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.UPDATE_PIN,
      data
    );
    return response.data.data;
  },

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD_REQUEST,
      data
    );
    return response.data.data;
  },

  /**
   * Forgot password - verify OTP
   */
  async forgotPasswordVerifyOtp(data: VerifyOtpRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY_OTP,
      data
    );
    return response.data.data;
  },

  /**
   * Forgot password - reset with token
   */
  async forgotPasswordReset(data: ForgotPasswordResetRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.FORGOT_PASSWORD_RESET,
      data
    );
    return response.data.data;
  },

  /**
   * Resend OTP code
   */
  async resendOtp(data: ResendOtpRequest): Promise<{ message: string }> {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      ENDPOINTS.AUTH.RESEND_OTP,
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
