import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  tableService,
  TableFormDialog,
  QrPreviewDialog,
} from "@/features/tables";
import type { Table as ApiTable, Area, CreateTableRequest } from "@/features/tables";
import {
  Input,
  Button,
  Badge,
  useToast,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  QrCode,
  Layers,
  Users as UsersIcon,
} from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  AVAILABLE: { label: "Tersedia", variant: "success" },
  OCCUPIED: { label: "Terisi", variant: "warning" },
  RESERVED: { label: "Reserved", variant: "default" },
  UNAVAILABLE: { label: "Tidak Tersedia", variant: "default" },
};

export default function TablesPage() {
  const { showToast } = useToast();
  const [tables, setTables] = useState<ApiTable[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [filters, setFilters] = useState<{ search: string; areaId: string }>({ search: "", areaId: "all" });
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<ApiTable | null>(null);
  const [qrTable, setQrTable] = useState<ApiTable | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const [tablesData, areasData] = await Promise.all([
        tableService.list(),
        tableService.areas(),
      ]);
      setTables(tablesData);
      setAreas(areasData);
    } catch {
      showToast("Gagal memuat data meja", "error");
    } finally {
      setIsFetching(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    return tables.filter((t) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!t.name.toLowerCase().includes(search)) return false;
      }
      if (filters.areaId !== "all" && t.area_id !== filters.areaId) return false;
      return true;
    });
  }, [tables, filters]);

  const stats = useMemo(
    () => ({
      total: tables.length,
      totalCapacity: tables.reduce((s, t) => s + t.capacity, 0),
      available: tables.filter((t) => t.status === "AVAILABLE").length,
    }),
    [tables]
  );

  const handleAdd = async (data: CreateTableRequest) => {
    try {
      await tableService.create(data);
      showToast("Meja berhasil ditambahkan", "success");
      await fetchData();
      setShowForm(false);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = status === 500 || status === 409
        ? "Nama meja sudah digunakan. Gunakan nama berbeda tiap area, contoh: A1, B1, IN-1"
        : (err?.response?.data?.message ?? err?.message ?? "Gagal menambah meja");
      showToast(msg, "error");
    }
  };

  const handleEdit = async (data: CreateTableRequest) => {
    if (!editingTable) return;
    try {
      await tableService.update(editingTable.id, {
        name: data.name,
        capacity: data.capacity,
      });
      showToast("Meja berhasil diubah", "success");
      await fetchData();
      setEditingTable(null);
    } catch {
      showToast("Gagal mengubah meja", "error");
    }
  };

  const handleDelete = async (table: ApiTable) => {
    if (table.status === "OCCUPIED") {
      showToast("Tidak bisa menghapus meja yang sedang terisi", "error");
      return;
    }
    if (confirm(`Hapus meja "${table.name}" (${table.area?.name || ""})?`)) {
      try {
        await tableService.delete(table.id);
        setTables((prev) => prev.filter((t) => t.id !== table.id));
        showToast(`Meja "${table.name}" berhasil dihapus`, "success");
      } catch {
        showToast("Gagal menghapus meja", "error");
      }
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-text-secondary">Memuat data meja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Meja</h1>
          <p className="text-sm text-text-secondary mt-1">Kelola daftar meja untuk semua area</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Meja
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
            <p className="text-xs text-text-secondary">Total Meja</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-50 text-green-700">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{stats.totalCapacity}</p>
            <p className="text-xs text-text-secondary">Total Kapasitas</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-50 text-green-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{stats.available}</p>
            <p className="text-xs text-text-secondary">Tersedia</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Cari nama meja..."
            className="pl-9"
          />
        </div>
        <Select value={filters.areaId} onValueChange={(v) => setFilters((prev) => ({ ...prev, areaId: v }))}>
          <SelectTrigger className="w-48">
            <SelectValue>
              {filters.areaId === "all"
                ? "Semua Area"
                : areas.find((a) => a.id === filters.areaId)?.name || filters.areaId}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Area</SelectItem>
            {areas.filter((a) => a.is_active).map((area) => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table — grouped by area */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={() =>
                    setSelectedIds((prev) =>
                      prev.length === filtered.length ? [] : filtered.map((t) => t.id)
                    )
                  }
                  className="h-4 w-4 rounded border-border text-primary"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs">Nama Meja</TableHead>
              <TableHead className="font-semibold text-xs text-center">Kapasitas</TableHead>
              <TableHead className="font-semibold text-xs text-center">Status</TableHead>
              <TableHead className="font-semibold text-xs text-center">QR</TableHead>
              <TableHead className="font-semibold text-xs text-center w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(() => {
              // Group filtered tables by area
              const groups: { areaName: string; areaId: string; tables: ApiTable[] }[] = [];
              filtered.forEach((t) => {
                const areaId = t.area_id || "unknown";
                const areaName = t.area?.name || "Tanpa Area";
                const existing = groups.find((g) => g.areaId === areaId);
                if (existing) existing.tables.push(t);
                else groups.push({ areaId, areaName, tables: [t] });
              });

              return groups.map((group) => (
                <React.Fragment key={group.areaId}>
                  {/* Area divider row */}
                  <TableRow key={`area-${group.areaId}`} className="bg-primary/5 border-b border-primary/10">
                    <TableCell colSpan={6} className="py-2 px-4">
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">
                        {group.areaName}
                        <span className="ml-2 font-normal text-text-secondary normal-case tracking-normal">
                          {group.tables.length} meja
                        </span>
                      </span>
                    </TableCell>
                  </TableRow>

                  {/* Tables in this area */}
                  {group.tables.map((t) => {
                    const sc = statusConfig[t.status] || { label: t.status, variant: "default" as const };
                    return (
                      <TableRow key={t.id} className="hover:bg-background/50 transition-colors">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(t.id)}
                            onChange={() =>
                              setSelectedIds((prev) =>
                                prev.includes(t.id) ? prev.filter((x) => x !== t.id) : [...prev, t.id]
                              )
                            }
                            className="h-4 w-4 rounded border-border text-primary"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold bg-purple-50 text-purple-700">
                              {t.name}
                            </div>
                            <span className="text-sm font-medium text-text-primary">Meja {t.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-text-primary">{t.capacity} kursi</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={sc.variant} size="sm">
                            {sc.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setQrTable(t)}
                            className="h-8 w-8 p-0"
                            title="QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingTable(t)}
                              className="h-8 w-8 p-0"
                              title="Ubah"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(t)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              title="Hapus"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </React.Fragment>
              ));
            })()}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-text-disabled">
        Menampilkan {filtered.length} dari {tables.length} meja
        {selectedIds.length > 0 && <span> · {selectedIds.length} dipilih</span>}
      </p>

      {/* Dialogs */}
      {showForm && (
        <TableFormDialog areas={areas} onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}
      {editingTable && (
        <TableFormDialog
          initialData={editingTable}
          areas={areas}
          onSubmit={handleEdit}
          onCancel={() => setEditingTable(null)}
          isEditing
        />
      )}
      {qrTable && <QrPreviewDialog table={qrTable} onClose={() => setQrTable(null)} />}
    </div>
  );
}
