import { useQuery } from "@tanstack/react-query";
import { getTaskHistory } from "../../api/driver";

export function useTaskHistoryQuery(limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["driver", "history", limit, offset],
    queryFn: () => getTaskHistory(limit, offset),
    retry: false,
  });
}
