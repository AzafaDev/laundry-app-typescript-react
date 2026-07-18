import { useQuery } from "@tanstack/react-query";
import { getStationOrderItems } from "../../api/worker";
import type { Station } from "../../types/worker";

export function useStationOrderItemsQuery(station: Station, orderId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["worker", "station", station, orderId, "items"],
    queryFn: () => getStationOrderItems(station, orderId!),
    enabled: enabled && !!orderId,
    retry: false,
  });
}
