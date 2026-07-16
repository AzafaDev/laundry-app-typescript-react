import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../hooks/auth/useVerifyEmailQuery";
import { useVerifyEmailMutation } from "../hooks/auth/useVerifyEmailMutation";
import { useResendVerificationMutation } from "../hooks/auth/useResendVerificationMutation";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "../schemas/auth";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const emailFromUrl = searchParams.get("email");

  const autoVerifyQuery = useVerifyEmailQuery(tokenFromUrl);
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationMutation();

  const verifyForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: tokenFromUrl ?? "" },
  });
  const resendForm = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: emailFromUrl ?? "" },
  });

  if (autoVerifyQuery.isSuccess || verifyMutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
          <h2>Email terverifikasi</h2>
          <p className="auth-success-text">Akun kamu sudah siap. Sekarang kamu bisa masuk.</p>
          <Link to="/login" className="auth-button">Ke halaman masuk</Link>
        </div>
      </div>
    );
  }

  if (tokenFromUrl && autoVerifyQuery.isPending) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h2>Memverifikasi email kamu...</h2>
        </div>
      </div>
    );
  }

  const displayError = verifyMutation.error ?? autoVerifyQuery.error;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Verifikasi email kamu</h2>
        <p>Tempel token verifikasi yang kami kirim ke email kamu.</p>

        <form onSubmit={verifyForm.handleSubmit((data) => verifyMutation.mutate(data))}>
          <FormField label="Token" htmlFor="token" hint="salin kode panjang dari link di email" error={verifyForm.formState.errors.token?.message}>
            <div className="auth-input-wrap">
              <input
                id="token"
                className="auth-input"
                autoComplete="off"
                {...verifyForm.register("token")}
              />
            </div>
          </FormField>

          <ApiErrorMessage error={displayError} />

          <button className="auth-button" type="submit" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </form>

        <hr className="auth-divider" />

        {resendMutation.isSuccess ? (
          <p className="auth-success-text">{resendMutation.data?.message}</p>
        ) : (
          <form onSubmit={resendForm.handleSubmit((data) => resendMutation.mutate(data))}>
            <FormField label="Belum dapat emailnya?" htmlFor="resend_email" error={resendForm.formState.errors.email?.message}>
              <div className="auth-input-wrap">
                <input
                  id="resend_email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  {...resendForm.register("email")}
                />
              </div>
            </FormField>
            <button className="auth-button" type="submit" disabled={resendMutation.isPending}>
              {resendMutation.isPending ? "Mengirim..." : "Kirim ulang"}
            </button>
          </form>
        )}

        <p className="auth-link">
          <Link to="/login">Kembali ke halaman masuk</Link>
        </p>
      </div>
    </div>
  );
}
