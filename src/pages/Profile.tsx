import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import { ProfileInfoSection } from "../components/profile/ProfileInfoSection";
import { ChangePasswordSection } from "../components/profile/ChangePasswordSection";
import { ChangeEmailSection } from "../components/profile/ChangeEmailSection";
import { AvatarSection } from "../components/profile/AvatarSection";

import "../styles/auth.css";

export function Profile() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  };

  return (
    <div className="auth-shell">
      <div className="auth-card profile-card">
        <ProfileInfoSection />

        <hr className="auth-divider" />

        <ChangePasswordSection />

        <hr className="auth-divider" />

        <ChangeEmailSection />

        <hr className="auth-divider" />

        <AvatarSection />

        <hr className="auth-divider" />

        <button
          className="auth-button auth-button-secondary"
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </div>
  );
}
