import { request } from "./client";
import type { Employee, EmployeeRole } from "../types/employee";
import type { PaginatedResponse } from "../types/pagination";

export interface EmployeeListParams {
  role?: EmployeeRole;
  search?: string;
  include_deleted?: boolean;
  limit: number;
  offset: number;
}

export interface CreateEmployeeRequestData {
  full_name: string;
  email: string;
  phone: string;
  password?: string;
  role: EmployeeRole;
  outlet_id?: string | null;
}

export interface UpdateEmployeeRequestData {
  full_name: string;
  phone: string;
  role: EmployeeRole;
}

export const getEmployees = (params: EmployeeListParams) => {
  const qs = new URLSearchParams();
  if (params.role) qs.set("role", params.role);
  if (params.search) qs.set("search", params.search);
  if (params.include_deleted) qs.set("include_deleted", "true");
  qs.set("limit", String(params.limit));
  qs.set("offset", String(params.offset));
  return request<PaginatedResponse<Employee>>(`/api/v1/employee/admin/employees?${qs.toString()}`);
};

export const getEmployee = (id: string) =>
  request<Employee>(`/api/v1/employee/admin/employees/${id}`);

export const createEmployee = (data: CreateEmployeeRequestData) =>
  request<Employee>("/api/v1/employee/admin/employees", { method: "POST", body: JSON.stringify(data) });

export const updateEmployee = (id: string, data: UpdateEmployeeRequestData) =>
  request<Employee>(`/api/v1/employee/admin/employees/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const assignEmployeeOutlet = (id: string, outlet_id: string | null) =>
  request<Employee>(`/api/v1/employee/admin/employees/${id}/outlet`, {
    method: "PATCH",
    body: JSON.stringify({ outlet_id }),
  });

export const softDeleteEmployee = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/employees/${id}`, { method: "DELETE" });

export const hardDeleteEmployee = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/employees/${id}/permanent`, { method: "DELETE" });

export const resendInvite = (id: string) =>
  request<Employee>(`/api/v1/employee/admin/employees/${id}/resend-invite`, { method: "POST" });
