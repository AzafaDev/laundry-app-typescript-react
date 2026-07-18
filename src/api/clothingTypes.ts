import { request } from "./client";
import type { ClothingType } from "../types/clothingType";
import type { PaginatedResponse } from "../types/pagination";

export interface ClothingTypeRequestData {
  name: string;
  is_active: boolean;
}

export const getClothingTypes = (limit: number, offset: number) =>
  request<PaginatedResponse<ClothingType>>(`/api/v1/employee/admin/clothing-types?limit=${limit}&offset=${offset}`);

export const getClothingType = (id: string) =>
  request<ClothingType>(`/api/v1/employee/admin/clothing-types/${id}`);

export const createClothingType = (data: ClothingTypeRequestData) =>
  request<ClothingType>("/api/v1/employee/admin/clothing-types", { method: "POST", body: JSON.stringify(data) });

export const updateClothingType = (id: string, data: ClothingTypeRequestData) =>
  request<ClothingType>(`/api/v1/employee/admin/clothing-types/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteClothingType = (id: string) =>
  request<{ message: string }>(`/api/v1/employee/admin/clothing-types/${id}`, { method: "DELETE" });
