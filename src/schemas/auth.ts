import { z } from "zod";
import { emailField, passwordField } from "./shared";

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, "Nama lengkap wajib diisi"),
    email: emailField,
    phone: z.string().trim().min(1, "Nomor HP wajib diisi"),
    password: passwordField,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Kata sandi tidak cocok",
    path: ["confirm_password"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1, "Token wajib diisi"),
});
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const resendVerificationSchema = z.object({
  email: emailField,
});
export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;

export const loginSchema = z.object({
  email: emailField,
  password: z.string().trim().min(1, "Kata sandi wajib diisi"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const staffLoginSchema = z.object({
  email: emailField,
  password: z.string().trim().min(1, "Kata sandi wajib diisi"),
});
export type StaffLoginFormValues = z.infer<typeof staffLoginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, "Token wajib diisi"),
    new_password: passwordField,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Kata sandi tidak cocok",
    path: ["confirm_password"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
