import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markStaffNotificationRead } from "../../api/staffNotifications";

export function useMarkStaffNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markStaffNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-notifications"] });
    },
  });
}
