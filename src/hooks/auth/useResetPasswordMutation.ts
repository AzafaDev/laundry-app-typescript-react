import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPassword } from "../../api/auth";

export function useResetPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => queryClient.setQueryData(["profile"], data),
  });
}
