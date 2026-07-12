import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(1, "Phone is required"),
});
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().trim().min(1, "Current password is required"),
    new_password: z.string().trim().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const requestEmailChangeSchema = z.object({
  new_email: z.string().trim().email("Invalid email address"),
  current_password: z.string().trim().min(1, "Current password is required"),
});
export type RequestEmailChangeFormValues = z.infer<typeof requestEmailChangeSchema>;

export const verifyEmailChangeSchema = z.object({
  token: z.string().trim().min(1, "Token is required"),
});
export type VerifyEmailChangeFormValues = z.infer<typeof verifyEmailChangeSchema>;
