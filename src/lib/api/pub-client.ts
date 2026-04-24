/**
 * Public API client untuk halaman customer (/order, /order/checkout, dll).
 *
 * Strategi auth (prioritas berurutan):
 * 1. Token admin dari localStorage["auth_token"] — dikirim via header x-store-token.
 *    Pub-proxy akan langsung meneruskan token ini ke BE tanpa perlu .env credentials.
 *    Ini artinya web order otomatis mengikuti akun owner yang sedang login.
 * 2. Fallback: pub-proxy menggunakan STORE_TOKEN / STORE_PHONE+STORE_PASSWORD dari .env
 *    (untuk backward-compat atau deployment terpisah tanpa admin session).
 */
import axios from "axios";

const pubClient = axios.create({
  baseURL: "/api/pub",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Kirim token admin (jika ada) ke pub-proxy via header x-store-token
pubClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // Coba baca dari localStorage key utama
    let token: string | null = localStorage.getItem("auth_token");

    // Fallback: baca dari Zustand persist storage
    if (!token) {
      try {
        const zustandRaw = localStorage.getItem("auth-storage");
        if (zustandRaw) {
          token = JSON.parse(zustandRaw)?.state?.token ?? null;
        }
      } catch {
        // ignore
      }
    }

    if (token) {
      config.headers["x-store-token"] = token;
    }
  }
  return config;
});

export default pubClient;
