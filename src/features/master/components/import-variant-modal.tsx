import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockOutlets, mockOutletVariants } from "../mock-data";
import { MasterVariant } from "../types";

interface ImportVariantModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (variants: Partial<MasterVariant>[]) => void;
}

export function ImportVariantModal({ open, onClose, onImport }: ImportVariantModalProps) {
  const [selectedOutletId, setSelectedOutletId] = useState<string>("");
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

  const availableVariants = useMemo(() => {
    return mockOutletVariants.filter(v => v.outletId === selectedOutletId);
  }, [selectedOutletId]);

  const handleToggleVariant = (id: string) => {
    setSelectedVariantIds(prev => 
      prev.includes(id) ? prev.filter(vId => vId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVariantIds(availableVariants.map(v => v.id));
    } else {
      setSelectedVariantIds([]);
    }
  };

  const handleSubmit = () => {
    const variantsToImport = availableVariants
      .filter(v => selectedVariantIds.includes(v.id))
      .map(v => ({
        name: v.name,
        type: 'SINGLE' as const,
        options: [],
        isMandatory: false,
        status: 'ACTIVE' as const,
        optionSource: 'custom' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    onImport(variantsToImport);
    onClose();
    // Reset
    setSelectedOutletId("");
    setSelectedVariantIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Impor Varian dari Outlet</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Pilih Outlet Sumber</Label>
            <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Outlet" />
              </SelectTrigger>
              <SelectContent>
                {mockOutlets.map(outlet => (
                  <SelectItem key={outlet.id} value={outlet.id}>
                    {outlet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOutletId && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Daftar Varian ({availableVariants.length})</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all" 
                    checked={availableVariants.length > 0 && selectedVariantIds.length === availableVariants.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                  <label htmlFor="select-all" className="text-sm cursor-pointer">Pilih Semua</label>
                </div>
              </div>

              <div className="border rounded-md max-h-[300px] overflow-y-auto p-2 space-y-2">
                {availableVariants.length === 0 ? (
                  <p className="text-sm text-text-secondary text-center py-4">Tidak ada varian di outlet ini.</p>
                ) : (
                  availableVariants.map(variant => (
                    <div key={variant.id} className="flex items-center space-x-3 p-2 hover:bg-background rounded-lg border border-transparent hover:border-divider">
                      <Checkbox 
                        id={variant.id} 
                        checked={selectedVariantIds.includes(variant.id)}
                        onCheckedChange={() => handleToggleVariant(variant.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{variant.name}</p>
                        <p className="text-xs text-text-secondary">{variant.options} Opsi Available</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={selectedVariantIds.length === 0}>
            Impor {selectedVariantIds.length} Varian
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
