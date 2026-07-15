import { z } from "zod";

export const outletSchema = z
  .object({
    name: z.string().trim().min(1, "Nama wajib diisi"),
    address: z.string().trim().min(1, "Alamat wajib diisi"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.latitude || !data.longitude) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["latitude"], message: "Pilih lokasi di peta" });
    }
  });

export type OutletFormValues = z.infer<typeof outletSchema>;
