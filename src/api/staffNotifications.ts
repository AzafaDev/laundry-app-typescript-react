import { request } from "./client";
import type { NotificationListResponse, UnreadCountResponse } from "../types/notification";

export const listStaffNotifications = (limit = 10, offset = 0) =>
  request<NotificationListResponse>(`/api/v1/employee/notifications?limit=${limit}&offset=${offset}`);

export const getStaffUnreadCount = () =>
  request<UnreadCountResponse>("/api/v1/employee/notifications/unread-count");

export const markStaffNotificationRead = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/notifications/${id}/read`, { method: "PATCH" });

export const markAllStaffNotificationsRead = () =>
  request<{ message: string }>("/api/v1/employee/notifications/read-all", { method: "PATCH" });
