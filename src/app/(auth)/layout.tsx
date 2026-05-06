import { Outlet } from "react-router-dom";
import { Code2, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex font-sans bg-[#0A0E1F]">
      {/* Left side - Kodeka Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#0A0E1F] relative overflow-hidden">
        {/* Subtle hexagon pattern backdrop */}
        <div className="absolute inset-0 z-0 bg-hex-pattern opacity-40" />

        {/* Animated brand glow accents */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-brand-500/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 bg-brand-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
          <div className="absolute -bottom-32 left-1/3 w-[26rem] h-[26rem] bg-brand-600/15 rounded-full blur-[160px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full h-full p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-500 flex items-center justify-center shadow-2xl shadow-brand-500/40">
              <Code2 className="h-7 w-7 text-[#0A0E1F]" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight">
                <span className="text-brand-500">Kodeka</span>
                <span className="text-white"> POS</span>
              </span>
              <div className="h-1 w-8 bg-brand-500 rounded-full mt-0.5" />
            </div>
          </div>

          {/* Hero copy */}
          <div className="max-w-md">
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              Power Your <span className="text-brand-500">Business</span> With Intelligent Code.
            </h1>

            <div className="grid gap-6">
              <div className="flex gap-4 group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-500/15 group-hover:border-brand-500/40 transition-all duration-300">
                  <Zap className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Ultra Fast POS</h3>
                  <p className="text-slate-400 text-sm font-medium">
                    Process transactions in seconds with our optimized engine.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-500/15 group-hover:border-brand-500/40 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Smart Analytics</h3>
                  <p className="text-slate-400 text-sm font-medium">
                    Turn your data into actionable insights for rapid growth.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-500/15 group-hover:border-brand-500/40 transition-all duration-300">
                  <ShieldCheck className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Secure &amp; Reliable</h3>
                  <p className="text-slate-400 text-sm font-medium">
                    Enterprise-grade security standards for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-slate-500">
            <p className="text-sm font-bold uppercase tracking-widest">
              &copy; 2026 {APP_NAME} &middot; by Kodeka Labs
            </p>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-[440px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
