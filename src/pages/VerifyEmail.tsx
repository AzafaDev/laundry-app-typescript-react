import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { useVerifyEmailQuery } from "../hooks/auth/useVerifyEmailQuery";
import { useVerifyEmailMutation } from "../hooks/auth/useVerifyEmailMutation";
import { useResendVerificationMutation } from "../hooks/auth/useResendVerificationMutation";
import {
  verifyEmailSchema,
  type VerifyEmailFormValues,
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "../schemas/auth";
import { ApiError } from "../api/client";
import "../styles/auth.css";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const autoVerifyQuery = useVerifyEmailQuery(tokenFromUrl);
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationMutation();

  const verifyForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    values: { token: tokenFromUrl ?? "" },
  });
  const resendForm = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const ticketDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" })
    .format(new Date())
    .toUpperCase();

  if (autoVerifyQuery.isSuccess || verifyMutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
          <span className="auth-print-cover" aria-hidden="true" />
          <div className="auth-ticket-header">
            <span>EMAIL VERIFICATION</span>
            <span className="auth-date">{ticketDate}</span>
          </div>
          <h2>Email verified</h2>
          <p className="auth-success-text">Your account is ready. You can log in now.</p>
          <Link to="/login" className="auth-button">Go to login</Link>
        </div>
      </div>
    );
  }

  if (tokenFromUrl && autoVerifyQuery.isPending) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <span className="auth-print-cover" aria-hidden="true" />
          <div className="auth-ticket-header">
            <span>EMAIL VERIFICATION</span>
            <span className="auth-date">{ticketDate}</span>
          </div>
          <h2>Verifying your email...</h2>
        </div>
      </div>
    );
  }

  const displayError = verifyMutation.error ?? autoVerifyQuery.error;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span className="auth-print-cover" aria-hidden="true" />
        <div className="auth-ticket-header">
          <span>EMAIL VERIFICATION</span>
          <span className="auth-date">{ticketDate}</span>
        </div>
        <h2>Verify your email</h2>
        <p>Paste the verification token we sent to your email.</p>

        <form onSubmit={verifyForm.handleSubmit((data) => verifyMutation.mutate(data))}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="token">Token</label>
            <div className="auth-input-wrap">
              <input
                id="token"
                className="auth-input"
                autoComplete="off"
                {...verifyForm.register("token")}
              />
            </div>
            {verifyForm.formState.errors.token && (
              <span className="auth-error">{verifyForm.formState.errors.token.message}</span>
            )}
          </div>

          {displayError && (
            <p className="auth-error">
              {displayError instanceof ApiError ? displayError.message : "Something went wrong"}
            </p>
          )}

          <button className="auth-button" type="submit" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Verifying..." : "Verify"}
          </button>
        </form>

        <hr className="auth-perforation" />

        {resendMutation.isSuccess ? (
          <p className="auth-success-text">{resendMutation.data?.message}</p>
        ) : (
          <form onSubmit={resendForm.handleSubmit((data) => resendMutation.mutate(data))}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="resend_email">Didn't get the email?</label>
              <div className="auth-input-wrap">
                <input
                  id="resend_email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  {...resendForm.register("email")}
                />
              </div>
              {resendForm.formState.errors.email && (
                <span className="auth-error">{resendForm.formState.errors.email.message}</span>
              )}
            </div>
            <button className="auth-button" type="submit" disabled={resendMutation.isPending}>
              {resendMutation.isPending ? "Sending..." : "Resend"}
            </button>
          </form>
        )}

        <p className="auth-link">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
