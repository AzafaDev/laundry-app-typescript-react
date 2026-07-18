import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../hooks/auth/useRegisterMutation";
import { registerSchema, type RegisterFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import { Button } from "../components/ui/Button";
import { buttonClasses } from "../components/ui/buttonStyles";
import { inputClasses } from "../components/ui/Input";
import { AuthShell, AuthCard } from "../components/ui/AuthShell";
import { ClaimTag } from "../components/ui/ClaimTag";

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
      <AuthShell>
        <AuthCard className="text-center">
          <h2 className="text-xl font-bold text-on-surface">Cek email kamu</h2>
          <p className="text-sm text-on-surface-variant">Kami sudah mengirim link verifikasi ke {mutation.variables?.email}.</p>
          <Link
            to={`/verify-email?email=${encodeURIComponent(mutation.variables?.email ?? "")}`}
            className={buttonClasses("primary", "md", "w-full")}
          >
            Verifikasi sekarang
          </Link>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <ClaimTag className="w-full max-w-sm">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Daftar</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Simpan alamat dan kelola akun kamu dalam satu tempat, siap dipakai tiap kali butuh layanan laundry.</p>
          </div>

          <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
            <input id="full_name" className={inputClasses} autoComplete="name" autoFocus {...register("full_name")} />
          </FormField>

          <FormField label="Email" htmlFor="email" hint="contoh: nama@email.com" error={errors.email?.message}>
            <input id="email" className={inputClasses} type="email" autoComplete="email" {...register("email")} />
          </FormField>

          <FormField label="Nomor HP" htmlFor="phone" error={errors.phone?.message}>
            <input id="phone" className={inputClasses} type="tel" autoComplete="tel" {...register("phone")} />
          </FormField>

          <FormField label="Kata sandi" htmlFor="password" hint="minimal 8 karakter" error={errors.password?.message}>
            <PasswordInput id="password" autoComplete="new-password" {...register("password")} />
          </FormField>

          <FormField label="Konfirmasi kata sandi" htmlFor="confirm_password" error={errors.confirm_password?.message}>
            <PasswordInput id="confirm_password" autoComplete="new-password" {...register("confirm_password")} />
          </FormField>

          <ApiErrorMessage error={mutation.error} />

          <Button type="submit" fullWidth isLoading={mutation.isPending}>
            {mutation.isPending ? "Mendaftar..." : "Daftar"}
          </Button>

          <hr className="border-outline-variant" />

          <p className="text-center text-sm text-on-surface-variant">
            Sudah punya akun? <Link to="/login" className="font-semibold text-primary hover:underline">Masuk</Link>
          </p>
        </form>
      </ClaimTag>
    </AuthShell>
  );
}
