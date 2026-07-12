import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useRequestEmailChangeMutation } from "../../hooks/profile/useRequestEmailChangeMutation";
import { useVerifyEmailChangeMutation } from "../../hooks/profile/useVerifyEmailChangeMutation";
import { ApiError } from "../../api/client";
import {
  requestEmailChangeSchema,
  type RequestEmailChangeFormValues,
  verifyEmailChangeSchema,
  type VerifyEmailChangeFormValues,
} from "../../schemas/profile";
import { PasswordInput } from "../PasswordInput";

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
    <div>
      {isEditing ? (
        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)}>
          <div className="profile-section-header">
            <h2>Change email</h2>
            <button type="button" className="auth-toggle" onClick={cancelEditing}>CANCEL</button>
          </div>
          <p>Update the email address linked to your account.</p>

          <div className="auth-field">
            <label className="auth-label" htmlFor="new_email">New email</label>
            <div className="auth-input-wrap">
              <input
                id="new_email"
                className="auth-input"
                type="email"
                autoComplete="email"
                autoFocus
                {...requestForm.register("new_email")}
              />
            </div>
            {requestForm.formState.errors.new_email && (
              <span className="auth-error">{requestForm.formState.errors.new_email.message}</span>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email_change_current_password">Current password</label>
            <PasswordInput
              id="email_change_current_password"
              autoComplete="current-password"
              {...requestForm.register("current_password")}
            />
            {requestForm.formState.errors.current_password && (
              <span className="auth-error">{requestForm.formState.errors.current_password.message}</span>
            )}
          </div>

          {requestMutation.error && (
            <p className="auth-error">
              {requestMutation.error instanceof ApiError ? requestMutation.error.message : "Something went wrong"}
            </p>
          )}

          {requestMutation.isSuccess && (
            <p className="auth-success-text">{requestMutation.data?.message}</p>
          )}

          <button className="auth-button" type="submit" disabled={requestMutation.isPending}>
            {requestMutation.isPending ? "Sending..." : "Send verification email"}
          </button>
        </form>
      ) : (
        <div>
          <div className="profile-section-header">
            <h2>Change email</h2>
            <button type="button" className="auth-toggle" onClick={startEditing}>EDIT</button>
          </div>
          <p className="profile-summary">{customer?.email}</p>
        </div>
      )}

      <hr className="auth-divider" />

      {isVerifying ? (
        <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
          <div className="profile-section-header">
            <h2>Verify new email</h2>
            <button type="button" className="auth-toggle" onClick={cancelVerifying}>CANCEL</button>
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email_change_token">Token</label>
            <div className="auth-input-wrap">
              <input
                id="email_change_token"
                className="auth-input"
                autoComplete="off"
                autoFocus
                {...verifyForm.register("token")}
              />
            </div>
            {verifyForm.formState.errors.token && (
              <span className="auth-error">{verifyForm.formState.errors.token.message}</span>
            )}
          </div>

          {verifyMutation.error && (
            <p className="auth-error">
              {verifyMutation.error instanceof ApiError ? verifyMutation.error.message : "Something went wrong"}
            </p>
          )}

          <button className="auth-button" type="submit" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Verifying..." : "Verify new email"}
          </button>
        </form>
      ) : (
        <div className="profile-section-header">
          <p className="profile-summary" style={{ margin: 0 }}>Already have a token?</p>
          <button type="button" className="auth-toggle" onClick={startVerifying}>ENTER TOKEN</button>
        </div>
      )}
    </div>
  );
}
