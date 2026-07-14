import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/staffAuth";

export function useStaffLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.setQueryData(["staff-profile"], null),
  });
}
