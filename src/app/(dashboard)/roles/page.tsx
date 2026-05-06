import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { roleService, RoleModal, DeleteConfirm } from "@/features/roles";
import type { Role } from "@/features/roles";
import { Shield, Plus, Pencil, Trash2, Loader2, CheckCircle2 } from "lucide-react";

function formatDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
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
