import { request } from "./client";
import type { BypassListResponse, BypassRequest } from "../types/worker";

export const listBypassRequests = (limit: number, offset: number, status?: string) => {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  if (status) params.set("status", status);
  return request<BypassListResponse>(`/api/v1/employee/admin/bypass-requests?${params.toString()}`);
};

export const getBypassRequest = (id: string) =>
  request<BypassRequest>(`/api/v1/employee/admin/bypass-requests/${id}`);

export const reviewBypassRequest = (id: string, data: { approve: boolean; admin_notes?: string }) =>
  request<BypassRequest>(`/api/v1/employee/admin/bypass-requests/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
