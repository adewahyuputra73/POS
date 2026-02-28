"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/stores";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const demoUser = {
        id: "1",
        name: "Admin User",
        email: data.email,
        role: "admin" as const,
        phone: "+62 812 3456 7890",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      login(demoUser, "demo-token-123");
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-700">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <div className="p-4 text-xs font-bold text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-600" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Professional Email"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
            className="rounded-xl border-slate-200 focus:ring-brand-500/10 focus:border-brand-500"
            {...register("email")}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-brand-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              className="rounded-xl border-slate-200 focus:ring-brand-500/10 focus:border-brand-500"
              {...register("password")}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                className="peer h-5 w-5 rounded-lg border-2 border-slate-200 bg-surface text-brand-600 focus:ring-0 focus:ring-offset-0 transition-all checked:border-brand-600"
                {...register("remember")}
              />
            </div>
            <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
          </label>

          <a
            href="/forgot-password"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base shadow-xl shadow-brand-500/20" 
          isLoading={isLoading}
        >
          <LogIn className="h-5 w-5 mr-1" />
          Sign into Dashboard
        </Button>
      </form>
      
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
          <span className="bg-surface px-4 text-slate-400">Security Verified</span>
        </div>
      </div>
    </div>
  );
}
