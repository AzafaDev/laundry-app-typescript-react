import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "../../api/auth";
import type { ResendVerificationFormValues } from "../../schemas/auth";

export function useResendVerificationMutation() {
  return useMutation({
    mutationFn: (data: ResendVerificationFormValues) => resendVerification(data.email),
  });
}
