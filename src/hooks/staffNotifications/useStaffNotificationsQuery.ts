import { useQuery } from "@tanstack/react-query";
import { listStaffNotifications } from "../../api/staffNotifications";

export function useStaffNotificationsQuery(limit: number, offset: number, enabled = true) {
  return useQuery({
    queryKey: ["staff-notifications", limit, offset],
    queryFn: () => listStaffNotifications(limit, offset),
    enabled,
    refetchInterval: offset === 0 ? 20_000 : false,
  });
}
