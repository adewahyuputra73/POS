import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout";
import { walletService } from "@/features/wallet";
import type { WalletHistoryItem } from "@/features/wallet";
import { useToast } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, AlertCircle, CheckCircle2, Loader2, Receipt } from "lucide-react";

const KATEGORI_OPTIONS = [
  { value: "Listrik/Air", label: "Listrik / Air" },
  { value: "Sewa", label: "Sewa Tempat" },
  { value: "Bahan Baku", label: "Bahan Baku" },
  { value: "Gaji", label: "Gaji Karyawan" },
  { value: "Operasional", label: "Operasional Umum" },
  { value: "Perawatan", label: "Perawatan & Perbaikan" },
  { value: "Lainnya", label: "Lainnya" },
];

const CHANNEL_OPTIONS = [
  { value: "CASH", label: "Tunai" },
  { value: "CASHLESS", label: "Non-Tunai" },
  { value: "EDC", label: "EDC" },
] as const;

function formatDateTime(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function PengeluaranPage() {
  const { showToast } = useToast();

  // Form state
  const [amount, setAmount] = useState("");
  const [kategori, setKategori] = useState("Operasional");
  const [keterangan, setKeterangan] = useState("");
  const [channel, setChannel] = useState<"CASH" | "CASHLESS" | "EDC">("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // History state
  const [history, setHistory] = useState<WalletHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await walletService.history({ limit: 50, page: 1 });
      // Filter only OUT transactions (pengeluaran)
      const outItems = (res?.data ?? []).filter((item) => item.type === "OUT");
      setHistory(outItems);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseFloat(amount);
    if (isNaN(nominal) || nominal <= 0) {
      setError("Masukkan jumlah pengeluaran yang valid");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const note = keterangan.trim()
        ? `${kategori} — ${keterangan.trim()}`
        : kategori;
      await walletService.createTransaction({
        wallet_type: channel,
        type: "OUT",
        amount: nominal,
        note,
      });
      showToast("Pengeluaran berhasil dicatat", "success");
      setAmount("");
      setKeterangan("");
      setKategori("Operasional");
      setChannel("CASH");
      await fetchHistory();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Gagal mencatat pengeluaran");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengeluaran"
        description="Catat pengeluaran kas operasional harian"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Pengeluaran" }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-base font-bold text-text-primary">Catat Pengeluaran</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Jumlah (Rp) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  required
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors"
                >
                  {KATEGORI_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Sumber Dana <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CHANNEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setChannel(opt.value)}
                      className={`h-9 rounded-lg text-xs font-semibold border transition-colors ${
                        channel === opt.value
                          ? "bg-primary text-white border-primary"
                          : "bg-background text-text-secondary border-border hover:border-primary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Keterangan (opsional)
                </label>
                <textarea
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  rows={2}
                  placeholder="Detail pengeluaran..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {submitting ? "Menyimpan..." : "Catat Pengeluaran"}
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-xl border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-text-secondary" />
                <h2 className="text-sm font-bold text-text-primary">Riwayat Pengeluaran</h2>
              </div>
              {!loadingHistory && (
                <span className="text-xs text-text-secondary">{history.length} transaksi</span>
              )}
            </div>

            {loadingHistory ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <CheckCircle2 className="h-6 w-6 text-text-disabled" />
                <p className="text-sm text-text-secondary">Belum ada pengeluaran</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary">Tanggal</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary">Kategori / Keterangan</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary">Sumber</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary">Kasir</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                        <td className="px-5 py-3 text-xs text-text-secondary whitespace-nowrap">
                          {formatDateTime(item.createdAt)}
                        </td>
                        <td className="px-5 py-3 text-sm text-text-primary max-w-[200px] truncate">
                          {item.note ?? "-"}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            item.wallet_type === "CASH"
                              ? "bg-green-50 text-green-700"
                              : item.wallet_type === "CASHLESS"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }`}>
                            {item.wallet_type === "CASH" ? "Tunai" : item.wallet_type === "CASHLESS" ? "Non-Tunai" : "EDC"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-text-secondary">
                          {item.admin?.full_name ?? "-"}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-red-500">
                          -{formatCurrency(Number(item.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
