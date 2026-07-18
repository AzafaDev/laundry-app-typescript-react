export interface SalesReportFilters {
  group_by?: "day" | "month" | "year";
  outlet_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface SalesReportPeriod {
  period: string;
  income: number;
  order_count: number;
  average_per_order: number;
}

export interface SalesReportSummary {
  total_income: number;
  total_orders: number;
  average_per_order: number;
  average_per_period: number;
  period_count: number;
}

export interface SalesReportResponse {
  summary: SalesReportSummary;
  chart: SalesReportPeriod[];
}

export interface EmployeePerformanceItem {
  employee_id: string;
  name: string;
  role: string;
  outlet_id?: string;
  worker_jobs: number;
  driver_jobs: number;
  total_jobs: number;
}

export interface EmployeePerformanceListResponse {
  data: EmployeePerformanceItem[];
}
