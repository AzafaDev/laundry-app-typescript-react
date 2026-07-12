import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmailChange } from "../../api/profile";
import type { VerifyEmailChangeFormValues } from "../../schemas/profile";

export function useVerifyEmailChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyEmailChangeFormValues) => verifyEmailChange(data.token),
    onSuccess: (data) => queryClient.setQueryData(["profile"], data),
  });
}
