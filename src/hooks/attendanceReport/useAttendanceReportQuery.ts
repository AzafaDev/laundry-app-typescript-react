import { useQuery } from "@tanstack/react-query";
import { getAttendanceReport } from "../../api/attendanceAdmin";
import type { AttendanceReportFilters } from "../../types/attendanceReport";

export function useAttendanceReportQuery(filters: AttendanceReportFilters, limit: number, offset: number) {
  return useQuery({
    queryKey: ["attendance-report", filters, { limit, offset }],
    queryFn: () => getAttendanceReport(filters, limit, offset),
  });
}
