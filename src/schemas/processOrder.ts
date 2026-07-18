import { z } from "zod";

const itemLineSchema = z.object({
  laundry_item_id: z.string(),
  quantity: z.number().min(0),
});

const breakdownLineSchema = z.object({
  clothing_type_id: z.string(),
  quantity: z.number().int().min(0),
});

// Mirrors validateProcessOrderRequest in internal/order/handler_pipeline.go
// verbatim: at least one item quantity>0, weight in [0, 999.99] and a whole
// number when >0, and breakdown/weight must be filled together.
export const processOrderSchema = z
  .object({
    total_weight_kg: z.number().min(0).max(999.99),
    items: z.array(itemLineSchema),
    breakdown: z.array(breakdownLineSchema),
  })
  .superRefine((data, ctx) => {
    const hasAnyItem = data.items.some((i) => i.quantity > 0);
    if (!hasAnyItem) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["items"], message: "Isi minimal satu item dengan jumlah lebih dari 0" });
    }

    if (data.total_weight_kg > 0 && !Number.isInteger(data.total_weight_kg)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["total_weight_kg"], message: "Berat total harus bilangan bulat" });
    }

    const hasBreakdown = data.breakdown.some((b) => b.quantity > 0);
    if (hasBreakdown && data.total_weight_kg === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["total_weight_kg"], message: "Isi berat total kalau breakdown diisi" });
    }
    if (data.total_weight_kg > 0 && !hasBreakdown) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["breakdown"], message: "Isi breakdown jenis pakaian kalau berat total diisi" });
    }
  });

export type ProcessOrderFormValues = z.infer<typeof processOrderSchema>;
