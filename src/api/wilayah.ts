import { request } from "./client";
import type { Province, City, District } from "../types/wilayah";

export const getProvinces = () =>
  request<Province[]>("/api/v1/wilayah/provinces");

export const getCities = (provinceId: number) =>
  request<City[]>(`/api/v1/wilayah/provinces/${provinceId}/cities`);

export const getDistricts = (cityId: number) =>
  request<District[]>(`/api/v1/wilayah/cities/${cityId}/districts`);
