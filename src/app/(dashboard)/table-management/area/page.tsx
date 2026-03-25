"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { tableService } from '@/features/tables/services/table-service';
import type { Area } from '@/features/tables/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Search, MapPin, Users, Layers, Pencil, Trash2, ArrowLeft } from 'lucide-react';

type ViewMode = 'list' | 'add' | 'edit';

// ==================
// Area Form
// ==================
function AreaForm({ initialData, onSubmit, onCancel, isEditing }: {
  initialData?: Area;
  onSubmit: (name: string) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Nama area wajib diisi'); return; }
    if (name.length > 50) { setError('Maksimal 50 karakter'); return; }
    onSubmit(name.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <h2 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Ubah Area' : 'Tambah Area'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Informasi Area</h3>
          <div className="max-w-sm">
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Nama Area * <span className="text-text-disabled">({name.length}/50)</span>
            </label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value); if (error) setError(''); }}
              placeholder="Contoh: Lt.1 Indoor"
              maxLength={50}
              className={error ? 'border-red-500' : ''}
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit">{isEditing ? 'Ubah Area' : 'Simpan Area'}</Button>
        </div>
      </form>
    </div>
  );
}

// ==================
// Area Page
// ==================
export default function AreaPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tableService.areas();
      setAreas(Array.isArray(data) ? data : []);
    } catch {
      showToast('Gagal memuat area', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = useMemo(() => {
    if (!search) return areas;
    const q = search.toLowerCase();
    return areas.filter(a => a.name.toLowerCase().includes(q));
  }, [areas, search]);

  const stats = useMemo(() => ({
    total: areas.length,
    active: areas.filter(a => a.is_active).length,
    totalTables: areas.reduce((sum, a) => sum + (a.tables?.length ?? 0), 0),
    totalCapacity: areas.reduce((sum, a) => sum + (a.tables ?? []).reduce((s, t) => s + t.capacity, 0), 0),
  }), [areas]);

  const handleAdd = async (name: string) => {
    try {
      await tableService.createArea({ name });
      showToast('Area berhasil dibuat', 'success');
      setViewMode('list');
      fetchData();
    } catch {
      showToast('Gagal membuat area', 'error');
    }
  };

  const handleEdit = async (name: string) => {
    if (!editingArea) return;
    try {
      await tableService.updateArea(editingArea.id, { name });
      showToast('Area berhasil diperbarui', 'success');
      setViewMode('list');
      setEditingArea(null);
      fetchData();
    } catch {
      showToast('Gagal memperbarui area', 'error');
    }
  };

  const handleDelete = async (area: Area) => {
    if ((area.tables?.length ?? 0) > 0) {
      alert('Tidak bisa menghapus area yang masih memiliki meja.');
      return;
    }
    if (!confirm(`Hapus area "${area.name}"?`)) return;
    try {
      await tableService.deleteArea(area.id);
      showToast('Area berhasil dihapus', 'success');
      fetchData();
    } catch {
      showToast('Gagal menghapus area', 'error');
    }
  };

  if (viewMode === 'add') {
    return (
      <div className="animate-in fade-in duration-300">
        <AreaForm onSubmit={handleAdd} onCancel={() => setViewMode('list')} />
      </div>
    );
  }

  if (viewMode === 'edit' && editingArea) {
    return (
      <div className="animate-in fade-in duration-300">
        <AreaForm
          initialData={editingArea}
          onSubmit={handleEdit}
          onCancel={() => { setViewMode('list'); setEditingArea(null); }}
          isEditing
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Area</h1>
          <p className="text-sm text-text-secondary mt-1">Kelola area dan zona dalam outlet</p>
        </div>
        <Button onClick={() => setViewMode('add')} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Area
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Area', value: stats.total, icon: MapPin, color: 'text-blue-700 bg-blue-50' },
          { label: 'Area Aktif', value: stats.active, icon: Layers, color: 'text-green-700 bg-green-50' },
          { label: 'Total Meja', value: stats.totalTables, icon: Layers, color: 'text-purple-700 bg-purple-50' },
          { label: 'Total Kapasitas', value: stats.totalCapacity, icon: Users, color: 'text-amber-700 bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{s.value}</p>
              <p className="text-xs text-text-secondary">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari area..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-background/50">
                <TableHead className="font-semibold text-xs">Nama Area</TableHead>
                <TableHead className="font-semibold text-xs text-center">Jumlah Meja</TableHead>
                <TableHead className="font-semibold text-xs text-center">Kapasitas</TableHead>
                <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-center w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <MapPin className="h-8 w-8 text-text-disabled mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Belum ada area</p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((area) => {
                  const tableCount = area.tables?.length ?? 0;
                  const capacity = (area.tables ?? []).reduce((s, t) => s + t.capacity, 0);
                  return (
                    <TableRow key={area.id} className="hover:bg-background/50 transition-colors">
                      <TableCell>
                        <p className="font-medium text-sm text-text-primary">{area.name}</p>
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium text-text-primary">
                        {tableCount}
                      </TableCell>
                      <TableCell className="text-center text-sm text-text-primary">
                        {capacity > 0 ? `${capacity} pax` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={area.is_active ? 'success' : 'default'} size="sm">
                          {area.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => { setEditingArea(area); setViewMode('edit'); }}
                            className="h-8 w-8 p-0"
                            title="Ubah"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleDelete(area)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <p className="text-xs text-text-disabled">
        Menampilkan {filtered.length} dari {areas.length} area
      </p>
    </div>
  );
}
