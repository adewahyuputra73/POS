"use client";

import { useState, useMemo } from 'react';
import { Area, AreaFormData, AreaFilters } from '@/features/table-management/types';
import { mockAreas, filterAreas, getAreaStats } from '@/features/table-management/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus, Search, MapPin, Users, Layers, Pencil, Trash2, ArrowLeft,
  X, Baby, Wifi, Music, Wind, Cigarette, Tv,
} from 'lucide-react';

type ViewMode = 'list' | 'add' | 'edit';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

// ==================
// Area Form
// ==================
function AreaForm({ initialData, onSubmit, onCancel, isEditing }: {
  initialData?: Area;
  onSubmit: (data: AreaFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) {
  const [form, setForm] = useState<AreaFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    basePrice: initialData?.basePrice || 0,
    paxDivider: initialData?.paxDivider || 1,
    enableExtraPrice: initialData?.enableExtraPrice || false,
    enableMaxCapacity: initialData?.enableMaxCapacity || false,
    maxCapacity: initialData?.maxCapacity,
    allowChildren: initialData?.allowChildren ?? true,
    services: initialData?.services.map(s => s.name) || [],
    photos: initialData?.photos.map(p => p.imageUrl) || [],
  });
  const [newService, setNewService] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nama area wajib diisi';
    if (form.name.length > 50) errs.name = 'Maksimal 50 karakter';
    if (form.enableMaxCapacity && (!form.maxCapacity || form.maxCapacity <= 0)) {
      errs.maxCapacity = 'Batas maksimal harus > 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addService = () => {
    if (newService.trim() && newService.length <= 20 && form.services.length < 10) {
      setForm(prev => ({ ...prev, services: [...prev.services, newService.trim()] }));
      setNewService('');
    }
  };

  const removeService = (idx: number) => {
    setForm(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
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
        {/* Informasi Area */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Informasi Area</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Nama Area * <span className="text-text-disabled">({form.name.length}/50)</span></label>
              <Input
                value={form.name}
                onChange={(e) => { setForm(prev => ({ ...prev, name: e.target.value })); if (errors.name) setErrors(prev => ({ ...prev, name: '' })); }}
                placeholder="Contoh: Lt.1 Indoor"
                maxLength={50}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Deskripsi Area</label>
              <Input
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi area (opsional)"
              />
            </div>
          </div>

          {/* Harga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Harga (Rp)</label>
              <Input
                type="number"
                value={form.basePrice || ''}
                onChange={(e) => setForm(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                placeholder="0"
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Per Pax</label>
              <Input
                type="number"
                value={form.paxDivider || ''}
                onChange={(e) => setForm(prev => ({ ...prev, paxDivider: Number(e.target.value) || 1 }))}
                placeholder="1"
                min={1}
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Pengaturan Area</h3>

          {/* Extra Price Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-text-primary font-medium">Sesuaikan Harga Tambahan</p>
              <p className="text-xs text-text-disabled">Hitung biaya tambahan jika jumlah melebihi batas paket</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, enableExtraPrice: !prev.enableExtraPrice }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.enableExtraPrice ? 'bg-primary' : 'bg-background'}`}
            >
              <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.enableExtraPrice ? 'translate-x-5' : ''}`} />
            </button>
          </label>

          {/* Max Capacity Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-text-primary font-medium">Terapkan Batas Maksimal Pengunjung</p>
              <p className="text-xs text-text-disabled">Area memiliki max capacity, tidak bisa menerima reservasi over limit</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, enableMaxCapacity: !prev.enableMaxCapacity }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.enableMaxCapacity ? 'bg-primary' : 'bg-background'}`}
            >
              <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.enableMaxCapacity ? 'translate-x-5' : ''}`} />
            </button>
          </label>
          {form.enableMaxCapacity && (
            <div className="max-w-xs ml-4">
              <Input
                type="number"
                value={form.maxCapacity || ''}
                onChange={(e) => setForm(prev => ({ ...prev, maxCapacity: Number(e.target.value) }))}
                placeholder="Maksimal pengunjung"
                min={1}
                className={errors.maxCapacity ? 'border-red-500' : ''}
              />
              {errors.maxCapacity && <p className="text-xs text-red-500 mt-1">{errors.maxCapacity}</p>}
            </div>
          )}

          {/* Child Access Toggle */}
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm text-text-primary font-medium">Akses Anak</p>
              <p className="text-xs text-text-disabled">Area dapat dipilih untuk reservasi dengan anak</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, allowChildren: !prev.allowChildren }))}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.allowChildren ? 'bg-primary' : 'bg-background'}`}
            >
              <div className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.allowChildren ? 'translate-x-5' : ''}`} />
            </button>
          </label>
        </div>

        {/* Services & Facilities */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Layanan & Fasilitas</h3>
          <div className="flex flex-wrap gap-2">
            {form.services.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                {s}
                <button type="button" onClick={() => removeService(i)} className="hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-xs">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Tambah fasilitas (maks 20 karakter)"
              maxLength={20}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addService} disabled={!newService.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Submit */}
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
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [filters, setFilters] = useState<AreaFilters>({ search: '' });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  const filtered = useMemo(() => filterAreas(areas, filters), [areas, filters]);
  const stats = useMemo(() => getAreaStats(areas), [areas]);

  const handleAdd = (data: AreaFormData) => {
    const newArea: Area = {
      id: Math.max(...areas.map(a => a.id)) + 1,
      ...data,
      services: data.services.map((s, i) => ({ id: Date.now() + i, name: s })),
      photos: data.photos.map((p, i) => ({ id: Date.now() + i, imageUrl: p })),
      isActive: true, tableCount: 0, totalCapacity: 0,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    setAreas(prev => [...prev, newArea]);
    setViewMode('list');
  };

  const handleEdit = (data: AreaFormData) => {
    if (!editingArea) return;
    setAreas(prev => prev.map(a => a.id === editingArea.id ? {
      ...a, ...data,
      services: data.services.map((s, i) => ({ id: Date.now() + i, name: s })),
      photos: data.photos.map((p, i) => ({ id: Date.now() + i, imageUrl: p })),
      updatedAt: new Date().toISOString(),
    } : a));
    setViewMode('list');
    setEditingArea(null);
  };

  const handleDelete = (area: Area) => {
    if (area.tableCount > 0) {
      alert('Tidak bisa menghapus area yang masih memiliki meja.');
      return;
    }
    if (confirm(`Hapus area "${area.name}"?`)) {
      setAreas(prev => prev.map(a => a.id === area.id ? { ...a, isActive: false } : a));
    }
  };

  if (viewMode === 'add') {
    return <div className="animate-in fade-in duration-300"><AreaForm onSubmit={handleAdd} onCancel={() => setViewMode('list')} /></div>;
  }

  if (viewMode === 'edit' && editingArea) {
    return <div className="animate-in fade-in duration-300"><AreaForm initialData={editingArea} onSubmit={handleEdit} onCancel={() => { setViewMode('list'); setEditingArea(null); }} isEditing /></div>;
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
          { label: 'Total Area', value: stats.totalAreas, icon: MapPin, color: 'text-blue-700 bg-blue-50' },
          { label: 'Area Aktif', value: stats.activeAreas, icon: Layers, color: 'text-green-700 bg-green-50' },
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
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Cari area..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-background/50">
              <TableHead className="font-semibold text-xs">Nama Area</TableHead>
              <TableHead className="font-semibold text-xs text-center">Jumlah Meja</TableHead>
              <TableHead className="font-semibold text-xs text-center">Kapasitas</TableHead>
              <TableHead className="font-semibold text-xs text-center">Layanan & Fasilitas</TableHead>
              <TableHead className="font-semibold text-xs text-center">Status</TableHead>
              <TableHead className="font-semibold text-xs text-center w-24">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((area) => (
              <TableRow key={area.id} className="hover:bg-background/50 transition-colors">
                <TableCell>
                  <div>
                    <p className="font-medium text-sm text-text-primary">{area.name}</p>
                    {area.description && <p className="text-xs text-text-disabled truncate max-w-xs">{area.description}</p>}
                    {area.basePrice > 0 && <p className="text-xs text-primary mt-0.5">{formatCurrency(area.basePrice)} / {area.paxDivider} pax</p>}
                  </div>
                </TableCell>
                <TableCell className="text-center text-sm font-medium text-text-primary">{area.tableCount}</TableCell>
                <TableCell className="text-center text-sm text-text-primary">{area.totalCapacity} pax</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {area.services.slice(0, 3).map(s => (
                      <Badge key={s.id} variant="default" size="sm">{s.name}</Badge>
                    ))}
                    {area.services.length > 3 && (
                      <Badge variant="default" size="sm">+{area.services.length - 3}</Badge>
                    )}
                    {area.services.length === 0 && <span className="text-xs text-text-disabled">-</span>}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={area.isActive ? 'success' : 'default'} size="sm">
                    {area.isActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingArea(area); setViewMode('edit'); }} className="h-8 w-8 p-0" title="Ubah">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(area)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700" title="Hapus">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-text-disabled">Menampilkan {filtered.length} dari {areas.length} area</p>
    </div>
  );
}
