import { request } from "./client";
import type { Customer, MessageResponse } from "../types/customer";

export const register = (data: { full_name: string; email: string; phone: string; password: string; confirm_password: string }) =>
  request<Customer>("/api/v1/customer/auth/register", { method: "POST", body: JSON.stringify(data) });

export const login = (data: { email: string; password: string }) =>
  request<Customer>("/api/v1/customer/auth/login", { method: "POST", body: JSON.stringify(data) });

export const refresh = () =>
  request<void>("/api/v1/customer/auth/refresh", { method: "POST" });

export const logout = () =>
  request<void>("/api/v1/customer/auth/logout", { method: "POST" });

export const verifyEmail = (token: string) =>
  request<MessageResponse>("/api/v1/customer/auth/verify", { method: "POST", body: JSON.stringify({ token }) });

export const resendVerification = (email: string) =>
  request<MessageResponse>("/api/v1/customer/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) });

export const forgotPassword = (email: string) =>
  request<MessageResponse>("/api/v1/customer/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });

export const resetPassword = (data: { token: string; new_password: string; confirm_password: string }) =>
  request<Customer>("/api/v1/customer/auth/reset-password", { method: "POST", body: JSON.stringify(data) });

export const googleLoginUrl = () => `${import.meta.env.VITE_API_BASE_URL}/api/v1/customer/auth/google`;
