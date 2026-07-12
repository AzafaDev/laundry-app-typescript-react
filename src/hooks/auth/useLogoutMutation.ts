import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/auth";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.setQueryData(["profile"], null),
  });
}
