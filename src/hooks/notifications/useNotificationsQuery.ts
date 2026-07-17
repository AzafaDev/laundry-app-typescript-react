import { useQuery } from "@tanstack/react-query";
import { listNotifications } from "../../api/notifications";

export function useNotificationsQuery(limit: number, offset: number, enabled = true) {
  return useQuery({
    queryKey: ["notifications", limit, offset],
    queryFn: () => listNotifications(limit, offset),
    enabled,
    refetchInterval: offset === 0 ? 20_000 : false,
  });
}
