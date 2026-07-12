import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../hooks/auth/useResetPasswordMutation";
import { ApiError } from "../api/client";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import "../styles/auth.css";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenFromUrl ?? "" },
  });

  const mutation = useResetPasswordMutation();

  const ticketDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" })
    .format(new Date())
    .toUpperCase();

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <span className="auth-print-cover" aria-hidden="true" />
        <div className="auth-ticket-header">
          <span>RESET PASSWORD</span>
          <span className="auth-date">{ticketDate}</span>
        </div>
        <h2>Reset password</h2>
        <p>
          {tokenFromUrl
            ? "Choose a new password."
            : "Enter the token from your email and choose a new password."}
        </p>

        {tokenFromUrl ? (
          <input type="hidden" {...register("token")} />
        ) : (
          <div className="auth-field">
            <label className="auth-label" htmlFor="token">Token</label>
            <div className="auth-input-wrap">
              <input
                id="token"
                className="auth-input"
                autoComplete="off"
                {...register("token")}
              />
            </div>
            {errors.token && <span className="auth-error">{errors.token.message}</span>}
          </div>
        )}

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
          {mutation.isPending ? "Resetting..." : "Reset password"}
        </button>

        <hr className="auth-perforation" />

        <p className="auth-link">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
