import { request, downloadFile } from "./client";
import type { SalesReportFilters, SalesReportResponse, EmployeePerformanceListResponse } from "../types/reports";

export const getSalesReport = (filters: SalesReportFilters) => {
  const params = new URLSearchParams();
  if (filters.group_by) params.set("group_by", filters.group_by);
  if (filters.outlet_id) params.set("outlet_id", filters.outlet_id);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  return request<SalesReportResponse>(
    `/api/v1/employee/admin/reports/sales?${params.toString()}`
  );
};

export const exportSalesReport = (filters: SalesReportFilters) => {
  const params = new URLSearchParams();
  if (filters.group_by) params.set("group_by", filters.group_by);
  if (filters.outlet_id) params.set("outlet_id", filters.outlet_id);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  return downloadFile(`/api/v1/employee/admin/reports/sales/export?${params.toString()}`);
};

export const getEmployeePerformanceReport = (filters: Omit<SalesReportFilters, "group_by">) => {
  const params = new URLSearchParams();
  if (filters.outlet_id) params.set("outlet_id", filters.outlet_id);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  return request<EmployeePerformanceListResponse>(
    `/api/v1/employee/admin/reports/employee-performance?${params.toString()}`
  );
};

export const exportEmployeePerformanceReport = (filters: Omit<SalesReportFilters, "group_by">) => {
  const params = new URLSearchParams();
  if (filters.outlet_id) params.set("outlet_id", filters.outlet_id);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  return downloadFile(
    `/api/v1/employee/admin/reports/employee-performance/export?${params.toString()}`
  );
};
