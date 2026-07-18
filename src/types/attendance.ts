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
  status: string;
  notes?: string;
  message?: string;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  total_count: number;
}

export interface CurrentShift {
  shift_id: string;
  name: string;
  start_time: string;
  end_time: string;
}
