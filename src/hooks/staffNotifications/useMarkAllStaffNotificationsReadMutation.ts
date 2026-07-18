import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllStaffNotificationsRead } from "../../api/staffNotifications";

export function useMarkAllStaffNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllStaffNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-notifications"] });
    },
  });
}
