import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import { ProfileInfoSection } from "../components/profile/ProfileInfoSection";
import { ChangePasswordSection } from "../components/profile/ChangePasswordSection";
import { ChangeEmailSection } from "../components/profile/ChangeEmailSection";
import { AvatarSection } from "../components/profile/AvatarSection";
import { Button } from "../components/ui/Button";
import { AuthShell, AuthCard } from "../components/ui/AuthShell";
import { BackLink } from "../components/ui/BackLink";

export function Profile() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/login", { replace: true }),
    });
  };

  return (
    <AuthShell>
      <AuthCard className="max-w-md">
        <BackLink to="/">Kembali ke beranda</BackLink>

        <h1 className="text-xl font-bold text-on-surface">Profil</h1>

        <ProfileInfoSection />

        <hr className="border-outline-variant" />

        <ChangePasswordSection />

        <hr className="border-outline-variant" />

        <ChangeEmailSection />

        <hr className="border-outline-variant" />

        <AvatarSection />

        <hr className="border-outline-variant" />

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-on-surface">Manajemen Alamat</h2>
          <Button variant="secondary" fullWidth onClick={() => navigate("/addresses")}>
            Atur Alamat
          </Button>
        </div>

        <hr className="border-outline-variant" />

        <Button variant="secondary" fullWidth onClick={handleLogout} isLoading={logoutMutation.isPending}>
          {logoutMutation.isPending ? "Keluar..." : "Keluar"}
        </Button>
      </AuthCard>
    </AuthShell>
  );
}
