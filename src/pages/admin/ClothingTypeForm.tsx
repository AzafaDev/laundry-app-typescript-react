import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { clothingTypeSchema, type ClothingTypeFormValues } from "../../schemas/clothingType";
import type { ClothingTypeRequestData } from "../../api/clothingTypes";
import type { ClothingType } from "../../types/clothingType";
import { useClothingTypeQuery } from "../../hooks/clothingTypes/useClothingTypeQuery";
import { useCreateClothingTypeMutation } from "../../hooks/clothingTypes/useCreateClothingTypeMutation";
import { useUpdateClothingTypeMutation } from "../../hooks/clothingTypes/useUpdateClothingTypeMutation";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { inputClasses } from "../../components/ui/Input";
import { LoadingState, ErrorState } from "../../components/ui/PageState";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";

export function ClothingTypeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const typeQuery = useClothingTypeQuery(id);

  if (isEdit && typeQuery.isLoading) {
    return (
      <main className="max-w-xl mx-auto px-4 md:px-8 py-10">
        <LoadingState label="Memuat jenis pakaian..." bordered={false} />
      </main>
    );
  }
  if (isEdit && typeQuery.isError) {
    return (
      <main className="max-w-xl mx-auto px-4 md:px-8 py-10">
        <ErrorState message="Jenis pakaian tidak ditemukan." />
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/clothing-types">Kembali ke daftar jenis pakaian</BackLink>
      <h1 className="text-2xl font-bold text-on-surface">{isEdit ? "Ubah Jenis Pakaian" : "Tambah Jenis Pakaian"}</h1>
      <Card>
        <ClothingTypeFormFields initialData={typeQuery.data} onSuccess={() => navigate("/staff/admin/clothing-types")} />
      </Card>
    </main>
  );
}

function ClothingTypeFormFields({
  initialData,
  onSuccess,
}: {
  initialData?: ClothingType;
  onSuccess: () => void;
}) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClothingTypeFormValues>({
    resolver: zodResolver(clothingTypeSchema),
    defaultValues: initialData
      ? { name: initialData.name, is_active: initialData.is_active }
      : { is_active: true },
  });

  const createMutation = useCreateClothingTypeMutation();
  const updateMutation = useUpdateClothingTypeMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const onSubmit = (values: ClothingTypeFormValues) => {
    const payload: ClothingTypeRequestData = { name: values.name, is_active: values.is_active };

    if (isEdit && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => { toast.success("Jenis pakaian berhasil diperbarui"); onSuccess(); } },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success("Jenis pakaian berhasil ditambahkan"); onSuccess(); },
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

      <div className="flex items-center gap-2">
        <input id="is_active" type="checkbox" {...register("is_active")} />
        <label htmlFor="is_active" className="text-sm text-on-surface">Jenis pakaian aktif</label>
      </div>

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" isLoading={mutation.isPending} fullWidth>
        {isEdit ? "Simpan perubahan" : "Tambah jenis pakaian"}
      </Button>
    </form>
  );
}
