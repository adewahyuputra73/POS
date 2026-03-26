"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Star, MessageSquare, Settings } from "lucide-react";
import type { Review, ReviewFilters } from "@/features/customers/types";
import { filterReviews, getReviewStats } from "@/features/customers/mock-data";
import { ReviewTable } from "@/features/customers/components/review-table";
import { customerService } from "@/features/customers/services/customer-service";

function mapApiReview(raw: any): Review {
  return {
    id: raw.id ?? "",
    customerId: raw.customer_id ?? raw.customerId ?? "",
    customerName: raw.customer?.name ?? raw.customer_name ?? raw.customerName ?? "Pelanggan",
    customerPhone: raw.customer?.phone ?? raw.customer_phone ?? raw.customerPhone ?? "",
    orderId: raw.order_id ?? raw.orderId ?? "",
    orderDate: raw.order?.created_at ?? raw.order_date ?? raw.orderDate ?? raw.createdAt ?? "",
    rating: Number(raw.rating ?? 0),
    comment: raw.comment ?? "",
    is_visible: raw.is_visible ?? true,
    products: Array.isArray(raw.products) ? raw.products : [],
    questionAnswers: Array.isArray(raw.question_answers)
      ? raw.question_answers
      : Array.isArray(raw.questionAnswers) ? raw.questionAnswers : [],
    createdAt: raw.created_at ?? raw.createdAt ?? "",
  };
}

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({
    search: "",
    ratingMin: null,
    ratingMax: null,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await customerService.reviews({
        min_rating: filters.ratingMin ?? undefined,
        max_rating: filters.ratingMax ?? undefined,
      });
      const data = Array.isArray(raw) ? raw : [];
      setReviews(data.map((r: any) => mapApiReview(r)));
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [filters.ratingMin, filters.ratingMax]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredReviews = useMemo(
    () => filterReviews(reviews, filters),
    [reviews, filters]
  );

  const stats = useMemo(() => getReviewStats(reviews), [reviews]);

  const handleViewCustomer = (customerId: string) => {
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
            onClick={() => router.push("/customers/reviews/settings")}
          >
            <Settings className="h-4 w-4" /> Pengaturan Ulasan
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgRating}</p>
              <p className="text-xs text-text-secondary">Rating Rata-rata</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalReviews}</p>
              <p className="text-xs text-text-secondary">Total Ulasan</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-4 col-span-2">
          <p className="text-xs text-text-secondary mb-2">Distribusi Rating</p>
          <div className="flex items-center gap-2">
            {stats.ratingDistribution.map((count, i) => {
              const maxCount = Math.max(...stats.ratingDistribution, 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={i} className="flex-1 text-center">
                  <div className="relative h-16 bg-background rounded-md overflow-hidden mb-1">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-yellow-400 rounded-md transition-all"
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-xs font-medium">{i + 1}</span>
                    <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <p className="text-[10px] text-text-disabled">{count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-disabled" />
            <Input
              placeholder="Cari nama pelanggan, order ID, atau komentar..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select
            value={filters.ratingMin !== null ? filters.ratingMin.toString() : "all"}
            onValueChange={(v: string) => {
              if (v === "all") {
                setFilters({ ...filters, ratingMin: null, ratingMax: null });
              } else {
                const val = parseInt(v);
                setFilters({ ...filters, ratingMin: val, ratingMax: val });
              }
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue>
                {filters.ratingMin === null ? "Semua Rating" : `⭐ ${filters.ratingMin} Bintang`}
              </SelectValue>
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
        <p className="text-xs text-text-secondary mt-2">
          Menampilkan{" "}
          <span className="font-semibold text-text-primary">{filteredReviews.length}</span>{" "}
          ulasan
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <ReviewTable reviews={filteredReviews} onViewCustomer={handleViewCustomer} />
      )}
    </div>
  );
}
