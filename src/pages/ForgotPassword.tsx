import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../hooks/auth/useForgotPasswordMutation";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/auth";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
          <h2>Cek email kamu</h2>
          <p className="auth-success-text">{mutation.data?.message}</p>
          <Link to="/login" className="auth-button">Kembali ke halaman masuk</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Lupa kata sandi</h2>
        <p>Masukkan email kamu, nanti kami kirim link buat atur ulang kata sandi.</p>

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

        <ApiErrorMessage error={mutation.error} />

        <button className="auth-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Mengirim..." : "Kirim link reset"}
        </button>

        <hr className="auth-divider" />

        <p className="auth-link">
          <Link to="/login">Kembali ke halaman masuk</Link>
        </p>
      </form>
    </div>
  );
}
