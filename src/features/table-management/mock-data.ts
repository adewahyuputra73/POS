import {
  Area, AreaFilters, RestaurantTable, TableFilters, LayoutObject,
} from './types';

// ========================
// AREA MOCK DATA
// ========================

export const mockAreas: Area[] = [
  {
    id: 1, name: 'Lt.1 Indoor', description: 'Area lantai 1 dengan AC, cocok untuk keluarga',
    basePrice: 0, paxDivider: 1, enableExtraPrice: false, enableMaxCapacity: true, maxCapacity: 40,
    allowChildren: true, isActive: true,
    services: [
      { id: 1, name: 'AC' }, { id: 2, name: 'WiFi' }, { id: 3, name: 'TV' },
    ],
    photos: [{ id: 1, imageUrl: '/placeholder-area-1.jpg' }],
    tableCount: 8, totalCapacity: 32, createdAt: '2025-06-01T09:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 2, name: 'Lt.2 Outdoor', description: 'Area outdoor terbuka dengan pemandangan taman',
    basePrice: 0, paxDivider: 1, enableExtraPrice: false, enableMaxCapacity: false,
    allowChildren: true, isActive: true,
    services: [
      { id: 4, name: 'Outdoor' }, { id: 5, name: 'Smoking' },
    ],
    photos: [],
    tableCount: 6, totalCapacity: 24, createdAt: '2025-06-01T09:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 3, name: 'VIP Room', description: 'Ruang VIP private dengan pelayanan eksklusif',
    basePrice: 50000, paxDivider: 2, enableExtraPrice: true, enableMaxCapacity: true, maxCapacity: 12,
    allowChildren: false, isActive: true,
    services: [
      { id: 6, name: 'AC' }, { id: 7, name: 'WiFi' }, { id: 8, name: 'Private Room' }, { id: 9, name: 'Live Music' },
    ],
    photos: [{ id: 2, imageUrl: '/placeholder-area-2.jpg' }, { id: 3, imageUrl: '/placeholder-area-3.jpg' }],
    tableCount: 3, totalCapacity: 12, createdAt: '2025-07-15T09:00:00Z', updatedAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 4, name: 'Rooftop', description: 'Rooftop area dengan view kota',
    basePrice: 25000, paxDivider: 1, enableExtraPrice: false, enableMaxCapacity: true, maxCapacity: 30,
    allowChildren: true, isActive: true,
    services: [
      { id: 10, name: 'Outdoor' }, { id: 11, name: 'Live Music' }, { id: 12, name: 'WiFi' },
    ],
    photos: [],
    tableCount: 5, totalCapacity: 20, createdAt: '2025-08-01T09:00:00Z', updatedAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 5, name: 'Garden', description: 'Area taman outdoor yang asri',
    basePrice: 0, paxDivider: 1, enableExtraPrice: false, enableMaxCapacity: false,
    allowChildren: true, isActive: false,
    services: [
      { id: 13, name: 'Outdoor' },
    ],
    photos: [],
    tableCount: 0, totalCapacity: 0, createdAt: '2025-10-01T09:00:00Z', updatedAt: '2025-12-01T09:00:00Z',
  },
];

// ========================
// TABLE (MEJA) MOCK DATA
// ========================

