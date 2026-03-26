"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { formatCurrency } from "@/lib/utils/format";
import { walletService } from "@/features/wallet/services/wallet-service";
import type { WalletBalance, WalletHistoryItem } from "@/features/wallet/types";
import { ArrowDownLeft, ArrowUpRight, Wallet, RefreshCw, Loader2, TrendingUp, Calendar } from "lucide-react";

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatDateTime(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const TYPE_LABEL: Record<string, { label: string; color: string }> = {
  IN: { label: "Masuk", color: "text-emerald-600" },
  OUT: { label: "Keluar", color: "text-red-500" },
  DEPOSIT: { label: "Setor", color: "text-blue-600" },
};

const WALLET_TYPE_LABEL: Record<string, string> = {
  CASH: "Tunai",
  CASHLESS: "Non-Tunai",
  EDC: "EDC",
};

function BalanceCard({ label, data, color }: { label: string; data: { in: number; out: number; net: number }; color: string }) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
        <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center`}>
          <Wallet className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="text-xl font-black text-text-primary mb-3">
        {data.net >= 0 ? "" : "-"}{formatCurrency(Math.abs(data.net))}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-emerald-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1 mb-1">
            <ArrowDownLeft className="h-3 w-3 text-emerald-600" />
            <p className="text-[10px] font-semibold text-emerald-600">Masuk</p>
          </div>
          <p className="text-sm font-bold text-emerald-700">{formatCurrency(data.in)}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1 mb-1">
            <ArrowUpRight className="h-3 w-3 text-red-500" />
            <p className="text-[10px] font-semibold text-red-500">Keluar</p>
          </div>
          <p className="text-sm font-bold text-red-600">{formatCurrency(data.out)}</p>
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [history, setHistory] = useState<WalletHistoryItem[]>([]);
  const [totalHistory, setTotalHistory] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [startDate, setStartDate] = useState(toDateStr(firstOfMonth));
  const [endDate, setEndDate] = useState(toDateStr(today));

  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [walletFilter, setWalletFilter] = useState<"" | "CASH" | "CASHLESS" | "EDC">("");

  const fetchBalance = useCallback(async () => {
    setLoadingBalance(true);
    try {
      const data = await walletService.balance({ start_date: startDate, end_date: endDate });
      setBalance(data);
    } catch {
      setBalance(null);
    } finally {
      setLoadingBalance(false);
    }
  }, [startDate, endDate]);

  const fetchHistory = useCallback(async (p = 1) => {
    setLoadingHistory(true);
    try {
      const res = await walletService.history({
        start_date: startDate,
        end_date: endDate,
        page: p,
        limit: 20,
      });
      setHistory(res.data ?? []);
      setTotalHistory(res.total ?? 0);
      setTotalPages(res.totalPages ?? 1);
      setPage(p);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchBalance();
    fetchHistory(1);
  }, [fetchBalance, fetchHistory]);

  const filteredHistory = walletFilter
    ? history.filter((h) => h.wallet_type === walletFilter)
    : history;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wallet"
        description="Ringkasan saldo dan riwayat transaksi kas"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Wallet" }]}
      />

      {/* Date filter */}
      <div className="bg-surface rounded-xl border border-border p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-text-secondary" />
          <span className="text-xs font-semibold text-text-secondary">Periode</span>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors" />
          <span className="text-text-secondary text-sm">–</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors" />
        </div>
        <button onClick={() => { fetchBalance(); fetchHistory(1); }}
          className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Terapkan
        </button>
      </div>

      {/* Balance cards */}
      {loadingBalance ? (
        <div className="flex justify-center py-8"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : balance ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BalanceCard label="Tunai (CASH)" data={balance.CASH} color="bg-amber-500" />
          <BalanceCard label="Non-Tunai (CASHLESS)" data={balance.CASHLESS} color="bg-blue-500" />
          <BalanceCard label="EDC" data={balance.EDC} color="bg-purple-500" />
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-8 text-center">
          <TrendingUp className="h-8 w-8 text-text-disabled mx-auto mb-2" />
          <p className="text-sm text-text-secondary">Tidak ada data saldo</p>
        </div>
      )}

      {/* History */}
      <div className="bg-surface rounded-xl border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-text-secondary" />
            <h2 className="text-sm font-bold text-text-primary">Riwayat Transaksi</h2>
            {totalHistory > 0 && (
              <span className="text-xs text-text-secondary">({totalHistory} transaksi)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {(["", "CASH", "CASHLESS", "EDC"] as const).map((type) => (
              <button key={type}
                onClick={() => setWalletFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  walletFilter === type
                    ? "bg-primary text-white"
                    : "bg-background text-text-secondary hover:text-primary border border-border"
                }`}>
                {type === "" ? "Semua" : WALLET_TYPE_LABEL[type]}
              </button>
            ))}
          </div>
        </div>

        {loadingHistory ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Wallet className="h-8 w-8 text-text-disabled" />
            <p className="text-sm text-text-secondary">Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Waktu</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Kasir</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Tipe</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Wallet</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Catatan</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => {
                    const t = TYPE_LABEL[item.type] ?? { label: item.type, color: "text-text-primary" };
                    return (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                        <td className="px-6 py-3 text-text-secondary whitespace-nowrap">{formatDateTime(item.createdAt)}</td>
                        <td className="px-4 py-3 text-text-primary">{item.admin?.full_name ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold ${t.color}`}>{t.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-text-secondary">{WALLET_TYPE_LABEL[item.wallet_type] ?? item.wallet_type}</span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary max-w-[200px] truncate">{item.note ?? "-"}</td>
                        <td className={`px-4 py-3 text-right font-bold ${t.color}`}>
                          {item.type === "OUT" ? "-" : "+"}{formatCurrency(Number(item.amount ?? 0))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-xs text-text-secondary">Halaman {page} dari {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => fetchHistory(page - 1)} disabled={page <= 1}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-background transition-colors">
                    Sebelumnya
                  </button>
                  <button onClick={() => fetchHistory(page + 1)} disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold disabled:opacity-40 hover:bg-background transition-colors">
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
