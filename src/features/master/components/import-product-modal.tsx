import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mockOutlets, mockOutletProducts } from "../mock-data";
import { MasterProduct } from "../types";

interface ImportProductModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (products: Partial<MasterProduct>[]) => void;
}

export function ImportProductModal({ open, onClose, onImport }: ImportProductModalProps) {
  const [selectedOutletId, setSelectedOutletId] = useState<string>("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const availableProducts = useMemo(() => {
    return mockOutletProducts.filter(p => p.outletId === selectedOutletId);
  }, [selectedOutletId]);

  const handleToggleProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(availableProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSubmit = () => {
    const productsToImport = availableProducts
      .filter(p => selectedProductIds.includes(p.id))
      .map(p => ({
        name: p.name,
        basePrice: p.price,
        // Default values for new master product
        status: 'ACTIVE' as const,
        trackStock: true,
        stock: 0,
        hasTax: false,
        hasServiceFee: false,
        variantIds: [],
        outletIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        categoryId: 'mc-1', // Default category for now
        channelPrices: { goFood: 0, grabFood: 0, shopeeFood: 0 }
      }));

    onImport(productsToImport);
    onClose();
    // Reset
    setSelectedOutletId("");
    setSelectedProductIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Impor Produk dari Outlet</DialogTitle>
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
                <Label>Daftar Produk ({availableProducts.length})</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="select-all" 
                    checked={availableProducts.length > 0 && selectedProductIds.length === availableProducts.length}
                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                  />
                  <label htmlFor="select-all" className="text-sm cursor-pointer">Pilih Semua</label>
                </div>
              </div>

              <div className="border rounded-md max-h-[300px] overflow-y-auto p-2 space-y-2">
                {availableProducts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Tidak ada produk di outlet ini.</p>
                ) : (
                  availableProducts.map(product => (
                    <div key={product.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100">
                      <Checkbox 
                        id={product.id} 
                        checked={selectedProductIds.includes(product.id)}
                        onCheckedChange={() => handleToggleProduct(product.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">Rp {product.price.toLocaleString()} • {product.category}</p>
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
          <Button onClick={handleSubmit} disabled={selectedProductIds.length === 0}>
            Impor {selectedProductIds.length} Produk
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
