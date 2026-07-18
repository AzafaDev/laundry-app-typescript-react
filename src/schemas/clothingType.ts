import { z } from "zod";

export const clothingTypeSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  is_active: z.boolean(),
});

export type ClothingTypeFormValues = z.infer<typeof clothingTypeSchema>;
