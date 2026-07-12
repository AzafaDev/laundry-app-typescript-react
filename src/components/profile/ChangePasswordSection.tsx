import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordMutation } from "../../hooks/profile/useChangePasswordMutation";
import { ApiError } from "../../api/client";
import { changePasswordSchema, type ChangePasswordFormValues } from "../../schemas/profile";
import { PasswordInput } from "../PasswordInput";

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
          <h2>Change password</h2>
          <button type="button" className="auth-toggle" onClick={startEditing}>EDIT</button>
        </div>
        <p className="profile-summary">••••••••</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="profile-section-header">
        <h2>Change password</h2>
        <button type="button" className="auth-toggle" onClick={cancelEditing}>CANCEL</button>
      </div>
      <p>Update the password used to log in.</p>

      <div className="auth-field">
        <label className="auth-label" htmlFor="current_password">Current password</label>
        <PasswordInput
          id="current_password"
          autoComplete="current-password"
          autoFocus
          {...register("current_password")}
        />
        {errors.current_password && <span className="auth-error">{errors.current_password.message}</span>}
      </div>

      <div className="auth-field">
        <div className="auth-label-row">
          <label className="auth-label" htmlFor="new_password">New password</label>
          <span className="auth-hint">min. 8 characters</span>
        </div>
        <PasswordInput
          id="new_password"
          autoComplete="new-password"
          {...register("new_password")}
        />
        {errors.new_password && <span className="auth-error">{errors.new_password.message}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="confirm_password">Confirm password</label>
        <PasswordInput
          id="confirm_password"
          autoComplete="new-password"
          {...register("confirm_password")}
        />
        {errors.confirm_password && <span className="auth-error">{errors.confirm_password.message}</span>}
      </div>

      {mutation.error && (
        <p className="auth-error">
          {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong"}
        </p>
      )}

      <button className="auth-button" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Changing..." : "Change password"}
      </button>
    </form>
  );
}
