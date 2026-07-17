export type OrderStatus =
  | "waiting_pickup_driver"
  | "laundry_to_outlet"
  | "laundry_arrived_outlet"
  | "washing"
  | "ironing"
  | "packing"
  | "waiting_payment"
  | "ready_for_delivery"
  | "delivery_to_customer"
  | "received_by_customer"
  | "completed";

export interface Order {
  id: string;
  invoice_number: string;
  outlet_id: string;
  outlet_name?: string;
  outlet_address?: string;
  pickup_address_id: string;
  status: OrderStatus;
  pickup_date: string;
  delivery_fee: number;
  total_price: number;
  created_at: string;
  message?: string;
}

export interface OrderListResponse {
  data: Order[];
  total_count: number;
}

export interface OrderItem {
  id: string;
  laundry_item_id: string;
  quantity: number;
  price_at_order: number;
}

export interface OrderBreakdownItem {
  id: string;
  clothing_type_id: string;
  quantity: number;
}

export interface OrderStatusHistoryEntry {
  id: string;
  old_status?: OrderStatus;
  new_status: OrderStatus;
  changed_by_type: string;
  changed_by_id: string;
  note?: string;
  created_at: string;
}

export type ComplaintType =
  | "missing_item"
  | "damaged_item"
  | "wrong_item"
  | "late_delivery"
  | "quality_issue"
  | "other";

export interface ComplaintSummary {
  id: string;
  complaint_type: ComplaintType;
  description: string;
  status: "open" | "in_progress" | "resolved" | "rejected";
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  gateway_name?: string;
  gateway_transaction_id?: string;
  payment_link?: string;
  status: "pending" | "paid" | "failed" | "refunded" | "expired";
  expired_at?: string;
  paid_at?: string;
  message?: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  breakdown: OrderBreakdownItem[];
  status_history: OrderStatusHistoryEntry[];
  payment: Payment | null;
  complaints: ComplaintSummary[];
}

export interface CreateComplaintPayload {
  complaint_type: ComplaintType;
  description: string;
  photo_urls?: string[];
}
