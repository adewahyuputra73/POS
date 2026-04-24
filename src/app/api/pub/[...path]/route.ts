import { NextRequest, NextResponse } from "next/server";

// Edge Runtime — kompatibel dengan Cloudflare Pages
export const runtime = "edge";

const BE_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://qa-api.ferecorps.com/api/fereapps/v1";

// ── Token cache untuk fallback env-credentials ──
// Hanya digunakan jika client tidak mengirim x-store-token
let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function fetchToken(): Promise<string | null> {
  // Prioritas 1: STORE_TOKEN langsung di .env (untuk production)
  const directToken = process.env.STORE_TOKEN;
  if (directToken) {
    cachedToken = directToken;
    tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
    console.log("[pub-proxy] Menggunakan STORE_TOKEN dari .env");
    return directToken;
  }

  // Prioritas 2: Auto-login dengan phone + password
  const phone = process.env.STORE_PHONE;
  const password = process.env.STORE_PASSWORD;

  if (!phone || !password) {
    console.warn("[pub-proxy] Set STORE_TOKEN atau STORE_PHONE+STORE_PASSWORD di .env");
    return null;
  }

  try {
    // Step 1: Login
    const loginRes = await fetch(`${BE_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone, password }),
    });
    const loginJson = await loginRes.json();

    // Token langsung ada (tanpa OTP)
    if (loginJson?.data?.token) {
      const token = loginJson.data.token as string;
      cachedToken = token;
      tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
      console.log("[pub-proxy] Login berhasil (tanpa OTP)");
      return token;
    }

    // BE butuh OTP — gunakan debug_otp jika tersedia (env QA/dev)
    if (loginJson?.data?.next_step === "VERIFY_OTP") {
      const otp = loginJson?.data?.debug_otp as string | undefined;
      if (!otp) {
        console.error("[pub-proxy] BE butuh OTP tapi debug_otp tidak ada. Gunakan STORE_TOKEN di .env");
        return null;
      }

      // Step 2: Verify OTP
      const otpRes = await fetch(`${BE_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone, otp_code: otp }),
      });
      const otpJson = await otpRes.json();
      const token: string | null = otpJson?.data?.token ?? null;

      if (token) {
        cachedToken = token;
        tokenExpiresAt = Date.now() + 23 * 60 * 60 * 1000;
        console.log("[pub-proxy] Login + OTP berhasil, token tersimpan");
      } else {
        console.error("[pub-proxy] Verify OTP gagal:", JSON.stringify(otpJson));
      }
      return token;
    }

    console.error("[pub-proxy] Response login tidak dikenali:", JSON.stringify(loginJson));
    return null;
  } catch (err) {
    console.error("[pub-proxy] Gagal auto-login:", err);
    return null;
  }
}

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }
  // Token tidak ada / sudah expired → login ulang
  cachedToken = null;
  return fetchToken();
}

// ── Proxy handler ──
async function handle(
  request: NextRequest,
  params: { path: string[] }
): Promise<NextResponse> {
  // Prioritas 1: token admin yang dikirim dari pubClient via x-store-token header
  // Ini diisi secara otomatis dari localStorage saat owner membuka web order di browser
  // yang sama dengan admin dashboard — token menentukan store mana yang tampil.
  const clientToken = request.headers.get("x-store-token");

  // Prioritas 2: fallback ke env credentials (STORE_TOKEN / STORE_PHONE+STORE_PASSWORD)
  const token = clientToken ?? (await getToken());

  if (!token) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Web order belum dikonfigurasi. Login ke admin dashboard terlebih dahulu, atau tambahkan STORE_TOKEN di file .env.",
      },
      { status: 503 }
    );
  }

  // x-be-path header allows services to specify exact BE path (incl. trailing slash)
  // because Next.js normalizes/strips trailing slashes before routing
  const bePathOverride = request.headers.get("x-be-path");
  const endpoint = bePathOverride || "/" + params.path.join("/");
  const beUrl = new URL(BE_BASE + endpoint);

  // Forward search params (e.g. ?limit=50)
  request.nextUrl.searchParams.forEach((value, key) => {
    beUrl.searchParams.set(key, value);
  });

  const method = request.method;
  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.text();
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const tokenSource = clientToken ? "client (admin session)" : "env credentials";
  console.log(`[pub-proxy] ${method} ${endpoint} [auth: ${tokenSource}]`, body ? `body: ${body}` : "");

  const beRes = await fetch(beUrl.toString(), { method, headers, body });
  // Helper: parse JSON safely, fallback ke text
  async function parseResponse(res: Response) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error(`[pub-proxy] Non-JSON response (${res.status}):`, text.slice(0, 300));
      return { status: "error", message: `BE error ${res.status}`, detail: text.slice(0, 200) };
    }
  }

  const beJson = await parseResponse(beRes);
  console.log(`[pub-proxy] BE responded: ${beRes.status}`, beRes.status >= 400 ? JSON.stringify(beJson).slice(0, 500) : "");

  // Jika token expired/invalid → clear cache env, retry sekali
  // Jika pakai clientToken (admin session), token-nya expired — langsung 401 ke client
  // agar browser bisa redirect ke halaman login.
  if (beRes.status === 401 || beRes.status === 403) {
    if (clientToken) {
      // Token admin sudah expired — tidak bisa retry, kembalikan 401 ke browser
      return NextResponse.json({ status: "error", message: "Sesi admin sudah berakhir. Silakan login ulang." }, { status: 401 });
    }

    cachedToken = null;
    tokenExpiresAt = 0;
    const newToken = await fetchToken();

    if (!newToken) {
      return NextResponse.json({ status: "error", message: "Autentikasi gagal" }, { status: 503 });
    }

    const retryRes = await fetch(beUrl.toString(), {
      method,
      headers: { ...headers, Authorization: `Bearer ${newToken}` },
      body,
    });
    const retryJson = await parseResponse(retryRes);
    return NextResponse.json(retryJson, { status: retryRes.status });
  }

  return NextResponse.json(beJson, { status: beRes.status });
}

// ── Export HTTP methods ──
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handle(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handle(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handle(request, await params);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handle(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handle(request, await params);
}
