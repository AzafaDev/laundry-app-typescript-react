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
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const autoVerifyQuery = useVerifyEmailQuery(tokenFromUrl);
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationMutation();

  const verifyForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: tokenFromUrl ?? "" },
  });
  const resendForm = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
  });

  if (autoVerifyQuery.isSuccess || verifyMutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
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
          <h2>Verifying your email...</h2>
        </div>
      </div>
    );
  }

  const displayError = verifyMutation.error ?? autoVerifyQuery.error;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Verify your email</h2>
        <p>Paste the verification token we sent to your email.</p>

        <form onSubmit={verifyForm.handleSubmit((data) => verifyMutation.mutate(data))}>
          <FormField label="Token" htmlFor="token" error={verifyForm.formState.errors.token?.message}>
            <div className="auth-input-wrap">
              <input
                id="token"
                className="auth-input"
                autoComplete="off"
                {...verifyForm.register("token")}
              />
            </div>
          </FormField>

          <ApiErrorMessage error={displayError} />

          <button className="auth-button" type="submit" disabled={verifyMutation.isPending}>
            {verifyMutation.isPending ? "Verifying..." : "Verify"}
          </button>
        </form>

        <hr className="auth-divider" />

        {resendMutation.isSuccess ? (
          <p className="auth-success-text">{resendMutation.data?.message}</p>
        ) : (
          <form onSubmit={resendForm.handleSubmit((data) => resendMutation.mutate(data))}>
            <FormField label="Didn't get the email?" htmlFor="resend_email" error={resendForm.formState.errors.email?.message}>
              <div className="auth-input-wrap">
                <input
                  id="resend_email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  {...resendForm.register("email")}
                />
              </div>
            </FormField>
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
