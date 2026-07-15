import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useStaffLoginMutation } from "../hooks/staffAuth/useStaffLoginMutation";
import { staffLoginSchema, type StaffLoginFormValues } from "../schemas/auth";
import { PasswordInput } from "../components/PasswordInput";
import { FormField } from "../components/FormField";
import { ApiErrorMessage } from "../components/ApiErrorMessage";
import "../styles/auth.css";

export function StaffLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffLoginFormValues>({
    resolver: zodResolver(staffLoginSchema),
  });

  const mutation = useStaffLoginMutation();

  const onSubmit = (data: StaffLoginFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => navigate("/staff/dashboard"),
    });
  };

  return (
    <div className="auth-shell" data-portal="staff">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <span className="auth-badge-staff">Staf</span>
        <h2>Selamat datang kembali</h2>
        <p>Masuk untuk mengakses antrian kerja kamu.</p>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
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
        </FormField>

        <FormField label="Kata sandi" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
        </FormField>

        <ApiErrorMessage error={mutation.error} />

        <button className="auth-button" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Masuk..." : "Masuk"}
        </button>

        <hr className="auth-divider" />

        <p className="auth-link">
          <Link to="/staff/forgot-password">Lupa kata sandi?</Link>
        </p>
      </form>
    </div>
  );
}
