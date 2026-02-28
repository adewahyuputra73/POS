"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft, Calendar, DollarSign, ShoppingBag, Star, Gift, Coins,
  User, Phone, Mail, MapPin, Clock, MessageSquare,
} from "lucide-react";
import { CustomerDetail } from "../types";
import { segmentConfig } from "../mock-data";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
}

function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-border'}`}
        />
      ))}
    </div>
  );
}

interface CustomerDetailViewProps {
  customer: CustomerDetail;
  onBack: () => void;
}

export function CustomerDetailView({ customer, onBack }: CustomerDetailViewProps) {
  const [activeTab, setActiveTab] = useState('ringkasan');
  const seg = segmentConfig[customer.segment];

  const summaryCards = [
    { label: 'Ulang Tahun', value: formatDate(customer.birthdate), icon: <Calendar className="h-5 w-5 text-pink-500" />, bg: 'bg-pink-50' },
    { label: 'Total Belanja', value: formatCurrency(customer.totalSpent), icon: <DollarSign className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
    { label: 'Reservasi', value: customer.totalReservations.toString(), icon: <ShoppingBag className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Produk Favorit', value: customer.favProducts.toString(), icon: <Gift className="h-5 w-5 text-purple-500" />, bg: 'bg-purple-50' },
    { label: 'Ulasan', value: `${customer.totalReviews} (${customer.avgRating}★)`, icon: <Star className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Sisa Koin', value: customer.coins.toLocaleString('id-ID'), icon: <Coins className="h-5 w-5 text-orange-500" />, bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Pelanggan
      </Button>

      {/* Customer Header */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-text-primary">{customer.name}</h2>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${seg.color}`}>
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
                {customer.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>}
              </div>
              {customer.address && (
                <p className="flex items-center gap-1 text-sm text-text-disabled mt-1"><MapPin className="h-3.5 w-3.5" /> {customer.address}</p>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-text-secondary">
            <p className="flex items-center gap-1 justify-end"><Clock className="h-3.5 w-3.5" /> Member sejak {formatDate(customer.memberSince)}</p>
            {customer.notes && <p className="mt-1 text-xs text-text-disabled italic">&quot;{customer.notes}&quot;</p>}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {summaryCards.map((card) => (
            <div key={card.label} className={`rounded-xl p-3.5 ${card.bg}`}>
              <div className="flex items-center gap-2 mb-1.5">
                {card.icon}
                <span className="text-xs font-medium text-text-secondary">{card.label}</span>
              </div>
              <p className="text-lg font-bold text-text-primary">{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
          <TabsTrigger value="pesanan">Pesanan ({customer.orders.length})</TabsTrigger>
          <TabsTrigger value="reservasi">Reservasi ({customer.reservations.length})</TabsTrigger>
          <TabsTrigger value="ulasan">Ulasan ({customer.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl border border-border p-6">
              <h4 className="text-sm font-semibold mb-4">Statistik Transaksi</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Total Pesanan Sukses</span><span className="font-medium">{customer.successOrders}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Rata-rata per Pesanan</span><span className="font-medium">{formatCurrency(customer.avgOrderValue)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Total Reservasi</span><span className="font-medium">{customer.totalReservations}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Terakhir Datang</span><span className="font-medium">{formatDate(customer.lastVisit)}</span></div>
              </div>
            </div>
            <div className="bg-surface rounded-xl border border-border p-6">
              <h4 className="text-sm font-semibold mb-4">Loyalty</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Sisa Koin</span><span className="font-medium text-yellow-600">🪙 {customer.coins.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Produk Favorit</span><span className="font-medium">{customer.favProducts} produk</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Rating Rata-rata</span><span className="font-medium">{customer.avgRating} ⭐</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Segmentasi</span><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${seg.color}`}>{seg.label}</span></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pesanan">
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background/50">
                  <TableHead className="font-semibold text-xs">Order ID</TableHead>
                  <TableHead className="font-semibold text-xs">Tanggal</TableHead>
                  <TableHead className="font-semibold text-xs">Item</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Total</TableHead>
                  <TableHead className="font-semibold text-xs">Pembayaran</TableHead>
                  <TableHead className="font-semibold text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs text-text-secondary">{order.orderId}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(order.date)}</TableCell>
                    <TableCell className="text-sm">{order.items.join(', ')}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell className="text-sm">{order.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'success' ? 'success' : order.status === 'cancelled' ? 'warning' : 'default'}>
                        {order.status === 'success' ? 'Sukses' : order.status === 'cancelled' ? 'Batal' : 'Pending'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {customer.orders.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-text-disabled">Belum ada pesanan</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="reservasi">
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background/50">
                  <TableHead className="font-semibold text-xs">Tanggal</TableHead>
                  <TableHead className="font-semibold text-xs">Waktu</TableHead>
                  <TableHead className="font-semibold text-xs">Meja</TableHead>
                  <TableHead className="font-semibold text-xs text-center">Tamu</TableHead>
                  <TableHead className="font-semibold text-xs">Catatan</TableHead>
                  <TableHead className="font-semibold text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.reservations.map((res) => (
                  <TableRow key={res.id}>
                    <TableCell className="text-sm">{formatDate(res.date)}</TableCell>
                    <TableCell className="text-sm font-medium">{res.time}</TableCell>
                    <TableCell className="text-sm">{res.tableNumber}</TableCell>
                    <TableCell className="text-center text-sm">{res.guests} orang</TableCell>
                    <TableCell className="text-sm text-text-secondary">{res.notes || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={res.status === 'completed' ? 'success' : res.status === 'confirmed' ? 'info' : res.status === 'cancelled' ? 'warning' : 'default'}>
                        {res.status === 'completed' ? 'Selesai' : res.status === 'confirmed' ? 'Dikonfirmasi' : res.status === 'cancelled' ? 'Batal' : 'No Show'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {customer.reservations.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-text-disabled">Belum ada reservasi</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ulasan">
          <div className="space-y-4">
            {customer.reviews.map((review) => (
              <div key={review.id} className="bg-surface rounded-xl border border-border p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Order: {review.orderId}</p>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-xs text-text-disabled">{formatDateTime(review.date)}</p>
                </div>
                {review.comment && <p className="text-sm text-text-primary mb-3">{review.comment}</p>}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {review.products.map((p, i) => (
                    <span key={i} className="text-xs bg-background text-text-secondary px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
                {review.questionAnswers.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-1.5">
                    {review.questionAnswers.map((qa, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">{qa.question}</span>
                        <StarRating rating={qa.rating} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {customer.reviews.length === 0 && (
              <div className="bg-surface rounded-xl border border-border p-12 text-center text-text-disabled">
                <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Belum ada ulasan</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
