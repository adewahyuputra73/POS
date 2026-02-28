"use client";

import { CoinApproval } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, ArrowUpDown, ArrowRight } from 'lucide-react';

interface CoinApprovalListProps {
  approvals: CoinApproval[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function CoinApprovalList({ approvals, onApprove, onReject, onClose }: CoinApprovalListProps) {
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const pastApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-disabled hover:text-text-secondary">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">Approval Koin</h3>
            <p className="text-xs text-text-secondary">{pendingApprovals.length} permintaan menunggu persetujuan</p>
          </div>
        </div>

        {/* Pending */}
        {pendingApprovals.length > 0 ? (
          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Menunggu Persetujuan</p>
            {pendingApprovals.map(a => (
              <div key={a.id} className="flex items-center justify-between bg-orange-50/50 border border-orange-100 rounded-xl p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {a.type === 'adjust' ? (
                      <ArrowUpDown className="h-3.5 w-3.5 text-orange-500" />
                    ) : (
                      <ArrowRight className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <span className="text-sm font-medium text-text-primary">{a.customerName}</span>
                    <Badge variant={a.direction === 'credit' ? 'success' : 'warning'} size="sm">
                      {a.direction === 'credit' ? '+' : '-'}{a.amount} koin
                    </Badge>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {a.type === 'adjust' ? 'Adjustment' : `Transfer ke ${a.recipientName}`}
                    {' · '}oleh {a.requestedBy} · {formatDate(a.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => onReject(a.id)} className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">
                    <X className="h-3.5 w-3.5 mr-1" /> Tolak
                  </Button>
                  <Button size="sm" onClick={() => onApprove(a.id)} className="h-8 text-xs">
                    <Check className="h-3.5 w-3.5 mr-1" /> Setujui
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-6">
            <Check className="h-10 w-10 text-green-300 mx-auto mb-2" />
            <p className="text-sm text-text-secondary">Tidak ada permintaan yang menunggu</p>
          </div>
        )}

        {/* History */}
        {pastApprovals.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Riwayat</p>
            {pastApprovals.map(a => (
              <div key={a.id} className="flex items-center justify-between bg-background rounded-xl p-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">{a.customerName}</span>
                    <Badge
                      variant={a.status === 'approved' ? 'success' : 'default'}
                      size="sm"
                    >
                      {a.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-disabled">
                    {a.direction === 'credit' ? '+' : '-'}{a.amount} koin · {formatDate(a.createdAt)}
                    {a.approvedBy && ` · oleh ${a.approvedBy}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
