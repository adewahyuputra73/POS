"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { tableService } from '@/features/tables/services/table-service';
import type { Table, Area } from '@/features/tables/types';
import { useToast } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, RotateCcw, ZoomIn, ZoomOut, Layers, Move, Square, Trash2 } from 'lucide-react';

// ==================
// Local types
// ==================
interface TablePos { x: number; y: number; }

interface LocalObject {
  id: string;
  areaId: string;
  type: 'bar' | 'dapur' | 'tembok';
  name: string;
  x: number; y: number;
  width: number; height: number;
}

const TABLE_W = 80;
const TABLE_H = 70;
const STORAGE_KEY = 'fere-table-layout-v1';

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE: 'bg-green-100 border-green-300 text-green-700',
  OCCUPIED: 'bg-red-100 border-red-300 text-red-700',
  RESERVED: 'bg-yellow-100 border-yellow-300 text-yellow-700',
  UNAVAILABLE: 'bg-gray-100 border-gray-300 text-gray-400',
};

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Tersedia',
  OCCUPIED: 'Terisi',
  RESERVED: 'Reserved',
  UNAVAILABLE: 'Nonaktif',
};

function loadSavedLayout(): Record<string, Record<string, TablePos>> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

function autoPositions(tables: Table[]): Record<string, TablePos> {
  const COLS = 5;
  const result: Record<string, TablePos> = {};
  tables.forEach((t, i) => {
    result[t.id] = {
      x: 40 + (i % COLS) * 120,
      y: 40 + Math.floor(i / COLS) * 110,
    };
  });
  return result;
}

