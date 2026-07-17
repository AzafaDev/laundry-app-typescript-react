import { request } from "./client";
import type { NotificationListResponse, UnreadCountResponse } from "../types/notification";

export const listNotifications = (limit = 10, offset = 0) =>
  request<NotificationListResponse>(`/api/v1/customer/notifications?limit=${limit}&offset=${offset}`);

export const getUnreadCount = () =>
  request<UnreadCountResponse>("/api/v1/customer/notifications/unread-count");

export const markNotificationRead = (id: string) =>
  request<{ message: string }>(`/api/v1/customer/notifications/${id}/read`, { method: "PATCH" });

export const markAllNotificationsRead = () =>
  request<{ message: string }>("/api/v1/customer/notifications/read-all", { method: "PATCH" });
