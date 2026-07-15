export type EmployeeRole =
  | "super_admin"
  | "outlet_admin"
  | "washing_worker"
  | "ironing_worker"
  | "packing_worker"
  | "driver";

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  outlet_id: string | null;
  is_active: boolean;
  deleted_at: string | null;
  invite_sent?: boolean;
  message?: string;
}
