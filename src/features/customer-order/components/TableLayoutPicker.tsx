import { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowLeft, Users, Check, Loader2, Layers } from "lucide-react";
import { pubTableService } from "@/features/customer-order/services/pub-services";
import type { Table, Area } from "@/features/tables/types";

interface TableLayoutPickerProps {
    onSelect: (table: Table) => void;
    onBack: () => void;
    title?: string;
}

// Same storage key as admin — shares layout positions
const STORAGE_KEY = "fere-table-layout-v1";

interface TablePos {
    x: number;
    y: number;
}

function loadSavedLayout(): Record<string, Record<string, TablePos>> {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
        return {};
    }
}

function autoPositions(tables: Table[]): Record<string, TablePos> {
    const COLS = 4;
    const result: Record<string, TablePos> = {};
    tables.forEach((t, i) => {
        result[t.id] = {
            x: 30 + (i % COLS) * 150,
            y: 30 + Math.floor(i / COLS) * 130,
        };
    });
    return result;
}

function getTableSize(capacity: number): { w: number; h: number } {
    const extra = Math.max(0, capacity - 2);
    const w = 76 + Math.floor(extra / 2) * 14;
    const h = 70 + Math.floor(extra / 2) * 10;
    return { w: Math.min(w, 150), h: Math.min(h, 130) };
}

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string }> = {
    AVAILABLE: { bg: "#ECFDF5", border: "#86EFAC", text: "#166534" },
    OCCUPIED: { bg: "#FEE2E2", border: "#FCA5A5", text: "#991B1B" },
    RESERVED: { bg: "#FEF3C7", border: "#FCD34D", text: "#92400E" },
    UNAVAILABLE: { bg: "#F3F4F6", border: "#D1D5DB", text: "#9CA3AF" },
};

const STATUS_LABEL: Record<string, string> = {
    AVAILABLE: "Tersedia",
    OCCUPIED: "Terisi",
    RESERVED: "Dipesan",
    UNAVAILABLE: "Nonaktif",
};

