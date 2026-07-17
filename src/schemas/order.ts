import { z } from "zod";

export const createOrderSchema = z.object({
  pickup_address_id: z.string().trim().min(1, "Pilih alamat pickup dulu"),
  pickup_date: z.string().trim().min(1, "Pilih tanggal pickup"),
});
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
