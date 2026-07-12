import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../hooks/auth/useLoginMutation";
import { googleLoginUrl } from "../api/auth";
import { ApiError } from "../api/client";
import { loginSchema, type LoginFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import "../styles/auth.css";

export function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useLoginMutation();

  const ticketDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" })
    .format(new Date())
    .toUpperCase();

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/"),
    });
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <span className="auth-print-cover" aria-hidden="true" />
        <div className="auth-ticket-header">
          <span>LOGIN</span>
          <span className="auth-date">{ticketDate}</span>
        </div>
        <h2>Welcome back</h2>
        <p>Log in to manage your laundry pickups.</p>

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

        <div className="auth-field">
          <label className="auth-label" htmlFor="password">Password</label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && <span className="auth-error">{errors.password.message}</span>}
        </div>

        {mutation.error && (
          <p className="auth-error">
            {mutation.error instanceof ApiError ? mutation.error.message : "Something went wrong"}
          </p>
        )}

        <button className="auth-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

        <a href={googleLoginUrl()} className="auth-button auth-button-secondary">
          Continue with Google
        </a>

        <hr className="auth-perforation" />

        <p className="auth-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
