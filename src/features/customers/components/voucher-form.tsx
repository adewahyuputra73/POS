"use client";

import { useState } from 'react';
import { VoucherFormData, VoucherType, DiscountType, ProductScope } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Tag, Truck, Info } from 'lucide-react';

interface VoucherFormProps {
  initialData?: VoucherFormData;
  onSubmit: (data: VoucherFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const defaultForm: VoucherFormData = {
  code: '',
  type: 'produk',
  description: '',
  discountType: 'percent',
  discountValue: 0,
  budgetPerTransaction: null,
  quotaTotal: null,
  isStackable: false,
  productScope: 'all',
  selectedProductIds: [],
  minOrder: null,
  specificDelivery: null,
  specificPayment: null,
  specificCustomerSegment: null,
  startDate: '',
  endDate: '',
};

export function VoucherForm({ initialData, onSubmit, onCancel, isEditing }: VoucherFormProps) {
  const [form, setForm] = useState<VoucherFormData>(initialData || defaultForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toggles
  const [enableMinOrder, setEnableMinOrder] = useState(!!initialData?.minOrder);
  const [enableBudget, setEnableBudget] = useState(!!initialData?.budgetPerTransaction);
  const [enableQuota, setEnableQuota] = useState(!!initialData?.quotaTotal);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.code.trim()) errs.code = 'Kode diskon wajib diisi';
    if (!form.description.trim()) errs.description = 'Informasi diskon wajib diisi';
    if (form.description.length > 100) errs.description = 'Maksimal 100 karakter';
    if (form.discountValue <= 0) errs.discountValue = 'Jumlah potongan harus > 0';
    if (form.discountType === 'percent' && form.discountValue > 100) errs.discountValue = 'Maksimal 100%';
    if (!form.startDate) errs.startDate = 'Tanggal mulai wajib diisi';
    if (!form.endDate) errs.endDate = 'Tanggal berakhir wajib diisi';
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
      errs.endDate = 'Tanggal berakhir harus setelah tanggal mulai';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...form,
        budgetPerTransaction: enableBudget ? form.budgetPerTransaction : null,
        quotaTotal: enableQuota ? form.quotaTotal : null,
        minOrder: enableMinOrder ? form.minOrder : null,
      });
    }
  };

  const updateField = <K extends keyof VoucherFormData>(key: K, value: VoucherFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <h2 className="text-lg font-semibold text-text-primary">
          {isEditing ? 'Edit Voucher' : 'Tambah Voucher'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Informasi Diskon */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> Informasi Diskon
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipe Diskon */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Tipe Diskon *</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateField('type', 'produk' as VoucherType)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-medium ${form.type === 'produk' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-border'}`}
                >
                  <Tag className="h-4 w-4" /> Produk
                </button>
                <button
                  type="button"
                  onClick={() => updateField('type', 'ongkir' as VoucherType)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-medium ${form.type === 'ongkir' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary hover:border-border'}`}
                >
                  <Truck className="h-4 w-4" /> Ongkos Kirim
                </button>
              </div>
            </div>

            {/* Kode Diskon */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Kode Diskon *</label>
              <Input
                value={form.code}
                onChange={(e) => updateField('code', e.target.value.toUpperCase())}
                placeholder="HEMAT20"
                className={`font-mono ${errors.code ? 'border-red-500' : ''}`}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code}</p>}
            </div>
          </div>

          {/* Informasi Diskon */}
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Informasi Diskon * <span className="text-text-disabled">({form.description.length}/100)</span></label>
            <Input
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Contoh: Diskon 20% untuk semua produk"
              maxLength={100}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Stackable */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isStackable}
              onChange={(e) => updateField('isStackable', e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-text-primary">Bisa digunakan bersama voucher lain</span>
          </label>
        </div>

        {/* Section: Potongan & Kuota */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Potongan & Kuota Diskon</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipe Potongan */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Jenis Potongan</label>
              <Select value={form.discountType} onValueChange={(v) => updateField('discountType', v as DiscountType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Persentase (%)</SelectItem>
                  <SelectItem value="fixed">Nominal (Rp)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jumlah Potongan */}
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">
                Jumlah Potongan * {form.discountType === 'percent' ? '(%)' : '(Rp)'}
              </label>
              <Input
                type="number"
                value={form.discountValue || ''}
                onChange={(e) => updateField('discountValue', Number(e.target.value))}
                placeholder={form.discountType === 'percent' ? '20' : '10000'}
                className={errors.discountValue ? 'border-red-500' : ''}
              />
              {errors.discountValue && <p className="text-xs text-red-500 mt-1">{errors.discountValue}</p>}
            </div>

            {/* Budget per transaksi */}
            <div>
              <label className="flex items-center gap-2 mb-1.5">
                <input type="checkbox" checked={enableBudget} onChange={e => setEnableBudget(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
                <span className="text-xs font-medium text-text-primary">Budget per Transaksi (Rp)</span>
              </label>
              <Input
                type="number"
                value={form.budgetPerTransaction || ''}
                onChange={(e) => updateField('budgetPerTransaction', Number(e.target.value) || null)}
                disabled={!enableBudget}
                placeholder="50000"
              />
            </div>
          </div>

          {/* Kuota */}
          <div className="max-w-xs">
            <label className="flex items-center gap-2 mb-1.5">
              <input type="checkbox" checked={enableQuota} onChange={e => setEnableQuota(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
              <span className="text-xs font-medium text-text-primary">Kuota Diskon</span>
            </label>
            <Input
              type="number"
              value={form.quotaTotal || ''}
              onChange={(e) => updateField('quotaTotal', Number(e.target.value) || null)}
              disabled={!enableQuota}
              placeholder="100"
            />
          </div>
        </div>

        {/* Section: Produk Diskon (only for type=produk) */}
        {form.type === 'produk' && (
          <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Produk Diskon</h3>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => updateField('productScope', 'all' as ProductScope)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.productScope === 'all' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary'}`}
              >
                Semua Produk
              </button>
              <button
                type="button"
                onClick={() => updateField('productScope', 'selected' as ProductScope)}
                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${form.productScope === 'selected' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-secondary'}`}
              >
                Sebagian Produk
              </button>
            </div>
            {form.productScope === 'selected' && (
              <p className="text-xs text-text-disabled italic">Pilihan produk akan tersedia setelah integrasi API</p>
            )}
          </div>
        )}

        {/* Section: Kriteria Voucher */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Kriteria Voucher <span className="text-text-disabled font-normal">(Opsional)</span></h3>

          <div className="max-w-xs">
            <label className="flex items-center gap-2 mb-1.5">
              <input type="checkbox" checked={enableMinOrder} onChange={e => setEnableMinOrder(e.target.checked)} className="h-3.5 w-3.5 rounded border-border text-primary" />
              <span className="text-xs font-medium text-text-primary">Minimum Total Order (Rp)</span>
            </label>
            <Input
              type="number"
              value={form.minOrder || ''}
              onChange={(e) => updateField('minOrder', Number(e.target.value) || null)}
              disabled={!enableMinOrder}
              placeholder="100000"
            />
          </div>
        </div>

        {/* Section: Durasi */}
        <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Durasi Diskon</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Tanggal & Jam Mulai *</label>
              <Input
                type="datetime-local"
                value={form.startDate ? form.startDate.slice(0, 16) : ''}
                onChange={(e) => updateField('startDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                className={errors.startDate ? 'border-red-500' : ''}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-text-primary mb-1.5">Tanggal & Jam Berakhir *</label>
              <Input
                type="datetime-local"
                value={form.endDate ? form.endDate.slice(0, 16) : ''}
                onChange={(e) => updateField('endDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
                className={errors.endDate ? 'border-red-500' : ''}
              />
              {errors.endDate && <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
          <Button type="submit">{isEditing ? 'Simpan Perubahan' : 'Simpan Voucher'}</Button>
        </div>
      </form>
    </div>
  );
}
