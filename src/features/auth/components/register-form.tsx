"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores";
import { authService } from "../services/auth-service";
import {
  Eye, EyeOff, Phone, Lock, User, ArrowLeft, RefreshCw, UserPlus,
} from "lucide-react";

type Step = "credentials" | "otp";

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [step, setStep] = useState<Step>("credentials");

  // Step 1 state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [normalizedPhone, setNormalizedPhone] = useState("");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 2 OTP state
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Normalize phone → 628xxxxxxxx
  const normalizePhone = (raw: string): string => {
    const digits = raw.trim().replace(/\s|-/g, "");
    if (digits.startsWith("+")) return digits.slice(1);
    if (digits.startsWith("08")) return "62" + digits.slice(1);
    if (digits.startsWith("8")) return "62" + digits;
    return digits;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Nama lengkap wajib diisi";
    if (!phoneNumber.trim()) errs.phoneNumber = "Nomor HP wajib diisi";
    if (!password) errs.password = "Password wajib diisi";
    else if (password.length < 6) errs.password = "Password minimal 6 karakter";
    if (!passwordConfirm) errs.passwordConfirm = "Konfirmasi password wajib diisi";
    else if (password !== passwordConfirm) errs.passwordConfirm = "Password tidak cocok";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const normalized = normalizePhone(phoneNumber);
    setNormalizedPhone(normalized);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await authService.register({
        full_name: fullName.trim(),
        phone_number: normalized,
        password,
        password_confirm: passwordConfirm,
      }) as any;
      setDebugOtp(result?.debug_otp ?? null);
      setStep("otp");
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      // Coba berbagai struktur error dari BE
      const data = err?.response?.data;
      const status = err?.response?.status;
      const msg: string =
        data?.message ??
        data?.error ??
        (Array.isArray(data?.errors) ? data.errors[0]?.message ?? data.errors[0] : null) ??
        err?.message ??
        "";

      const msgLower = msg.toLowerCase();

      if (
        msgLower.includes("sudah") ||
        msgLower.includes("registered") ||
        msgLower.includes("exist") ||
        msgLower.includes("taken") ||
        status === 409
      ) {
        setErrors((prev) => ({ ...prev, phoneNumber: "Nomor HP sudah terdaftar" }));
      } else if (status === 422 || msgLower.includes("validation") || msgLower.includes("invalid")) {
        setErrorMessage(msg || "Data tidak valid. Periksa kembali isian Anda.");
      } else if (status === 400) {
        setErrorMessage(msg || "Data yang dimasukkan tidak lengkap atau tidak sesuai.");
      } else if (status === 500 || status === 503) {
        setErrorMessage("Server sedang bermasalah. Coba beberapa saat lagi.");
      } else {
        setErrorMessage(msg || "Pendaftaran gagal. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError("");
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || "";
    setOtpDigits(newDigits);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length < 6) {
      setOtpError("Masukkan 6 digit kode OTP");
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await authService.verifyOtp({
        phone_number: normalizedPhone,
        otp_code: otp,
      });
      login(
        {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role,
          phone: response.user.phone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        response.token
      );
      router.push("/dashboard");
    } catch {
      setOtpError("Kode OTP salah atau sudah kedaluwarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setErrorMessage(null);
    try {
      await authService.resendOtp({ phone_number: normalizedPhone });
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setErrorMessage("Gagal mengirim ulang OTP. Silakan coba lagi.");
    }
  };

  const maskedPhone = normalizedPhone.length > 6
    ? normalizedPhone.slice(0, 4) + "****" + normalizedPhone.slice(-3)
    : normalizedPhone;

  // ─── Step 1: Form Registrasi ───────────────────────────────────────────────
  if (step === "credentials") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          <Input
            label="Nama Lengkap"
            type="text"
            placeholder="Masukkan nama lengkap"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: "" })); }}
            error={errors.fullName}
            leftIcon={<User className="h-4 w-4 text-slate-400" />}
          />

          <Input
            label="Nomor HP"
            type="tel"
            placeholder="08123456789"
            value={phoneNumber}
            onChange={(e) => { setPhoneNumber(e.target.value); setErrors((p) => ({ ...p, phoneNumber: "" })); }}
            error={errors.phoneNumber}
            leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
            error={errors.password}
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            rightIcon={
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Input
            label="Konfirmasi Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Ulangi password"
            value={passwordConfirm}
            onChange={(e) => { setPasswordConfirm(e.target.value); setErrors((p) => ({ ...p, passwordConfirm: "" })); }}
            error={errors.passwordConfirm}
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            rightIcon={
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
            <UserPlus className="h-5 w-5 mr-1" />
            Daftar Sekarang
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Sudah punya akun?{" "}
          <a href="/login" className="font-semibold text-primary hover:underline">
            Masuk
          </a>
        </p>
      </div>
    );
  }

  // ─── Step 2: OTP ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <button
        type="button"
        onClick={() => { setStep("credentials"); setErrorMessage(null); setOtpError(""); }}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </button>

      <div className="text-center">
        <p className="text-sm text-text-secondary">Kode OTP telah dikirim ke</p>
        <p className="text-base font-bold text-text-primary mt-0.5">{maskedPhone}</p>
      </div>

      <form onSubmit={handleOtpSubmit} className="space-y-5">
        {debugOtp && (
          <div className="p-3 text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl">
            Debug OTP: {debugOtp}
          </div>
        )}
        {(errorMessage || otpError) && (
          <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
            {otpError || errorMessage}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-3">Kode OTP</label>
          <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={[
                  "w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  digit ? "border-primary bg-primary/5 text-primary" : "border-border bg-surface text-text-primary",
                  otpError ? "border-red-400" : "",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
          Verifikasi & Masuk
        </Button>

        <div className="text-center">
          {resendCountdown > 0 ? (
            <p className="text-sm text-text-secondary">
              Kirim ulang OTP dalam{" "}
              <span className="font-bold text-primary">{resendCountdown}s</span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1.5 mx-auto text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Kirim ulang OTP
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
