// ==========================================
// Table Management Types (PRD v6 E.1-E.3)
// ==========================================

// Area Types
export interface Area {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  paxDivider: number;
  enableExtraPrice: boolean;
  enableMaxCapacity: boolean;
  maxCapacity?: number;
  allowChildren: boolean;
  isActive: boolean;
  services: AreaService[];
  photos: AreaPhoto[];
  // Computed
  tableCount: number;
  totalCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface AreaService {
  id: number;
  name: string;
}

export interface AreaPhoto {
  id: number;
  imageUrl: string;
}

export interface AreaFormData {
  name: string;
  description: string;
  basePrice: number;
  paxDivider: number;
  enableExtraPrice: boolean;
  enableMaxCapacity: boolean;
  maxCapacity?: number;
  allowChildren: boolean;
  services: string[];
  photos: string[];
}

// Table (Meja) Types
export type TableShape = 'circle' | 'rectangle';
export type TableStatus = 'available' | 'occupied' | 'reserved';

export interface RestaurantTable {
  id: number;
  areaId: number;
  areaName: string;
  name: string;
  capacity: number;
  shape: TableShape;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  qrCode: string;
  isActive: boolean;
  status: TableStatus;
  createdAt: string;
}

export interface TableFormData {
  name: string;
  areaId: number;
  capacity: number;
}

// Layout Object Types (non-table elements)
export type LayoutObjectType = 'bar' | 'dapur' | 'tembok';

export interface LayoutObject {
  id: number;
  areaId: number;
  type: LayoutObjectType;
  name: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
}

// Filter types
export interface AreaFilters {
  search: string;
}

export interface TableFilters {
  search: string;
  areaId: number | 'all';
}
