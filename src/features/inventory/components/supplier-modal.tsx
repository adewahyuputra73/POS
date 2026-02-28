"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Supplier, SupplierFormData } from "../types";

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  onSubmit: (data: SupplierFormData) => void;
}

const PAYMENT_TERMS = ['7 hari', '14 hari', '21 hari', '30 hari', '45 hari', '60 hari'];

export function SupplierModal({ open, onClose, supplier, onSubmit }: SupplierModalProps) {
  const isEdit = !!supplier;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [paymentType, setPaymentType] = useState<'cash' | 'transfer'>('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (supplier) {
        setName(supplier.name);
        setPhone(supplier.phone || '');
        setAddress(supplier.address || '');
        setPaymentTerm(supplier.paymentTerm || '');
        setPaymentType(supplier.paymentType || 'cash');
      } else {
        setName(''); setPhone(''); setAddress(''); setPaymentTerm(''); setPaymentType('cash');
      }
      setErrors({});
    }
  }, [open, supplier]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Nama supplier wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: name.trim(),
      phone: phone || undefined,
      address: address || undefined,
      paymentTerm: paymentTerm || undefined,
      paymentType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Ubah Supplier' : 'Tambah Supplier'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input label="Nama Supplier *" placeholder="Contoh: UD Makmur Jaya" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
          <Input label="No. Telepon" placeholder="08xxxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Alamat" placeholder="Alamat lengkap supplier" value={address} onChange={(e) => setAddress(e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Tempo Pembayaran</label>
            <select
              className="w-full h-10 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              value={paymentTerm}
              onChange={(e) => setPaymentTerm(e.target.value)}
            >
              <option value="">Pilih tempo</option>
              {PAYMENT_TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Tipe Pembayaran</label>
            <div className="flex gap-3">
              {(['cash', 'transfer'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    paymentType === type
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-surface text-text-secondary border-border hover:border-indigo-300'
                  }`}
                >
                  {type === 'cash' ? 'Cash' : 'Transfer'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-divider">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Simpan' : 'Tambah'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
