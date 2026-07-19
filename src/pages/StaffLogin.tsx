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

const DEMO_ACCOUNTS = {
  staff: [
    { email: "admin@demo.laundry", name: "Super Admin", role: "Super Admin" },
    { email: "outlet.admin@demo.laundry", name: "Outlet Admin", role: "Outlet Admin" },
    { email: "driver@demo.laundry", name: "Driver", role: "Driver" },
    { email: "washing@demo.laundry", name: "Washing Worker", role: "Washing Worker" },
  ],
};

export function StaffLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StaffLoginFormValues>({
    resolver: zodResolver(staffLoginSchema),
  });

  const mutation = useStaffLoginMutation();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

  const onSubmit = (data: StaffLoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/staff/dashboard"),
    });
  };

  const fillDemoAccount = (email: string) => {
    setValue("email", email);
    setValue("password", "demo123");
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

        {isDemoMode && (
          <>
            <hr className="border-outline-variant" />
            <div className="space-y-3">
              <p className="text-center text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Akun Demo
              </p>
              {DEMO_ACCOUNTS.staff.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="block w-full text-left rounded border border-outline-variant bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container text-sm"
                >
                  <div className="font-medium text-on-surface">{account.name}</div>
                  <div className="text-xs text-on-surface-variant">{account.role}</div>
                  <div className="text-xs text-on-surface-variant">{account.email}</div>
                  <div className="text-xs text-on-surface-variant">Password: demo123</div>
                </button>
              ))}
            </div>
          </>
        )}

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
