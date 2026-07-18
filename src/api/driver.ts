import { request } from "./client";
import type { DriverTask, DriverTaskListResponse } from "../types/driver";

export const getAvailablePickups = () =>
  request<{ data: DriverTask[] }>("/api/v1/employee/driver/pickups/available");

export const getAvailableDeliveries = () =>
  request<{ data: DriverTask[] }>("/api/v1/employee/driver/deliveries/available");

export const getActiveTask = () =>
  request<{ data: DriverTask | null }>("/api/v1/employee/driver/tasks/active");

export const claimTask = (taskId: string) =>
  request<DriverTask>(`/api/v1/employee/driver/tasks/${taskId}/claim`, { method: "POST" });

export const completeTask = (taskId: string) =>
  request<DriverTask>(`/api/v1/employee/driver/tasks/${taskId}/complete`, { method: "PATCH" });

export const getTaskHistory = (limit = 20, offset = 0) =>
  request<DriverTaskListResponse>(`/api/v1/employee/driver/tasks/history?limit=${limit}&offset=${offset}`);
