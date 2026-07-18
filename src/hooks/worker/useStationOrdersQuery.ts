import { useQuery } from "@tanstack/react-query";
import { getStationOrders } from "../../api/worker";
import type { Station } from "../../types/worker";

export function useStationOrdersQuery(station: Station | undefined) {
  return useQuery({
    queryKey: ["worker", "station", station],
    queryFn: () => getStationOrders(station!),
    enabled: !!station,
    retry: false,
  });
}
