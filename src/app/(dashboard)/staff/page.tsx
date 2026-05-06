import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Plus, Trash2, Users, Phone, ShieldCheck, Loader2, Edit } from "lucide-react";
import {
  staffService,
  StatusBadge,
  AddStaffModal,
  EditRoleModal,
  DeleteConfirm,
} from "@/features/staff";
import type {
  StaffMember,
  StaffRole,
  CreateStaffRequest,
  UpdateStaffRequest,
} from "@/features/staff";

export default function StaffPage() {
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [staffRes, rolesRes] = await Promise.all([
        staffService.list(),
        staffService.roles(),
      ]);
      setStaffList(staffRes.data);
      setRoles(rolesRes);
    } catch {
      showToast("Gagal memuat data staff", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCreate = async (data: CreateStaffRequest) => {
    const result = await staffService.create(data);
    const msg = result.is_new_account
      ? `Staff ditambahkan. Akun baru dibuat — ${result.phone_number} perlu registrasi.`
      : `Staff ${result.full_name} berhasil ditambahkan.`;
    showToast(msg, "success");
    await loadData();
  };

  const handleUpdate = async (data: UpdateStaffRequest) => {
    if (!editTarget) return;
    await staffService.update(editTarget.id, data);
    showToast("Role staff berhasil diubah", "success");
    setEditTarget(null);
    await loadData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await staffService.delete(deleteTarget.id);
      showToast("Staff berhasil dihapus", "success");
      setDeleteTarget(null);
      await loadData();
    } catch {
      showToast("Gagal menghapus staff", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Staff"
        description="Kelola staff dan hak akses mereka"
        breadcrumbs={[{ label: "Pengaturan" }, { label: "Staff" }]}
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            Tambah Staff
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Staff", value: staffList.length, icon: Users, color: "text-primary bg-primary-light" },
          { label: "Aktif", value: staffList.filter((s) => s.status === "AKTIF").length, icon: ShieldCheck, color: "text-success bg-success-light" },
          { label: "Belum Registrasi", value: staffList.filter((s) => s.status === "BELUM_REGISTRASI").length, icon: Phone, color: "text-warning bg-warning-light" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 py-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">{label}</p>
                <p className="text-xl font-bold text-text-primary">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : staffList.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 text-text-disabled mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Belum ada staff. Tambahkan staff pertama.</p>
            <Button className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4" />
              Tambah Staff
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider">
                    <th className="text-left text-xs font-semibold text-text-secondary px-5 py-3">Nama</th>
                    <th className="text-left text-xs font-semibold text-text-secondary px-5 py-3">No. HP</th>
                    <th className="text-left text-xs font-semibold text-text-secondary px-5 py-3">Role</th>
                    <th className="text-left text-xs font-semibold text-text-secondary px-5 py-3">Status</th>
                    <th className="text-left text-xs font-semibold text-text-secondary px-5 py-3">Bergabung</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-text-primary">{staff.full_name}</td>
                      <td className="px-5 py-3.5 text-text-secondary">{staff.phone_number}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {staff.roles.length > 0 ? (
                            staff.roles.map((r) => (
                              <Badge
                                key={r.user_role_id}
                                className="bg-primary-light text-primary text-xs font-semibold capitalize"
                              >
                                {r.role_name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-text-disabled text-xs">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={staff.status} />
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-xs">
                        {new Date(staff.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => setEditTarget(staff)}>
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:text-error hover:bg-error-light"
                            onClick={() => setDeleteTarget(staff)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddStaffModal
          roles={roles}
          onClose={() => setShowAddModal(false)}
          onSave={handleCreate}
        />
      )}
      {editTarget && (
        <EditRoleModal
          staff={editTarget}
          roles={roles}
          onClose={() => setEditTarget(null)}
          onSave={handleUpdate}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          staff={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
