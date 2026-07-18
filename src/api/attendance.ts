import { request } from "./client";
import type { AttendanceListResponse, AttendanceRecord, CurrentShift } from "../types/attendance";

export const checkIn = (data: { latitude: number; longitude: number }) =>
  request<AttendanceRecord>("/api/v1/employee/attendance/check-in", { method: "POST", body: JSON.stringify(data) });

export const checkOut = (data: { latitude?: number; longitude?: number } = {}) =>
  request<AttendanceRecord>("/api/v1/employee/attendance/check-out", { method: "POST", body: JSON.stringify(data) });

export const getMyAttendanceLogs = (limit = 20, offset = 0) =>
  request<AttendanceListResponse>(`/api/v1/employee/attendance/my-logs?limit=${limit}&offset=${offset}`);

export const getTodayAttendance = () =>
  request<{ data: AttendanceRecord | null }>("/api/v1/employee/attendance/today");

export const getCurrentShift = () =>
  request<{ data: CurrentShift | null }>("/api/v1/employee/attendance/current-shift");
