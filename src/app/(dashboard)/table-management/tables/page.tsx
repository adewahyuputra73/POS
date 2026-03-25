"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Table as ApiTable, Area, CreateTableRequest } from '@/features/tables/types';
import { tableService } from '@/features/tables/services/table-service';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Plus, Search, Download, Pencil, Trash2, X, QrCode, Layers,
  Users as UsersIcon,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  AVAILABLE: { label: 'Tersedia', variant: 'success' },
  OCCUPIED: { label: 'Terisi', variant: 'warning' },
  RESERVED: { label: 'Reserved', variant: 'default' },
  UNAVAILABLE: { label: 'Tidak Tersedia', variant: 'default' },
};

// ==================
// Table Form Dialog
// ==================
function TableFormDialog({ initialData, areas, onSubmit, onCancel, isEditing }: {
  initialData?: ApiTable;
  areas: Area[];
  onSubmit: (data: CreateTableRequest) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) {
  const [form, setForm] = useState<CreateTableRequest>({
    name: initialData?.name || '',
    area_id: initialData?.area_id || (areas[0]?.id || ''),
    capacity: initialData?.capacity || 4,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nama meja wajib diisi';
    if (form.name.length > 5) errs.name = 'Maksimal 5 karakter';
    if (form.capacity < 1 || form.capacity > 99) errs.capacity = 'Kapasitas 1-99';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onCancel} className="absolute top-4 right-4 text-text-disabled hover:text-text-secondary">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-text-primary mb-5">
          {isEditing ? 'Ubah Meja' : 'Tambah Meja'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Nama Meja * <span className="text-text-disabled">(maks 5 karakter)</span></label>
            <Input
              value={form.name}
              onChange={(e) => { setForm(prev => ({ ...prev, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
              placeholder="1"
              maxLength={5}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Area *</label>
            <Select value={form.area_id} onValueChange={(v) => setForm(prev => ({ ...prev, area_id: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {areas.filter(a => a.is_active).map(area => (
                  <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Kapasitas</label>
            <Input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm(prev => ({ ...prev, capacity: Number(e.target.value) }))}
              min={1}
              max={99}
              className={errors.capacity ? 'border-red-500' : ''}
            />
            {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Batal</Button>
            <Button type="submit" className="flex-1">{isEditing ? 'Simpan' : 'Tambah'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================
// QR Preview Dialog
// ==================
function QrPreviewDialog({ table, onClose }: { table: ApiTable; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-disabled hover:text-text-secondary">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-text-primary mb-2">QR Code Meja {table.name}</h3>
        <p className="text-xs text-text-secondary mb-6">{table.area?.name || ''}</p>

        {/* QR Placeholder */}
        <div className="mx-auto w-48 h-48 bg-background rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-4">
          <div className="text-center">
            <QrCode className="h-16 w-16 text-text-disabled mx-auto mb-2" />
            <p className="text-[10px] text-text-disabled font-mono break-all px-2">{table.qr_code}</p>
          </div>
        </div>

        <p className="text-xs text-text-disabled mb-4">
          URL: <span className="font-mono text-text-secondary">{table.qr_code}</span>
        </p>

        <Button className="w-full gap-2">
          <Download className="h-4 w-4" /> Unduh QR (PNG)
        </Button>
      </div>
    </div>
  );
}

// ==================
// Meja Page
// ==================
export default function TablesPage() {
  const { showToast } = useToast();
  const [tables, setTables] = useState<ApiTable[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [filters, setFilters] = useState<{ search: string; areaId: string }>({ search: '', areaId: 'all' });
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<ApiTable | null>(null);
  const [qrTable, setQrTable] = useState<ApiTable | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fetch data
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

  // Filter tables
  const filtered = useMemo(() => {
    return tables.filter(t => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (!t.name.toLowerCase().includes(search)) return false;
      }
      if (filters.areaId !== 'all' && t.area_id !== filters.areaId) return false;
      return true;
    });
  }, [tables, filters]);

  // Stats
  const stats = useMemo(() => ({
    total: tables.length,
    totalCapacity: tables.reduce((s, t) => s + t.capacity, 0),
    available: tables.filter(t => t.status === 'AVAILABLE').length,
  }), [tables]);

  const handleAdd = async (data: CreateTableRequest) => {
    try {
      await tableService.create(data);
      showToast("Meja berhasil ditambahkan", "success");
      await fetchData();
      setShowForm(false);
    } catch {
      showToast("Gagal menambah meja", "error");
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
    if (table.status === 'OCCUPIED') {
      showToast("Tidak bisa menghapus meja yang sedang terisi", "error");
      return;
    }
    if (confirm(`Hapus meja "${table.name}" (${table.area?.name || ''})?`)) {
      try {
        await tableService.delete(table.id);
        setTables(prev => prev.filter(t => t.id !== table.id));
        showToast(`Meja "${table.name}" berhasil dihapus`, "success");
      } catch {
        showToast("Gagal menghapus meja", "error");
      }
    }
  };

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
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Cari nama meja..."
            className="pl-9"
          />
        </div>
        <Select value={filters.areaId} onValueChange={(v) => setFilters(prev => ({ ...prev, areaId: v }))}>
          <SelectTrigger className="w-48">
            <SelectValue>
              {filters.areaId === 'all'
                ? "Semua Area"
                : (areas.find(a => a.id === filters.areaId)?.name || filters.areaId)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Area</SelectItem>
            {areas.filter(a => a.is_active).map(area => (
              <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={() => setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(t => t.id))}
                  className="h-4 w-4 rounded border-border text-primary"
                />
              </TableHead>
              <TableHead className="font-semibold text-xs">Nama Meja</TableHead>
              <TableHead className="font-semibold text-xs">Area</TableHead>
              <TableHead className="font-semibold text-xs text-center">Kapasitas</TableHead>
              <TableHead className="font-semibold text-xs text-center">Status</TableHead>
              <TableHead className="font-semibold text-xs text-center">QR</TableHead>
              <TableHead className="font-semibold text-xs text-center w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => {
              const sc = statusConfig[t.status] || { label: t.status, variant: 'default' as const };
              return (
                <TableRow key={t.id} className="hover:bg-background/50 transition-colors">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={() => setSelectedIds(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
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
                  <TableCell className="text-sm text-text-secondary">{t.area?.name || ''}</TableCell>
                  <TableCell className="text-center text-sm text-text-primary">{t.capacity} pax</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="sm" onClick={() => setQrTable(t)} className="h-8 w-8 p-0" title="QR Code">
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTable(t)} className="h-8 w-8 p-0" title="Ubah">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(t)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700" title="Hapus">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-text-disabled">
        Menampilkan {filtered.length} dari {tables.length} meja
        {selectedIds.length > 0 && <span> · {selectedIds.length} dipilih</span>}
      </p>

      {/* Dialogs */}
      {showForm && <TableFormDialog areas={areas} onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
      {editingTable && <TableFormDialog initialData={editingTable} areas={areas} onSubmit={handleEdit} onCancel={() => setEditingTable(null)} isEditing />}
      {qrTable && <QrPreviewDialog table={qrTable} onClose={() => setQrTable(null)} />}
    </div>
  );
}
