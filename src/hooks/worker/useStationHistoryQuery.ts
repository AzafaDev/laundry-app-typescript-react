import { useQuery } from "@tanstack/react-query";
import { getStationHistory } from "../../api/worker";
import type { Station } from "../../types/worker";

export function useStationHistoryQuery(station: Station | undefined, limit = 20, offset = 0) {
  return useQuery({
    queryKey: ["worker", "station", station, "history", limit, offset],
    queryFn: () => getStationHistory(station!, limit, offset),
    enabled: !!station,
    retry: false,
  });
}
