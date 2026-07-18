import { useQuery } from "@tanstack/react-query";
import { getActiveTask } from "../../api/driver";

export function useActiveTaskQuery() {
  return useQuery({
    queryKey: ["driver", "active-task"],
    queryFn: () => getActiveTask(),
    retry: false,
  });
}
