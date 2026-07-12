import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useUpdateProfileMutation } from "../../hooks/profile/useUpdateProfileMutation";
import { ApiError } from "../../api/client";
import { updateProfileSchema, type UpdateProfileFormValues } from "../../schemas/profile";

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
          <h2>Profile info</h2>
          <button type="button" className="auth-toggle" onClick={startEditing}>EDIT</button>
        </div>
        <p className="profile-summary">{customer?.full_name} &middot; {customer?.phone}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="profile-section-header">
        <h2>Profile info</h2>
        <button type="button" className="auth-toggle" onClick={cancelEditing}>CANCEL</button>
      </div>
      <p>Your name and phone number.</p>

      <div className="auth-field">
        <label className="auth-label" htmlFor="full_name">Full name</label>
        <div className="auth-input-wrap">
          <input
            id="full_name"
            className="auth-input"
            autoComplete="name"
            autoFocus
            {...register("full_name")}
          />
        </div>
        {errors.full_name && <span className="auth-error">{errors.full_name.message}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="phone">Phone</label>
        <div className="auth-input-wrap">
          <input
            id="phone"
            className="auth-input"
            autoComplete="tel"
            {...register("phone")}
          />
        </div>
        {errors.phone && <span className="auth-error">{errors.phone.message}</span>}
      </div>

      {mutation.error && (
        <p className="auth-error">
          {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong"}
        </p>
      )}

      <button className="auth-button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
