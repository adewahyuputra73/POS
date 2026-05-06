import { LoginForm } from "@/features/auth";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <div className="bg-surface rounded-2xl shadow-xl border border-divider p-8">
      {/* Mobile logo */}
      <div className="lg:hidden text-center mb-8">
        <h1 className="text-2xl font-bold text-indigo-600">{APP_NAME}</h1>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-text-primary">Selamat Datang</h2>
        <p className="text-text-secondary mt-2">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
