import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useUpdateProfileMutation } from "../../hooks/profile/useUpdateProfileMutation";
import { updateProfileSchema, type UpdateProfileFormValues } from "../../schemas/profile";
import { FormField } from "../FormField";
import { ApiErrorMessage } from "../ApiErrorMessage";

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
    defaultValues: {
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
        <div className="profile-section-header">
          <h2>Info profil</h2>
          <button type="button" className="auth-toggle" onClick={startEditing}>EDIT</button>
        </div>
        <p className="profile-summary">{customer?.full_name} &middot; {customer?.phone}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="profile-section-header">
        <h2>Info profil</h2>
        <button type="button" className="auth-toggle" onClick={cancelEditing}>BATAL</button>
      </div>
      <p>Nama dan nomor HP kamu.</p>
      {!customer?.phone && (
        <p className="profile-notice">Lengkapi nomor HP kamu juga, ya — supaya kami bisa menghubungimu soal pesanan.</p>
      )}

      <FormField label="Nama lengkap" htmlFor="full_name" error={errors.full_name?.message}>
        <div className="auth-input-wrap">
          <input
            id="full_name"
            className="auth-input"
            autoComplete="name"
            autoFocus
            {...register("full_name")}
          />
        </div>
      </FormField>

      <FormField label="Nomor HP" htmlFor="phone" error={errors.phone?.message}>
        <div className="auth-input-wrap">
          <input
            id="phone"
            className="auth-input"
            autoComplete="tel"
            {...register("phone")}
          />
        </div>
      </FormField>

      <ApiErrorMessage error={mutation.error} />

      <button className="auth-button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Menyimpan..." : "Simpan perubahan"}
      </button>
    </form>
  );
}
