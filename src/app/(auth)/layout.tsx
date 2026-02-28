import { ReactNode } from "react";
import { Store, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-surface font-sans">
      {/* Left side - Dynamic Branding Panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-slate-950 relative overflow-hidden">
        {/* Animated gradients and patterns */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] animate-pulse delay-1000"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] invert"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full h-full p-16">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-2xl shadow-brand-500/40 transform -rotate-6">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tighter italic">{APP_NAME}</span>
              <div className="h-1 w-8 bg-brand-500 rounded-full mt-0.5"></div>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
              Empower Your <span className="text-brand-500">Business</span> With Intelligence.
            </h1>
            
            <div className="grid gap-6">
              <div className="flex gap-4 group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-600/20 group-hover:border-brand-500/30 transition-all duration-300">
                  <Zap className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Ultra Fast POS</h3>
                  <p className="text-slate-400 text-sm font-medium">Process transactions in seconds with our optimized engine.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-600/20 group-hover:border-emerald-500/30 transition-all duration-300">
                  <BarChart3 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Smart Analytics</h3>
                  <p className="text-slate-400 text-sm font-medium">Turn your data into actionable insights for rapid growth.</p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-orange-600/20 group-hover:border-orange-500/30 transition-all duration-300">
                  <ShieldCheck className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Secure & Reliable</h3>
                  <p className="text-slate-400 text-sm font-medium">Enterprise-grade security standards for your peace of mind.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <p className="text-sm font-bold uppercase tracking-widest">&copy; 2026 Fere POS Global</p>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-[#fcfcfd]">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}
