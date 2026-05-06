import { useState } from "react";
import { Shield, Loader2, AlertCircle, X } from "lucide-react";
import { roleService } from "../services/role-service";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "../types";

interface RoleModalProps {
  role: Role | null;
  onClose: () => void;
  onSaved: () => void;
}

export function RoleModal({ role, onClose, onSaved }: RoleModalProps) {
  const isEdit = !!role;
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Nama role wajib diisi"); return; }
    setLoading(true);
    setError("");
    try {
      if (isEdit && role) {
        const payload: UpdateRoleRequest = {};
        if (name.trim() !== role.name) payload.name = name.trim();
        if (description.trim() !== role.description) payload.description = description.trim();
        await roleService.update(role.id, payload);
      } else {
        const payload: CreateRoleRequest = { name: name.trim(), description: description.trim() };
        await roleService.create(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-base font-bold text-text-primary">
              {isEdit ? "Edit Role" : "Tambah Role Baru"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-background transition-colors">
            <X className="h-4 w-4 text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">
              Nama Role <span className="text-red-500">*</span>
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="contoh: Kasir, Manajer Shift"
              className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat tentang role ini..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none" />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 h-10 rounded-lg border border-border text-sm font-semibold text-text-secondary hover:bg-background transition-colors">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Simpan Perubahan" : "Tambah Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
