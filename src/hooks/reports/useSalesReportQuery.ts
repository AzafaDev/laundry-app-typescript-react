import { useQuery } from "@tanstack/react-query";
import { getSalesReport } from "../../api/reports";
import type { SalesReportFilters } from "../../types/reports";

export function useSalesReportQuery(filters: SalesReportFilters) {
  return useQuery({
    queryKey: ["sales-report", filters],
    queryFn: () => getSalesReport(filters),
  });
}
