import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetPassword } from "../../api/staffAuth";

export function useStaffResetPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => queryClient.setQueryData(["staff-profile"], data),
  });
}
