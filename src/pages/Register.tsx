import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../hooks/auth/useRegisterMutation";
import { registerSchema, type RegisterFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
          <h2>Cek email kamu</h2>
          <p className="auth-success-text">Kami sudah mengirim link verifikasi ke {mutation.variables?.email}.</p>
          <Link
            to={`/verify-email?email=${encodeURIComponent(mutation.variables?.email ?? "")}`}
            className="auth-button"
          >
            Verifikasi sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Daftar</h2>
        <p>Simpan alamat dan kelola akun kamu dalam satu tempat, siap dipakai tiap kali butuh layanan laundry.</p>

        <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
          <div className="auth-input-wrap">
            <input
              id="full_name"
              className="auth-input"
              autoComplete="name"
              autoFocus
              {...register("full_name")}
            />
          </div>
        </FormField>

        <FormField label="Email" htmlFor="email" hint="contoh: nama@email.com" error={errors.email?.message}>
          <div className="auth-input-wrap">
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
          </div>
        </FormField>

        <FormField label="Kata sandi" htmlFor="password" hint="minimal 8 karakter" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        <FormField label="Konfirmasi kata sandi" htmlFor="confirm_password" error={errors.confirm_password?.message}>
          <PasswordInput
            id="confirm_password"
            autoComplete="new-password"
            {...register("confirm_password")}
          />
        </FormField>

        <ApiErrorMessage error={mutation.error} />

        <button className="auth-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Mendaftar..." : "Daftar"}
        </button>

        <hr className="auth-divider" />

        <p className="auth-link">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </form>
    </div>
  );
}