export const mockTables: RestaurantTable[] = [
  // Lt.1 Indoor
  { id: 1, areaId: 1, areaName: 'Lt.1 Indoor', name: '1', capacity: 4, shape: 'rectangle', positionX: 50, positionY: 50, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=1', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 2, areaId: 1, areaName: 'Lt.1 Indoor', name: '2', capacity: 4, shape: 'rectangle', positionX: 170, positionY: 50, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=2', isActive: true, status: 'occupied', createdAt: '2025-06-01T09:00:00Z' },
  { id: 3, areaId: 1, areaName: 'Lt.1 Indoor', name: '3', capacity: 4, shape: 'rectangle', positionX: 290, positionY: 50, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=3', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 4, areaId: 1, areaName: 'Lt.1 Indoor', name: '4', capacity: 4, shape: 'circle', positionX: 50, positionY: 180, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=4', isActive: true, status: 'reserved', createdAt: '2025-06-01T09:00:00Z' },
  { id: 5, areaId: 1, areaName: 'Lt.1 Indoor', name: '5', capacity: 4, shape: 'circle', positionX: 170, positionY: 180, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=5', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 6, areaId: 1, areaName: 'Lt.1 Indoor', name: '6', capacity: 2, shape: 'circle', positionX: 290, positionY: 180, width: 60, height: 60, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=6', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 7, areaId: 1, areaName: 'Lt.1 Indoor', name: '7', capacity: 6, shape: 'rectangle', positionX: 50, positionY: 300, width: 120, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=7', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 8, areaId: 1, areaName: 'Lt.1 Indoor', name: '8', capacity: 6, shape: 'rectangle', positionX: 220, positionY: 300, width: 120, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=8', isActive: true, status: 'occupied', createdAt: '2025-06-01T09:00:00Z' },

  // Lt.2 Outdoor
  { id: 9, areaId: 2, areaName: 'Lt.2 Outdoor', name: '1', capacity: 4, shape: 'circle', positionX: 80, positionY: 60, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=O1', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 10, areaId: 2, areaName: 'Lt.2 Outdoor', name: '2', capacity: 4, shape: 'circle', positionX: 200, positionY: 60, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=O2', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 11, areaId: 2, areaName: 'Lt.2 Outdoor', name: '3', capacity: 4, shape: 'circle', positionX: 320, positionY: 60, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=O3', isActive: true, status: 'occupied', createdAt: '2025-06-01T09:00:00Z' },
  { id: 12, areaId: 2, areaName: 'Lt.2 Outdoor', name: '4', capacity: 4, shape: 'rectangle', positionX: 80, positionY: 180, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=O4', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 13, areaId: 2, areaName: 'Lt.2 Outdoor', name: '5', capacity: 4, shape: 'rectangle', positionX: 200, positionY: 180, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=O5', isActive: true, status: 'available', createdAt: '2025-06-01T09:00:00Z' },
  { id: 14, areaId: 2, areaName: 'Lt.2 Outdoor', name: '6', capacity: 4, shape: 'rectangle', positionX: 320, positionY: 180, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=O6', isActive: true, status: 'reserved', createdAt: '2025-06-01T09:00:00Z' },

  // VIP Room
  { id: 15, areaId: 3, areaName: 'VIP Room', name: 'V1', capacity: 4, shape: 'rectangle', positionX: 80, positionY: 80, width: 100, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=V1', isActive: true, status: 'available', createdAt: '2025-07-15T09:00:00Z' },
  { id: 16, areaId: 3, areaName: 'VIP Room', name: 'V2', capacity: 4, shape: 'rectangle', positionX: 230, positionY: 80, width: 100, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=V2', isActive: true, status: 'occupied', createdAt: '2025-07-15T09:00:00Z' },
  { id: 17, areaId: 3, areaName: 'VIP Room', name: 'V3', capacity: 4, shape: 'circle', positionX: 150, positionY: 220, width: 90, height: 90, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=V3', isActive: true, status: 'available', createdAt: '2025-07-15T09:00:00Z' },

  // Rooftop
  { id: 18, areaId: 4, areaName: 'Rooftop', name: 'R1', capacity: 4, shape: 'circle', positionX: 60, positionY: 60, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=R1', isActive: true, status: 'available', createdAt: '2025-08-01T09:00:00Z' },
  { id: 19, areaId: 4, areaName: 'Rooftop', name: 'R2', capacity: 4, shape: 'circle', positionX: 180, positionY: 60, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=R2', isActive: true, status: 'available', createdAt: '2025-08-01T09:00:00Z' },
  { id: 20, areaId: 4, areaName: 'Rooftop', name: 'R3', capacity: 4, shape: 'rectangle', positionX: 300, positionY: 60, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=R3', isActive: true, status: 'available', createdAt: '2025-08-01T09:00:00Z' },
  { id: 21, areaId: 4, areaName: 'Rooftop', name: 'R4', capacity: 4, shape: 'rectangle', positionX: 60, positionY: 180, width: 80, height: 80, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=R4', isActive: true, status: 'occupied', createdAt: '2025-08-01T09:00:00Z' },
  { id: 22, areaId: 4, areaName: 'Rooftop', name: 'R5', capacity: 4, shape: 'circle', positionX: 180, positionY: 180, width: 70, height: 70, rotation: 0, qrCode: 'opaper.app/fere-coffee?meja=R5', isActive: true, status: 'available', createdAt: '2025-08-01T09:00:00Z' },
];

// ========================
// LAYOUT OBJECTS MOCK DATA
// ========================

export const mockLayoutObjects: LayoutObject[] = [
  { id: 1, areaId: 1, type: 'bar', name: 'Bar Utama', positionX: 400, positionY: 30, width: 150, height: 50, rotation: 0 },
  { id: 2, areaId: 1, type: 'dapur', name: 'Dapur', positionX: 400, positionY: 200, width: 150, height: 120, rotation: 0 },
  { id: 3, areaId: 1, type: 'tembok', name: '', positionX: 0, positionY: 0, width: 600, height: 10, rotation: 0 },
  { id: 4, areaId: 2, type: 'bar', name: 'Bar Outdoor', positionX: 400, positionY: 50, width: 120, height: 40, rotation: 0 },
  { id: 5, areaId: 3, type: 'tembok', name: 'Partisi', positionX: 0, positionY: 170, width: 400, height: 8, rotation: 0 },
];

// ========================
// FILTER & HELPERS
// ========================

export function filterAreas(areas: Area[], filters: AreaFilters): Area[] {
  return areas.filter(a => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function filterTables(tables: RestaurantTable[], filters: TableFilters): RestaurantTable[] {
  return tables.filter(t => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.areaName.toLowerCase().includes(q)) return false;
    }
    if (filters.areaId !== 'all' && t.areaId !== filters.areaId) return false;
    return true;
  });
}

export function getAreaStats(areas: Area[]) {
  const active = areas.filter(a => a.isActive);
  return {
    totalAreas: areas.length,
    activeAreas: active.length,
    totalTables: active.reduce((s, a) => s + a.tableCount, 0),
    totalCapacity: active.reduce((s, a) => s + a.totalCapacity, 0),
  };
}

export function getTablesByArea(tables: RestaurantTable[], areaId: number) {
  return tables.filter(t => t.areaId === areaId);
}

export function getLayoutObjectsByArea(objects: LayoutObject[], areaId: number) {
  return objects.filter(o => o.areaId === areaId);
}
