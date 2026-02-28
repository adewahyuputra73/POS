"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { UnitConversion, UnitConversionFormData, UnitRole } from "../types";

interface UnitConversionModalProps {
  open: boolean;
  onClose: () => void;
  conversion?: UnitConversion | null;
  onSubmit: (data: UnitConversionFormData) => void;
  existingNames: string[];
}

interface UnitRow {
  tempId: string;
  name: string;
  conversionValue: string;
  perUom: string;
  role: UnitRole | '';
}

const ROLES: { value: UnitRole; label: string }[] = [
  { value: 'base', label: 'Base' },
  { value: 'transfer', label: 'Sedang (Transfer)' },
  { value: 'purchase', label: 'Besar (Purchase)' },
];

export function UnitConversionModal({
  open,
  onClose,
  conversion,
  onSubmit,
  existingNames,
}: UnitConversionModalProps) {
  const isEdit = !!conversion;

  const [name, setName] = useState('');
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      if (conversion) {
        setName(conversion.name);
        setUnits(
          conversion.units.map((u) => ({
            tempId: `unit-${u.id}`,
            name: u.name,
            conversionValue: String(u.conversionValue),
            perUom: u.perUom,
            role: u.role,
          }))
        );
      } else {
        setName('');
        setUnits([
          { tempId: `unit-${Date.now()}`, name: '', conversionValue: '1', perUom: '', role: 'base' },
        ]);
      }
      setErrors({});
    }
  }, [open, conversion]);

  const addUnit = () => {
    setUnits((prev) => [
      ...prev,
      { tempId: `unit-${Date.now()}-${prev.length}`, name: '', conversionValue: '', perUom: '', role: '' },
    ]);
  };

  const removeUnit = (tempId: string) => {
    setUnits((prev) => prev.filter((u) => u.tempId !== tempId));
  };

  const updateUnit = (tempId: string, field: keyof UnitRow, value: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.tempId === tempId ? { ...u, [field]: value } : u))
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nama konversi unit wajib diisi';
    } else if (
      existingNames
        .filter((n) => !isEdit || n !== conversion?.name)
        .some((n) => n.toLowerCase() === name.trim().toLowerCase())
    ) {
      newErrors.name = 'Nama konversi unit sudah digunakan';
    }

    if (units.length === 0) {
      newErrors.units = 'Minimal 1 unit wajib ditambahkan';
    }

    const hasBase = units.some((u) => u.role === 'base');
    if (!hasBase) {
      newErrors.units = 'Wajib memiliki 1 unit dengan role Base';
    }

    // Check duplicate roles
    const roles = units.filter((u) => u.role).map((u) => u.role);
    const uniqueRoles = new Set(roles);
    if (roles.length !== uniqueRoles.size) {
      newErrors.units = 'Tidak boleh ada role yang duplikat';
    }

    units.forEach((u, i) => {
      if (!u.name.trim()) newErrors[`unit-${i}-name`] = 'Wajib diisi';
      if (!u.conversionValue || Number(u.conversionValue) <= 0) {
        newErrors[`unit-${i}-value`] = 'Harus > 0';
      }
      if (!u.role) newErrors[`unit-${i}-role`] = 'Wajib dipilih';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      units: units.map((u) => ({
        name: u.name.trim(),
        conversionValue: Number(u.conversionValue),
        perUom: u.perUom || units.find((b) => b.role === 'base')?.name || u.name,
        role: u.role as UnitRole,
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Ubah Konversi Unit' : 'Tambah Konversi Unit'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Nama Konversi */}
          <div>
            <Input
              label="Nama Konversi Unit"
              placeholder="Contoh: Satuan Berat"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
          </div>

          {/* Unit List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-text-primary">Detail Unit Konversi</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={addUnit}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Tambah Unit
              </Button>
            </div>

            {errors.units && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-3 p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {errors.units}
              </div>
            )}

            <div className="space-y-3">
              {units.map((unit, index) => (
                <div
                  key={unit.tempId}
                  className="border border-border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-secondary">Unit #{index + 1}</span>
                    {units.length > 1 && (
                      <button
                        onClick={() => removeUnit(unit.tempId)}
                        className="text-text-disabled hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Nama Unit"
                      placeholder="gram, kg, liter..."
                      value={unit.name}
                      onChange={(e) => updateUnit(unit.tempId, 'name', e.target.value)}
                      error={errors[`unit-${index}-name`]}
                    />
                    <Input
                      label="Nilai Konversi"
                      type="number"
                      placeholder="1"
                      value={unit.conversionValue}
                      onChange={(e) => updateUnit(unit.tempId, 'conversionValue', e.target.value)}
                      error={errors[`unit-${index}-value`]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Per UOM
                      </label>
                      <select
                        className="w-full h-10 px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
                        value={unit.perUom}
                        onChange={(e) => updateUnit(unit.tempId, 'perUom', e.target.value)}
                      >
                        <option value="">Pilih unit referensi</option>
                        {units
                          .filter((u) => u.name.trim() && u.tempId !== unit.tempId)
                          .map((u) => (
                            <option key={u.tempId} value={u.name}>{u.name}</option>
                          ))}
                        {unit.name.trim() && (
                          <option value={unit.name}>{unit.name} (self)</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">
                        Role Unit
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {ROLES.map((r) => {
                          const isUsed = units.some((u) => u.role === r.value && u.tempId !== unit.tempId);
                          return (
                            <button
                              key={r.value}
                              onClick={() => updateUnit(unit.tempId, 'role', r.value)}
                              disabled={isUsed}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                unit.role === r.value
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : isUsed
                                    ? "bg-background text-text-disabled border-border cursor-not-allowed"
                                    : "bg-surface text-text-secondary border-border hover:border-blue-300 hover:text-blue-600"
                              )}
                            >
                              {r.label}
                            </button>
                          );
                        })}
                      </div>
                      {errors[`unit-${index}-role`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`unit-${index}-role`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-divider">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? 'Simpan Perubahan' : 'Tambah Konversi'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
