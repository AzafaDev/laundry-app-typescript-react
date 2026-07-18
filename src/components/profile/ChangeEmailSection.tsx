import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useRequestEmailChangeMutation } from "../../hooks/profile/useRequestEmailChangeMutation";
import { useVerifyEmailChangeMutation } from "../../hooks/profile/useVerifyEmailChangeMutation";
import {
  requestEmailChangeSchema,
  type RequestEmailChangeFormValues,
  verifyEmailChangeSchema,
  type VerifyEmailChangeFormValues,
} from "../../schemas/profile";
import { PasswordInput } from "../PasswordInput";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";
import { Button } from "../ui/Button";
import { inputClasses } from "../ui/Input";

const sectionHeaderClasses = "flex items-center justify-between mb-2";
const toggleClasses = "text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline";

export function ChangeEmailSection() {
  const { customer } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const requestForm = useForm<RequestEmailChangeFormValues>({
    resolver: zodResolver(requestEmailChangeSchema),
  });
  const verifyForm = useForm<VerifyEmailChangeFormValues>({
    resolver: zodResolver(verifyEmailChangeSchema),
  });

  const requestMutation = useRequestEmailChangeMutation();
  const verifyMutation = useVerifyEmailChangeMutation();

  const startEditing = () => {
    requestMutation.reset();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    requestForm.reset();
    setIsEditing(false);
  };

  const startVerifying = () => {
    verifyMutation.reset();
    setIsVerifying(true);
  };

  const cancelVerifying = () => {
    verifyForm.reset();
    setIsVerifying(false);
  };

  const onRequestSubmit = (data: RequestEmailChangeFormValues) => {
    requestMutation.mutate(data);
  };

  const onVerifySubmit = (data: VerifyEmailChangeFormValues) => {
    verifyMutation.mutate(data, {
      onSuccess: () => {
        verifyForm.reset();
        setIsVerifying(false);
      },
    });
  };

  return (
    <div className="space-y-5">
      {isEditing ? (
        <form className="space-y-5" onSubmit={requestForm.handleSubmit(onRequestSubmit)}>
          <div className={sectionHeaderClasses}>
            <h2 className="text-base font-bold text-on-surface">Ubah email</h2>
            <button type="button" className={toggleClasses} onClick={cancelEditing}>BATAL</button>
          </div>
          <p className="text-sm text-on-surface-variant">Perbarui alamat email yang terhubung ke akun kamu.</p>

          <FormField label="Email baru" htmlFor="new_email" error={requestForm.formState.errors.new_email?.message}>
            <input
              id="new_email"
              className={inputClasses}
              type="email"
              autoComplete="email"
              autoFocus
              {...requestForm.register("new_email")}
            />
          </FormField>

          <FormField
            label="Kata sandi saat ini"
            htmlFor="email_change_current_password"
            error={requestForm.formState.errors.current_password?.message}
          >
            <PasswordInput
              id="email_change_current_password"
              autoComplete="current-password"
              {...requestForm.register("current_password")}
            />
          </FormField>

          <ApiErrorMessage error={requestMutation.error} />

          {requestMutation.isSuccess && (
            <p className="text-sm text-primary">{requestMutation.data?.message}</p>
          )}

          <Button type="submit" fullWidth isLoading={requestMutation.isPending}>
            {requestMutation.isPending ? "Mengirim..." : "Kirim email verifikasi"}
          </Button>
        </form>
      ) : (
        <div>
          <div className={sectionHeaderClasses}>
            <h2 className="text-base font-bold text-on-surface">Ubah email</h2>
            <button type="button" className={toggleClasses} onClick={startEditing}>EDIT</button>
          </div>
          <p className="text-sm text-on-surface-variant">{customer?.email}</p>
        </div>
      )}

      <hr className="border-outline-variant" />

      {isVerifying ? (
        <form className="space-y-5" onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
          <div className={sectionHeaderClasses}>
            <h2 className="text-base font-bold text-on-surface">Verifikasi email baru</h2>
            <button type="button" className={toggleClasses} onClick={cancelVerifying}>BATAL</button>
          </div>
          <FormField label="Token" htmlFor="email_change_token" error={verifyForm.formState.errors.token?.message}>
            <input
              id="email_change_token"
              className={inputClasses}
              autoComplete="off"
              autoFocus
              {...verifyForm.register("token")}
            />
          </FormField>

          <ApiErrorMessage error={verifyMutation.error} />

          <Button type="submit" fullWidth isLoading={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Memverifikasi..." : "Verifikasi email baru"}
          </Button>
        </form>
      ) : (
        <div className={sectionHeaderClasses}>
          <p className="text-sm text-on-surface-variant">Sudah punya token?</p>
          <button type="button" className={toggleClasses} onClick={startVerifying}>MASUKKAN TOKEN</button>
        </div>
      )}
    </div>
  );
}
