import { useEffect } from "react";
import { APP_NAME } from "@/lib/constants";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Terjadi Kesalahan
        </h1>
        <p className="text-text-secondary mb-2">
          Maaf, ada sesuatu yang tidak berjalan dengan semestinya.
        </p>
        {error.digest && (
          <p className="text-xs text-text-disabled font-mono mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Coba Lagi
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-surface border border-border text-text-primary font-semibold rounded-xl hover:bg-background transition-colors"
          >
            Ke Beranda
          </a>
        </div>
        <p className="text-xs text-text-disabled mt-8">{APP_NAME}</p>
      </div>
    </div>
  );
}
