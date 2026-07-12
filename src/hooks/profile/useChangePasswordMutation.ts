import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword } from "../../api/profile";

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => queryClient.setQueryData(["profile"], data),
  });
}
