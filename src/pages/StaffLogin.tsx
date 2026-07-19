import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useStaffLoginMutation } from "../hooks/staffAuth/useStaffLoginMutation";
import { staffLoginSchema, type StaffLoginFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import { Button } from "../components/ui/Button";
import { inputClasses } from "../components/ui/Input";
import { AuthShell } from "../components/ui/AuthShell";

export function StaffLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginFormValues>({
    resolver: zodResolver(staffLoginSchema),
  });

  const mutation = useStaffLoginMutation();

  const onSubmit = (data: StaffLoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/staff/dashboard"),
    });
  };

  return (
    <AuthShell data-portal="staff">
      <form
        className="w-full max-w-sm rounded-3xl border border-outline-variant bg-surface-container-lowest p-7 shadow-sm space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
            Staf
          </span>
          <h2 className="text-xl font-bold text-on-surface">Selamat datang kembali</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Masuk untuk mengakses antrian kerja kamu.</p>
        </div>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            className={inputClasses}
            type="email"
            autoComplete="email"
            autoFocus
            {...register("email")}
          />
        </FormField>

        <FormField label="Kata sandi" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>

        <ApiErrorMessage error={mutation.error} />

        <Button type="submit" fullWidth isLoading={mutation.isPending}>
          {mutation.isPending ? "Masuk..." : "Masuk"}
        </Button>

        <hr className="border-outline-variant" />

        <p className="text-center text-sm text-on-surface-variant">
          <Link to="/staff/forgot-password" className="font-semibold text-primary hover:underline">Lupa kata sandi?</Link>
        </p>
      </form>

      <p className="text-sm text-on-surface-variant">
        Pelanggan? <Link to="/" className="font-semibold text-primary hover:underline">Masuk di sini</Link>
      </p>
    </AuthShell>
  );
}
