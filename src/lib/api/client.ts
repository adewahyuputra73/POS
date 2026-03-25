import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from "@/lib/constants";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only access localStorage on client side
    if (typeof window !== "undefined") {
      // Primary: dedicated auth_token key (written on login)
      let token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      // Fallback: read from Zustand persist storage if primary is missing
      if (!token) {
        try {
          const zustandRaw = localStorage.getItem("auth-storage");
          if (zustandRaw) {
            token = JSON.parse(zustandRaw)?.state?.token ?? null;
            // Sync back so future requests use the primary key
            if (token) localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          }
        } catch {
          // ignore JSON parse errors
        }
      }

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest) {
      // Clear auth data and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper types for API responses
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
