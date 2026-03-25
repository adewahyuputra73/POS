"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui";
import { Search, Download, Users } from "lucide-react";
import { CustomerFilters, Customer, CustomerDetail } from "@/features/customers/types";
import { filterCustomers } from "@/features/customers/mock-data";
import { customerService } from "@/features/customers/services";
import { CustomerTable } from "@/features/customers/components/customer-table";
import { CustomerFilterBar } from "@/features/customers/components/customer-filter-bar";
import { CustomerDetailView } from "@/features/customers/components/customer-detail-view";

export default function CustomersPage() {
  const { showToast } = useToast();

  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    segment: 'all',
    lastVisit: 'all',
    birthdayMonth: null,
    totalSpent: 'all',
    productId: null,
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<CustomerDetail | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Fetch customer list on mount
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await customerService.list();
        setCustomers(response.data);
      } catch {
        showToast("Gagal memuat data pelanggan", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [showToast]);

  const filteredCustomers = useMemo(() => filterCustomers(customers, filters), [customers, filters]);

  const handleViewDetail = async (customer: Customer) => {
    setSelectedCustomerId(customer.id);
    setSelectedDetail(null);
    setIsDetailLoading(true);
    setView('detail');
    try {
      const detail = await customerService.detail(customer.id);
      setSelectedDetail(detail);
    } catch {
      showToast("Gagal memuat detail pelanggan", "error");
      setView('list');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleWhatsApp = (customer: { phone: string }) => {
    const cleanPhone = customer.phone.replace(/^0/, '62');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  // Stats derived from fetched list
  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter(c => c.is_active).length;
    const inactive = customers.filter(c => !c.is_active).length;
    return { total, active, inactive };
  }, [customers]);

  if (view === 'detail') {
    if (isDetailLoading) {
      return (
        <div className="space-y-6">
          <PageHeader
            title="Detail Pelanggan"
            description="Memuat data..."
            breadcrumbs={[
              { label: "Home", href: "/dashboard" },
              { label: "Pelanggan", href: "/customers" },
              { label: "Detail" },
            ]}
          />
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      );
    }

    if (selectedDetail) {
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-text-secondary">Total Pelanggan</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-text-secondary">Aktif</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-400">{stats.inactive}</p>
              <p className="text-xs text-text-secondary">Tidak Aktif</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
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
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onViewDetail={handleViewDetail}
          onWhatsApp={handleWhatsApp}
        />
      )}
    </div>
  );
}
