"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { RestaurantTable, LayoutObject, LayoutObjectType } from '@/features/table-management/types';
import { mockTables, mockAreas, mockLayoutObjects, getTablesByArea, getLayoutObjectsByArea } from '@/features/table-management/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Save, RotateCcw, ZoomIn, ZoomOut, Plus, Trash2, Layers, Move, Square, Circle,
} from 'lucide-react';

// ==================
// Canvas Table Element
// ==================
function CanvasTable({ table, isSelected, onSelect, onDrag }: {
  table: RestaurantTable;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (dx: number, dy: number) => void;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onDrag(dx, dy);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [isDragging, onDrag]);

  const statusColor = table.status === 'occupied' ? 'bg-red-100 border-red-300 text-red-700'
    : table.status === 'reserved' ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
    : 'bg-green-100 border-green-300 text-green-700';

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move flex flex-col items-center justify-center border-2 transition-shadow select-none
        ${table.shape === 'circle' ? 'rounded-full' : 'rounded-lg'}
        ${statusColor}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'shadow-sm hover:shadow-md'}
      `}
      style={{
        left: table.positionX, top: table.positionY,
        width: table.width, height: table.height,
        transform: `rotate(${table.rotation}deg)`,
      }}
      title={`Meja ${table.name} (${table.capacity} pax) - ${table.areaName}`}
    >
      <span className="text-xs font-bold leading-none">{table.name}</span>
      <span className="text-[9px] opacity-70">{table.capacity}p</span>
    </div>
  );
}

// ==================
// Canvas Layout Object
// ==================
function CanvasObject({ obj, isSelected, onSelect, onDrag }: {
  obj: LayoutObject;
  isSelected: boolean;
  onSelect: () => void;
  onDrag: (dx: number, dy: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      onDrag(dx, dy);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [isDragging, onDrag]);

  const typeConfig: Record<LayoutObjectType, { bg: string; label: string }> = {
    bar: { bg: 'bg-amber-200 border-amber-400 text-amber-800', label: '🍸 Bar' },
    dapur: { bg: 'bg-orange-200 border-orange-400 text-orange-800', label: '🍳 Dapur' },
    tembok: { bg: 'bg-gray-400 border-gray-500', label: '' },
  };
  const config = typeConfig[obj.type];

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move border-2 flex items-center justify-center select-none
        ${config.bg}
        ${obj.type === 'tembok' ? '' : 'rounded-lg'}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      style={{
        left: obj.positionX, top: obj.positionY,
        width: obj.width, height: obj.height,
        transform: `rotate(${obj.rotation}deg)`,
      }}
      title={obj.name || obj.type}
    >
      {config.label && <span className="text-[10px] font-medium">{config.label}</span>}
      {obj.name && obj.type !== 'tembok' && (
        <span className="text-[9px] absolute -bottom-4 left-0 right-0 text-center text-gray-500">{obj.name}</span>
      )}
    </div>
  );
}

// ==================
// Layout Editor Page
// ==================
export default function LayoutPage() {
  const [selectedAreaId, setSelectedAreaId] = useState(mockAreas[0]?.id || 1);
  const [tables, setTables] = useState<RestaurantTable[]>(mockTables);
  const [objects, setObjects] = useState<LayoutObject[]>(mockLayoutObjects);
  const [selectedId, setSelectedId] = useState<{ type: 'table' | 'object'; id: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  const areaTables = useMemo(() => getTablesByArea(tables, selectedAreaId), [tables, selectedAreaId]);
  const areaObjects = useMemo(() => getLayoutObjectsByArea(objects, selectedAreaId), [objects, selectedAreaId]);
  const selectedArea = mockAreas.find(a => a.id === selectedAreaId);

  const handleTableDrag = useCallback((tableId: number, dx: number, dy: number) => {
    setTables(prev => prev.map(t => t.id === tableId ? {
      ...t, positionX: Math.max(0, t.positionX + dx / zoom), positionY: Math.max(0, t.positionY + dy / zoom),
    } : t));
    setHasChanges(true);
  }, [zoom]);

  const handleObjectDrag = useCallback((objId: number, dx: number, dy: number) => {
    setObjects(prev => prev.map(o => o.id === objId ? {
      ...o, positionX: Math.max(0, o.positionX + dx / zoom), positionY: Math.max(0, o.positionY + dy / zoom),
    } : o));
    setHasChanges(true);
  }, [zoom]);

  const addObject = (type: LayoutObjectType) => {
    const newObj: LayoutObject = {
      id: Math.max(...objects.map(o => o.id), 0) + 1,
      areaId: selectedAreaId,
      type,
      name: type === 'tembok' ? '' : `${type.charAt(0).toUpperCase() + type.slice(1)} Baru`,
      positionX: 200, positionY: 200,
      width: type === 'tembok' ? 200 : 120,
      height: type === 'tembok' ? 10 : 60,
      rotation: 0,
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId({ type: 'object', id: newObj.id });
    setHasChanges(true);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    if (selectedId.type === 'table') {
      const t = tables.find(t => t.id === selectedId.id);
      if (t?.status === 'occupied') { alert('Meja sedang terisi!'); return; }
      setTables(prev => prev.filter(t => t.id !== selectedId.id));
    } else {
      setObjects(prev => prev.filter(o => o.id !== selectedId.id));
    }
    setSelectedId(null);
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    // API save would go here
  };

  const handleReset = () => {
    setTables(mockTables);
    setObjects(mockLayoutObjects);
    setSelectedId(null);
    setHasChanges(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tata Letak</h1>
          <p className="text-sm text-gray-500 mt-1">Desain layout meja restoran secara visual</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-1.5">
            <Save className="h-4 w-4" /> Simpan Layout
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-border p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Area Selector */}
          <Select value={String(selectedAreaId)} onValueChange={(v) => { setSelectedAreaId(Number(v)); setSelectedId(null); }}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {mockAreas.filter(a => a.isActive).map(area => (
                <SelectItem key={area.id} value={String(area.id)}>
                  {area.name} ({getTablesByArea(tables, area.id).length} meja)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-px h-6 bg-gray-200" />

          {/* Add Object Buttons */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">Tambah:</span>
            <Button variant="outline" size="sm" onClick={() => addObject('bar')} className="h-8 text-xs gap-1">
              🍸 Bar
            </Button>
            <Button variant="outline" size="sm" onClick={() => addObject('dapur')} className="h-8 text-xs gap-1">
              🍳 Dapur
            </Button>
            <Button variant="outline" size="sm" onClick={() => addObject('tembok')} className="h-8 text-xs gap-1">
              <Square className="h-3 w-3" /> Tembok
            </Button>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Delete */}
          {selectedId && (
            <Button variant="outline" size="sm" onClick={deleteSelected} className="h-8 text-xs gap-1 text-red-500 border-red-200 hover:bg-red-50">
              <Trash2 className="h-3 w-3" /> Hapus
            </Button>
          )}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl border border-border overflow-auto" style={{ height: 'calc(100vh - 280px)' }}>
        <div
          className="relative bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]"
          style={{
            width: 800 * zoom, height: 600 * zoom,
            transform: `scale(${zoom})`, transformOrigin: 'top left',
            minWidth: 800, minHeight: 600,
          }}
          onClick={() => setSelectedId(null)}
        >
          {/* Legend */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg border border-border p-2.5 z-10 space-y-1.5">
            <p className="text-[10px] font-semibold text-gray-600 mb-1">LEGENDA</p>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-green-200 border border-green-400" />
              <span className="text-[10px] text-gray-500">Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-200 border border-red-400" />
              <span className="text-[10px] text-gray-500">Terisi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-400" />
              <span className="text-[10px] text-gray-500">Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400" />
              <span className="text-[10px] text-gray-500">Bar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-200 border border-orange-400" />
              <span className="text-[10px] text-gray-500">Dapur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gray-400" />
              <span className="text-[10px] text-gray-500">Tembok</span>
            </div>
          </div>

          {/* Layout Objects */}
          {areaObjects.map(obj => (
            <CanvasObject
              key={`obj-${obj.id}`}
              obj={obj}
              isSelected={selectedId?.type === 'object' && selectedId.id === obj.id}
              onSelect={() => setSelectedId({ type: 'object', id: obj.id })}
              onDrag={(dx, dy) => handleObjectDrag(obj.id, dx, dy)}
            />
          ))}

          {/* Tables */}
          {areaTables.map(table => (
            <CanvasTable
              key={`table-${table.id}`}
              table={table}
              isSelected={selectedId?.type === 'table' && selectedId.id === table.id}
              onSelect={() => setSelectedId({ type: 'table', id: table.id })}
              onDrag={(dx, dy) => handleTableDrag(table.id, dx, dy)}
            />
          ))}

          {/* Empty state */}
          {areaTables.length === 0 && areaObjects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Layers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Belum ada meja di area ini</p>
                <p className="text-gray-400 text-xs mt-1">Tambahkan meja dari halaman Meja</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span>{selectedArea?.name || '-'}</span>
          <span>·</span>
          <span>{areaTables.length} meja</span>
          <span>·</span>
          <span>{areaObjects.length} objek</span>
        </div>
        <div className="flex items-center gap-2">
          <Move className="h-3 w-3" />
          <span>Klik & drag untuk memindahkan · Klik untuk memilih</span>
          {hasChanges && <Badge variant="warning" size="sm">Belum disimpan</Badge>}
        </div>
      </div>
    </div>
  );
}
