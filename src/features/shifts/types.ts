// Shift Module Types

// === API Response Types ===
export interface ShiftStatus {
  id: string;
  store_id: string;
  admin_id: string;
  shift_number: number;
  opening_cash: string;
  closing_cash: string | null;
  cash_deposited: string;
  expected_cash: string | null;
  cash_difference: string;
  closed_by_name: string;
  start_time: string;
  end_time: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  outlet_id: string | null;
  cashier: {
    id: string;
    full_name: string;
    phone_number: string;
  };
}

export interface ShiftHistoryItem {
  id: string;
  store_id: string;
  admin_id: string;
  shift_number: number;
  opening_cash: string;
  closing_cash: string | null;
  cash_deposited: string;
  expected_cash: string | null;
  cash_difference: string;
  closed_by_name: string;
  start_time: string;
  end_time: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  outlet_id: string | null;
  cashier: {
    id: string;
    full_name: string;
  };
}

export interface ShiftHistoryResponse {
  shifts: ShiftHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
