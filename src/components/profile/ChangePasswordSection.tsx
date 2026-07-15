import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "../../hooks/profile/useChangePasswordMutation";
import { changePasswordSchema, type ChangePasswordFormValues } from "../../schemas/profile";
import { PasswordInput } from "../PasswordInput";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";

export function ChangePasswordSection() {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const mutation = useChangePasswordMutation();

  const startEditing = () => {
    mutation.reset();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: ChangePasswordFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        setIsEditing(false);
      },
    });
  };

  if (!isEditing) {
    return (
      <div>
        <div className="profile-section-header">
          <h2>Ubah kata sandi</h2>
          <button type="button" className="auth-toggle" onClick={startEditing}>EDIT</button>
        </div>
        <p className="profile-summary">••••••••</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="profile-section-header">
        <h2>Ubah kata sandi</h2>
        <button type="button" className="auth-toggle" onClick={cancelEditing}>BATAL</button>
      </div>
      <p>Perbarui kata sandi yang kamu pakai buat masuk.</p>

      <FormField label="Kata sandi saat ini" htmlFor="current_password" error={errors.current_password?.message}>
        <PasswordInput
          id="current_password"
          autoComplete="current-password"
          autoFocus
          {...register("current_password")}
        />
      </FormField>

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
        {mutation.isPending ? "Menyimpan..." : "Ubah kata sandi"}
      </button>
    </form>
  );
}
