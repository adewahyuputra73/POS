"use client";

import { useState, useMemo } from 'react';
import { RestaurantTable, TableFilters, TableFormData } from '@/features/table-management/types';
import { mockTables, mockAreas, filterTables } from '@/features/table-management/mock-data';
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  available: { label: 'Tersedia', variant: 'success' },
  occupied: { label: 'Terisi', variant: 'warning' },
  reserved: { label: 'Reserved', variant: 'default' },
};

// ==================
// Table Form Dialog
// ==================
function TableFormDialog({ initialData, onSubmit, onCancel, isEditing }: {
  initialData?: RestaurantTable;
  onSubmit: (data: TableFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}) {
  const [form, setForm] = useState<TableFormData>({
    name: initialData?.name || '',
    areaId: initialData?.areaId || (mockAreas[0]?.id || 0),
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 mb-5">
          {isEditing ? 'Ubah Meja' : 'Tambah Meja'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Nama Meja * <span className="text-gray-400">(maks 5 karakter)</span></label>
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
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Area *</label>
            <Select value={String(form.areaId)} onValueChange={(v) => setForm(prev => ({ ...prev, areaId: Number(v) }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {mockAreas.filter(a => a.isActive).map(area => (
                  <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Kapasitas</label>
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
function QrPreviewDialog({ table, onClose }: { table: RestaurantTable; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Meja {table.name}</h3>
        <p className="text-xs text-gray-500 mb-6">{table.areaName}</p>

        {/* QR Placeholder */}
        <div className="mx-auto w-48 h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
          <div className="text-center">
            <QrCode className="h-16 w-16 text-gray-300 mx-auto mb-2" />
            <p className="text-[10px] text-gray-400 font-mono break-all px-2">{table.qrCode}</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          URL: <span className="font-mono text-gray-600">{table.qrCode}</span>
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
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables);
  const [filters, setFilters] = useState<TableFilters>({ search: '', areaId: 'all' });
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [qrTable, setQrTable] = useState<RestaurantTable | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filtered = useMemo(() => filterTables(tables, filters), [tables, filters]);

  const handleAdd = (data: TableFormData) => {
    const area = mockAreas.find(a => a.id === data.areaId);
    const newTable: RestaurantTable = {
      id: Math.max(...tables.map(t => t.id)) + 1,
      areaId: data.areaId,
      areaName: area?.name || '',
      name: data.name,
      capacity: data.capacity,
      shape: 'rectangle',
      positionX: 50, positionY: 50, width: 80, height: 80, rotation: 0,
      qrCode: `opaper.app/fere-cafe?meja=${data.name}`,
      isActive: true, status: 'available',
      createdAt: new Date().toISOString(),
    };
    setTables(prev => [...prev, newTable]);
    setShowForm(false);
  };

  const handleEdit = (data: TableFormData) => {
    if (!editingTable) return;
    const area = mockAreas.find(a => a.id === data.areaId);
    setTables(prev => prev.map(t => t.id === editingTable.id ? {
      ...t, name: data.name, areaId: data.areaId, areaName: area?.name || '', capacity: data.capacity,
      qrCode: `opaper.app/fere-cafe?meja=${data.name}`,
    } : t));
    setEditingTable(null);
  };

  const handleDelete = (table: RestaurantTable) => {
    if (table.status === 'occupied') {
      alert('Tidak bisa menghapus meja yang sedang terisi.');
      return;
    }
    if (confirm(`Hapus meja "${table.name}" (${table.areaName})?`)) {
      setTables(prev => prev.filter(t => t.id !== table.id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meja</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola daftar meja untuk semua area</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Meja
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-blue-50 text-blue-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
            <p className="text-xs text-gray-500">Total Meja</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-50 text-green-700">
            <UsersIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{tables.reduce((s, t) => s + t.capacity, 0)}</p>
            <p className="text-xs text-gray-500">Total Kapasitas</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-green-50 text-green-700">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{tables.filter(t => t.status === 'available').length}</p>
            <p className="text-xs text-gray-500">Tersedia</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Cari nama meja..."
            className="pl-9"
          />
        </div>
        <Select value={String(filters.areaId)} onValueChange={(v) => setFilters(prev => ({ ...prev, areaId: v === 'all' ? 'all' : Number(v) }))}>
          <SelectTrigger className="w-48">
            <SelectValue>
              {filters.areaId === 'all' 
                ? "Semua Area" 
                : (mockAreas.find(a => a.id === filters.areaId)?.name || String(filters.areaId))}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Area</SelectItem>
            {mockAreas.filter(a => a.isActive).map(area => (
              <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filtered.length && filtered.length > 0}
                  onChange={() => setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(t => t.id))}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
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
              const sc = statusConfig[t.status];
              return (
                <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(t.id)}
                      onChange={() => setSelectedIds(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        t.shape === 'circle' ? 'rounded-full bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {t.name}
                      </div>
                      <span className="text-sm font-medium text-gray-900">Meja {t.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{t.areaName}</TableCell>
                  <TableCell className="text-center text-sm text-gray-700">{t.capacity} pax</TableCell>
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

      <p className="text-xs text-gray-400">
        Menampilkan {filtered.length} dari {tables.length} meja
        {selectedIds.length > 0 && <span> · {selectedIds.length} dipilih</span>}
      </p>

      {/* Dialogs */}
      {showForm && <TableFormDialog onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
      {editingTable && <TableFormDialog initialData={editingTable} onSubmit={handleEdit} onCancel={() => setEditingTable(null)} isEditing />}
      {qrTable && <QrPreviewDialog table={qrTable} onClose={() => setQrTable(null)} />}
    </div>
  );
}