// ==================
// CanvasTable
// ==================
function CanvasTable({ table, pos, isSelected, onSelect, onDrag }: {
  table: Table;
  pos: TablePos;
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
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, onDrag]);

  const colorClass = STATUS_COLOR[table.status] ?? STATUS_COLOR.AVAILABLE;

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move flex flex-col items-center justify-center border-2 rounded-lg select-none transition-shadow
        ${colorClass}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : 'shadow-sm hover:shadow-md'}
      `}
      style={{ left: pos.x, top: pos.y, width: TABLE_W, height: TABLE_H }}
      title={`${table.name} · ${table.capacity} pax · ${table.area?.name ?? ''}`}
    >
      <span className="text-xs font-bold leading-none">{table.name}</span>
      <span className="text-[9px] opacity-70 mt-0.5">{table.capacity}p</span>
    </div>
  );
}

// ==================
// CanvasObject
// ==================
const OBJ_CONFIG: Record<LocalObject['type'], { bg: string; label: string }> = {
  bar: { bg: 'bg-amber-200 border-amber-400 text-amber-800', label: '🍸 Bar' },
  dapur: { bg: 'bg-orange-200 border-orange-400 text-orange-800', label: '🍳 Dapur' },
  tembok: { bg: 'bg-gray-300 border-gray-400 text-gray-600', label: '' },
};

function CanvasObject({ obj, isSelected, onSelect, onDrag }: {
  obj: LocalObject;
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
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, onDrag]);

  const cfg = OBJ_CONFIG[obj.type];

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move border-2 flex items-center justify-center select-none
        ${cfg.bg}
        ${obj.type !== 'tembok' ? 'rounded-lg' : ''}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      style={{ left: obj.x, top: obj.y, width: obj.width, height: obj.height }}
      title={obj.name || obj.type}
    >
      {cfg.label && <span className="text-[10px] font-medium">{cfg.label}</span>}
    </div>
  );
}

// ==================
// Main Page
// ==================
export default function LayoutPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [positions, setPositions] = useState<Record<string, Record<string, TablePos>>>({});
  const [objects, setObjects] = useState<LocalObject[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('');
  const [selectedId, setSelectedId] = useState<{ type: 'table' | 'object'; id: string } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const [areasData, tablesData] = await Promise.all([
          tableService.areas().catch(() => [] as Area[]),
          tableService.list().catch(() => [] as Table[]),
        ]);
        const areaList = Array.isArray(areasData) ? areasData : [];
        const tableList = Array.isArray(tablesData) ? tablesData : [];
        setAreas(areaList);
        setTables(tableList);
        if (areaList.length > 0) setSelectedAreaId(areaList[0].id);
        setPositions(loadSavedLayout());
      } catch {
        showToast('Gagal memuat data meja', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const areaTables = useMemo(
    () => tables.filter(t => t.area_id === selectedAreaId),
    [tables, selectedAreaId]
  );

  const areaObjects = useMemo(
    () => objects.filter(o => o.areaId === selectedAreaId),
    [objects, selectedAreaId]
  );

  // Auto-place tables if no saved position for this area
  useEffect(() => {
    if (!selectedAreaId || areaTables.length === 0) return;
    if (positions[selectedAreaId]) return;
    setPositions(prev => ({ ...prev, [selectedAreaId]: autoPositions(areaTables) }));
  }, [selectedAreaId, areaTables, positions]);

  const getPos = useCallback((tableId: string): TablePos => {
    return positions[selectedAreaId]?.[tableId] ?? { x: 40, y: 40 };
  }, [positions, selectedAreaId]);

  const handleTableDrag = useCallback((tableId: string, dx: number, dy: number) => {
    setPositions(prev => {
      const areaPos = prev[selectedAreaId] ?? {};
      const cur = areaPos[tableId] ?? { x: 40, y: 40 };
      return {
        ...prev,
        [selectedAreaId]: {
          ...areaPos,
          [tableId]: {
            x: Math.max(0, cur.x + dx / zoom),
            y: Math.max(0, cur.y + dy / zoom),
          },
        },
      };
    });
    setHasChanges(true);
  }, [selectedAreaId, zoom]);

  const handleObjectDrag = useCallback((objId: string, dx: number, dy: number) => {
    setObjects(prev => prev.map(o => o.id === objId ? {
      ...o,
      x: Math.max(0, o.x + dx / zoom),
      y: Math.max(0, o.y + dy / zoom),
    } : o));
    setHasChanges(true);
  }, [zoom]);

  const addObject = (type: LocalObject['type']) => {
    const newObj: LocalObject = {
      id: `obj-${Date.now()}`,
      areaId: selectedAreaId,
      type,
      name: type === 'tembok' ? '' : type.charAt(0).toUpperCase() + type.slice(1),
      x: 200, y: 150,
      width: type === 'tembok' ? 200 : 120,
      height: type === 'tembok' ? 12 : 60,
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId({ type: 'object', id: newObj.id });
    setHasChanges(true);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    if (selectedId.type === 'object') {
      setObjects(prev => prev.filter(o => o.id !== selectedId.id));
      setHasChanges(true);
    }
    setSelectedId(null);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    setHasChanges(false);
    showToast('Layout berhasil disimpan', 'success');
  };

  const handleReset = () => {
    if (!selectedAreaId || areaTables.length === 0) return;
    setPositions(prev => ({ ...prev, [selectedAreaId]: autoPositions(areaTables) }));
    setObjects(prev => prev.filter(o => o.areaId !== selectedAreaId));
    setSelectedId(null);
    setHasChanges(false);
    showToast('Layout direset ke posisi awal', 'success');
  };

  const selectedArea = areas.find(a => a.id === selectedAreaId);

  const tableCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    areas.forEach(a => {
      counts[a.id] = tables.filter(t => t.area_id === a.id).length;
    });
    return counts;
  }, [areas, tables]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tata Letak</h1>
          <p className="text-sm text-text-secondary mt-1">Atur posisi meja secara visual per area</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset Area
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="gap-1.5">
            <Save className="h-4 w-4" /> Simpan Layout
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-surface rounded-xl border border-border p-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Area Selector */}
          {areas.length > 0 ? (
            <Select value={selectedAreaId} onValueChange={(v) => { setSelectedAreaId(v); setSelectedId(null); }}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Pilih area" />
              </SelectTrigger>
              <SelectContent>
                {areas.filter(a => a.is_active).map(area => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name} ({tableCounts[area.id] ?? 0} meja)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <span className="text-sm text-text-secondary">Belum ada area</span>
          )}

          <div className="w-px h-6 bg-border" />

          {/* Add Objects */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-text-secondary mr-1">Tambah:</span>
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

          {selectedId?.type === 'object' && (
            <>
              <div className="w-px h-6 bg-border" />
              <Button
                variant="outline" size="sm"
                onClick={deleteSelected}
                className="h-8 text-xs gap-1 text-red-500 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" /> Hapus Objek
              </Button>
            </>
          )}
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="h-8 w-8 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-text-secondary w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="h-8 w-8 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="bg-surface rounded-xl border border-border overflow-auto"
        style={{ height: 'calc(100vh - 290px)' }}
      >
        <div
          className="relative bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]"
          style={{
            width: 800 * zoom,
            height: 600 * zoom,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            minWidth: 800,
            minHeight: 600,
          }}
          onClick={() => setSelectedId(null)}
        >
          {/* Legend */}
          <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur rounded-lg border border-border p-2.5 z-10 space-y-1.5">
            <p className="text-[10px] font-semibold text-text-secondary mb-1">LEGENDA</p>
            {Object.entries(STATUS_LABEL).map(([status, label]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm border ${STATUS_COLOR[status]}`} />
                <span className="text-[10px] text-text-secondary">{label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-200 border border-amber-400" />
              <span className="text-[10px] text-text-secondary">Bar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-200 border border-orange-400" />
              <span className="text-[10px] text-text-secondary">Dapur</span>
            </div>
          </div>

          {/* Objects */}
          {areaObjects.map(obj => (
            <CanvasObject
              key={obj.id}
              obj={obj}
              isSelected={selectedId?.type === 'object' && selectedId.id === obj.id}
              onSelect={() => setSelectedId({ type: 'object', id: obj.id })}
              onDrag={(dx, dy) => handleObjectDrag(obj.id, dx, dy)}
            />
          ))}

          {/* Tables */}
          {areaTables.map(table => {
            const pos = getPos(table.id);
            return (
              <CanvasTable
                key={table.id}
                table={table}
                pos={pos}
                isSelected={selectedId?.type === 'table' && selectedId.id === table.id}
                onSelect={() => setSelectedId({ type: 'table', id: table.id })}
                onDrag={(dx, dy) => handleTableDrag(table.id, dx, dy)}
              />
            );
          })}

          {/* Empty state */}
          {areaTables.length === 0 && areaObjects.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Layers className="h-12 w-12 text-text-disabled mx-auto mb-3" />
                <p className="text-text-disabled text-sm">Belum ada meja di area ini</p>
                <p className="text-text-disabled text-xs mt-1">Tambahkan meja dari halaman Meja</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-text-disabled">
        <div className="flex items-center gap-3">
          <span>{selectedArea?.name ?? '-'}</span>
          <span>·</span>
          <span>{areaTables.length} meja</span>
          <span>·</span>
          <span>
            {areaTables.filter(t => t.status === 'AVAILABLE').length} tersedia
            {' · '}
            {areaTables.filter(t => t.status === 'OCCUPIED').length} terisi
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Move className="h-3 w-3" />
          <span>Klik & drag untuk memindahkan · Posisi disimpan di browser</span>
          {hasChanges && <Badge variant="warning" size="sm">Belum disimpan</Badge>}
        </div>
      </div>
    </div>
  );
}
