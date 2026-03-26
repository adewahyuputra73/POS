"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/components/ui";
import { useToast } from "@/components/ui";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { ChangePasswordData } from "../types";
import { authService } from "@/features/auth/services/auth-service";

export function ChangePasswordForm() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<ChangePasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChangePasswordData, string>> = {};
    if (!formData.current_password) newErrors.current_password = "Password saat ini wajib diisi";
    if (!formData.new_password) newErrors.new_password = "Password baru wajib diisi";
    if (formData.new_password.length < 8) {
      newErrors.new_password = "Password minimal 8 karakter";
    }
    if (formData.new_password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.new_password)) {
      newErrors.new_password = "Password harus mengandung huruf besar, huruf kecil, dan angka";
    }
    if (!formData.confirm_password) newErrors.confirm_password = "Konfirmasi password wajib diisi";
    if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Password tidak cocok";
    }
    if (formData.current_password === formData.new_password && formData.new_password) {
      newErrors.new_password = "Password baru harus berbeda dari password saat ini";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await authService.changePassword({
        old_password: formData.current_password,
        new_password: formData.new_password,
        new_password_confirm: formData.confirm_password,
      });
      showToast("Password berhasil diubah", "success");
      setFormData({ current_password: "", new_password: "", confirm_password: "" });
    } catch {
      showToast("Gagal mengubah password", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ChangePasswordData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strengthLevel = getPasswordStrength(formData.new_password);
  const strengthLabels = ["", "Sangat Lemah", "Lemah", "Cukup", "Kuat", "Sangat Kuat"];
  const strengthColors = ["", "bg-error", "bg-warning", "bg-yellow-400", "bg-success", "bg-primary"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-warning-light flex items-center justify-center">
            <Lock className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-base">Ubah Password</CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Pastikan password baru Anda kuat dan mudah diingat
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div className="relative">
            <Input
              label="Password Saat Ini"
              type={showPasswords.current ? "text" : "password"}
              value={formData.current_password}
              onChange={(e) => handleChange("current_password", e.target.value)}
              error={errors.current_password}
              placeholder="Masukkan password saat ini"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="text-text-disabled hover:text-text-secondary transition-colors"
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          </div>

          {/* New Password */}
          <div>
            <Input
              label="Password Baru"
              type={showPasswords.new ? "text" : "password"}
              value={formData.new_password}
              onChange={(e) => handleChange("new_password", e.target.value)}
              error={errors.new_password}
              placeholder="Masukkan password baru"
              leftIcon={<Lock className="h-4 w-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="text-text-disabled hover:text-text-secondary transition-colors"
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
            {/* Password strength bar */}
            {formData.new_password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        level <= strengthLevel
                          ? strengthColors[strengthLevel]
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-xs font-medium ${
                    strengthLevel <= 2
                      ? "text-error"
                      : strengthLevel <= 3
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {strengthLabels[strengthLevel]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <Input
            label="Konfirmasi Password Baru"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirm_password}
            onChange={(e) => handleChange("confirm_password", e.target.value)}
            error={errors.confirm_password}
            placeholder="Masukkan ulang password baru"
            leftIcon={<ShieldCheck className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="text-text-disabled hover:text-text-secondary transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          {/* Requirements */}
          <div className="bg-background rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-text-primary mb-2">Persyaratan Password:</p>
            <PasswordRequirement
              met={formData.new_password.length >= 8}
              text="Minimal 8 karakter"
            />
            <PasswordRequirement
              met={/[a-z]/.test(formData.new_password)}
              text="Mengandung huruf kecil"
            />
            <PasswordRequirement
              met={/[A-Z]/.test(formData.new_password)}
              text="Mengandung huruf besar"
            />
            <PasswordRequirement
              met={/\d/.test(formData.new_password)}
              text="Mengandung angka"
            />
            <PasswordRequirement
              met={/[^a-zA-Z0-9]/.test(formData.new_password)}
              text="Mengandung karakter spesial (opsional)"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isSubmitting}>
              <Lock className="h-4 w-4" />
              Ubah Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-4 w-4 rounded-full flex items-center justify-center ${
          met ? "bg-success" : "bg-border"
        } transition-colors`}
      >
        {met && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`text-xs ${met ? "text-text-primary" : "text-text-secondary"}`}>{text}</span>
    </div>
  );
}
