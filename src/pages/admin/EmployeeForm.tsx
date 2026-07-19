import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  type CreateEmployeeFormValues,
  type UpdateEmployeeFormValues,
} from "../../schemas/employee";
import type { Employee, EmployeeRole } from "../../types/employee";
import { useEmployeeQuery } from "../../hooks/employees/useEmployeeQuery";
import { useCreateEmployeeMutation } from "../../hooks/employees/useCreateEmployeeMutation";
import { useUpdateEmployeeMutation } from "../../hooks/employees/useUpdateEmployeeMutation";
import { useAssignEmployeeOutletMutation } from "../../hooks/employees/useAssignEmployeeOutletMutation";
import { useOutletsQuery, OUTLET_SELECT_LIMIT } from "../../hooks/outlets/useOutletsQuery";
import { FormField } from "../../components/FormField";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import { EmployeeShiftAssignment } from "../../components/EmployeeShiftAssignment";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { inputClasses } from "../../components/ui/Input";
import { BackLink } from "../../components/ui/BackLink";

const ROLE_LABELS: Record<EmployeeRole, string> = {
  super_admin: "Super Admin",
  outlet_admin: "Admin Outlet",
  washing_worker: "Pekerja Cuci",
  ironing_worker: "Pekerja Setrika",
  packing_worker: "Pekerja Kemas",
  driver: "Kurir",
};

const ROLES = Object.keys(ROLE_LABELS) as EmployeeRole[];

function OutletSelect({ id, value, onChange }: { id: string; value: string | null; onChange: (v: string | null) => void }) {
  const outletsQuery = useOutletsQuery(OUTLET_SELECT_LIMIT, 0);
  const outlets = outletsQuery.data?.data ?? [];

  return (
    <select
      id={id}
      className={inputClasses}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">Tidak ada outlet</option>
      {outlets.map((outlet) => (
        <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
      ))}
    </select>
  );
}

function CreateEmployeeFormFields({ onSuccess }: { onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: { role: "washing_worker", outlet_id: null },
  });

  const createMutation = useCreateEmployeeMutation();

  const onSubmit = (values: CreateEmployeeFormValues) => {
    createMutation.mutate(
      {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        password: values.password ? values.password : undefined,
        role: values.role,
        outlet_id: values.outlet_id ?? undefined,
      },
      { onSuccess }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
        <input id="full_name" className={inputClasses} {...register("full_name")} />
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <input id="email" type="email" className={inputClasses} {...register("email")} />
      </FormField>

      <FormField label="Nomor telepon" htmlFor="phone" error={errors.phone?.message}>
        <input id="phone" className={inputClasses} {...register("phone")} />
      </FormField>

      <FormField
        label="Kata sandi"
        htmlFor="password"
        hint="Kosongkan untuk mengirim undangan lewat email"
        error={errors.password?.message}
      >
        <input id="password" type="password" className={inputClasses} {...register("password")} />
      </FormField>

      <FormField label="Peran" htmlFor="role" error={errors.role?.message}>
        <select id="role" className={inputClasses} {...register("role")}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Outlet" htmlFor="outlet_id" error={errors.outlet_id?.message}>
        <OutletSelect id="outlet_id" value={watch("outlet_id") ?? null} onChange={(v) => setValue("outlet_id", v)} />
      </FormField>

      <ApiErrorMessage error={createMutation.error} />

      <Button type="submit" isLoading={createMutation.isPending} fullWidth>
        Tambah karyawan
      </Button>
    </form>
  );
}

