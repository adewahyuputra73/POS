import { useState } from "react";
import { Card, CardContent, Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Plus } from "lucide-react";
import type { StaffRole, CreateStaffRequest } from "../types";

interface AddStaffModalProps {
  roles: StaffRole[];
  onClose: () => void;
  onSave: (data: CreateStaffRequest) => Promise<void>;
}

export function AddStaffModal({ roles, onClose, onSave }: AddStaffModalProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast("Masukkan nama lengkap", "error"); return; }
    if (!phone.trim()) { showToast("Masukkan nomor HP", "error"); return; }
    if (!roleId) { showToast("Pilih role terlebih dahulu", "error"); return; }
    setIsSubmitting(true);
    try {
      await onSave({ full_name: fullName.trim(), phone_number: phone.trim(), role_id: roleId });
      onClose();
    } catch {
      showToast("Gagal menambahkan staff", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-1">Tambah Staff</h2>
          <p className="text-sm text-text-secondary mb-5">
            Staff akan diundang melalui nomor HP. Jika belum terdaftar, akun akan dibuat otomatis.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama staff"
              required
            />
            <Input
              label="Nomor HP (format: 628xxx)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="628123456789"
              required
            />
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
              <Button type="submit" isLoading={isSubmitting}>
                <Plus className="h-4 w-4" />
                Tambah Staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
