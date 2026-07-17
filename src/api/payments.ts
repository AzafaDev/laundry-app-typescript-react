import { request } from "./client";
import type { Payment } from "../types/order";

export const createTransaction = (orderId: string) =>
  request<Payment>(`/api/v1/customer/orders/${orderId}/payment/create-transaction`, { method: "POST" });

export const getPaymentStatus = (orderId: string) =>
  request<Payment>(`/api/v1/customer/orders/${orderId}/payment/status`);

export const syncPaymentStatus = (orderId: string) =>
  request<Payment>(`/api/v1/customer/orders/${orderId}/payment/sync`, { method: "POST" });
