import { z } from "zod";
import { emailField, passwordField } from "./shared";

const roleEnum = z.enum([
  "super_admin",
  "outlet_admin",
  "washing_worker",
  "ironing_worker",
  "packing_worker",
  "driver",
]);

export const createEmployeeSchema = z
  .object({
    full_name: z.string().trim().min(1, "Nama wajib diisi"),
    email: emailField,
    phone: z.string().trim().min(1, "Nomor telepon wajib diisi"),
    password: z.union([passwordField, z.literal("")]).optional(),
    role: roleEnum,
    outlet_id: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "outlet_admin" && !data.outlet_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["outlet_id"], message: "Pilih outlet untuk outlet admin" });
    }
  });

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;

// outlet_id here is only a form field (assignment is submitted through a separate
// mutation from the rest of the edit, since the backend has no combined endpoint), but
// the "role -> outlet_admin with no outlet" check must still read it as-is: it's already
// the live, current value (seeded from the employee's existing outlet via defaultValues,
// updated as the user picks a new one), not a stand-in that needs a stale fallback.
export const updateEmployeeSchema = z
  .object({
    full_name: z.string().trim().min(1, "Nama wajib diisi"),
    phone: z.string().trim().min(1, "Nomor telepon wajib diisi"),
    role: roleEnum,
    outlet_id: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "outlet_admin" && !data.outlet_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["outlet_id"], message: "Pilih outlet untuk outlet admin" });
    }
  });

export type UpdateEmployeeFormValues = z.infer<typeof updateEmployeeSchema>;
