import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useRegisterMutation } from "../hooks/auth/useRegisterMutation";
import { registerSchema, type RegisterFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
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

        <FormField label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
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

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <div className="auth-input-wrap">
            <input
              id="email"
              className="auth-input"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
          </div>
        </FormField>

        <FormField label="Password" htmlFor="password" hint="min. 8 characters" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </FormField>

        <FormField label="Confirm password" htmlFor="confirm_password" error={errors.confirm_password?.message}>
          <PasswordInput
            id="confirm_password"
            autoComplete="new-password"
            {...register("confirm_password")}
          />
        </FormField>

        <ApiErrorMessage error={mutation.error} />

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
