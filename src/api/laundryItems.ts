import { request } from "./client";
import type { LaundryItem } from "../types/laundryItem";
import type { PaginatedResponse } from "../types/pagination";

export interface LaundryItemRequestData {
  name: string;
  description: string;
  unit: string;
  base_price: number;
  is_active: boolean;
}

export const getLaundryItems = (limit: number, offset: number) =>
  request<PaginatedResponse<LaundryItem>>(`/api/v1/employee/admin/laundry-items?limit=${limit}&offset=${offset}`);

export const getLaundryItem = (id: string) =>
  request<LaundryItem>(`/api/v1/employee/admin/laundry-items/${id}`);

export const createLaundryItem = (data: LaundryItemRequestData) =>
  request<LaundryItem>("/api/v1/employee/admin/laundry-items", { method: "POST", body: JSON.stringify(data) });

export const updateLaundryItem = (id: string, data: LaundryItemRequestData) =>
  request<LaundryItem>(`/api/v1/employee/admin/laundry-items/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteLaundryItem = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/laundry-items/${id}`, { method: "DELETE" });
