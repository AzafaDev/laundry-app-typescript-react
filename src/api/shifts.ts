import { request } from "./client";
import type { WorkShift, EmployeeShift } from "../types/shift";
import type { PaginatedResponse } from "../types/pagination";

export interface WorkShiftRequestData {
  name: string;
  start_time: string;
  end_time: string;
  description: string;
  is_active: boolean;
}

export interface EmployeeShiftRequestData {
  shift_id: string;
  outlet_id: string;
  day_of_week?: number;
  date?: string;
  is_active: boolean;
}

export const getWorkShifts = (limit: number, offset: number) =>
  request<PaginatedResponse<WorkShift>>(`/api/v1/employee/admin/shifts?limit=${limit}&offset=${offset}`);

export const getWorkShift = (id: string) =>
  request<WorkShift>(`/api/v1/employee/admin/shifts/${id}`);

export const createWorkShift = (data: WorkShiftRequestData) =>
  request<WorkShift>("/api/v1/employee/admin/shifts", { method: "POST", body: JSON.stringify(data) });

export const updateWorkShift = (id: string, data: WorkShiftRequestData) =>
  request<WorkShift>(`/api/v1/employee/admin/shifts/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const softDeleteWorkShift = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/shifts/${id}`, { method: "DELETE" });

export const hardDeleteWorkShift = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/shifts/${id}/permanent`, { method: "DELETE" });

export const getEmployeeShifts = (employeeId: string) =>
  request<{ data: EmployeeShift[] }>(`/api/v1/employee/admin/employees/${employeeId}/shifts`);

export const createEmployeeShift = (employeeId: string, data: EmployeeShiftRequestData) =>
  request<EmployeeShift>(`/api/v1/employee/admin/employees/${employeeId}/shifts`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteEmployeeShift = (employeeId: string, shiftRecordId: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/employees/${employeeId}/shifts/${shiftRecordId}`, {
    method: "DELETE",
  });
