import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { employeeShiftSchema, type EmployeeShiftFormValues } from "../schemas/shift";
import type { EmployeeShiftRequestData } from "../api/shifts";
import { useEmployeeShiftsQuery } from "../hooks/shifts/useEmployeeShiftsQuery";
import { useCreateEmployeeShiftMutation } from "../hooks/shifts/useCreateEmployeeShiftMutation";
import { useDeleteEmployeeShiftMutation } from "../hooks/shifts/useDeleteEmployeeShiftMutation";
import { useWorkShiftsQuery } from "../hooks/shifts/useWorkShiftsQuery";
import { useOutletsQuery, OUTLET_SELECT_LIMIT } from "../hooks/outlets/useOutletsQuery";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { ApiErrorMessage } from "./ApiErrorMessage";
import "../styles/admin.css";

const DAY_LABELS: Record<number, string> = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

export function EmployeeShiftAssignment({ employeeId }: { employeeId: string }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  const shiftsQuery = useEmployeeShiftsQuery(employeeId);
  const shifts = shiftsQuery.data?.data ?? [];

  const workShiftsQuery = useWorkShiftsQuery(100, 0);
  const workShifts = workShiftsQuery.data?.data ?? [];

  const outletsQuery = useOutletsQuery(OUTLET_SELECT_LIMIT, 0);
  const outlets = outletsQuery.data?.data ?? [];

  const createMutation = useCreateEmployeeShiftMutation();
  const deleteMutation = useDeleteEmployeeShiftMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeShiftFormValues>({
    resolver: zodResolver(employeeShiftSchema),
    defaultValues: { schedule_type: "day_of_week", is_active: true },
  });

  const scheduleType = watch("schedule_type");

  const onSubmit = (values: EmployeeShiftFormValues) => {
    const payload: EmployeeShiftRequestData = {
      shift_id: values.shift_id,
      outlet_id: values.outlet_id,
      is_active: values.is_active,
    };

    if (values.schedule_type === "day_of_week" && values.day_of_week !== undefined) {
      payload.day_of_week = values.day_of_week;
    } else if (values.schedule_type === "date" && values.date) {
      payload.date = values.date;
    }

    createMutation.mutate(
      { employeeId, data: payload },
      {
        onSuccess: () => {
          toast.success("Jadwal berhasil ditambahkan");
          reset();
        },
      },
    );
  };

  const handleDeleteClick = (shiftId: string) => {
    setSelectedShiftId(shiftId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedShiftId) {
      deleteMutation.mutate(
        { employeeId, shiftRecordId: selectedShiftId },
        { onSuccess: () => toast.success("Jadwal berhasil dihapus") },
      );
    }
    setConfirmOpen(false);
    setSelectedShiftId(null);
  };

  const formatSchedule = (shift: any) => {
    if (shift.day_of_week !== undefined && shift.day_of_week !== null) {
      return `Setiap ${DAY_LABELS[shift.day_of_week]}`;
    }
    if (shift.date) {
      const date = new Date(shift.date);
      return date.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    }
    return "—";
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-on-surface mb-4">Jadwal Shift Karyawan</h3>

        {shiftsQuery.isLoading ? (
          <p className="text-sm text-on-surface-variant">Memuat jadwal...</p>
        ) : shifts.length === 0 ? (
          <p className="text-sm text-on-surface-variant">Belum ada jadwal shift yang ditambahkan.</p>
        ) : (
          <div className="space-y-2">
            {shifts.map((shift) => {
              const workShift = workShifts.find((ws) => ws.id === shift.shift_id);
              const outlet = outlets.find((o) => o.id === shift.outlet_id);
              return (
                <div key={shift.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface">{workShift?.name ?? "—"}</p>
                    <p className="text-xs text-on-surface-variant">
                      {workShift?.start_time} – {workShift?.end_time} • {outlet?.name ?? "—"}
                    </p>
                    <p className="text-xs text-on-surface-variant">{formatSchedule(shift)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(shift.id)}
                    disabled={deleteMutation.isPending}
                    className="text-sm font-semibold text-error hover:underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-outline-variant pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-on-surface">Tambah Jadwal</label>
            <p className="text-xs text-on-surface-variant mb-4">Pilih shift dan outlet untuk karyawan ini.</p>
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface" htmlFor="shift_id">
              Shift
            </label>
            <select id="shift_id" className="auth-input" {...register("shift_id")}>
              <option value="">— Pilih shift —</option>
              {workShifts.filter((ws) => ws.is_active).map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.name} ({ws.start_time} – {ws.end_time})
                </option>
              ))}
            </select>
            {errors.shift_id && <p className="text-xs text-error mt-1">{errors.shift_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface" htmlFor="outlet_id">
              Outlet
            </label>
            <select id="outlet_id" className="auth-input" {...register("outlet_id")}>
              <option value="">— Pilih outlet —</option>
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </option>
              ))}
            </select>
            {errors.outlet_id && <p className="text-xs text-error mt-1">{errors.outlet_id.message}</p>}
          </div>

          <div>
            <label className="text-sm font-bold text-on-surface" htmlFor="schedule_type">
              Tipe Jadwal
            </label>
            <select
              id="schedule_type"
              className="auth-input"
              {...register("schedule_type")}
            >
              <option value="day_of_week">Hari dalam minggu (berulang)</option>
              <option value="date">Tanggal spesifik (satu kali)</option>
            </select>
          </div>

          {scheduleType === "day_of_week" && (
            <div>
              <label className="text-sm font-bold text-on-surface" htmlFor="day_of_week">
                Hari
              </label>
              <select id="day_of_week" className="auth-input" {...register("day_of_week", { valueAsNumber: true })}>
                <option value="">— Pilih hari —</option>
                {Object.entries(DAY_LABELS).map(([day, label]) => (
                  <option key={day} value={day}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.day_of_week && <p className="text-xs text-error mt-1">{errors.day_of_week.message}</p>}
            </div>
          )}

          {scheduleType === "date" && (
            <div>
              <label className="text-sm font-bold text-on-surface" htmlFor="date">
                Tanggal
              </label>
              <input id="date" type="date" className="auth-input" {...register("date")} />
              {errors.date && <p className="text-xs text-error mt-1">{errors.date.message}</p>}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input id="is_active" type="checkbox" {...register("is_active")} />
            <label htmlFor="is_active" className="text-sm text-on-surface">
              Aktif
            </label>
          </div>

          <ApiErrorMessage error={createMutation.error} />

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary-hover disabled:opacity-50"
          >
            {createMutation.isPending ? "Menambahkan..." : "Tambah Jadwal"}
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus jadwal?"
        description="Jadwal shift karyawan akan dihapus."
        confirmLabel="Hapus"
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
