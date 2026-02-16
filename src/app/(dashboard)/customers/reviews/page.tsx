"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Star, MessageSquare, Settings } from "lucide-react";
import { ReviewFilters } from "@/features/customers/types";
import { mockReviews, filterReviews, getReviewStats } from "@/features/customers/mock-data";
import { ReviewTable } from "@/features/customers/components/review-table";

export default function ReviewsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ReviewFilters>({
    search: '',
    ratingMin: null,
    ratingMax: null,
  });

  const filteredReviews = useMemo(() => filterReviews(mockReviews, filters), [filters]);
  const stats = useMemo(() => getReviewStats(mockReviews), []);

  const handleViewCustomer = (customerId: number) => {
    router.push(`/customers?view=detail&id=${customerId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ulasan"
        description="Lihat feedback dari pelanggan"
        breadcrumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Pelanggan", href: "/customers" },
          { label: "Ulasan" },
        ]}
        actions={
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => router.push('/customers/reviews/settings')}
          >
            <Settings className="h-4 w-4" /> Pengaturan Ulasan
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgRating}</p>
              <p className="text-xs text-gray-500">Rating Rata-rata</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
              <p className="text-xs text-gray-500">Total Ulasan</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 col-span-2">
          <p className="text-xs text-gray-500 mb-2">Distribusi Rating</p>
          <div className="flex items-center gap-2">
            {stats.ratingDistribution.map((count, i) => {
              const maxCount = Math.max(...stats.ratingDistribution, 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 text-center">
                  <div className="relative h-16 bg-gray-100 rounded-md overflow-hidden mb-1">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded-md transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-xs font-medium">{i + 1}</span>
                    <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-[10px] text-gray-400">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama pelanggan, order ID, atau komentar..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.ratingMin !== null ? filters.ratingMin.toString() : 'all'}
            onValueChange={(v: string) => {
              if (v === 'all') {
                setFilters({ ...filters, ratingMin: null, ratingMax: null });
              } else {
                const val = parseInt(v);
                setFilters({ ...filters, ratingMin: val, ratingMax: val });
              }
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue>{filters.ratingMin === null ? "Semua Rating" : `⭐ ${filters.ratingMin} Bintang`}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Rating</SelectItem>
              <SelectItem value="5">⭐ 5 Bintang</SelectItem>
              <SelectItem value="4">⭐ 4 Bintang</SelectItem>
              <SelectItem value="3">⭐ 3 Bintang</SelectItem>
              <SelectItem value="2">⭐ 2 Bintang</SelectItem>
              <SelectItem value="1">⭐ 1 Bintang</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Menampilkan <span className="font-semibold text-gray-700">{filteredReviews.length}</span> ulasan
        </p>
      </div>

      {/* Reviews */}
      <ReviewTable reviews={filteredReviews} onViewCustomer={handleViewCustomer} />
    </div>
  );
}
