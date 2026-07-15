import { request } from "./client";
import type { GeocodeResult } from "../types/geocode";

export const geocode = (query: string) => {
  const params = new URLSearchParams({ q: query });
  return request<GeocodeResult>(`/api/v1/customer/geocode?${params.toString()}`);
};

export const searchGeocode = (query: string, limit = 5) => {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return request<GeocodeResult[]>(`/api/v1/customer/geocode/search?${params.toString()}`);
};

export const searchStaffGeocode = (query: string, limit = 5) => {
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return request<GeocodeResult[]>(`/api/v1/employee/admin/geocode/search?${params.toString()}`);
};
