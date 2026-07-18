import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../hooks/auth/useForgotPasswordMutation";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/auth";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import { Button } from "../components/ui/Button";
import { buttonClasses } from "../components/ui/buttonStyles";
import { inputClasses } from "../components/ui/Input";
import { AuthShell, AuthCard } from "../components/ui/AuthShell";
import { ClaimTag } from "../components/ui/ClaimTag";

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
      <AuthShell>
        <AuthCard className="text-center">
          <h2 className="text-xl font-bold text-on-surface">Cek email kamu</h2>
          <p className="text-sm text-on-surface-variant">{mutation.data?.message}</p>
          <Link to="/login" className={buttonClasses("primary", "md", "w-full")}>Kembali ke halaman masuk</Link>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <ClaimTag className="w-full max-w-sm">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Lupa kata sandi</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Masukkan email kamu, nanti kami kirim link buat atur ulang kata sandi.</p>
          </div>

          <FormField label="Email" htmlFor="email" error={errors.email?.message}>
            <input id="email" className={inputClasses} type="email" autoComplete="email" autoFocus {...register("email")} />
          </FormField>

          <ApiErrorMessage error={mutation.error} />

          <Button type="submit" fullWidth isLoading={mutation.isPending}>
            {mutation.isPending ? "Mengirim..." : "Kirim link reset"}
          </Button>

          <hr className="border-outline-variant" />

          <p className="text-center text-sm text-on-surface-variant">
            <Link to="/login" className="font-semibold text-primary hover:underline">Kembali ke halaman masuk</Link>
          </p>
        </form>
      </ClaimTag>
    </AuthShell>
  );
}
