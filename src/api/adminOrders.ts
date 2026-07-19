import { request } from "./client";
import type { OrderListResponse, OrderStatus, OrderDetail } from "../types/order";

export interface ListOutletOrdersQuery {
  status?: OrderStatus | "";
  search?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

function buildQueryString(query: ListOutletOrdersQuery): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.search) params.set("search", query.search);
  if (query.date_from) params.set("date_from", query.date_from);
  if (query.date_to) params.set("date_to", query.date_to);
  if (query.limit) params.set("limit", String(query.limit));
  if (query.offset) params.set("offset", String(query.offset));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const listOutletOrders = (query: ListOutletOrdersQuery = {}) =>
  request<OrderListResponse>(`/api/v1/employee/admin/orders${buildQueryString(query)}`);

export const getOutletOrderDetail = (id: string) =>
  request<OrderDetail>(`/api/v1/employee/admin/orders/${id}`);
