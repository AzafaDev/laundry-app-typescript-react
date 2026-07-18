import { useQuery } from "@tanstack/react-query";
import { listComplaints } from "../../api/complaints";
import type { AdminComplaintListResponse } from "../../api/complaints";

export function useComplaintsQuery(params: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
  outlet_id?: string | null;
  enabled?: boolean;
}) {
  return useQuery<AdminComplaintListResponse>({
    queryKey: ["admin", "complaints", params],
    queryFn: () => listComplaints({
      status: params.status,
      search: params.search,
      limit: params.limit,
      offset: params.offset,
      outlet_id: params.outlet_id || undefined,
    }),
    enabled: params.enabled !== false,
    staleTime: 0,
  });
}
