import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
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
import { Button } from "../components/ui/Button";
import { buttonClasses } from "../components/ui/buttonStyles";
import { inputClasses } from "../components/ui/Input";
import { AuthShell, AuthCard } from "../components/ui/AuthShell";

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
      <AuthShell>
        <AuthCard className="text-center">
          <h2 className="text-xl font-bold text-on-surface">Email terverifikasi</h2>
          <p className="text-sm text-on-surface-variant">Akun kamu sudah siap. Sekarang kamu bisa masuk.</p>
          <Link to="/login" className={buttonClasses("primary", "md", "w-full")}>Ke halaman masuk</Link>
        </AuthCard>
      </AuthShell>
    );
  }

  if (tokenFromUrl && autoVerifyQuery.isPending) {
    return (
      <AuthShell>
        <AuthCard className="flex flex-col items-center text-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <h2 className="text-xl font-bold text-on-surface">Memverifikasi email kamu...</h2>
        </AuthCard>
      </AuthShell>
    );
  }

  const displayError = verifyMutation.error ?? autoVerifyQuery.error;

  return (
    <AuthShell>
      <AuthCard>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Verifikasi email kamu</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Tempel token verifikasi yang kami kirim ke email kamu.</p>
        </div>

        <form className="space-y-5" onSubmit={verifyForm.handleSubmit((data) => verifyMutation.mutate(data))}>
          <FormField label="Token" htmlFor="token" hint="salin kode panjang dari link di email" error={verifyForm.formState.errors.token?.message}>
            <input id="token" className={inputClasses} autoComplete="off" {...verifyForm.register("token")} />
          </FormField>

          <ApiErrorMessage error={displayError} />

          <Button type="submit" fullWidth isLoading={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Memverifikasi..." : "Verifikasi"}
          </Button>
        </form>

        <hr className="border-outline-variant" />

        {resendMutation.isSuccess ? (
          <p className="text-sm text-on-surface-variant">{resendMutation.data?.message}</p>
        ) : (
          <form className="space-y-5" onSubmit={resendForm.handleSubmit((data) => resendMutation.mutate(data))}>
            <FormField label="Belum dapat emailnya?" htmlFor="resend_email" error={resendForm.formState.errors.email?.message}>
              <input id="resend_email" className={inputClasses} type="email" autoComplete="email" {...resendForm.register("email")} />
            </FormField>
            <Button type="submit" fullWidth isLoading={resendMutation.isPending}>
              {resendMutation.isPending ? "Mengirim..." : "Kirim ulang"}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-on-surface-variant">
          <Link to="/login" className="font-semibold text-primary hover:underline">Kembali ke halaman masuk</Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
