import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../../api/staffAuth";

export function useStaffLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => queryClient.setQueryData(["staff-profile"], data),
  });
}
