import { request } from "./client";

export interface AdminComplaintResponse {
  id: string;
  order_id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  complaint_type: string;
  description: string;
  photo_urls: string[];
  status: "open" | "in_progress" | "resolved" | "rejected";
  created_at: string;
  expected_resolution_date?: string;
  resolution_notes?: string;
  resolved_by?: string;
  resolved_by_name?: string;
  resolved_at?: string;
  message?: string;
}

export interface AdminComplaintListResponse {
  data: AdminComplaintResponse[];
  total_count: number;
}

export interface ComplaintStatsResponse {
  open: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

export interface UpdateComplaintStatusRequest {
  status: "in_progress" | "resolved" | "rejected";
  resolution_notes?: string;
  expected_resolution_date?: string;
}

export async function listComplaints(params: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
  outlet_id?: string;
}): Promise<AdminComplaintListResponse> {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.offset) query.append("offset", params.offset.toString());
  if (params.outlet_id) query.append("outlet_id", params.outlet_id);

  return request(`/api/v1/employee/admin/complaints?${query.toString()}`);
}

export async function getComplaintById(id: string): Promise<AdminComplaintResponse> {
  return request(`/api/v1/employee/admin/complaints/${id}`);
}

export async function getComplaintStats(params: {
  outlet_id?: string;
}): Promise<ComplaintStatsResponse> {
  const query = new URLSearchParams();
  if (params.outlet_id) query.append("outlet_id", params.outlet_id);

  return request(`/api/v1/employee/admin/complaints/stats?${query.toString()}`);
}

export async function updateComplaintStatus(
  id: string,
  body: UpdateComplaintStatusRequest
): Promise<AdminComplaintResponse> {
  return request(`/api/v1/employee/admin/complaints/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
