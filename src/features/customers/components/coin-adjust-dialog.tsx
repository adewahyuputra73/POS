"use client";

import { useState } from 'react';
import { CoinCustomer } from '../types';
import { coinSettings } from '../mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Coins, X } from 'lucide-react';

interface CoinAdjustDialogProps {
  customer: CoinCustomer;
  onConfirm: (type: 'credit' | 'debit', amount: number) => void;
  onCancel: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
}

export function CoinAdjustDialog({ customer, onConfirm, onCancel }: CoinAdjustDialogProps) {
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState('');

  const coinValue = amount * coinSettings.conversionRate;
  const newBalance = type === 'credit' ? customer.totalCoins + amount : customer.totalCoins - amount;

  const handleConfirm = () => {
    if (amount <= 0) { setError('Jumlah koin harus lebih dari 0'); return; }
    if (type === 'debit' && amount > customer.totalCoins) {
      setError('Saldo tidak cukup'); return;
    }
    onConfirm(type, amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Coins className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Adjust Koin</h3>
            <p className="text-xs text-gray-500">{customer.name} — Saldo: {customer.totalCoins.toLocaleString('id-ID')} koin</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Tipe Adjustment</label>
            <Select value={type} onValueChange={(v) => setType(v as 'credit' | 'debit')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">➕ Penambahan</SelectItem>
                <SelectItem value="debit">➖ Pengurangan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Nominal Koin</label>
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

          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Nilai Koin</span>
              <span className="font-medium text-gray-700">{formatCurrency(coinValue)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Saldo Setelah</span>
              <span className={`font-semibold ${newBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {newBalance.toLocaleString('id-ID')} koin
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onCancel}>Batal</Button>
          <Button className="flex-1" onClick={handleConfirm}>
            {coinSettings.approvalRequired ? 'Kirim untuk Approval' : 'Konfirmasi'}
          </Button>
        </div>
      </div>
    </div>
  );
}
