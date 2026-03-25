"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft, Calendar, DollarSign, ShoppingBag, Star,
  User, Phone, Mail, MapPin, Clock, MessageSquare,
} from "lucide-react";
import { CustomerDetail } from "../types";

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
  const summaryCards = [
    { label: 'Total Belanja', value: formatCurrency(parseFloat(customer.total_spent)), icon: <DollarSign className="h-5 w-5 text-green-500" />, bg: 'bg-green-50' },
    { label: 'Total Pesanan', value: customer.total_orders.toString(), icon: <ShoppingBag className="h-5 w-5 text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'Order Terakhir', value: formatDate(customer.last_order_at), icon: <Calendar className="h-5 w-5 text-pink-500" />, bg: 'bg-pink-50' },
    { label: 'Ulasan', value: `${customer.reviews.length} (${customer.avg_rating ?? 0}★)`, icon: <Star className="h-5 w-5 text-yellow-500" />, bg: 'bg-yellow-50' },
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
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${customer.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {customer.is_active ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
                {customer.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>}
              </div>
              {customer.outlet_id && (
                <p className="flex items-center gap-1 text-sm text-text-disabled mt-1"><MapPin className="h-3.5 w-3.5" /> Outlet #{customer.outlet_id}</p>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-text-secondary">
            <p className="flex items-center gap-1 justify-end"><Clock className="h-3.5 w-3.5" /> Member sejak {formatDate(customer.createdAt)}</p>
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
          <TabsTrigger value="pesanan">Pesanan ({customer.recent_orders.length})</TabsTrigger>
          <TabsTrigger value="ulasan">Ulasan ({customer.reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-xl border border-border p-6">
              <h4 className="text-sm font-semibold mb-4">Statistik Transaksi</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Total Pesanan</span><span className="font-medium">{customer.total_orders}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Total Belanja</span><span className="font-medium">{formatCurrency(parseFloat(customer.total_spent))}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Rata-rata per Pesanan</span><span className="font-medium">{customer.total_orders > 0 ? formatCurrency(parseFloat(customer.total_spent) / customer.total_orders) : '-'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Order Terakhir</span><span className="font-medium">{formatDate(customer.last_order_at)}</span></div>
              </div>
            </div>
            <div className="bg-surface rounded-xl border border-border p-6">
              <h4 className="text-sm font-semibold mb-4">Info Lainnya</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Rating Rata-rata</span><span className="font-medium">{customer.avg_rating ?? '-'} ★</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Total Ulasan</span><span className="font-medium">{customer.reviews.length}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">WhatsApp Opt-in</span><span className="font-medium">{customer.whatsapp_opt_in ? 'Ya' : 'Tidak'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-text-secondary">Member Sejak</span><span className="font-medium">{formatDate(customer.createdAt)}</span></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pesanan">
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-background/50">
                  <TableHead className="font-semibold text-xs">No. Order</TableHead>
                  <TableHead className="font-semibold text-xs">Tanggal</TableHead>
                  <TableHead className="font-semibold text-xs text-right">Total</TableHead>
                  <TableHead className="font-semibold text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.recent_orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs text-text-secondary">{order.order_number}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(order.created_at)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(parseFloat(order.total_amount))}</TableCell>
                    <TableCell>
                      <Badge variant={order.fulfillment_status === 'completed' ? 'success' : order.fulfillment_status === 'cancelled' ? 'warning' : 'default'}>
                        {order.fulfillment_status === 'completed' ? 'Selesai' : order.fulfillment_status === 'cancelled' ? 'Batal' : order.fulfillment_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {customer.recent_orders.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-text-disabled">Belum ada pesanan</TableCell></TableRow>
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
                  <StarRating rating={review.rating} />
                  <p className="text-xs text-text-disabled">{formatDateTime(review.created_at)}</p>
                </div>
                {review.comment && <p className="text-sm text-text-primary">{review.comment}</p>}
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
