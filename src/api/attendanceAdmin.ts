import { request, downloadFile } from "./client";
import type { PaginatedResponse } from "../types/pagination";
import type { AttendanceRecord, AttendanceReportFilters, SweepResult } from "../types/attendanceReport";

export const getAttendanceReport = (filters: AttendanceReportFilters, limit: number, offset: number) => {
  const params = new URLSearchParams();
  if (filters.outlet_id) params.set("outlet_id", filters.outlet_id);
  if (filters.employee_id) params.set("employee_id", filters.employee_id);
  if (filters.status) params.set("status", filters.status);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);
  params.set("limit", String(limit));
  params.set("offset", String(offset));

  return request<PaginatedResponse<AttendanceRecord>>(
    `/api/v1/employee/admin/attendance/report?${params.toString()}`
  );
};

export const exportAttendanceReport = (filters: AttendanceReportFilters) => {
  const params = new URLSearchParams();
  if (filters.outlet_id) params.set("outlet_id", filters.outlet_id);
  if (filters.employee_id) params.set("employee_id", filters.employee_id);
  if (filters.status) params.set("status", filters.status);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  return downloadFile(`/api/v1/employee/admin/attendance/report/export?${params.toString()}`);
};

export const triggerSweep = (date: string) =>
  request<SweepResult>("/api/v1/employee/admin/attendance/sweep", {
    method: "POST",
    body: JSON.stringify({ date }),
  });
