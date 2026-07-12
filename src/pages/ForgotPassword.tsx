import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../hooks/auth/useForgotPasswordMutation";
import { ApiError } from "../api/client";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas/auth";
import "../styles/auth.css";

export function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useForgotPasswordMutation();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
          <h2>Check your email</h2>
          <p className="auth-success-text">{mutation.data?.message}</p>
          <Link to="/login" className="auth-button">Back to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Forgot password</h2>
        <p>Enter your email and we'll send you a reset link.</p>

        <div className="auth-field">
          <label className="auth-label" htmlFor="email">Email</label>
          <div className="auth-input-wrap">
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              autoFocus
              {...register("email")}
            />
          </div>
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        </div>

        {mutation.error && (
          <p className="auth-error">
            {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong"}
          </p>
        )}

        <button className="auth-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send reset link"}
        </button>

        <hr className="auth-divider" />

        <p className="auth-link">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}
