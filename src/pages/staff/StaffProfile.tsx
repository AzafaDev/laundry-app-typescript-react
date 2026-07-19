import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "../../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../../hooks/staffAuth/useStaffLogoutMutation";
import { ROLE_LABEL } from "../../constants/roleLabels";
import { StaffChangePasswordSection } from "../../components/profile/StaffChangePasswordSection";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { BackLink } from "../../components/ui/BackLink";

export function StaffProfile() {
  const { employee } = useStaffAuth();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/staff/login"),
    });
  };

  return (
    <main className="max-w-xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>

      <h1 className="text-2xl font-bold text-on-surface">Profil</h1>

      <Card className="space-y-4">
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wide">Nama</p>
          <p className="text-sm font-medium text-on-surface">{employee?.full_name}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wide">Email</p>
          <p className="text-sm font-medium text-on-surface">{employee?.email}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wide">Nomor HP</p>
          <p className="text-sm font-medium text-on-surface">{employee?.phone || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-wide">Peran</p>
          <p className="text-sm font-medium text-on-surface">
            {employee ? ROLE_LABEL[employee.role] ?? employee.role : "-"}
          </p>
        </div>
        {employee?.outlet_name && (
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wide">Outlet</p>
            <p className="text-sm font-medium text-on-surface">{employee.outlet_name}</p>
          </div>
        )}
      </Card>

      <Card>
        <StaffChangePasswordSection />
      </Card>

      <Card className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-on-surface mb-2">Manajemen Absensi</h2>
          <div className="space-y-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate("/staff/attendance")}
              size="sm"
            >
              Absensi
            </Button>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate("/staff/attendance/history")}
              size="sm"
            >
              Riwayat Absensi
            </Button>
          </div>
        </div>
      </Card>

      <Button variant="secondary" fullWidth onClick={handleLogout} disabled={logoutMutation.isPending}>
        {logoutMutation.isPending ? "Keluar..." : "Keluar"}
      </Button>
    </main>
  );
}
