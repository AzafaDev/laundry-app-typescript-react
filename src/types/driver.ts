export type DriverTaskType = "pickup" | "delivery";

export interface DriverTask {
  id: string;
  order_id: string;
  driver_id?: string;
  task_type: DriverTaskType;
  status: "available" | "in_progress" | "completed";
  invoice_number?: string;
  distance_km?: number;
  taken_at?: string;
  completed_at?: string;
  message?: string;
}

export interface DriverTaskListResponse {
  data: DriverTask[];
  total_count: number;
}
