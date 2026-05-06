import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, Button, Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, MapPin, Phone, Store, Loader2 } from "lucide-react";
import { outletService, OutletModal, DeleteConfirm } from "@/features/outlets";
import type { Outlet, CreateOutletRequest } from "@/features/outlets";

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

  const handleCreate = async (data: CreateOutletRequest) => {
    await outletService.create(data);
    await loadOutlets();
  };

  const handleUpdate = async (data: CreateOutletRequest) => {
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
