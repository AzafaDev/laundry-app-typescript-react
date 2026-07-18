import { useQuery } from "@tanstack/react-query";
import { getAvailableDeliveries } from "../../api/driver";

export function useAvailableDeliveriesQuery(enabled = true) {
  return useQuery({
    queryKey: ["driver", "deliveries", "available"],
    queryFn: () => getAvailableDeliveries(),
    enabled,
    retry: false,
  });
}
