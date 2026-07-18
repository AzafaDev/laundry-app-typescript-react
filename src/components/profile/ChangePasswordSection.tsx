import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "../../hooks/profile/useChangePasswordMutation";
import { changePasswordSchema, type ChangePasswordFormValues } from "../../schemas/profile";
import { PasswordInput } from "../PasswordInput";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";
import { Button } from "../ui/Button";

const sectionHeaderClasses = "flex items-center justify-between mb-2";
const toggleClasses = "text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline";

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
        <div className={sectionHeaderClasses}>
          <h2 className="text-base font-bold text-on-surface">Ubah kata sandi</h2>
          <button type="button" className={toggleClasses} onClick={startEditing}>EDIT</button>
        </div>
        <p className="text-sm text-on-surface-variant">••••••••</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className={sectionHeaderClasses}>
        <h2 className="text-base font-bold text-on-surface">Ubah kata sandi</h2>
        <button type="button" className={toggleClasses} onClick={cancelEditing}>BATAL</button>
      </div>
      <p className="text-sm text-on-surface-variant">Perbarui kata sandi yang kamu pakai buat masuk.</p>

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

      <Button type="submit" fullWidth isLoading={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : "Ubah kata sandi"}
      </Button>
    </form>
  );
}
