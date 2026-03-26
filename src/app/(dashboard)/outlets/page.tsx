"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import {
  Card,
  CardContent,
  Button,
  Input,
  Badge,
} from "@/components/ui";
import { useToast } from "@/components/ui";
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Phone,
  Store,
  Loader2,
} from "lucide-react";
import { outletService } from "@/features/outlets";
import type { Outlet, CreateOutletRequest, UpdateOutletRequest } from "@/features/outlets";

// ─── Modal ────────────────────────────────────────────────────────────────────

interface OutletModalProps {
  outlet?: Outlet;
  onClose: () => void;
  onSave: (data: { name: string; address: string; phone_number?: string }) => Promise<void>;
}

function OutletModal({ outlet, onClose, onSave }: OutletModalProps) {
  const [name, setName] = useState(outlet?.name ?? "");
  const [address, setAddress] = useState(outlet?.address ?? "");
  const [phone, setPhone] = useState(outlet?.phone_number ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({ name, address, phone_number: phone || undefined });
      showToast(outlet ? "Cabang berhasil diperbarui" : "Cabang berhasil ditambahkan", "success");
      onClose();
    } catch {
      showToast("Gagal menyimpan cabang", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 pb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">
            {outlet ? "Edit Cabang" : "Tambah Cabang"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Cabang"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Cabang Utama"
              required
            />
            <Input
              label="Alamat"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Alamat lengkap cabang"
              required
            />
            <Input
              label="Nomor Telepon (opsional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+62 xxx-xxxx-xxxx"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                {outlet ? "Simpan Perubahan" : "Tambah Cabang"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

interface DeleteConfirmProps {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}

function DeleteConfirm({ name, onConfirm, onClose, isLoading }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-sm mx-4">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="h-12 w-12 rounded-full bg-error-light flex items-center justify-center mx-auto mb-4">
            <Trash2 className="h-5 w-5 text-error" />
          </div>
          <h3 className="text-base font-semibold text-text-primary mb-1">Hapus Cabang</h3>
          <p className="text-sm text-text-secondary mb-6">
            Apakah Anda yakin ingin menghapus <strong>{name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Batal
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onConfirm} isLoading={isLoading}>
              Hapus
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OutletsPage() {
  const { showToast } = useToast();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOutlet, setModalOutlet] = useState<Outlet | null | "new">(null);
  const [deleteTarget, setDeleteTarget] = useState<Outlet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadOutlets = useCallback(async () => {
    try {
      const data = await outletService.list();
      setOutlets(data);
    } catch {
      showToast("Gagal memuat data cabang", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOutlets();
  }, [loadOutlets]);

  const handleCreate = async (data: { name: string; address: string; phone_number?: string }) => {
    await outletService.create(data);
    await loadOutlets();
  };

  const handleUpdate = async (data: { name: string; address: string; phone_number?: string }) => {
    if (!modalOutlet || modalOutlet === "new") return;
    await outletService.update(modalOutlet.id, data);
    await loadOutlets();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await outletService.delete(deleteTarget.id);
      showToast("Cabang berhasil dihapus", "success");
      setDeleteTarget(null);
      await loadOutlets();
    } catch {
      showToast("Gagal menghapus cabang", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (outlet: Outlet) => {
    setTogglingId(outlet.id);
    try {
      await outletService.toggleStatus(outlet.id);
      showToast(
        outlet.is_active ? "Cabang dinonaktifkan" : "Cabang diaktifkan",
        "success"
      );
      await loadOutlets();
    } catch {
      showToast("Gagal mengubah status cabang", "error");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Cabang"
        description="Kelola cabang (outlet) toko Anda"
        breadcrumbs={[{ label: "Pengaturan" }, { label: "Cabang" }]}
        actions={
          <Button onClick={() => setModalOutlet("new")}>
            <Plus className="h-4 w-4" />
            Tambah Cabang
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : outlets.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Store className="h-12 w-12 text-text-disabled mx-auto mb-3" />
            <p className="text-text-secondary text-sm">Belum ada cabang. Tambahkan cabang pertama Anda.</p>
            <Button className="mt-4" onClick={() => setModalOutlet("new")}>
              <Plus className="h-4 w-4" />
              Tambah Cabang
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {outlets.map((outlet) => (
            <Card key={outlet.id} className="relative">
              <CardContent className="pt-5 pb-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{outlet.name}</p>
                      <Badge
                        className={
                          outlet.is_active
                            ? "bg-success-light text-success text-xs mt-0.5"
                            : "bg-background text-text-secondary text-xs mt-0.5"
                        }
                      >
                        {outlet.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm text-text-secondary">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>{outlet.address}</span>
                  </div>
                  {outlet.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{outlet.phone_number}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-divider">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setModalOutlet(outlet)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => handleToggleStatus(outlet)}
                    disabled={togglingId === outlet.id}
                  >
                    {togglingId === outlet.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : outlet.is_active ? (
                      <ToggleRight className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <ToggleLeft className="h-3.5 w-3.5" />
                    )}
                    {outlet.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:text-error hover:bg-error-light"
                    onClick={() => setDeleteTarget(outlet)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {modalOutlet !== null && (
        <OutletModal
          outlet={modalOutlet === "new" ? undefined : modalOutlet}
          onClose={() => setModalOutlet(null)}
          onSave={modalOutlet === "new" ? handleCreate : handleUpdate}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
