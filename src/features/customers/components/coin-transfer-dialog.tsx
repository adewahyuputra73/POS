"use client";

import { useState } from 'react';
import { CoinCustomer } from '../types';
import { coinSettings, mockCoinCustomers } from '../mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Coins, X, Search } from 'lucide-react';

interface CoinTransferDialogProps {
  customer: CoinCustomer;
  onConfirm: (recipientId: number, amount: number) => void;
  onCancel: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function CoinTransferDialog({ customer, onConfirm, onCancel }: CoinTransferDialogProps) {
  const [recipientSearch, setRecipientSearch] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<CoinCustomer | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');

  const coinValue = amount * coinSettings.conversionRate;
  const otherCustomers = mockCoinCustomers.filter(c => c.id !== customer.id);
  const searchResults = recipientSearch.length >= 2
    ? otherCustomers.filter(c => c.name.toLowerCase().includes(recipientSearch.toLowerCase()) || c.phone.includes(recipientSearch))
    : [];

  const handleConfirm = () => {
    if (!selectedRecipient) { setError('Pilih penerima terlebih dahulu'); return; }
    if (amount <= 0) { setError('Jumlah koin harus lebih dari 0'); return; }
    if (amount > customer.totalCoins) { setError('Saldo tidak cukup'); return; }
    onConfirm(selectedRecipient.id, amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Transfer Koin</h3>
            <p className="text-xs text-gray-500">{customer.name} — Saldo: {customer.totalCoins.toLocaleString('id-ID')} koin</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Recipient search */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Penerima</label>
            {selectedRecipient ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{selectedRecipient.name}</p>
                  <p className="text-xs text-gray-500">{selectedRecipient.phone}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRecipient(null)} className="h-7 text-xs">
                  Ubah
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={recipientSearch}
                  onChange={(e) => setRecipientSearch(e.target.value)}
                  placeholder="Cari nama atau nomor telepon..."
                  className="pl-9"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {searchResults.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedRecipient(c); setRecipientSearch(''); setError(''); }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.phone}</p>
                        </div>
                        <span className="text-xs text-gray-400">{c.totalCoins} koin</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Jumlah Koin</label>
            <Input
              type="number"
              value={amount || ''}
              onChange={(e) => { setAmount(Number(e.target.value)); setError(''); }}
              placeholder="0"
              min={0}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Nilai Transfer</span>
              <span className="font-medium text-gray-700">{formatCurrency(coinValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Saldo Pengirim Setelah</span>
              <span className={`font-semibold ${customer.totalCoins - amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {(customer.totalCoins - amount).toLocaleString('id-ID')} koin
              </span>
            </div>
            {selectedRecipient && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Saldo Penerima Setelah</span>
                <span className="font-semibold text-gray-900">
                  {(selectedRecipient.totalCoins + amount).toLocaleString('id-ID')} koin
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Batal</Button>
          <Button className="flex-1" onClick={handleConfirm}>
            {coinSettings.approvalRequired ? 'Kirim untuk Approval' : 'Konfirmasi Transfer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
