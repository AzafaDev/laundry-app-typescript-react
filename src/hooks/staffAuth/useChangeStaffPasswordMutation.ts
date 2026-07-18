import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeStaffPassword } from "../../api/staffAuth";

export function useChangeStaffPasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeStaffPassword,
    onSuccess: (data) => queryClient.setQueryData(["staff-profile"], data),
  });
}
