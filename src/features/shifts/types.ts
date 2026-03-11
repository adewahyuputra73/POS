// Shift Module Types

// === API Response Types ===
// NOTE: ShiftStatus fields are guessed — adjust when actual response is known
export interface ShiftStatus {
  id: string;
  isOpen: boolean;
  openingCash: number;
  openedAt: string;
  openedBy: string;
}

// NOTE: ShiftPreviewEnd fields are guessed — adjust when actual response is known
export interface ShiftPreviewEnd {
  openingCash: number;
  expectedCash: number;
  totalSales: number;
  totalTransactions: number;
}

// NOTE: ShiftDetail fields are guessed — adjust when actual response is known
export interface ShiftDetail {
  id: string;
  openingCash: number;
  closingCash: number;
  cashDeposited: number;
  totalSales: number;
  totalTransactions: number;
  note: string;
  openedAt: string;
  closedAt: string;
  openedBy: string;
}

// NOTE: ShiftHistoryItem fields are guessed — adjust when actual response is known
export interface ShiftHistoryItem {
  id: string;
  openingCash: number;
  closingCash: number;
  totalSales: number;
  openedAt: string;
  closedAt: string;
  openedBy: string;
}

// === API Request Types ===
export interface StartShiftRequest {
  opening_cash: number;
}

export interface EndShiftRequest {
  closing_cash: number;
  cash_deposited: number;
  note?: string;
}

export interface ShiftHistoryParams {
  start_date?: string;
  end_date?: string;
}
