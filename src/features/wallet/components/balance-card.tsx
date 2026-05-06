import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

interface BalanceCardProps {
  label: string;
  data: { in: number; out: number; net: number };
  color: string;
}

export function BalanceCard({ label, data, color }: BalanceCardProps) {
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
