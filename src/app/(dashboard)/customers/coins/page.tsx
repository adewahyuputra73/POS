"use client";

import { useState, useEffect, useCallback } from "react";
import { walletService } from "@/features/wallet/services/wallet-service";
import type { WalletBalance, WalletHistoryItem } from "@/features/wallet/types";
import { useToast } from "@/components/ui";
import { Banknote, CreditCard, LayoutGrid, ArrowUpCircle, ArrowDownCircle, Coins } from "lucide-react";

function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", minimumFractionDigits: 0,
  }).format(Number(value));
}

function formatDateTime(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const CHANNEL_CONFIG = {
  CASH: { label: "Tunai", icon: Banknote, color: "text-green-700 bg-green-50" },
  CASHLESS: { label: "Non-Tunai", icon: CreditCard, color: "text-blue-700 bg-blue-50" },
  EDC: { label: "EDC", icon: LayoutGrid, color: "text-purple-700 bg-purple-50" },
} as const;

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  IN: { label: "Masuk", color: "text-success" },
  OUT: { label: "Keluar", color: "text-error" },
  DEPOSIT: { label: "Deposit", color: "text-primary" },
};

export default function CoinsPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [history, setHistory] = useState<WalletHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bal, hist] = await Promise.all([
        walletService.balance(),
        walletService.history({ limit: 50, page: 1 }),
      ]);
      setBalance(bal);
      setHistory(hist?.data ?? []);
    } catch {
      showToast("Gagal memuat data wallet", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Saldo Kasir</h1>
        <p className="text-sm text-text-secondary mt-1">Ringkasan saldo dan riwayat transaksi kasir</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* Balance Cards */}
          {balance && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["CASH", "CASHLESS", "EDC"] as const).map((ch) => {
                const cfg = CHANNEL_CONFIG[ch];
                const data = balance[ch];
                return (
                  <div key={ch} className="bg-surface rounded-xl border border-border p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${cfg.color}`}>
                        <cfg.icon className="h-5 w-5" />
                      </div>
                      <p className="font-semibold text-text-primary">{cfg.label}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-text-secondary text-xs">Masuk</p>
                        <p className="font-semibold text-success">{formatCurrency(data.in)}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs">Keluar</p>
                        <p className="font-semibold text-error">{formatCurrency(data.out)}</p>
                      </div>
                      {data.deposit > 0 && (
                        <div>
                          <p className="text-text-secondary text-xs">Deposit</p>
                          <p className="font-semibold text-primary">{formatCurrency(data.deposit)}</p>
                        </div>
                      )}
                      {data.refund > 0 && (
                        <div>
                          <p className="text-text-secondary text-xs">Refund</p>
                          <p className="font-semibold text-warning">{formatCurrency(data.refund)}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Net</span>
                      <span className={`text-base font-bold ${data.net >= 0 ? "text-success" : "text-error"}`}>
                        {formatCurrency(data.net)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-divider">
              <h3 className="font-semibold text-text-primary">Riwayat Transaksi</h3>
              <p className="text-xs text-text-secondary mt-0.5">{history.length} transaksi terakhir</p>
            </div>

            {history.length === 0 ? (
              <div className="p-12 text-center">
                <Coins className="h-12 w-12 text-text-disabled mx-auto mb-3" />
                <p className="text-sm text-text-secondary">Belum ada riwayat transaksi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Tanggal</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Channel</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Tipe</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Kasir</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Catatan</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => {
                      const typeCfg = TYPE_CONFIG[item.type] ?? { label: item.type, color: "text-text-primary" };
                      const chCfg = CHANNEL_CONFIG[item.wallet_type] ?? { label: item.wallet_type };
                      const isOut = item.type === "OUT";
                      return (
                        <tr key={item.id} className="border-b border-divider last:border-0 hover:bg-background/50 transition-colors">
                          <td className="px-5 py-3 text-xs text-text-secondary whitespace-nowrap">
                            {formatDateTime(item.createdAt)}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium text-text-primary">
                            {chCfg.label}
                          </td>
                          <td className="px-5 py-3">
                            <div className={`flex items-center gap-1 text-sm font-medium ${typeCfg.color}`}>
                              {isOut
                                ? <ArrowDownCircle className="h-3.5 w-3.5" />
                                : <ArrowUpCircle className="h-3.5 w-3.5" />}
                              {typeCfg.label}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sm text-text-secondary">
                            {item.admin?.full_name ?? "-"}
                          </td>
                          <td className="px-5 py-3 text-xs text-text-secondary max-w-[200px] truncate">
                            {item.note ?? item.cashless_provider ?? item.edc_bank ?? "-"}
                          </td>
                          <td className={`px-5 py-3 text-right text-sm font-semibold ${isOut ? "text-error" : "text-success"}`}>
                            {isOut ? "-" : "+"}{formatCurrency(item.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
