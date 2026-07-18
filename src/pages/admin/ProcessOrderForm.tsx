import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useLaundryItemsQuery } from "../../hooks/laundryItems/useLaundryItemsQuery";
import { useClothingTypesQuery } from "../../hooks/clothingTypes/useClothingTypesQuery";
import { useProcessOrderMutation } from "../../hooks/pipeline/useProcessOrderMutation";
import { processOrderSchema, type ProcessOrderFormValues } from "../../schemas/processOrder";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { inputClasses } from "../../components/ui/Input";
import { LoadingState } from "../../components/ui/PageState";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";
import { formatRupiah } from "../../utils/formatPrice";

// Master-data driven form (items/breakdown come from the API, not fixed
// fields), so it uses plain quantity maps + manual zod validation on
// submit rather than react-hook-form — same pattern as StationProcessModal
// for the equivalent reason.
const SELECT_LIMIT = 500;

export function ProcessOrderForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const laundryItemsQuery = useLaundryItemsQuery(SELECT_LIMIT, 0);
  const clothingTypesQuery = useClothingTypesQuery(SELECT_LIMIT, 0);
  const processMutation = useProcessOrderMutation();

  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});
  const [breakdownQuantities, setBreakdownQuantities] = useState<Record<string, number>>({});
  const [totalWeightKg, setTotalWeightKg] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const laundryItems = (laundryItemsQuery.data?.data ?? []).filter((i) => i.is_active);
  const clothingTypes = (clothingTypesQuery.data?.data ?? []).filter((c) => c.is_active);
  const isLoading = laundryItemsQuery.isLoading || clothingTypesQuery.isLoading;

  // Mirrors ProcessOrder's own total_price calc (sum of item.base_price *
  // quantity, plus the delivery fee already fixed at CreateOrder time) —
  // just a live preview so the admin can see what they're about to submit.
  // Clothing-type breakdown has no price of its own, it's descriptive only.
  const itemsSubtotal = laundryItems.reduce(
    (sum, item) => sum + item.base_price * (itemQuantities[item.id] ?? 0),
    0,
  );

  const handleSubmit = () => {
    const values: ProcessOrderFormValues = {
      total_weight_kg: totalWeightKg,
      items: laundryItems.map((i) => ({ laundry_item_id: i.id, quantity: itemQuantities[i.id] ?? 0 })),
      breakdown: clothingTypes.map((c) => ({ clothing_type_id: c.id, quantity: breakdownQuantities[c.id] ?? 0 })),
    };

    const result = processOrderSchema.safeParse(values);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? "Data tidak valid");
      return;
    }
    setValidationError(null);

    if (!id) return;
    processMutation.mutate(
      { orderId: id, data: result.data },
      {
        onSuccess: () => {
          toast.success("Pesanan berhasil diproses");
          navigate("/staff/admin/orders/pending-process");
        },
      },
    );
  };

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/orders/pending-process">Kembali ke daftar pesanan</BackLink>
      <h1 className="text-2xl font-bold text-on-surface">Proses Pesanan</h1>

      {isLoading ? (
        <Card>
          <LoadingState label="Memuat master data..." bordered={false} />
        </Card>
      ) : (
        <Card className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-bold text-on-surface" htmlFor="total_weight_kg">
              Berat total cucian (kg)
            </label>
            <input
              id="total_weight_kg"
              type="number"
              min={0}
              max={999}
              step={1}
              className={inputClasses}
              value={totalWeightKg}
              onChange={(e) => setTotalWeightKg(Number(e.target.value))}
            />
            <p className="text-xs text-on-surface-variant">
              Berat fisik keseluruhan cucian buat catatan/struk — <strong>bukan</strong> penentu harga (harga tetap dari qty item di bawah, termasuk "Cuci Kiloan" kalau ada). Wajib diisi kalau breakdown jenis pakaian juga diisi, dan sebaliknya.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-on-surface">Item Laundry</p>
            {laundryItems.length === 0 && (
              <p className="text-xs text-on-surface-variant">Belum ada item laundry aktif.</p>
            )}
            {laundryItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-on-surface">
                    {item.name} <span className="text-xs text-on-surface-variant uppercase">({item.unit})</span>
                  </p>
                  <p className="text-xs text-on-surface-variant">{formatRupiah(item.base_price)} / {item.unit}</p>
                </div>
                <input
                  type="number"
                  min={0}
                  step={item.unit === "kg" ? "0.1" : "1"}
                  value={itemQuantities[item.id] ?? 0}
                  onChange={(e) =>
                    setItemQuantities((prev) => ({ ...prev, [item.id]: Number(e.target.value) }))
                  }
                  className="w-24 bg-white border border-outline-variant rounded-lg p-2 text-sm text-center"
                />
              </div>
            ))}
            {laundryItems.length > 0 && (
              <div className="pt-2 border-t border-outline-variant space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-on-surface">Subtotal item</span>
                  <span className="text-sm font-bold text-primary">{formatRupiah(itemsSubtotal)}</span>
                </div>
                <p className="text-xs text-on-surface-variant">Belum termasuk ongkir (sudah ditetapkan saat customer memesan).</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-on-surface">Breakdown Jenis Pakaian</p>
            {clothingTypes.length === 0 && (
              <p className="text-xs text-on-surface-variant">Belum ada jenis pakaian aktif.</p>
            )}
            {clothingTypes.map((ct) => (
              <div key={ct.id} className="flex items-center justify-between gap-3">
                <p className="text-sm text-on-surface">{ct.name}</p>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={breakdownQuantities[ct.id] ?? 0}
                  onChange={(e) =>
                    setBreakdownQuantities((prev) => ({ ...prev, [ct.id]: Number(e.target.value) }))
                  }
                  className="w-24 bg-white border border-outline-variant rounded-lg p-2 text-sm text-center"
                />
              </div>
            ))}
          </div>

          {validationError && <p className="text-xs text-error">{validationError}</p>}
          <ApiErrorMessage error={processMutation.error} />

          <Button type="button" onClick={handleSubmit} isLoading={processMutation.isPending} fullWidth>
            Proses Pesanan
          </Button>
        </Card>
      )}
    </main>
  );
}
