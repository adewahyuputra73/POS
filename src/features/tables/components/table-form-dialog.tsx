import { useState } from "react";
import { X } from "lucide-react";
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui";
import type { Table, Area, CreateTableRequest } from "../types";

interface TableFormDialogProps {
  initialData?: Table;
  areas: Area[];
  onSubmit: (data: CreateTableRequest) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TableFormDialog({ initialData, areas, onSubmit, onCancel, isEditing }: TableFormDialogProps) {
  // Sort by createdAt ascending so letter assignment is stable — new areas always get higher letters
  const activeAreas = areas
    .filter((a) => a.is_active)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const [form, setForm] = useState<CreateTableRequest>({
    name: initialData?.name || "",
    area_id: initialData?.area_id || (activeAreas[0]?.id || ""),
    capacity: initialData?.capacity || 4,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get area letter (A, B, C...) based on stable creation-order index
  const getAreaLetter = (areaId: string) => {
    const idx = activeAreas.findIndex((a) => a.id === areaId);
    if (idx === -1) return "A";
    return String.fromCharCode(65 + idx);
  };

  // Suggest next table name for the selected area
  const getSuggestedName = (areaId: string) => {
    const letter = getAreaLetter(areaId);
    const area = activeAreas.find((a) => a.id === areaId);
    const nextNum = (area?.tables?.length ?? 0) + 1;
    return `${letter}${nextNum}`;
  };

  // Hint: show max 3 areas only
  const hintExamples = activeAreas
    .slice(0, 3)
    .map((area, idx) => {
      const letter = String.fromCharCode(65 + idx);
      return `${letter}1 (${area.name})`;
    })
    .join(", ");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama meja wajib diisi";
    if (form.name.length > 5) errs.name = "Maksimal 5 karakter";
    if (form.capacity < 1 || form.capacity > 99) errs.capacity = "Kapasitas 1-99";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in slide-in-from-bottom-4 duration-300">
        <button onClick={onCancel} className="absolute top-4 right-4 text-text-disabled hover:text-text-secondary">
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold text-text-primary mb-5">
          {isEditing ? "Ubah Meja" : "Tambah Meja"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Nama Meja * <span className="text-text-disabled">(maks 5 karakter)</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder={getSuggestedName(form.area_id)}
              maxLength={5}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name
              ? <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              : <p className="text-xs text-text-disabled mt-1">Nama harus unik di semua area. Contoh: <span className="font-medium">{hintExamples}</span></p>
            }
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Area *</label>
            <Select value={form.area_id} onValueChange={(v) => setForm((prev) => ({ ...prev, area_id: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {activeAreas.map((area, idx) => (
                  <SelectItem key={area.id} value={area.id}>
                    {String.fromCharCode(65 + idx)} — {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Kapasitas</label>
            <Input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm((prev) => ({ ...prev, capacity: Number(e.target.value) }))}
              min={1}
              max={99}
              className={errors.capacity ? "border-red-500" : ""}
            />
            {errors.capacity && <p className="text-xs text-red-500 mt-1">{errors.capacity}</p>}
          </div>
          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Batal
            </Button>
            <Button type="submit" className="flex-1">
              {isEditing ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
