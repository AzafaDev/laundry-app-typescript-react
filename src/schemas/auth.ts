import { z } from "zod";

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const resendVerificationSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});
export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().trim().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Token is required"),
    new_password: z.string().trim().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
