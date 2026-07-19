import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../api/dashboard";
import type { DashboardStatsResponse } from "../../api/dashboard";

export function useDashboardStatsQuery(params: {
  outlet_id?: string | null;
  enabled?: boolean;
}) {
  return useQuery<DashboardStatsResponse>({
    queryKey: ["admin", "dashboard", "stats", params],
    queryFn: () => getDashboardStats({
      outlet_id: params.outlet_id || undefined,
    }),
    enabled: params.enabled !== false,
    staleTime: 0,
  });
}
