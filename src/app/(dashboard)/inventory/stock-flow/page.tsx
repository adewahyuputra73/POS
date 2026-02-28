"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Search, Plus, ShoppingCart, MinusCircle, ClipboardCheck, ArrowLeftRight, FileText, ChevronDown, X } from "lucide-react";
import { StockFlowTable } from "@/features/inventory/components/stock-flow-table";
import { StockFlowDetailView } from "@/features/inventory/components/stock-flow-detail-view";
import { PurchaseForm } from "@/features/inventory/components/purchase-form";
import { ExpenseForm } from "@/features/inventory/components/expense-form";
import { StockOpnameForm } from "@/features/inventory/components/stock-opname-form";
import { TransferForm } from "@/features/inventory/components/transfer-form";
import { PurchaseOrderForm } from "@/features/inventory/components/purchase-order-form";
import { POMultiSupplierForm } from "@/features/inventory/components/po-multi-supplier-form";
import { mockStockFlowRecords, mockStockFlowDetails, filterStockFlowRecords } from "@/features/inventory/mock-data";
import { StockFlowRecord, StockFlowFilters, StockFlowType, StockFlowDetailRecord } from "@/features/inventory/types";

type ViewMode = 'list' | 'detail' | 'purchase' | 'expense' | 'opname' | 'transfer' | 'purchase-order' | 'po-multi';

export default function StockFlowPage() {
  const { showToast } = useToast();

  const [records, setRecords] = useState<StockFlowRecord[]>(mockStockFlowRecords);
  const [filters, setFilters] = useState<StockFlowFilters>({ type: 'all', search: '' });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDetail, setSelectedDetail] = useState<StockFlowDetailRecord | null>(null);

  const filteredRecords = useMemo(() => filterStockFlowRecords(records, filters), [records, filters]);

  const handleViewDetail = (record: StockFlowRecord) => {
    const detail = mockStockFlowDetails.find(d => d.id === record.id);
    if (detail) {
      setSelectedDetail(detail);
      setViewMode('detail');
    } else {
      showToast("Detail tidak ditemukan", "error");
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDetail(null);
  };

  const handleFormSubmit = (formType: string) => {
    showToast(`${formType} berhasil diproses. Stok telah diperbarui.`, "success");
    setViewMode('list');
  };

  // Render form views
  if (viewMode === 'purchase') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Pembelian"
          description="Catat pembelian bahan dari supplier"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "Pembelian" },
          ]}
        />
        <PurchaseForm onSubmit={() => handleFormSubmit('Pembelian')} onCancel={handleBackToList} />
      </div>
    );
  }

  if (viewMode === 'expense') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Pengeluaran"
          description="Catat pengeluaran stok bahan"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "Pengeluaran" },
          ]}
        />
        <ExpenseForm onSubmit={() => handleFormSubmit('Pengeluaran')} onCancel={handleBackToList} />
      </div>
    );
  }

  if (viewMode === 'opname') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Stok Opname"
          description="Sesuaikan stok fisik aktual"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "Stok Opname" },
          ]}
        />
        <StockOpnameForm onSubmit={() => handleFormSubmit('Stok Opname')} onCancel={handleBackToList} />
      </div>
    );
  }

  if (viewMode === 'transfer') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Transfer Bahan"
          description="Kirim atau minta bahan antar outlet"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "Transfer" },
          ]}
        />
        <TransferForm onSubmit={() => handleFormSubmit('Transfer')} onCancel={handleBackToList} />
      </div>
    );
  }

  if (viewMode === 'purchase-order') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Purchase Order"
          description="Buat permintaan pembelian ke supplier"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "Purchase Order" },
          ]}
        />
        <PurchaseOrderForm onSubmit={() => handleFormSubmit('Purchase Order')} onCancel={handleBackToList} />
      </div>
    );
  }

  if (viewMode === 'po-multi') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="PO Multi Supplier"
          description="Buat Purchase Order untuk beberapa supplier sekaligus"
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "PO Multi Supplier" },
          ]}
        />
        <POMultiSupplierForm onSubmit={() => handleFormSubmit('PO Multi Supplier')} onCancel={handleBackToList} />
      </div>
    );
  }

  if (viewMode === 'detail' && selectedDetail) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detail Arus Stok"
          description={selectedDetail.referenceNumber}
          breadcrumbs={[
            { label: "Inventory", href: "/inventory" },
            { label: "Arus Stok", href: "/inventory/stock-flow" },
            { label: "Detail" },
          ]}
        />
        <StockFlowDetailView record={selectedDetail} onBack={handleBackToList} />
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <PageHeader
        title="Arus Stok"
        description="Kelola pergerakan stok bahan dasar"
        breadcrumbs={[
          { label: "Inventory", href: "/inventory" },
          { label: "Arus Stok" },
        ]}
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" /> Tambah Arus Stok
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setViewMode('purchase')} className="gap-2">
                <ShoppingCart className="h-4 w-4 text-green-600" /> Pembelian
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('expense')} className="gap-2">
                <MinusCircle className="h-4 w-4 text-red-600" /> Pengeluaran
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('opname')} className="gap-2">
                <ClipboardCheck className="h-4 w-4 text-blue-600" /> Stok Opname
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('transfer')} className="gap-2">
                <ArrowLeftRight className="h-4 w-4 text-purple-600" /> Transfer Bahan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('purchase-order')} className="gap-2">
                <FileText className="h-4 w-4 text-orange-600" /> Purchase Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('po-multi')} className="gap-2">
                <FileText className="h-4 w-4 text-orange-600" /> PO Multi Supplier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Cari no. referensi, supplier..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              leftIcon={<Search className="h-4 w-4" />}
              rightIcon={filters.search ? (
                <button onClick={() => setFilters({ ...filters, search: '' })} className="text-text-disabled hover:text-text-secondary">
                  <X className="h-4 w-4" />
                </button>
              ) : undefined}
            />
          </div>
        </div>
        <Tabs value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v as StockFlowType | 'all' })}>
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="pembelian" className="gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5" /> Pembelian
            </TabsTrigger>
            <TabsTrigger value="pengeluaran" className="gap-1.5">
              <MinusCircle className="h-3.5 w-3.5" /> Pengeluaran
            </TabsTrigger>
            <TabsTrigger value="stok_opname" className="gap-1.5">
              <ClipboardCheck className="h-3.5 w-3.5" /> Stok Opname
            </TabsTrigger>
            <TabsTrigger value="transfer" className="gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" /> Transfer
            </TabsTrigger>
            <TabsTrigger value="purchase_order" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Purchase Order
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <StockFlowTable
        records={filteredRecords}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}
