import { z } from "zod";

export const addressSchema = z
  .object({
    label: z.string().trim().min(1, "Label wajib diisi"),
    address: z.string().trim().min(1, "Alamat wajib diisi"),
    province_id: z.number().optional(),
    city_id: z.number().optional(),
    district_id: z.number().optional(),
    postal_code: z.string().trim().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    is_primary: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.province_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["province_id"], message: "Pilih provinsi" });
    }
    if (!data.city_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city_id"], message: "Pilih kota" });
    }
    if (!data.district_id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["district_id"], message: "Pilih kecamatan" });
    }
    if (!data.latitude || !data.longitude) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["latitude"],
        message: "Pilih lokasi dari hasil pencarian dulu",
      });
    }
  });

export type AddressFormValues = z.infer<typeof addressSchema>;
