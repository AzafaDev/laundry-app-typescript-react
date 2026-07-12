import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => queryClient.setQueryData(["profile"], data),
  });
}
