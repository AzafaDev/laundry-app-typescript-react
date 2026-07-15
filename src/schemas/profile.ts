import { z } from "zod";
import { emailField, passwordField } from "./shared";

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Nama lengkap wajib diisi"),
  phone: z.string().trim().min(1, "Nomor HP wajib diisi"),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().trim().min(1, "Kata sandi saat ini wajib diisi"),
    new_password: passwordField,
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Kata sandi tidak cocok",
    path: ["confirm_password"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const requestEmailChangeSchema = z.object({
  new_email: emailField,
  current_password: z.string().trim().min(1, "Kata sandi saat ini wajib diisi"),
});
export type RequestEmailChangeFormValues = z.infer<typeof requestEmailChangeSchema>;

export const verifyEmailChangeSchema = z.object({
  token: z.string().trim().min(1, "Token wajib diisi"),
});
export type VerifyEmailChangeFormValues = z.infer<typeof verifyEmailChangeSchema>;
