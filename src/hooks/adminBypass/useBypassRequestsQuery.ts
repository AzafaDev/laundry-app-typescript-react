import { useQuery } from "@tanstack/react-query";
import { listBypassRequests } from "../../api/adminBypass";

export function useBypassRequestsQuery(limit: number, offset: number, status?: string) {
  return useQuery({
    queryKey: ["admin", "bypass-requests", { limit, offset, status }],
    queryFn: () => listBypassRequests(limit, offset, status),
  });
}
