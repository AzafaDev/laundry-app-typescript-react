import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/auth";
import type { ForgotPasswordFormValues } from "../../schemas/auth";

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => forgotPassword(data.email),
  });
}
