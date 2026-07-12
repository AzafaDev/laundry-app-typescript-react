import { request } from "./client";
import type { Customer, MessageResponse } from "../types/customer";

export const getProfile = () =>
  request<Customer>("/api/v1/customer/profile");

export const updateProfile = (data: { full_name: string; phone: string }) =>
  request<Customer>("/api/v1/customer/profile", { method: "PATCH", body: JSON.stringify(data) });

export const changePassword = (data: { current_password: string; new_password: string; confirm_password: string }) =>
  request<Customer>("/api/v1/customer/profile/password", { method: "PATCH", body: JSON.stringify(data) });

export const requestEmailChange = (data: { new_email: string; current_password: string }) =>
  request<MessageResponse>("/api/v1/customer/profile/email", { method: "POST", body: JSON.stringify(data) });

export const verifyEmailChange = (token: string) =>
  request<Customer>("/api/v1/customer/profile/email/verify", { method: "POST", body: JSON.stringify({ token }) });

export const uploadAvatar = (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  return request<Customer>("/api/v1/customer/profile/avatar", { method: "POST", body: formData });
};
