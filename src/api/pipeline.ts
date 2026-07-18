import { request } from "./client";
import type { Order } from "../types/order";
import type { ProcessOrderFormValues } from "../schemas/processOrder";

export const getPendingProcessOrders = () =>
  request<{ data: Order[] }>("/api/v1/employee/admin/orders/pending-process");

export const processOrder = (orderId: string, data: ProcessOrderFormValues) =>
  request<Order>(`/api/v1/employee/admin/orders/${orderId}/process`, { method: "POST", body: JSON.stringify(data) });
