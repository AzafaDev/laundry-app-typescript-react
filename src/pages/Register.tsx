import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../hooks/auth/useRegisterMutation";
import { ApiError } from "../api/client";
import { registerSchema, type RegisterFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import "../styles/auth.css";

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  if (mutation.isSuccess) {
    return (
      <div className="auth-shell">
        <div className="auth-card auth-success">
          <h2>Check your email</h2>
          <p className="auth-success-text">We've sent a verification link to {mutation.variables?.email}.</p>
          <Link to="/verify-email" className="auth-button">Verify now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>
        <p>Create your account to start booking pickups.</p>

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
          <label className="auth-label" htmlFor="email">Email</label>
          <div className="auth-input-wrap">
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
          </div>
          {errors.email && <span className="auth-error">{errors.email.message}</span>}
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label className="auth-label" htmlFor="password">Password</label>
            <span className="auth-hint">min. 8 characters</span>
          </div>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...register("password")}
          />
          {errors.password && <span className="auth-error">{errors.password.message}</span>}
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
          {mutation.isPending ? "Registering..." : "Register"}
        </button>

        <hr className="auth-divider" />

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
