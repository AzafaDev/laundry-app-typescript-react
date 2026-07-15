import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/auth/useLoginMutation";
import { googleLoginUrl } from "../api/auth";
import { loginSchema, type LoginFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

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
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Selamat datang kembali</h2>
        <p>Masuk untuk mengelola jadwal jemput laundry kamu.</p>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <div className="auth-input-wrap">
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              autoFocus
              {...register("email")}
            />
          </div>
        </FormField>

        <FormField label="Kata sandi" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>

        <ApiErrorMessage error={mutation.error} />

        <button className="auth-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Masuk..." : "Masuk"}
        </button>

        <a href={googleLoginUrl()} className="auth-button auth-button-secondary">
          Lanjutkan dengan Google
        </a>

        <hr className="auth-divider" />

        <p className="auth-link">
          <Link to="/forgot-password">Lupa kata sandi?</Link>
        </p>
        <p className="auth-link">
          Belum punya akun? <Link to="/register">Daftar</Link>
        </p>
      </form>

      <p className="auth-footer">
        Staf laundry? <Link to="/staff/login">Masuk di sini</Link>
      </p>
    </div>
  );
}
