import { request } from "./client";
import type { Outlet } from "../types/outlet";
import type { PaginatedResponse } from "../types/pagination";

export interface OutletRequestData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  service_radius_km: number;
}

export const getOutlets = (limit: number, offset: number) =>
  request<PaginatedResponse<Outlet>>(`/api/v1/employee/admin/outlets?limit=${limit}&offset=${offset}`);

export const getOutlet = (id: string) =>
  request<Outlet>(`/api/v1/employee/admin/outlets/${id}`);

export const createOutlet = (data: OutletRequestData) =>
  request<Outlet>("/api/v1/employee/admin/outlets", { method: "POST", body: JSON.stringify(data) });

export const updateOutlet = (id: string, data: OutletRequestData) =>
  request<Outlet>(`/api/v1/employee/admin/outlets/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteOutlet = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/outlets/${id}`, { method: "DELETE" });
