"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Star, MessageSquare } from "lucide-react";
import { Review } from "../types";

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-border'}`}
        />
      ))}
    </div>
  );
}

interface ReviewTableProps {
  reviews: Review[];
  onViewCustomer?: (customerId: number) => void;
}

export function ReviewTable({ reviews, onViewCustomer }: ReviewTableProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-border p-12 text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-border" />
        <h3 className="text-sm font-medium text-text-primary">Belum ada ulasan</h3>
        <p className="mt-1 text-sm text-text-secondary">Ulasan akan muncul setelah pelanggan memberikan feedback</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-surface rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-sm font-bold text-primary">
                {review.customerName.charAt(0)}
              </div>
              <div>
                <button
                  onClick={() => onViewCustomer?.(review.customerId)}
                  className="text-sm font-medium text-text-primary hover:text-primary transition-colors cursor-pointer"
                >
                  {review.customerName}
                </button>
                <p className="text-xs text-text-disabled">{review.customerPhone}</p>
              </div>
            </div>
            <div className="text-right">
              <StarRating rating={review.rating} size="md" />
              <p className="text-xs text-text-disabled mt-1">{formatDateTime(review.createdAt)}</p>
            </div>
          </div>

          {review.comment && (
            <p className="text-sm text-text-primary mb-3 pl-[52px]">&ldquo;{review.comment}&rdquo;</p>
          )}

          <div className="pl-[52px] flex items-center gap-2 flex-wrap mb-3">
            <span className="text-xs text-text-disabled">Produk:</span>
            {review.products.map((p, i) => (
              <span key={i} className="text-xs bg-background text-text-secondary px-2 py-0.5 rounded-full">{p}</span>
            ))}
          </div>

          {review.questionAnswers.length > 0 && (
            <div className="pl-[52px] border-t border-border pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {review.questionAnswers.map((qa, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-background rounded-lg px-3 py-2">
                  <span className="text-text-secondary truncate mr-2">{qa.questionText}</span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{qa.ratingValue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-text-disabled pl-[52px] mt-2">
            Order: <span className="font-mono">{review.orderId}</span> · {formatDateTime(review.orderDate)}
          </p>
        </div>
      ))}
    </div>
  );
}