function EditEmployeeFormFields({ initialData, onSuccess }: { initialData: Employee; onSuccess: () => void }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateEmployeeFormValues>({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      full_name: initialData.full_name,
      phone: initialData.phone,
      role: initialData.role,
      outlet_id: initialData.outlet_id,
    },
  });

  const updateMutation = useUpdateEmployeeMutation();
  const assignMutation = useAssignEmployeeOutletMutation();
  const isPending = updateMutation.isPending || assignMutation.isPending;
  const [partialFailureMessage, setPartialFailureMessage] = useState<string | null>(null);

  const onSubmit = async (values: UpdateEmployeeFormValues) => {
    setPartialFailureMessage(null);
    const outletChanged = values.outlet_id !== initialData.outlet_id;

    try {
      if (outletChanged && values.outlet_id) {
        // Assign first — assignEmployeeOutlet never rejects assigning a non-null outlet
        // regardless of current role, while updateEmployee's outlet_admin check needs
        // a valid outlet already in the DB before the role change lands.
        await assignMutation.mutateAsync({ id: initialData.id, outletId: values.outlet_id });
        try {
          await updateMutation.mutateAsync({
            id: initialData.id,
            data: { full_name: values.full_name, phone: values.phone, role: values.role },
          });
        } catch {
          setPartialFailureMessage("Outlet berhasil diubah, tapi update profil gagal — coba submit ulang.");
          return;
        }
      } else {
        // Update first — when unassigning (null), assignEmployeeOutlet only rejects
        // while the DB role is still outlet_admin, so the role must move off first.
        await updateMutation.mutateAsync({
          id: initialData.id,
          data: { full_name: values.full_name, phone: values.phone, role: values.role },
        });
        if (outletChanged) {
          try {
            await assignMutation.mutateAsync({ id: initialData.id, outletId: values.outlet_id });
          } catch {
            setPartialFailureMessage("Profil berhasil diubah, tapi outlet gagal diubah — coba submit ulang.");
            return;
          }
        }
      }
    } catch {
      // First step failed — updateMutation/assignMutation.error is already set by
      // mutateAsync, and the existing ApiErrorMessage below renders it.
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
        <input id="full_name" className={inputClasses} {...register("full_name")} />
      </FormField>

      <FormField label="Email" htmlFor="email">
        <input id="email" className={inputClasses} value={initialData.email} disabled />
      </FormField>

      <FormField label="Nomor telepon" htmlFor="phone" error={errors.phone?.message}>
        <input id="phone" className={inputClasses} {...register("phone")} />
      </FormField>

      <FormField label="Peran" htmlFor="role" error={errors.role?.message}>
        <select id="role" className={inputClasses} {...register("role")}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Outlet" htmlFor="outlet_id" error={errors.outlet_id?.message}>
        <OutletSelect id="outlet_id" value={watch("outlet_id")} onChange={(v) => setValue("outlet_id", v)} />
      </FormField>

      {partialFailureMessage && <p className="text-xs text-error">{partialFailureMessage}</p>}
      <ApiErrorMessage error={updateMutation.error ?? assignMutation.error} />

      <Button type="submit" isLoading={isPending} fullWidth>
        Simpan perubahan
      </Button>
    </form>
  );
}

function EditEmployeeShiftSection({ employeeId }: { employeeId: string }) {
  return (
    <div className="mt-8 pt-8 border-t border-on-surface/10">
      <EmployeeShiftAssignment employeeId={employeeId} />
    </div>
  );
}

export function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const employeeQuery = useEmployeeQuery(id);

  const handleSuccess = () => navigate("/staff/admin/employees");

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/admin/employees">Kembali ke daftar karyawan</BackLink>
      <h1 className="text-2xl font-bold text-on-surface">{isEdit ? "Ubah Karyawan" : "Tambah Karyawan"}</h1>
      <Card>
        {isEdit && employeeQuery.isLoading ? (
          <p>Memuat...</p>
        ) : isEdit && employeeQuery.isError ? (
          <p>Karyawan tidak ditemukan.</p>
        ) : isEdit && employeeQuery.data ? (
          <>
            <EditEmployeeFormFields initialData={employeeQuery.data} onSuccess={handleSuccess} />
            <EditEmployeeShiftSection employeeId={employeeQuery.data.id} />
          </>
        ) : (
          <CreateEmployeeFormFields onSuccess={handleSuccess} />
        )}
      </Card>
    </main>
  );
}
