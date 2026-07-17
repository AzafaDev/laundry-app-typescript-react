import { z } from "zod";

export const MAX_COMPLAINT_PHOTOS = 5;
export const MAX_COMPLAINT_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB, matches internal/apphelper.MaxImageUploadSize
const ALLOWED_COMPLAINT_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const complaintTypeValues = [
  "missing_item",
  "damaged_item",
  "wrong_item",
  "late_delivery",
  "quality_issue",
  "other",
] as const;

export const createComplaintSchema = z.object({
  complaint_type: z.enum(complaintTypeValues),
  description: z.string().trim().min(1, "Deskripsi wajib diisi"),
  photos: z
    .array(z.instanceof(File))
    .max(MAX_COMPLAINT_PHOTOS, `Maksimal ${MAX_COMPLAINT_PHOTOS} foto`)
    .refine((files) => files.every((f) => f.size <= MAX_COMPLAINT_PHOTO_SIZE), "Ukuran tiap foto maksimal 2MB")
    .refine(
      (files) => files.every((f) => ALLOWED_COMPLAINT_PHOTO_TYPES.has(f.type)),
      "Format foto harus JPEG, PNG, atau WebP",
    ),
});
export type CreateComplaintFormValues = z.infer<typeof createComplaintSchema>;
