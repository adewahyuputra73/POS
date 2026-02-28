"use client";

import { useState, useMemo } from 'react';
import { VoucherFilters, VoucherStatus, Voucher, VoucherFormData } from '@/features/customers/types';
import { mockVouchers, filterVouchers, getVoucherStats } from '@/features/customers/mock-data';
import { VoucherTable } from '@/features/customers/components/voucher-table';
import { VoucherForm } from '@/features/customers/components/voucher-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Tag } from 'lucide-react';

type ViewMode = 'list' | 'add' | 'edit';

const statusTabs: { value: VoucherStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Berjalan' },
  { value: 'upcoming', label: 'Akan Datang' },
  { value: 'ended', label: 'Selesai' },
];

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(mockVouchers);
  const [filters, setFilters] = useState<VoucherFilters>({ search: '', status: 'all' });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const filteredVouchers = useMemo(() => filterVouchers(vouchers, filters), [vouchers, filters]);
  const stats = useMemo(() => getVoucherStats(vouchers), [vouchers]);

  const handleAdd = (data: VoucherFormData) => {
    const newVoucher: Voucher = {
      ...data,
      id: Math.max(...vouchers.map(v => v.id)) + 1,
      quotaUsed: 0,
      status: new Date(data.startDate) > new Date() ? 'upcoming' : 'active',
      createdAt: new Date().toISOString(),
    };
    setVouchers(prev => [...prev, newVoucher]);
    setViewMode('list');
  };

  const handleEdit = (data: VoucherFormData) => {
    if (!editingVoucher) return;
    setVouchers(prev => prev.map(v => v.id === editingVoucher.id ? {
      ...v, ...data,
      status: new Date(data.startDate) > new Date() ? 'upcoming' as const : 'active' as const,
    } : v));
    setViewMode('list');
    setEditingVoucher(null);
  };

  const handleDelete = (voucher: Voucher) => {
    if (confirm(`Hapus voucher ${voucher.code}?`)) {
      setVouchers(prev => prev.filter(v => v.id !== voucher.id));
    }
  };

  const startEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setViewMode('edit');
  };

  if (viewMode === 'add') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <VoucherForm onSubmit={handleAdd} onCancel={() => setViewMode('list')} />
      </div>
    );
  }

  if (viewMode === 'edit' && editingVoucher) {
    const formData: VoucherFormData = {
      code: editingVoucher.code,
      type: editingVoucher.type,
      description: editingVoucher.description,
      discountType: editingVoucher.discountType,
      discountValue: editingVoucher.discountValue,
      budgetPerTransaction: editingVoucher.budgetPerTransaction,
      quotaTotal: editingVoucher.quotaTotal,
      isStackable: editingVoucher.isStackable,
      productScope: editingVoucher.productScope,
      selectedProductIds: editingVoucher.selectedProductIds,
      minOrder: editingVoucher.minOrder,
      specificDelivery: editingVoucher.specificDelivery,
      specificPayment: editingVoucher.specificPayment,
      specificCustomerSegment: editingVoucher.specificCustomerSegment,
      startDate: editingVoucher.startDate,
      endDate: editingVoucher.endDate,
    };
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <VoucherForm initialData={formData} onSubmit={handleEdit} onCancel={() => { setViewMode('list'); setEditingVoucher(null); }} isEditing />
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Voucher', value: stats.total, icon: Tag, color: 'text-text-primary bg-background' },
          { label: 'Berjalan', value: stats.active, icon: Tag, color: 'text-green-700 bg-green-50' },
          { label: 'Akan Datang', value: stats.upcoming, icon: Tag, color: 'text-yellow-700 bg-yellow-50' },
          { label: 'Selesai', value: stats.ended, icon: Tag, color: 'text-text-secondary bg-background' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Status Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
          <Input
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Cari kode voucher atau deskripsi..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 bg-background rounded-lg p-1">
          {statusTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilters(prev => ({ ...prev, status: tab.value }))}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filters.status === tab.value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <Badge variant="default" size="sm" className="ml-1.5 h-4 min-w-[16px] px-1 text-[10px]">
                  {tab.value === 'active' ? stats.active : tab.value === 'upcoming' ? stats.upcoming : stats.ended}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <VoucherTable
        vouchers={filteredVouchers}
        onEdit={startEdit}
        onDelete={handleDelete}
      />

      {/* Result count */}
      <p className="text-xs text-text-disabled">
        Menampilkan {filteredVouchers.length} dari {vouchers.length} voucher
      </p>
    </div>
  );
}
