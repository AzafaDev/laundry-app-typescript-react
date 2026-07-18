import type { Order } from "./order";

export type Station = "washing" | "ironing" | "packing";

export interface ActualBreakdownItem {
  clothing_type_id: string;
  actual_quantity: number;
}

export interface ActualSatuanItem {
  laundry_item_id: string;
  actual_quantity: number;
}

export interface ExpectedItem {
  item_type: "clothing_type" | "laundry_item";
  item_id: string;
  name: string;
  quantity: number;
}

export interface Discrepancy {
  item_type: string;
  item_id: string;
  name: string;
  expected: number;
  actual: number;
}

export interface SubmitItemsResult {
  success: boolean;
  requires_bypass?: boolean;
  discrepancies?: Discrepancy[];
  data?: Order;
}

export interface NormalizedItem {
  item_type: string;
  item_id: string;
  name: string;
  quantity: number;
}

export interface StationHistoryEntry {
  id: string;
  order_id: string;
  invoice_number: string;
  from_status: string;
  to_status: string;
  processed_at: string;
}

export interface StationHistoryResponse {
  data: StationHistoryEntry[];
  total_count: number;
}

export interface BypassRequest {
  id: string;
  order_id: string;
  invoice_number?: string;
  station: string;
  requested_by: string;
  requested_by_name?: string;
  expected_items: NormalizedItem[];
  actual_items: NormalizedItem[];
  discrepancy_description: string;
  photo_evidence: string[];
  attempt_number: number;
  status: "pending" | "approved" | "rejected";
  reviewed_by?: string;
  admin_notes?: string;
}

export interface BypassListResponse {
  data: BypassRequest[];
  total_count: number;
}
