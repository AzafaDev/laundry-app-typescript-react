import { request } from "./client";
import type { Address } from "../types/address";

export interface AddressRequestData {
  label: string;
  address: string;
  province_id: number;
  city_id: number;
  district_id: number;
  postal_code?: string;
  latitude: number;
  longitude: number;
  is_primary?: boolean;
}

export const getAddresses = () =>
  request<Address[]>("/api/v1/customer/addresses");

export const getAddress = (id: string) =>
  request<Address>(`/api/v1/customer/addresses/${id}`);

export const createAddress = (data: AddressRequestData) =>
  request<Address>("/api/v1/customer/addresses", { method: "POST", body: JSON.stringify(data) });

export const updateAddress = (id: string, data: AddressRequestData) =>
  request<Address>(`/api/v1/customer/addresses/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const setPrimaryAddress = (id: string) =>
  request<Address>(`/api/v1/customer/addresses/${id}/primary`, { method: "PATCH" });

export const deleteAddress = (id: string) =>
  request<{ message: string }>(`/api/v1/customer/addresses/${id}`, { method: "DELETE" });
