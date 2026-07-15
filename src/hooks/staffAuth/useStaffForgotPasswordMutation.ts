import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api/staffAuth";
import type { ForgotPasswordFormValues } from "../../schemas/auth";

export function useStaffForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => forgotPassword(data.email),
  });
}
