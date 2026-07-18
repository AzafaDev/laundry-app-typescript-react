import { request } from "./client";
import type { Employee } from "../types/employee";
import type { MessageResponse } from "../types/customer";

export const login = (data: { email: string; password: string }) =>
  request<Employee>("/api/v1/employee/auth/login", { method: "POST", body: JSON.stringify(data) });

export const refresh = () =>
  request<void>("/api/v1/employee/auth/refresh", { method: "POST" });

export const logout = () =>
  request<void>("/api/v1/employee/auth/logout", { method: "POST" });

export const getProfile = () =>
  request<Employee>("/api/v1/employee/profile");

export const forgotPassword = (email: string) =>
  request<MessageResponse>("/api/v1/employee/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });

export const resetPassword = (data: { token: string; new_password: string; confirm_password: string }) =>
  request<Employee>("/api/v1/employee/auth/reset-password", { method: "POST", body: JSON.stringify(data) });

export const changeStaffPassword = (data: { current_password: string; new_password: string; confirm_password: string }) =>
  request<Employee>("/api/v1/employee/profile/password", { method: "PATCH", body: JSON.stringify(data) });
