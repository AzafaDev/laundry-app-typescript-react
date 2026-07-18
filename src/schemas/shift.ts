import { z } from "zod";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const workShiftSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(50, "Nama maksimal 50 karakter"),
  start_time: z.string().regex(timePattern, "Format jam harus HH:MM"),
  end_time: z.string().regex(timePattern, "Format jam harus HH:MM"),
  description: z.string().trim().optional(),
  is_active: z.boolean(),
});

export type WorkShiftFormValues = z.infer<typeof workShiftSchema>;

export const employeeShiftSchema = z
  .object({
    shift_id: z.string().min(1, "Shift wajib dipilih"),
    outlet_id: z.string().min(1, "Outlet wajib dipilih"),
    schedule_type: z.enum(["day_of_week", "date"]),
    day_of_week: z.number().int().min(0).max(6).optional(),
    date: z.string().optional(),
    is_active: z.boolean(),
  })
  .refine((v) => (v.schedule_type === "day_of_week" ? v.day_of_week !== undefined : !!v.date), {
    message: "Isi jadwal sesuai tipe yang dipilih",
    path: ["date"],
  });

export type EmployeeShiftFormValues = z.infer<typeof employeeShiftSchema>;
