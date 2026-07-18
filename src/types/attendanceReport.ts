export interface AttendanceRecord {
  id: string;
  employee_id: string;
  outlet_id: string;
  outlet_name?: string;
  date: string;
  check_in_time?: string;
  check_out_time?: string;
  is_late: boolean;
  late_minutes: number;
  status: "on_time" | "late" | "absent";
  notes?: string;
  message?: string;
}

export interface AttendanceReportFilters {
  outlet_id?: string;
  employee_id?: string;
  status?: "on_time" | "late" | "absent";
  date_from?: string;
  date_to?: string;
}

export interface SweepResult {
  date: string;
  marked_absent: number;
  auto_checked_out: number;
}
