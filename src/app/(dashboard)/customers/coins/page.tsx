"use client";

import { useState, useMemo } from 'react';
import { CoinCustomer, CoinFilters, CoinApproval } from '@/features/customers/types';
import { mockCoinCustomers, mockCoinApprovals, filterCoinCustomers, coinSettings } from '@/features/customers/mock-data';
import { CoinTable } from '@/features/customers/components/coin-table';
import { CoinAdjustDialog } from '@/features/customers/components/coin-adjust-dialog';
import { CoinTransferDialog } from '@/features/customers/components/coin-transfer-dialog';
import { CoinApprovalList } from '@/features/customers/components/coin-approval-list';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Coins, Clock, Users, TrendingUp } from 'lucide-react';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export default function CoinsPage() {
  const [customers, setCustomers] = useState<CoinCustomer[]>(mockCoinCustomers);
  const [approvals, setApprovals] = useState<CoinApproval[]>(mockCoinApprovals);
  const [filters, setFilters] = useState<CoinFilters>({ search: '' });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [adjustTarget, setAdjustTarget] = useState<CoinCustomer | null>(null);
  const [transferTarget, setTransferTarget] = useState<CoinCustomer | null>(null);
  const [showApprovals, setShowApprovals] = useState(false);

  const filtered = useMemo(() => filterCoinCustomers(customers, filters), [customers, filters]);
  const pendingCount = approvals.filter(a => a.status === 'pending').length;

  const totalCoins = customers.reduce((s, c) => s + c.totalCoins, 0);
  const totalValue = customers.reduce((s, c) => s + c.coinValue, 0);

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleToggleSelectAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(c => c.id));
  };

  const handleAdjust = (type: 'credit' | 'debit', amount: number) => {
    if (!adjustTarget) return;
    const delta = type === 'credit' ? amount : -amount;
    setCustomers(prev => prev.map(c => c.id === adjustTarget.id ? {
      ...c,
      totalCoins: c.totalCoins + delta,
      coinValue: (c.totalCoins + delta) * coinSettings.conversionRate,
    } : c));
    if (coinSettings.approvalRequired) {
      const newApproval: CoinApproval = {
        id: Math.max(...approvals.map(a => a.id), 0) + 1,
        customerId: adjustTarget.id, customerName: adjustTarget.name, customerPhone: adjustTarget.phone,
        type: 'adjust', amount, direction: type, status: 'pending',
        requestedBy: 'Admin', approvedBy: null, createdAt: new Date().toISOString(), approvedAt: null,
      };
      setApprovals(prev => [...prev, newApproval]);
    }
    setAdjustTarget(null);
  };

  const handleTransfer = (recipientId: number, amount: number) => {
    if (!transferTarget) return;
    setCustomers(prev => prev.map(c => {
      if (c.id === transferTarget.id) return { ...c, totalCoins: c.totalCoins - amount, coinValue: (c.totalCoins - amount) * coinSettings.conversionRate };
      if (c.id === recipientId) return { ...c, totalCoins: c.totalCoins + amount, coinValue: (c.totalCoins + amount) * coinSettings.conversionRate };
      return c;
    }));
    setTransferTarget(null);
  };

  const handleApprove = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const, approvedBy: 'Supervisor', approvedAt: new Date().toISOString() } : a));
  };

  const handleReject = (id: number) => {
    setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const, approvedBy: 'Supervisor', approvedAt: new Date().toISOString() } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Koin Pelanggan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola saldo koin loyalty pelanggan
            <span className="ml-2 text-xs text-gray-400">(1 koin = {formatCurrency(coinSettings.conversionRate)})</span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowApprovals(true)}
          className="gap-2 relative"
        >
          <Clock className="h-4 w-4" />
          Approval Koin
          {pendingCount > 0 && (
            <Badge variant="warning" size="sm" className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 text-[10px]">
              {pendingCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pelanggan', value: customers.length.toString(), icon: Users, color: 'text-blue-700 bg-blue-50' },
          { label: 'Total Koin Beredar', value: totalCoins.toLocaleString('id-ID'), icon: Coins, color: 'text-amber-700 bg-amber-50' },
          { label: 'Total Nilai', value: formatCurrency(totalValue), icon: TrendingUp, color: 'text-green-700 bg-green-50' },
          { label: 'Pending Approval', value: pendingCount.toString(), icon: Clock, color: 'text-orange-700 bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 truncate">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Cari nama atau nomor telepon..."
          className="pl-9"
        />
      </div>

      {/* Table */}
      <CoinTable
        customers={filtered}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onAdjust={setAdjustTarget}
        onTransfer={setTransferTarget}
      />

      <p className="text-xs text-gray-400">
        Menampilkan {filtered.length} dari {customers.length} pelanggan
        {selectedIds.length > 0 && <span> · {selectedIds.length} dipilih</span>}
      </p>

      {/* Dialogs */}
      {adjustTarget && (
        <CoinAdjustDialog customer={adjustTarget} onConfirm={handleAdjust} onCancel={() => setAdjustTarget(null)} />
      )}
      {transferTarget && (
        <CoinTransferDialog customer={transferTarget} onConfirm={handleTransfer} onCancel={() => setTransferTarget(null)} />
      )}
      {showApprovals && (
        <CoinApprovalList approvals={approvals} onApprove={handleApprove} onReject={handleReject} onClose={() => setShowApprovals(false)} />
      )}
    </div>
  );
}
