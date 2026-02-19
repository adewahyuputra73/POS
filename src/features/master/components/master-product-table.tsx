"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ChevronUp, 
  ChevronDown, 
  Pencil,
  ChevronLeft,
  ChevronRight,
  Package,
  Store,
} from "lucide-react";
import { MasterProduct } from "../types";
import { StatusToggle } from "@/features/products/components/status-toggle";
import { mockOutlets } from "../mock-data";

interface MasterProductTableProps {
  products: MasterProduct[];
  onEdit: (product: MasterProduct) => void;
  onToggleStatus: (productId: string, isActive: boolean) => void;
}

type SortField = 'name' | 'basePrice' | 'outletCount' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const ITEMS_PER_PAGE = 10;

export function MasterProductTable({
  products,
  onEdit,
  onToggleStatus,
}: MasterProductTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'basePrice':
          comparison = a.basePrice - b.basePrice;
          break;
        case 'outletCount':
          comparison = (a.outletIds?.length || 0) - (b.outletIds?.length || 0);
          break;
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [products, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getOutletNames = (outletIds: string[]) => {
    return outletIds
      .map((id) => mockOutlets.find((o) => o.id === id)?.name || 'Unknown')
      .slice(0, 2)
      .join(', ') + (outletIds.length > 2 ? ` +${outletIds.length - 2}` : '');
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-12 text-center">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada master produk</h3>
        <p className="text-sm text-gray-500">
          Klik tombol &quot;Tambah Master Produk&quot; untuk membuat produk baru
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                PRODUK
                <SortIcon field="name" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('basePrice')}
            >
              <div className="flex items-center gap-2">
                HARGA
                <SortIcon field="basePrice" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('outletCount')}
            >
              <div className="flex items-center gap-2">
                OUTLET TERKAIT
                <SortIcon field="outletCount" />
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleSort('updatedAt')}
            >
              <div className="flex items-center gap-2">
                TERAKHIR DIUBAH
                <SortIcon field="updatedAt" />
              </div>
            </TableHead>
            <TableHead className="text-center">STATUS</TableHead>
            <TableHead className="text-center">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {paginatedProducts.map((product) => (
            <TableRow key={product.id} className="hover:bg-gray-50/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    {product.description && (
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold text-gray-900">{formatPrice(product.basePrice)}</p>
                  {product.channelPrices?.goFood && (
                    <p className="text-xs text-gray-500">
                      GoFood: {formatPrice(product.channelPrices.goFood)}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                      (product.outletIds?.length || 0) > 0 
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    )}>
                      {product.outletIds?.length || 0} Outlet
                    </span>
                    {(product.outletIds?.length || 0) > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[150px]">
                        {getOutletNames(product.outletIds || [])}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {formatDate(product.updatedAt.toString())}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <StatusToggle
                    checked={product.status === 'ACTIVE'}
                    onChange={(checked) => onToggleStatus(product.id, checked)}
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 text-gray-500 hover:text-orange-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-gray-500">
            Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, products.length)} dari {products.length} produk
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-[32px]"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
