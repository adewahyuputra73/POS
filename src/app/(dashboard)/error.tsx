import { Component, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 py-16">
      <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
        <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-text-primary mb-1">Gagal memuat halaman</h2>
        <p className="text-sm text-text-secondary">
          Terjadi kesalahan saat memuat halaman ini. Silakan coba lagi.
        </p>
        {error.message && (
          <p className="text-xs text-text-disabled font-mono mt-2">{error.message}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Coba Lagi
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 bg-surface border border-border text-text-primary text-sm font-semibold rounded-xl hover:bg-background transition-colors"
        >
          Ke Dashboard
        </button>
      </div>
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class DashboardErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Dashboard error:", error);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    return this.props.children;
  }
}
