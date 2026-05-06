import { useState } from "react";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { roleService } from "../services/role-service";
import type { Role } from "../types";

interface DeleteConfirmProps {
  role: Role;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteConfirm({ role, onClose, onDeleted }: DeleteConfirmProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await roleService.delete(role.id);
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal menghapus role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-sm p-6">
        <div className="flex flex-col items-center text-center gap-3 mb-5">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Hapus Role?</h2>
            <p className="text-sm text-text-secondary mt-1">
              Role <span className="font-semibold text-text-primary">"{role.name}"</span> akan dihapus permanen.
            </p>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 h-10 rounded-lg border border-border text-sm font-semibold text-text-secondary hover:bg-background transition-colors">
            Batal
          </button>
          <button onClick={handleDelete} disabled={loading}
            className="flex-1 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
