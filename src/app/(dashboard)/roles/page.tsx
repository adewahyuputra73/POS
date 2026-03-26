"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { roleService } from "@/features/roles/services/role-service";
import type { Role, CreateRoleRequest, UpdateRoleRequest } from "@/features/roles/types";
import { Shield, Plus, Pencil, Trash2, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react";

function formatDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

interface RoleModalProps {
  role: Role | null;
  onClose: () => void;
  onSaved: () => void;
}

function RoleModal({ role, onClose, onSaved }: RoleModalProps) {
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

interface DeleteConfirmProps {
  role: Role;
  onClose: () => void;
  onDeleted: () => void;
}

function DeleteConfirm({ role, onClose, onDeleted }: DeleteConfirmProps) {
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

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [deleteRole, setDeleteRole] = useState<Role | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.list();
      // API may return paginated or plain array
      setRoles(Array.isArray(data) ? data : (data as any)?.data ?? []);
    } catch {
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const handleSaved = () => {
    setSuccessMsg("Role berhasil disimpan!");
    fetchRoles();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleted = () => {
    setSuccessMsg("Role berhasil dihapus!");
    fetchRoles();
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Role"
        description="Kelola role dan hak akses staff"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Pengaturan" }, { label: "Role" }]}
        actions={
          <button onClick={() => { setEditRole(null); setModalOpen(true); }}
            className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Role
          </button>
        }
      />

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">{successMsg}</p>
        </div>
      )}

      <div className="bg-surface rounded-xl border border-border">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
        ) : roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <p className="text-sm font-semibold text-text-primary">Belum ada role</p>
            <p className="text-xs text-text-secondary">Tambah role untuk mengatur hak akses staff</p>
            <button onClick={() => { setEditRole(null); setModalOpen(true); }}
              className="mt-1 h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Role Pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Nama Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Deskripsi</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Dibuat</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-semibold text-text-primary">{role.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-text-secondary max-w-[300px]">
                      {role.description || <span className="text-text-disabled italic">Tidak ada deskripsi</span>}
                    </td>
                    <td className="px-4 py-4 text-text-secondary whitespace-nowrap">{formatDate(role.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditRole(role); setModalOpen(true); }}
                          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary hover:text-primary transition-colors text-text-secondary">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => setDeleteRole(role)}
                          className="h-8 w-8 rounded-lg border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors text-text-secondary">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <RoleModal
          role={editRole}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {deleteRole && (
        <DeleteConfirm
          role={deleteRole}
          onClose={() => setDeleteRole(null)}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
