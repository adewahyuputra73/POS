"use client";

import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X, Check, FlaskConical } from "lucide-react";
import { RawMaterial, MaterialType } from "../types";

interface SelectMaterialModalProps {
  open: boolean;
  onClose: () => void;
  materials: RawMaterial[];
  excludeIds: number[];
  onSelect: (materialIds: number[]) => void;
}

export function SelectMaterialModal({
  open,
  onClose,
  materials,
  excludeIds,
  onSelect,
}: SelectMaterialModalProps) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<MaterialType>('raw');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      if (m.type !== activeTab) return false;
      if (excludeIds.includes(m.id)) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!m.name.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [materials, activeTab, search, excludeIds]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSelect(selectedIds);
    setSelectedIds([]);
    setSearch('');
  };

  const tabs = [
    { key: 'raw' as MaterialType, label: 'Bahan Mentah' },
    { key: 'semi_finished' as MaterialType, label: 'Setengah Jadi' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih Bahan Dasar</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-background rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedIds([]); }}
                className={cn(
                  "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  activeTab === tab.key ? "bg-surface text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <Input
            placeholder="Cari bahan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            rightIcon={search ? (
              <button onClick={() => setSearch('')} className="text-text-disabled hover:text-text-secondary">
                <X className="h-4 w-4" />
              </button>
            ) : undefined}
          />

          {/* Material List */}
          <div className="flex-1 overflow-y-auto space-y-1 max-h-[350px]">
            {filteredMaterials.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="h-10 w-10 text-text-disabled mx-auto mb-2" />
                <p className="text-sm text-text-secondary">Tidak ada bahan ditemukan</p>
              </div>
            ) : (
              filteredMaterials.map((material) => {
                const isSelected = selectedIds.includes(material.id);
                return (
                  <button
                    key={material.id}
                    onClick={() => toggleSelect(material.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                      isSelected ? "bg-emerald-50 border border-emerald-200" : "hover:bg-background border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-emerald-600 border-emerald-600" : "border-border"
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{material.name}</p>
                      <p className="text-xs text-text-secondary">{material.categoryName} · {material.baseUnit}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-divider">
          <span className="text-sm text-text-secondary">{selectedIds.length} bahan dipilih</span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Batal</Button>
            <Button onClick={handleSubmit} disabled={selectedIds.length === 0}>
              Tambahkan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
