import { useQuery } from "@tanstack/react-query";
import { getAvailablePickups } from "../../api/driver";

export function useAvailablePickupsQuery(enabled = true) {
  return useQuery({
    queryKey: ["driver", "pickups", "available"],
    queryFn: () => getAvailablePickups(),
    enabled,
    retry: false,
  });
}
