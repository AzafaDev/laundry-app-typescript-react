import { useQuery } from "@tanstack/react-query";
import { getStaffUnreadCount } from "../../api/staffNotifications";

export function useStaffUnreadCountQuery(enabled = true) {
  return useQuery({
    queryKey: ["staff-notifications", "unread-count"],
    queryFn: getStaffUnreadCount,
    enabled,
    refetchInterval: 20_000,
  });
}
