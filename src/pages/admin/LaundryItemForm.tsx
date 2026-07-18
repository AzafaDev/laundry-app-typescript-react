import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { laundryItemSchema, type LaundryItemFormValues } from "../../schemas/laundryItem";
import type { LaundryItemRequestData } from "../../api/laundryItems";
import type { LaundryItem } from "../../types/laundryItem";
import { useLaundryItemQuery } from "../../hooks/laundryItems/useLaundryItemQuery";
import { useCreateLaundryItemMutation } from "../../hooks/laundryItems/useCreateLaundryItemMutation";
import { useUpdateLaundryItemMutation } from "../../hooks/laundryItems/useUpdateLaundryItemMutation";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { inputClasses } from "../../components/ui/Input";
import { LoadingState, ErrorState } from "../../components/ui/PageState";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";

export function LaundryItemForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const itemQuery = useLaundryItemQuery(id);

  if (isEdit && itemQuery.isLoading) {
    return (
      <main className="max-w-xl mx-auto px-4 md:px-8 py-10">
        <LoadingState label="Memuat item..." bordered={false} />
      </main>
    );
  }
  if (isEdit && itemQuery.isError) {
    return (
      <main className="max-w-xl mx-auto px-4 md:px-8 py-10">
        <ErrorState message="Item tidak ditemukan." />
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/laundry-items">Kembali ke daftar item</BackLink>
      <h1 className="text-2xl font-bold text-on-surface">{isEdit ? "Ubah Item" : "Tambah Item"}</h1>
      <Card>
        <LaundryItemFormFields initialData={itemQuery.data} onSuccess={() => navigate("/staff/admin/laundry-items")} />
      </Card>
    </main>
  );
}

function LaundryItemFormFields({
  initialData,
  onSuccess,
}: {
  initialData?: LaundryItem;
  onSuccess: () => void;
}) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LaundryItemFormValues>({
    resolver: zodResolver(laundryItemSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          unit: initialData.unit === "pcs" ? "pcs" : "kg",
          base_price: initialData.base_price,
          is_active: initialData.is_active,
        }
      : { unit: "kg", base_price: 0, is_active: true, description: "" },
  });

  const createMutation = useCreateLaundryItemMutation();
  const updateMutation = useUpdateLaundryItemMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const onSubmit = (values: LaundryItemFormValues) => {
    const payload: LaundryItemRequestData = {
      name: values.name,
      description: values.description ?? "",
      unit: values.unit,
      base_price: values.base_price,
      is_active: values.is_active,
    };

    if (isEdit && initialData?.id) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => { toast.success("Item berhasil diperbarui"); onSuccess(); } },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success("Item berhasil ditambahkan"); onSuccess(); },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface" htmlFor="name">Nama</label>
        <input id="name" className={inputClasses} {...register("name")} />
        {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface" htmlFor="description">Deskripsi</label>
        <input id="description" className={inputClasses} {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-bold text-on-surface" htmlFor="unit">Satuan</label>
          <select id="unit" className={inputClasses} {...register("unit")}>
            <option value="kg">Kg</option>
            <option value="pcs">Pcs</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-on-surface" htmlFor="base_price">Harga dasar</label>
          <input
            id="base_price"
            type="number"
            min="0"
            step="100"
            className={inputClasses}
            {...register("base_price", { valueAsNumber: true })}
          />
          {errors.base_price && <p className="text-xs text-error">{errors.base_price.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input id="is_active" type="checkbox" {...register("is_active")} />
        <label htmlFor="is_active" className="text-sm text-on-surface">Item aktif</label>
      </div>

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" isLoading={mutation.isPending} fullWidth>
        {isEdit ? "Simpan perubahan" : "Tambah item"}
      </Button>
    </form>
  );
}
