import { z } from "zod";

export const laundryItemSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  description: z.string().trim().optional(),
  unit: z.enum(["pcs", "kg"]),
  base_price: z.number().nonnegative("Harga tidak boleh negatif"),
  is_active: z.boolean(),
});

export type LaundryItemFormValues = z.infer<typeof laundryItemSchema>;
