import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => {
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
          } else {
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          }
        }
        set({ token });
      },

      login: (user, token) => {
        // Write token to the key that apiClient reads from
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
