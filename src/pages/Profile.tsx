import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLogoutMutation } from "../hooks/auth/useLogoutMutation";
import { ProfileInfoSection } from "../components/profile/ProfileInfoSection";
import { ChangePasswordSection } from "../components/profile/ChangePasswordSection";
import { ChangeEmailSection } from "../components/profile/ChangeEmailSection";
import { AvatarSection } from "../components/profile/AvatarSection";
import { Button } from "../components/ui/Button";
import { AuthShell, AuthCard } from "../components/ui/AuthShell";

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
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke beranda
        </Link>

        <h1 className="text-xl font-bold text-on-surface">Profil</h1>

        <ProfileInfoSection />

        <hr className="border-outline-variant" />

        <ChangePasswordSection />

        <hr className="border-outline-variant" />

        <ChangeEmailSection />

        <hr className="border-outline-variant" />

        <AvatarSection />

        <hr className="border-outline-variant" />

        <Button variant="secondary" fullWidth onClick={handleLogout} isLoading={logoutMutation.isPending}>
          {logoutMutation.isPending ? "Keluar..." : "Keluar"}
        </Button>
      </AuthCard>
    </AuthShell>
  );
}
