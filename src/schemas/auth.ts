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
