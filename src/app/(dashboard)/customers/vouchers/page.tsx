"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { voucherService } from '@/features/vouchers/services/voucher-service';
import type { Voucher as ApiVoucher, CreateVoucherRequest } from '@/features/vouchers/types';
import type { VoucherFormData } from '@/features/customers/types';
import { VoucherForm } from '@/features/customers/components/voucher-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Plus, Search, Tag, Pencil, Trash2 } from 'lucide-react';

type ViewMode = 'list' | 'add' | 'edit';
type LocalStatus = 'active' | 'upcoming' | 'ended';

function getStatus(v: ApiVoucher): LocalStatus {
  const now = new Date();
  if (new Date(v.valid_from) > now) return 'upcoming';
  if (new Date(v.valid_until) < now) return 'ended';
  return 'active';
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const STATUS_TABS: { value: LocalStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Berjalan' },
  { value: 'upcoming', label: 'Akan Datang' },
  { value: 'ended', label: 'Selesai' },
];

const STATUS_CONFIG: Record<LocalStatus, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  active: { label: 'Berjalan', variant: 'success' },
  upcoming: { label: 'Akan Datang', variant: 'warning' },
  ended: { label: 'Selesai', variant: 'default' },
};

function toApiRequest(data: VoucherFormData): CreateVoucherRequest {
  return {
    code: data.code,
    name: data.description,
    discount_type: data.discountType === 'percent' ? 'PERCENTAGE' : 'FIXED',
    discount_value: data.discountValue,
    max_discount: data.budgetPerTransaction ?? undefined,
    min_purchase: data.minOrder ?? undefined,
    quota: data.quotaTotal ?? 0,
    valid_from: data.startDate,
    valid_until: data.endDate,
  };
}

function toDateTimeLocal(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  if (dateStr.includes('T')) return dateStr.slice(0, 16);
  return `${dateStr}T00:00`;
}

