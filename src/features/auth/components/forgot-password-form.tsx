import { useState, useRef, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { authService } from "../services/auth-service";
import {
  Phone, Lock, ArrowLeft, RefreshCw, CheckCircle, Eye, EyeOff, KeyRound,
} from "lucide-react";

type Step = "phone" | "otp" | "reset" | "success";

/** Normalize phone ke format 628xxxxxxxx */
function normalizePhone(raw: string): string {
  const digits = raw.trim().replace(/\s|-/g, "");
  if (digits.startsWith("+")) return digits.slice(1);
  if (digits.startsWith("08")) return "62" + digits.slice(1);
  if (digits.startsWith("8")) return "62" + digits;
  return digits;
}

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("phone");

  // Step 1 — Phone
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState("");
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Step 2 — OTP
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resetToken, setResetToken] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3 — New password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Countdown untuk resend OTP
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const maskedPhone = normalizedPhone.length > 6
    ? normalizedPhone.slice(0, 4) + "****" + normalizedPhone.slice(-3)
    : normalizedPhone;

  // ── Step 1: Input nomor HP ────────────────────────────────────────────────────
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setPhoneError("Nomor HP wajib diisi");
      return;
    }
    const normalized = normalizePhone(phoneNumber);
    setNormalizedPhone(normalized);
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.forgotPassword({ phone_number: normalized }) as any;
      setDebugOtp(res?.debug_otp ?? null);
      setStep("otp");
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "";
      const status = err?.response?.status;
      if (status === 404 || msg.toLowerCase().includes("not found") || msg.toLowerCase().includes("tidak ditemukan")) {
        setPhoneError("Nomor HP tidak terdaftar");
      } else {
        setErrorMessage(msg || "Gagal mengirim kode OTP. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── OTP handlers ─────────────────────────────────────────────────────────────
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
    const newDigits = Array(6).fill("");
    for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || "";
    setOtpDigits(newDigits);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── Step 2: Verifikasi OTP ────────────────────────────────────────────────────
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
      const res = await authService.forgotPasswordVerifyOtp({
        phone_number: normalizedPhone,
        otp_code: otp,
      });
      // BE harus return reset_token untuk step berikutnya
      setResetToken(res?.reset_token ?? "");
      setStep("reset");
    } catch {
      setOtpError("Kode OTP salah atau sudah kedaluwarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setErrorMessage(null);
    try {
      const res = await authService.forgotPassword({ phone_number: normalizedPhone }) as any;
      setDebugOtp(res?.debug_otp ?? null);
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setErrorMessage("Gagal mengirim ulang OTP. Silakan coba lagi.");
    }
  };

  // ── Step 3: Reset password ─────────────────────────────────────────────────
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newPassword) errs.newPassword = "Password baru wajib diisi";
    else if (newPassword.length < 6) errs.newPassword = "Password minimal 6 karakter";
    if (!confirmPassword) errs.confirmPassword = "Konfirmasi password wajib diisi";
    else if (newPassword !== confirmPassword) errs.confirmPassword = "Password tidak cocok";
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.forgotPasswordReset({
        reset_token: resetToken,
        new_password: newPassword,
      });
      setStep("success");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "";
      setErrorMessage(msg || "Gagal mereset password. Silakan ulangi dari awal.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── RENDER ──────────────────────────────────────────────────────────────────

  // Step 1: Nomor HP
  if (step === "phone") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <form onSubmit={handlePhoneSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          <p className="text-sm text-text-secondary">
            Masukkan nomor HP yang terdaftar. Kami akan mengirimkan kode OTP untuk mereset password Anda.
          </p>

          <Input
            label="Nomor HP"
            type="tel"
            placeholder="08123456789"
            value={phoneNumber}
            onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(""); }}
            error={phoneError}
            leftIcon={<Phone className="h-4 w-4 text-slate-400" />}
            className="rounded-xl"
          />

          <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
            <KeyRound className="h-5 w-5 mr-1" />
            Kirim Kode OTP
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary">
          Ingat password?{" "}
          <a href="/login" className="font-semibold text-primary hover:underline">
            Masuk
          </a>
        </p>
      </div>
    );
  }

  // Step 2: OTP
  if (step === "otp") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <button
          type="button"
          onClick={() => { setStep("phone"); setErrorMessage(null); setOtpError(""); }}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Ganti nomor HP
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
            Verifikasi Kode OTP
          </Button>

          <div className="text-center">
            {resendCountdown > 0 ? (
              <p className="text-sm text-text-secondary">
                Kirim ulang dalam{" "}
                <span className="font-bold text-primary">{resendCountdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
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

  // Step 3: Reset password baru
  if (step === "reset") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
        <p className="text-sm text-text-secondary">
          Buat password baru untuk akun dengan nomor <span className="font-bold text-text-primary">{maskedPhone}</span>.
        </p>

        <form onSubmit={handleResetSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-600 shrink-0" />
              {errorMessage}
            </div>
          )}

          <Input
            label="Password Baru"
            type={showNew ? "text" : "password"}
            placeholder="Minimal 6 karakter"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setPasswordErrors((p) => ({ ...p, newPassword: "" })); }}
            error={passwordErrors.newPassword}
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            rightIcon={
              <button type="button" onClick={() => setShowNew((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Input
            label="Konfirmasi Password Baru"
            type={showConfirm ? "text" : "password"}
            placeholder="Ulangi password baru"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setPasswordErrors((p) => ({ ...p, confirmPassword: "" })); }}
            error={passwordErrors.confirmPassword}
            leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
            rightIcon={
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          <Button type="submit" className="w-full h-12 text-base mt-2" isLoading={isLoading}>
            <KeyRound className="h-5 w-5 mr-1" />
            Reset Password
          </Button>
        </form>
      </div>
    );
  }

  // Step 4: Sukses
  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-in slide-in-from-bottom-2 duration-500">
      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-text-primary">Password Berhasil Direset!</h3>
        <p className="text-sm text-text-secondary">
          Password Anda telah berhasil diubah. Silakan masuk dengan password baru Anda.
        </p>
      </div>
      <a
        href="/login"
        className="w-full h-12 rounded-xl flex items-center justify-center text-base font-bold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-primary, #2196F3)" }}
      >
        Masuk Sekarang
      </a>
    </div>
  );
}
