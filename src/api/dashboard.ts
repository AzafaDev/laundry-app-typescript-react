import { request } from "./client";

export interface DashboardStatsResponse {
  needs_processing: number;
  awaiting_payment: number;
  bypass_pending: number;
  complaints_open: number;
}

export async function getDashboardStats(params: {
  outlet_id?: string;
}): Promise<DashboardStatsResponse> {
  const query = new URLSearchParams();
  if (params.outlet_id) query.append("outlet_id", params.outlet_id);

  return request(`/api/v1/employee/admin/dashboard/stats?${query.toString()}`);
}
