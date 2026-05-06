import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-text-secondary mb-8">
          Halaman yang Anda cari tidak ada atau sudah dipindahkan.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
        <p className="text-xs text-text-disabled mt-8">{APP_NAME}</p>
      </div>
    </div>
  );
}
