import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useUpdateProfileMutation } from "../../hooks/profile/useUpdateProfileMutation";
import { updateProfileSchema, type UpdateProfileFormValues } from "../../schemas/profile";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";
import { Button } from "../ui/Button";
import { inputClasses } from "../ui/Input";

const sectionHeaderClasses = "flex items-center justify-between mb-2";
const toggleClasses = "text-xs font-bold uppercase tracking-[0.06em] text-primary hover:underline";

export function ProfileInfoSection() {
  const { customer } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      full_name: customer?.full_name ?? "",
      phone: customer?.phone ?? "",
    },
  });

  const mutation = useUpdateProfileMutation();

  const startEditing = () => {
    mutation.reset();
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (data: UpdateProfileFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset(data);
        setIsEditing(false);
      },
    });
  };

  if (!isEditing) {
    return (
      <div>
        <div className={sectionHeaderClasses}>
          <h2 className="text-base font-bold text-on-surface">Info profil</h2>
          <button type="button" className={toggleClasses} onClick={startEditing}>EDIT</button>
        </div>
        <p className="text-sm text-on-surface-variant">
          {customer?.full_name}
          {customer?.phone && <> &middot; {customer.phone}</>}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className={sectionHeaderClasses}>
        <h2 className="text-base font-bold text-on-surface">Info profil</h2>
        <button type="button" className={toggleClasses} onClick={cancelEditing}>BATAL</button>
      </div>
      <p className="text-sm text-on-surface-variant">Nama dan nomor HP kamu.</p>
      {!customer?.phone && (
        <p className="text-sm text-on-surface-variant">Lengkapi nomor HP kamu juga, ya — supaya kami bisa menghubungimu soal pesanan.</p>
      )}

      <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
        <input id="full_name" className={inputClasses} autoComplete="name" autoFocus {...register("full_name")} />
      </FormField>

      <FormField label="Nomor HP" htmlFor="phone" error={errors.phone?.message}>
        <input id="phone" className={inputClasses} autoComplete="tel" {...register("phone")} />
      </FormField>

      <ApiErrorMessage error={mutation.error} />

      <Button type="submit" fullWidth isLoading={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : "Simpan perubahan"}
      </Button>
    </form>
  );
}
