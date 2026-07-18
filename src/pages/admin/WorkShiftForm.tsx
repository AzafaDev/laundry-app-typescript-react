import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { workShiftSchema, type WorkShiftFormValues } from "../../schemas/shift";
import type { WorkShiftRequestData } from "../../api/shifts";
import type { WorkShift } from "../../types/shift";
import { useWorkShiftQuery } from "../../hooks/shifts/useWorkShiftQuery";
import { useCreateWorkShiftMutation } from "../../hooks/shifts/useCreateWorkShiftMutation";
import { useUpdateWorkShiftMutation } from "../../hooks/shifts/useUpdateWorkShiftMutation";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { inputClasses } from "../../components/ui/Input";
import { LoadingState, ErrorState } from "../../components/ui/PageState";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { BackLink } from "../../components/ui/BackLink";

export function WorkShiftForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const shiftQuery = useWorkShiftQuery(id);

  if (isEdit && shiftQuery.isLoading) {
    return (
      <main className="max-w-xl mx-auto px-4 md:px-8 py-10">
        <LoadingState label="Memuat shift..." bordered={false} />
      </main>
    );
  }
  if (isEdit && shiftQuery.isError) {
    return (
      <main className="max-w-xl mx-auto px-4 md:px-8 py-10">
        <ErrorState message="Shift tidak ditemukan." />
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/shifts">Kembali ke daftar shift</BackLink>
      <h1 className="text-2xl font-bold text-on-surface">{isEdit ? "Ubah Shift" : "Tambah Shift"}</h1>
      <Card>
        <WorkShiftFormFields initialData={shiftQuery.data} onSuccess={() => navigate("/staff/admin/shifts")} />
      </Card>
    </main>
  );
}

function WorkShiftFormFields({
  initialData,
  onSuccess,
}: {
  initialData?: WorkShift;
  onSuccess: () => void;
}) {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkShiftFormValues>({
    resolver: zodResolver(workShiftSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          start_time: initialData.start_time,
          end_time: initialData.end_time,
          description: initialData.description,
          is_active: initialData.is_active,
        }
      : { start_time: "09:00", end_time: "17:00", is_active: true, description: "" },
  });

  const createMutation = useCreateWorkShiftMutation();
  const updateMutation = useUpdateWorkShiftMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const onSubmit = (values: WorkShiftFormValues) => {
    const payload: WorkShiftRequestData = {
      name: values.name,
      start_time: values.start_time,
      end_time: values.end_time,
      description: values.description ?? "",
      is_active: values.is_active,
    };

    if (isEdit && initialData?.id) {
      updateMutation.mutate(
        { id: initialData.id, data: payload },
        { onSuccess: () => { toast.success("Shift berhasil diperbarui"); onSuccess(); } },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => { toast.success("Shift berhasil ditambahkan"); onSuccess(); },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface" htmlFor="name">Nama</label>
        <input id="name" className={inputClasses} placeholder="e.g. Pagi, Siang, Malam" {...register("name")} />
        {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-bold text-on-surface" htmlFor="start_time">Jam mulai</label>
          <input id="start_time" type="time" className={inputClasses} {...register("start_time")} />
          {errors.start_time && <p className="text-xs text-error">{errors.start_time.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm font-bold text-on-surface" htmlFor="end_time">Jam selesai</label>
          <input id="end_time" type="time" className={inputClasses} {...register("end_time")} />
          {errors.end_time && <p className="text-xs text-error">{errors.end_time.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-bold text-on-surface" htmlFor="description">Deskripsi</label>
        <input id="description" className={inputClasses} placeholder="Opsional" {...register("description")} />
      </div>

      <div className="flex items-center gap-2">
        <input id="is_active" type="checkbox" {...register("is_active")} />
        <label htmlFor="is_active" className="text-sm text-on-surface">Shift aktif</label>
      </div>

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" isLoading={mutation.isPending} fullWidth>
        {isEdit ? "Simpan perubahan" : "Tambah shift"}
      </Button>
    </form>
  );
}