function toFormData(v: ApiVoucher): VoucherFormData {
  return {
    code: v.code,
    type: 'produk',
    description: v.name ?? '',
    discountType: v.discount_type === 'PERCENTAGE' ? 'percent' : 'fixed',
    discountValue: v.discount_value,
    budgetPerTransaction: v.max_discount,
    quotaTotal: v.quota,
    isStackable: false,
    productScope: 'all',
    selectedProductIds: [],
    minOrder: v.min_purchase,
    specificDelivery: null,
    specificPayment: null,
    specificCustomerSegment: null,
    startDate: toDateTimeLocal(v.valid_from),
    endDate: toDateTimeLocal(v.valid_until),
  };
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<ApiVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LocalStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingVoucher, setEditingVoucher] = useState<ApiVoucher | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await voucherService.list();
      setVouchers(Array.isArray(data) ? data : []);
    } catch {
      showToast('Gagal memuat voucher', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const vouchersWithStatus = useMemo(() =>
    vouchers.map(v => ({ ...v, _status: getStatus(v) })),
    [vouchers]
  );

  const stats = useMemo(() => ({
    total: vouchers.length,
    active: vouchersWithStatus.filter(v => v._status === 'active').length,
    upcoming: vouchersWithStatus.filter(v => v._status === 'upcoming').length,
    ended: vouchersWithStatus.filter(v => v._status === 'ended').length,
  }), [vouchers, vouchersWithStatus]);

  const filtered = useMemo(() => vouchersWithStatus.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || v.code.toLowerCase().includes(q)
      || (v.name ?? '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || v._status === statusFilter;
    return matchSearch && matchStatus;
  }), [vouchersWithStatus, search, statusFilter]);

  const handleAdd = async (data: VoucherFormData) => {
    try {
      await voucherService.create(toApiRequest(data));
      showToast('Voucher berhasil dibuat', 'success');
      setViewMode('list');
      fetchData();
    } catch {
      showToast('Gagal membuat voucher', 'error');
    }
  };

  const handleEdit = async (data: VoucherFormData) => {
    if (!editingVoucher) return;
    try {
      await voucherService.update(editingVoucher.id, toApiRequest(data));
      showToast('Voucher berhasil diperbarui', 'success');
      setViewMode('list');
      setEditingVoucher(null);
      fetchData();
    } catch {
      showToast('Gagal memperbarui voucher', 'error');
    }
  };

  const handleDelete = async (v: ApiVoucher) => {
    if (!confirm(`Hapus voucher ${v.code}?`)) return;
    try {
      await voucherService.delete(v.id);
      showToast('Voucher berhasil dihapus', 'success');
      fetchData();
    } catch {
      showToast('Gagal menghapus voucher', 'error');
    }
  };

  if (viewMode === 'add') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <VoucherForm onSubmit={handleAdd} onCancel={() => setViewMode('list')} />
      </div>
    );
  }

  if (viewMode === 'edit' && editingVoucher) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <VoucherForm
          initialData={toFormData(editingVoucher)}
          onSubmit={handleEdit}
          onCancel={() => { setViewMode('list'); setEditingVoucher(null); }}
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
          <h1 className="text-2xl font-bold text-text-primary">Voucher</h1>
          <p className="text-sm text-text-secondary mt-1">Kelola voucher diskon untuk pelanggan</p>
        </div>
        <Button onClick={() => setViewMode('add')} className="gap-2">
          <Plus className="h-4 w-4" /> Tambah Voucher
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Voucher', value: stats.total, color: 'text-text-primary bg-background' },
          { label: 'Berjalan', value: stats.active, color: 'text-green-700 bg-green-50' },
          { label: 'Akan Datang', value: stats.upcoming, color: 'text-yellow-700 bg-yellow-50' },
          { label: 'Selesai', value: stats.ended, color: 'text-text-secondary bg-background' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode atau nama voucher..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-background rounded-lg p-1">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <Badge variant="default" size="sm" className="ml-1.5 h-4 min-w-[16px] px-1 text-[10px]">
                  {tab.value === 'active' ? stats.active
                    : tab.value === 'upcoming' ? stats.upcoming
                    : stats.ended}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-xl border border-border p-12 text-center">
          <Tag className="h-12 w-12 text-text-disabled mx-auto mb-3" />
          <p className="text-text-secondary text-sm">Belum ada voucher</p>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-background/50">
                <TableHead className="font-semibold text-xs">Kode & Nama</TableHead>
                <TableHead className="font-semibold text-xs">Potongan</TableHead>
                <TableHead className="font-semibold text-xs">Durasi</TableHead>
                <TableHead className="font-semibold text-xs">Kuota</TableHead>
                <TableHead className="font-semibold text-xs text-center">Status</TableHead>
                <TableHead className="font-semibold text-xs text-center w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => {
                const sc = STATUS_CONFIG[v._status];
                const discountLabel = v.discount_type === 'PERCENTAGE'
                  ? `${v.discount_value}%`
                  : formatCurrency(v.discount_value);
                const quotaPercent = v.quota > 0 ? Math.round((v.used / v.quota) * 100) : null;

                return (
                  <TableRow key={v.id} className="hover:bg-background/50 transition-colors">
                    <TableCell>
                      <p className="font-mono font-semibold text-sm text-text-primary">{v.code}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{v.name}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-semibold text-primary">{discountLabel}</span>
                      {v.max_discount != null && (
                        <p className="text-[11px] text-text-disabled">maks {formatCurrency(v.max_discount)}/trx</p>
                      )}
                      {v.min_purchase != null && (
                        <p className="text-[11px] text-text-disabled">min order {formatCurrency(v.min_purchase)}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-text-primary">{formatDate(v.valid_from)}</p>
                      <p className="text-[11px] text-text-disabled">s/d {formatDate(v.valid_until)}</p>
                    </TableCell>
                    <TableCell>
                      {v.quota > 0 ? (
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-text-secondary">{v.used} / {v.quota}</span>
                            <span className="text-text-disabled">{quotaPercent}%</span>
                          </div>
                          <div className="w-full bg-background rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                quotaPercent! >= 100 ? 'bg-red-500'
                                : quotaPercent! >= 75 ? 'bg-yellow-500'
                                : 'bg-primary'
                              }`}
                              style={{ width: `${Math.min(quotaPercent!, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-text-disabled">Tanpa batas</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => { setEditingVoucher(v); setViewMode('edit'); }}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => handleDelete(v)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
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
      )}

      <p className="text-xs text-text-disabled">
        Menampilkan {filtered.length} dari {vouchers.length} voucher
      </p>
    </div>
  );
}
