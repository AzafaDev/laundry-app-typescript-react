import { useQuery } from "@tanstack/react-query";
import { getEmployeePerformanceReport } from "../../api/reports";
import type { SalesReportFilters } from "../../types/reports";

export function useEmployeePerformanceReportQuery(filters: Omit<SalesReportFilters, "group_by">) {
  return useQuery({
    queryKey: ["employee-performance-report", filters],
    queryFn: () => getEmployeePerformanceReport(filters),
  });
}
