import { request } from "./client";
import type { ComplaintType, Order, OrderDetail, OrderListResponse, OrderStatus } from "../types/order";

export interface ListOrdersQuery {
  status?: OrderStatus[];
  search?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

function buildQueryString(query: ListOrdersQuery): string {
  const params = new URLSearchParams();
  if (query.status && query.status.length > 0) params.set("status", query.status.join(","));
  if (query.search) params.set("search", query.search);
  if (query.date_from) params.set("date_from", query.date_from);
  if (query.date_to) params.set("date_to", query.date_to);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.offset) params.set("offset", String(query.offset));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const listOrders = (query: ListOrdersQuery = {}) =>
  request<OrderListResponse>(`/api/v1/customer/orders${buildQueryString(query)}`);

export const getOrderDetail = (id: string) =>
  request<OrderDetail>(`/api/v1/customer/orders/${id}`);

export const createOrder = (data: { pickup_address_id: string; pickup_date: string }) =>
  request<Order>("/api/v1/customer/orders", { method: "POST", body: JSON.stringify(data) });

export const completeOrder = (id: string) =>
  request<Order>(`/api/v1/customer/orders/${id}/complete`, { method: "PATCH" });

export interface CreateComplaintInput {
  complaint_type: ComplaintType;
  description: string;
  photos?: File[];
}

export const createComplaint = (orderId: string, data: CreateComplaintInput) => {
  const formData = new FormData();
  formData.append("complaint_type", data.complaint_type);
  formData.append("description", data.description);
  for (const photo of data.photos ?? []) {
    formData.append("photos", photo);
  }
  return request<{ id: string; message: string }>(`/api/v1/customer/orders/${orderId}/complaint`, {
    method: "POST",
    body: formData,
  });
};
