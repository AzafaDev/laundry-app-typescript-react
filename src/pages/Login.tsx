import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/auth/useLoginMutation";
import { googleLoginUrl } from "../api/auth";
import { loginSchema, type LoginFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import { Button, LinkButton } from "../components/ui/Button";
import { inputClasses } from "../components/ui/Input";
import { AuthShell } from "../components/ui/AuthShell";
import { ClaimTag } from "../components/ui/ClaimTag";

export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <AuthShell>
      <ClaimTag className="w-full max-w-sm">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Selamat datang kembali</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Masuk untuk mengelola jadwal jemput laundry kamu.</p>
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

          <LinkButton href={googleLoginUrl()} variant="secondary" fullWidth>
            Lanjutkan dengan Google
          </LinkButton>

          <hr className="border-outline-variant" />

          <p className="text-center text-sm text-on-surface-variant">
            <Link to="/forgot-password" className="font-semibold text-primary hover:underline">Lupa kata sandi?</Link>
          </p>
          <p className="text-center text-sm text-on-surface-variant">
            Belum punya akun? <Link to="/register" className="font-semibold text-primary hover:underline">Daftar</Link>
          </p>
        </form>
      </ClaimTag>

      <p className="text-sm text-on-surface-variant">
        Staf laundry? <Link to="/staff/login" className="font-semibold text-primary hover:underline">Masuk di sini</Link>
      </p>
    </AuthShell>
  );
}
