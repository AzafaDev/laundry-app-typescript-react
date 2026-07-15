import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useOutletsQuery } from "../../hooks/outlets/useOutletsQuery";
import { FormField } from "../../components/FormField";
import { ApiErrorMessage } from "../../components/ApiErrorMessage";
import "../../styles/auth.css";
import "../../styles/admin.css";

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
  const outletsQuery = useOutletsQuery(500, 0);
  const outlets = outletsQuery.data?.data ?? [];

  return (
    <select
      id={id}
      className="auth-input"
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
        <div className="auth-input-wrap">
          <input id="full_name" className="auth-input" {...register("full_name")} />
        </div>
      </FormField>

      <FormField label="Email" htmlFor="email" error={errors.email?.message}>
        <div className="auth-input-wrap">
          <input id="email" type="email" className="auth-input" {...register("email")} />
        </div>
      </FormField>

      <FormField label="Nomor telepon" htmlFor="phone" error={errors.phone?.message}>
        <div className="auth-input-wrap">
          <input id="phone" className="auth-input" {...register("phone")} />
        </div>
      </FormField>

      <FormField
        label="Kata sandi"
        htmlFor="password"
        hint="Kosongkan untuk mengirim undangan lewat email"
        error={errors.password?.message}
      >
        <div className="auth-input-wrap">
          <input id="password" type="password" className="auth-input" {...register("password")} />
        </div>
      </FormField>

      <FormField label="Peran" htmlFor="role" error={errors.role?.message}>
        <select id="role" className="auth-input" {...register("role")}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Outlet" htmlFor="outlet_id" error={errors.outlet_id?.message}>
        <OutletSelect id="outlet_id" value={watch("outlet_id") ?? null} onChange={(v) => setValue("outlet_id", v)} />
      </FormField>

      <ApiErrorMessage error={createMutation.error} />

      <button className="auth-button" type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? "Menyimpan..." : "Tambah karyawan"}
      </button>
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

  const onSubmit = async (values: UpdateEmployeeFormValues) => {
    const outletChanged = values.outlet_id !== initialData.outlet_id;

    if (outletChanged && values.outlet_id) {
      // Assign first — assignEmployeeOutlet never rejects assigning a non-null outlet
      // regardless of current role, while updateEmployee's outlet_admin check needs
      // a valid outlet already in the DB before the role change lands.
      await assignMutation.mutateAsync({ id: initialData.id, outletId: values.outlet_id });
      await updateMutation.mutateAsync({
        id: initialData.id,
        data: { full_name: values.full_name, phone: values.phone, role: values.role },
      });
    } else {
      // Update first — when unassigning (null), assignEmployeeOutlet only rejects
      // while the DB role is still outlet_admin, so the role must move off first.
      await updateMutation.mutateAsync({
        id: initialData.id,
        data: { full_name: values.full_name, phone: values.phone, role: values.role },
      });
      if (outletChanged) {
        await assignMutation.mutateAsync({ id: initialData.id, outletId: values.outlet_id });
      }
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
        <div className="auth-input-wrap">
          <input id="full_name" className="auth-input" {...register("full_name")} />
        </div>
      </FormField>

      <FormField label="Email" htmlFor="email">
        <div className="auth-input-wrap">
          <input id="email" className="auth-input" value={initialData.email} disabled />
        </div>
      </FormField>

      <FormField label="Nomor telepon" htmlFor="phone" error={errors.phone?.message}>
        <div className="auth-input-wrap">
          <input id="phone" className="auth-input" {...register("phone")} />
        </div>
      </FormField>

      <FormField label="Peran" htmlFor="role" error={errors.role?.message}>
        <select id="role" className="auth-input" {...register("role")}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Outlet" htmlFor="outlet_id" error={errors.outlet_id?.message}>
        <OutletSelect id="outlet_id" value={watch("outlet_id")} onChange={(v) => setValue("outlet_id", v)} />
      </FormField>

      <ApiErrorMessage error={updateMutation.error ?? assignMutation.error} />

      <button className="auth-button" type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}

export function EmployeeForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const employeeQuery = useEmployeeQuery(id);

  const handleSuccess = () => navigate("/staff/admin/employees");

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>{isEdit ? "Ubah Karyawan" : "Tambah Karyawan"}</h1>
        <Link to="/staff/admin/employees" className="auth-toggle">BATAL</Link>
      </div>

      {isEdit && employeeQuery.isLoading ? (
        <p>Memuat...</p>
      ) : isEdit && employeeQuery.isError ? (
        <p>Karyawan tidak ditemukan.</p>
      ) : isEdit && employeeQuery.data ? (
        <EditEmployeeFormFields initialData={employeeQuery.data} onSuccess={handleSuccess} />
      ) : (
        <CreateEmployeeFormFields onSuccess={handleSuccess} />
      )}
    </div>
  );
}
