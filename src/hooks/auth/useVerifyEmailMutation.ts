import { useMutation } from "@tanstack/react-query";
import { verifyEmail } from "../../api/auth";
import type { VerifyEmailFormValues } from "../../schemas/auth";

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (data: VerifyEmailFormValues) => verifyEmail(data.token),
  });
}
