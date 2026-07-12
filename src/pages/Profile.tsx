import { ProfileInfoSection } from "../components/profile/ProfileInfoSection";
import { ChangePasswordSection } from "../components/profile/ChangePasswordSection";
import { ChangeEmailSection } from "../components/profile/ChangeEmailSection";
import { AvatarSection } from "../components/profile/AvatarSection";
import "../styles/auth.css";

export function Profile() {
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

        <button className="auth-button auth-button-secondary" type="button" disabled>
          Logout
        </button>
      </div>
    </div>
  );
}
