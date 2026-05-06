import { useState } from "react";
import { Card, CardContent, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import type { StaffMember, StaffRole, UpdateStaffRequest } from "../types";

interface EditRoleModalProps {
  staff: StaffMember;
  roles: StaffRole[];
  onClose: () => void;
  onSave: (data: UpdateStaffRequest) => Promise<void>;
}

export function EditRoleModal({ staff, roles, onClose, onSave }: EditRoleModalProps) {
  const currentRoleId = staff.roles[0]?.role_id ?? "";
  const [roleId, setRoleId] = useState(currentRoleId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ role_id: roleId });
      onClose();
    } catch {
      showToast("Gagal mengubah role staff", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-1">Edit Role Staff</h2>
          <p className="text-sm text-text-secondary mb-5">
            Ubah role untuk <strong>{staff.full_name}</strong>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Role</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                required
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.description || r.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
              <Button type="submit" isLoading={isSubmitting}>Simpan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
