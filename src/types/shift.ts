export interface WorkShift {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  description: string;
  is_active: boolean;
}

export interface EmployeeShift {
  id: string;
  employee_id: string;
  shift_id: string;
  outlet_id: string;
  day_of_week?: number;
  date?: string;
  is_active: boolean;
}
