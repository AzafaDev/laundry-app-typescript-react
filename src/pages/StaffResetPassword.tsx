import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStaffResetPasswordMutation } from "../hooks/staffAuth/useStaffResetPasswordMutation";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

export function StaffResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenFromUrl ?? "" },
  });

  const mutation = useStaffResetPasswordMutation();

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/staff/dashboard", { replace: true }),
    });
  };

  return (
    <div className="auth-shell" data-portal="staff">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Atur ulang kata sandi</h2>
        <p>
          {tokenFromUrl
            ? "Pilih kata sandi baru."
            : "Masukkan token dari email kamu, lalu pilih kata sandi baru."}
        </p>

        {tokenFromUrl ? (
          <input type="hidden" {...register("token")} />
        ) : (
          <FormField label="Token" htmlFor="token" hint="salin kode panjang dari link di email" error={errors.token?.message}>
            <div className="auth-input-wrap">
              <input
                id="token"
                className="auth-input"
                autoComplete="off"
                {...register("token")}
              />
            </div>
          </FormField>
        )}

        <FormField label="Kata sandi baru" htmlFor="new_password" hint="minimal 8 karakter" error={errors.new_password?.message}>
          <PasswordInput
            id="new_password"
            autoComplete="new-password"
            {...register("new_password")}
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
          {mutation.isPending ? "Memproses..." : "Atur ulang kata sandi"}
        </button>

        <hr className="auth-divider" />

        <p className="auth-link">
          <Link to="/staff/login">Kembali ke halaman masuk</Link>
        </p>
      </form>
    </div>
  );
}
