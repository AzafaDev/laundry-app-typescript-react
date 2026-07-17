import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../../api/notifications";

export function useUnreadCountQuery(enabled = true) {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled,
    refetchInterval: 20_000,
  });
}
