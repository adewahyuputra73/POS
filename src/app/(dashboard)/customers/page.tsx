"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Users } from "lucide-react";
import { CustomerFilters } from "@/features/customers/types";
import { mockCustomers, filterCustomers, getCustomerDetail, mockCustomerDetails } from "@/features/customers/mock-data";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { CustomerFilterBar } from "@/features/customers/components/customer-filter-bar";
import { CustomerDetailView } from "@/features/customers/components/customer-detail-view";

export default function CustomersPage() {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    segment: 'all',
    lastVisit: 'all',
    birthdayMonth: null,
    totalSpent: 'all',
    productId: null,
  });

  const filteredCustomers = useMemo(() => filterCustomers(mockCustomers, filters), [filters]);

  const selectedDetail = useMemo(() => {
    if (!selectedCustomerId) return null;
    return getCustomerDetail(selectedCustomerId) || null;
  }, [selectedCustomerId]);

  const handleViewDetail = (customer: { id: number }) => {
    setSelectedCustomerId(customer.id);
    setView('detail');
  };

  const handleWhatsApp = (customer: { phone: string }) => {
    const cleanPhone = customer.phone.replace(/^0/, '62');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  // Stats
  const stats = useMemo(() => {
    const total = mockCustomers.length;
    const hot = mockCustomers.filter(c => c.segment === 'hot').length;
    const warm = mockCustomers.filter(c => c.segment === 'warm').length;
    const boil = mockCustomers.filter(c => c.segment === 'boil').length;
    return { total, hot, warm, boil };
  }, []);

  if (view === 'detail' && selectedDetail) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Pelanggan"
          description={selectedDetail.name}
          breadcrumbs={[
            { label: "Home", href: "/dashboard" },
            { label: "Pelanggan", href: "/customers" },
            { label: selectedDetail.name },
          ]}
        />
        <CustomerDetailView customer={selectedDetail} onBack={() => setView('list')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pelanggan"
        description="Kelola data pelanggan dan segmentasi"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Pelanggan" },
        ]}
        actions={
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" /> Ekspor
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Pelanggan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
              <span className="text-lg">🔥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.hot}</p>
              <p className="text-xs text-gray-500">Hot</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <span className="text-lg">🌤</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.warm}</p>
              <p className="text-xs text-gray-500">Warm</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <span className="text-lg">❄️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.boil}</p>
              <p className="text-xs text-gray-500">Boil</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-border p-5 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari nama atau nomor telepon..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>
        <CustomerFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={filteredCustomers.length}
        />
      </div>

      {/* Customer Table */}
      <CustomerTable
        customers={filteredCustomers}
        onViewDetail={handleViewDetail}
        onWhatsApp={handleWhatsApp}
      />
    </div>
  );
}
