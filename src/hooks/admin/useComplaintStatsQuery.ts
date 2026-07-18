import { useQuery } from "@tanstack/react-query";
import { getComplaintStats } from "../../api/complaints";
import type { ComplaintStatsResponse } from "../../api/complaints";

export function useComplaintStatsQuery(params: {
  outlet_id?: string | null;
  enabled?: boolean;
}) {
  return useQuery<ComplaintStatsResponse>({
    queryKey: ["admin", "complaints", "stats", params],
    queryFn: () => getComplaintStats({
      outlet_id: params.outlet_id || undefined,
    }),
    enabled: params.enabled !== false,
    staleTime: 0,
  });
}
