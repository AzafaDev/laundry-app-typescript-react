export type NotificationType =
  | "order_details"
  | "payment"
  | "payment_completed"
  | "order_update"
  | "driver_pickup_started"
  | "driver_delivery_started"
  | "driver_arrived_outlet"
  | "driver_arrived_customer"
  | "complaint_update";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  related_entity_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationListResponse {
  data: Notification[];
  total_count: number;
}

export interface UnreadCountResponse {
  unread_count: number;
}
