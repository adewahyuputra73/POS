"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { formatCurrency } from "@/lib/utils/format";
import { shiftService } from "@/features/shifts/services/shift-service";
import type { ShiftStatus, ShiftHistoryItem, StartShiftRequest, EndShiftRequest } from "@/features/shifts/types";
import { Clock, LogIn, LogOut, History, CheckCircle2, AlertCircle, Loader2, User } from "lucide-react";

function formatDateTime(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toUpperCase();
  if (s === "OPEN" || s === "ACTIVE") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Aktif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      Ditutup
    </span>
  );
}

export default function ShiftPage() {
  const [shift, setShift] = useState<ShiftStatus | null>(null);
  const [history, setHistory] = useState<ShiftHistoryItem[]>([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [openingCash, setOpeningCash] = useState("");
  const [submittingOpen, setSubmittingOpen] = useState(false);
  const [openError, setOpenError] = useState("");

  const [closingCash, setClosingCash] = useState("");
  const [cashDeposited, setCashDeposited] = useState("");
  const [note, setNote] = useState("");
  const [submittingClose, setSubmittingClose] = useState(false);
  const [closeError, setCloseError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchStatus = useCallback(async () => {
    setLoadingStatus(true);
    try {
      const data = await shiftService.status();
      const s = (data?.status ?? "").toUpperCase();
      setShift(s === "OPEN" || s === "ACTIVE" ? data : null);
    } catch {
      setShift(null);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await shiftService.history();
      setHistory(res.shifts ?? []);
    } catch {
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, [fetchStatus, fetchHistory]);

  const handleOpenShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const cash = parseFloat(openingCash);
    if (isNaN(cash) || cash < 0) { setOpenError("Masukkan jumlah kas awal yang valid"); return; }
    setSubmittingOpen(true);
    setOpenError("");
    try {
      await shiftService.start({ opening_cash: cash } as StartShiftRequest);
      setSuccessMsg("Shift berhasil dibuka!");
      setOpeningCash("");
      await fetchStatus();
      await fetchHistory();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setOpenError(err?.response?.data?.message ?? "Gagal membuka shift.");
    } finally {
      setSubmittingOpen(false);
    }
  };

  const handleCloseShift = async (e: React.FormEvent) => {
    e.preventDefault();
    const closing = parseFloat(closingCash);
    const deposited = parseFloat(cashDeposited);
    if (isNaN(closing) || closing < 0) { setCloseError("Masukkan jumlah kas akhir yang valid"); return; }
    if (isNaN(deposited) || deposited < 0) { setCloseError("Masukkan jumlah kas disetor yang valid"); return; }
    setSubmittingClose(true);
    setCloseError("");
    try {
      const payload: EndShiftRequest = { closing_cash: closing, cash_deposited: deposited };
      if (note.trim()) payload.note = note.trim();
      await shiftService.end(payload);
      setSuccessMsg("Shift berhasil ditutup!");
      setClosingCash(""); setCashDeposited(""); setNote("");
      await fetchStatus();
      await fetchHistory();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setCloseError(err?.response?.data?.message ?? "Gagal menutup shift.");
    } finally {
      setSubmittingClose(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Shift"
        description="Buka dan tutup shift kasir"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Shift" }]}
      />

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">{successMsg}</p>
        </div>
      )}

      {loadingStatus ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : shift ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active shift info */}
          <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-text-primary">Shift Aktif</h2>
              <StatusBadge status={shift.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Nomor Shift</p>
                <p className="text-xl font-black text-primary">#{shift.shift_number}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Kasir</p>
                <p className="text-sm font-bold text-text-primary truncate">{shift.cashier?.full_name ?? "-"}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Waktu Mulai</p>
                <p className="text-sm font-semibold text-text-primary">{formatDateTime(shift.start_time)}</p>
              </div>
              <div className="bg-background rounded-lg p-4">
                <p className="text-xs text-text-secondary mb-1">Kas Awal</p>
                <p className="text-sm font-bold text-text-primary">{formatCurrency(Number(shift.opening_cash ?? 0))}</p>
              </div>
            </div>
          </div>

          {/* Close shift form */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-base font-bold text-text-primary">Tutup Shift</h2>
            </div>
            <form onSubmit={handleCloseShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Kas Akhir (Rp) <span className="text-red-500">*</span>
                </label>
                <input type="number" min="0" value={closingCash} onChange={(e) => setClosingCash(e.target.value)}
                  placeholder="0" required
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Kas Disetor (Rp) <span className="text-red-500">*</span>
                </label>
                <input type="number" min="0" value={cashDeposited} onChange={(e) => setCashDeposited(e.target.value)}
                  placeholder="0" required
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">Catatan (opsional)</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Catatan penutupan shift..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-none" />
              </div>
              {closeError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-medium">{closeError}</p>
                </div>
              )}
              <button type="submit" disabled={submittingClose}
                className="w-full h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submittingClose ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                {submittingClose ? "Menutup..." : "Tutup Shift"}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="max-w-md">
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <LogIn className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text-primary">Buka Shift</h2>
                <p className="text-xs text-text-secondary">Tidak ada shift aktif saat ini</p>
              </div>
            </div>
            <form onSubmit={handleOpenShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                  Kas Awal (Rp) <span className="text-red-500">*</span>
                </label>
                <input type="number" min="0" value={openingCash} onChange={(e) => setOpeningCash(e.target.value)}
                  placeholder="0" required
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary transition-colors" />
                <p className="text-xs text-text-disabled mt-1">Masukkan jumlah uang tunai di laci kasir saat ini</p>
              </div>
              {openError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-medium">{openError}</p>
                </div>
              )}
              <button type="submit" disabled={submittingOpen}
                className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {submittingOpen ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {submittingOpen ? "Membuka..." : "Buka Shift"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-surface rounded-xl border border-border">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <History className="h-4 w-4 text-text-secondary" />
          <h2 className="text-sm font-bold text-text-primary">Riwayat Shift</h2>
        </div>
        {loadingHistory ? (
          <div className="flex items-center justify-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 gap-2">
            <Clock className="h-6 w-6 text-text-disabled" />
            <p className="text-sm text-text-secondary">Belum ada riwayat shift</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-text-secondary">Shift</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Kasir</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Mulai</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Selesai</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Kas Awal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-text-secondary">Kas Akhir</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                    <td className="px-6 py-3 font-bold text-primary">#{item.shift_number}</td>
                    <td className="px-4 py-3 text-text-primary">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                        {item.cashier?.full_name ?? "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateTime(item.start_time)}</td>
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{item.end_time ? formatDateTime(item.end_time) : "-"}</td>
                    <td className="px-4 py-3 text-right text-text-primary font-medium">{formatCurrency(Number(item.opening_cash ?? 0))}</td>
                    <td className="px-4 py-3 text-right text-text-primary font-medium">{item.closing_cash ? formatCurrency(Number(item.closing_cash)) : "-"}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