export function TableLayoutPicker({ onSelect, onBack, title = "Pilih Meja" }: TableLayoutPickerProps) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [positions, setPositions] = useState<Record<string, Record<string, TablePos>>>({});
    const [selectedAreaId, setSelectedAreaId] = useState<string>("");
    const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [areasData, tablesData] = await Promise.all([
                    pubTableService.areas(),
                    pubTableService.list(),
                ]);
                const areaList = Array.isArray(areasData) ? areasData : [];
                const tableList = Array.isArray(tablesData) ? tablesData : [];
                setAreas(areaList.filter((a) => a.is_active));
                setTables(tableList);
                if (areaList.length > 0) setSelectedAreaId(areaList[0].id);
                setPositions(loadSavedLayout());
            } catch {
                // keep empty
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const areaTables = useMemo(
        () => tables.filter((t) => t.area_id === selectedAreaId),
        [tables, selectedAreaId]
    );

    // Auto-place if no saved layout for this area
    useEffect(() => {
        if (!selectedAreaId || areaTables.length === 0) return;
        if (positions[selectedAreaId]) return;
        setPositions((prev) => ({ ...prev, [selectedAreaId]: autoPositions(areaTables) }));
    }, [selectedAreaId, areaTables, positions]);

    const getPos = useCallback(
        (tableId: string): TablePos => {
            return positions[selectedAreaId]?.[tableId] ?? { x: 30, y: 30 };
        },
        [positions, selectedAreaId]
    );

    // Canvas dimensions based on table positions
    const canvasDimensions = useMemo(() => {
        let maxX = 600;
        let maxY = 400;
        areaTables.forEach((t) => {
            const pos = positions[selectedAreaId]?.[t.id];
            if (pos) {
                const { w, h } = getTableSize(t.capacity ?? 2);
                maxX = Math.max(maxX, pos.x + w + 40);
                maxY = Math.max(maxY, pos.y + h + 40);
            }
        });
        return { width: maxX, height: maxY };
    }, [areaTables, positions, selectedAreaId]);

    const handleSelectTable = (table: Table) => {
        if (table.status !== "AVAILABLE") return;
        setSelectedTableId(table.id);
    };

    const handleConfirm = () => {
        const table = tables.find((t) => t.id === selectedTableId);
        if (table) onSelect(table);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin mb-4" style={{ color: "#D97706" }} />
                <p className="text-sm font-medium" style={{ color: "#9C7D58" }}>Memuat layout meja...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-90 border shrink-0"
                    style={{ backgroundColor: "#FFF8EE", borderColor: "rgba(124,74,30,0.2)", color: "#6B4C2A" }}
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                    <h2 className="text-lg md:text-xl font-black tracking-tight font-[family-name:var(--font-fraunces)]" style={{ color: "#1C0A00" }}>
                        {title}
                    </h2>
                    <p className="text-xs font-medium" style={{ color: "#9C7D58" }}>
                        Pilih meja yang tersedia
                    </p>
                </div>
            </div>

            {/* Area Tabs */}
            {areas.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {areas.map((area) => {
                        const isActive = area.id === selectedAreaId;
                        const count = tables.filter((t) => t.area_id === area.id && t.status === "AVAILABLE").length;
                        return (
                            <button
                                key={area.id}
                                onClick={() => { setSelectedAreaId(area.id); setSelectedTableId(null); }}
                                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all"
                                style={{
                                    backgroundColor: isActive ? "#1C0A00" : "#FFFFFF",
                                    borderColor: isActive ? "#F59E0B" : "#E5D5C0",
                                    color: isActive ? "#F59E0B" : "#6B4C2A",
                                }}
                            >
                                {area.name}
                                <span className="ml-1.5 opacity-60">({count})</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
                {Object.entries(STATUS_LABEL).map(([status, label]) => {
                    const s = STATUS_STYLE[status];
                    return (
                        <div key={status} className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: s.bg, borderColor: s.border }} />
                            <span className="text-[10px] font-bold" style={{ color: "#9C7D58" }}>{label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Canvas */}
            <div
                className="rounded-2xl border overflow-auto"
                style={{ backgroundColor: "#FFFCF7", borderColor: "rgba(124,74,30,0.12)" }}
            >
                {areaTables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Layers className="h-10 w-10 mb-3" style={{ color: "#D1D5DB" }} />
                        <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Belum ada meja di area ini</p>
                    </div>
                ) : (
                    <div
                        className="relative"
                        style={{
                            width: canvasDimensions.width,
                            height: canvasDimensions.height,
                            minWidth: "100%",
                            backgroundImage: "radial-gradient(circle, rgba(124,74,30,0.08) 1px, transparent 1px)",
                            backgroundSize: "20px 20px",
                        }}
                    >
                        {areaTables.map((table) => {
                            const pos = getPos(table.id);
                            const { w, h } = getTableSize(table.capacity ?? 2);
                            const style = STATUS_STYLE[table.status] ?? STATUS_STYLE.AVAILABLE;
                            const isAvailable = table.status === "AVAILABLE";
                            const isSelected = selectedTableId === table.id;

                            return (
                                <button
                                    key={table.id}
                                    disabled={!isAvailable}
                                    onClick={() => handleSelectTable(table)}
                                    className="absolute flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        width: w,
                                        height: h,
                                        backgroundColor: isSelected ? "#FEF3C7" : style.bg,
                                        borderColor: isSelected ? "#F59E0B" : style.border,
                                        color: style.text,
                                        cursor: isAvailable ? "pointer" : "not-allowed",
                                        opacity: !isAvailable ? 0.5 : 1,
                                        boxShadow: isSelected ? "0 0 0 3px rgba(245,158,11,0.25)" : "none",
                                    }}
                                >
                                    {isSelected && (
                                        <div
                                            className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center"
                                            style={{ backgroundColor: "#F59E0B" }}
                                        >
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    )}
                                    <span className="text-xs font-black leading-none">{table.name}</span>
                                    <span className="flex items-center gap-0.5 text-[10px] font-bold opacity-70 mt-1">
                                        <Users className="h-2.5 w-2.5" />
                                        {table.capacity}
                                    </span>
                                    {!isAvailable && (
                                        <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5 opacity-70">
                                            {STATUS_LABEL[table.status]}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirm Button */}
            {selectedTableId && (
                <button
                    onClick={handleConfirm}
                    className="w-full h-13 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: "#F59E0B", color: "#1C0A00", boxShadow: "0 8px 28px rgba(245,158,11,0.28)" }}
                >
                    <Check className="h-4 w-4" />
                    Pilih {tables.find((t) => t.id === selectedTableId)?.name ?? "Meja"} ({tables.find((t) => t.id === selectedTableId)?.capacity} kursi)
                </button>
            )}
        </div>
    );
}
