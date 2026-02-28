"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, ChevronDown, FolderPlus, Download } from "lucide-react";

interface AddOptionsMenuProps {
  onAddNew: () => void;
  onImport: () => void;
  label?: string;
  importLabel?: string;
}

export function AddOptionsMenu({
  onAddNew,
  onImport,
  label = "Tambah",
  importLabel = "Impor dari Outlet",
}: AddOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddNew = () => {
    setIsOpen(false);
    onAddNew();
  };

  const handleImport = () => {
    setIsOpen(false);
    onImport();
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button onClick={() => setIsOpen(!isOpen)}>
        <Plus className="h-4 w-4 mr-2" />
        {label}
        <ChevronDown
          className={cn(
            "h-4 w-4 ml-2 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl border border-border shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={handleAddNew}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FolderPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-text-primary text-sm">{label} Baru</p>
              <p className="text-xs text-text-secondary">Buat dari awal</p>
            </div>
          </button>
          <div className="border-t border-border" />
          <button
            onClick={handleImport}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-background transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Download className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-text-primary text-sm">{importLabel}</p>
              <p className="text-xs text-text-secondary">Salin dari outlet lain</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
