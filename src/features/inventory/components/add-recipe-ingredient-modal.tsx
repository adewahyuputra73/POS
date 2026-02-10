"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X, Check, FlaskConical } from "lucide-react";
import { RawMaterial, MaterialType } from "../types";

interface AddRecipeIngredientModalProps {
  open: boolean;
  onClose: () => void;
  materials: RawMaterial[];
  excludeIds: number[];
  onSelect: (materialIds: number[]) => void;
}

export function AddRecipeIngredientModal({
  open, onClose, materials, excludeIds, onSelect,
}: AddRecipeIngredientModalProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<MaterialType>('raw');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (m.type !== activeTab) return false;
      if (excludeIds.includes(m.id)) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [materials, activeTab, search, excludeIds]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    onSelect(selectedIds);
    setSelectedIds([]);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Tambah Bahan ke Resep</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {[{ key: 'raw' as const, label: 'Bahan Mentah' }, { key: 'semi_finished' as const, label: 'Setengah Jadi' }].map((t) => (
              <button key={t.key} onClick={() => { setActiveTab(t.key); setSelectedIds([]); }}
                className={cn("flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                )}>{t.label}</button>
            ))}
          </div>
          <Input placeholder="Cari bahan..." value={search} onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={search ? <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button> : undefined}
          />
          <div className="flex-1 overflow-y-auto space-y-1 max-h-[350px]">
            {filtered.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Tidak ada bahan ditemukan</p>
              </div>
            ) : (
              filtered.map((m) => {
                const sel = selectedIds.includes(m.id);
                return (
                  <button key={m.id} onClick={() => toggleSelect(m.id)}
                    className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                      sel ? "bg-rose-50 border border-rose-200" : "hover:bg-gray-50 border border-transparent"
                    )}>
                    <div className={cn("h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      sel ? "bg-rose-600 border-rose-600" : "border-gray-300"
                    )}>{sel && <Check className="h-3 w-3 text-white" />}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.categoryName} · {m.baseUnit}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">{selectedIds.length} bahan dipilih</span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button onClick={handleSubmit} disabled={selectedIds.length === 0}>Tambahkan</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
