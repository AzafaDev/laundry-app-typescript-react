import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../hooks/auth/useResetPasswordMutation";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import { Button } from "../components/ui/Button";
import { inputClasses } from "../components/ui/Input";
import { AuthShell } from "../components/ui/AuthShell";

export function ResetPassword() {
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

  const mutation = useResetPasswordMutation();

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  };

  return (
    <AuthShell>
      <form className="w-full max-w-sm rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2 className="text-xl font-bold text-on-surface">Atur ulang kata sandi</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            {tokenFromUrl
              ? "Pilih kata sandi baru."
              : "Masukkan token dari email kamu, lalu pilih kata sandi baru."}
          </p>
        </div>

        {tokenFromUrl ? (
          <input type="hidden" {...register("token")} />
        ) : (
          <FormField label="Token" htmlFor="token" hint="salin kode panjang dari link di email" error={errors.token?.message}>
            <input id="token" className={inputClasses} autoComplete="off" {...register("token")} />
          </FormField>
        )}

        <FormField label="Kata sandi baru" htmlFor="new_password" hint="minimal 8 karakter" error={errors.new_password?.message}>
          <PasswordInput id="new_password" autoComplete="new-password" {...register("new_password")} />
        </FormField>

        <FormField label="Konfirmasi kata sandi" htmlFor="confirm_password" error={errors.confirm_password?.message}>
          <PasswordInput id="confirm_password" autoComplete="new-password" {...register("confirm_password")} />
        </FormField>

        <ApiErrorMessage error={mutation.error} />

        <Button type="submit" fullWidth isLoading={mutation.isPending}>
          {mutation.isPending ? "Memproses..." : "Atur ulang kata sandi"}
        </Button>

        <hr className="border-outline-variant" />

        <p className="text-center text-sm text-on-surface-variant">
          <Link to="/login" className="font-semibold text-primary hover:underline">Kembali ke halaman masuk</Link>
        </p>
      </form>
    </AuthShell>
  );
}
