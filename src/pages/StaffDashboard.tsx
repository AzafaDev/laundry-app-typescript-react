import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, Bell, ClipboardList, Clock, History, ListChecks, MessageCircleWarning, Package, PackageCheck, PackageSearch, ShieldAlert, Shirt, Truck, UserRound } from "lucide-react";
import { useStaffAuth } from "../context/StaffAuthContext";
import { useStaffLogoutMutation } from "../hooks/staffAuth/useStaffLogoutMutation";
import { useStaffUnreadCountQuery } from "../hooks/staffNotifications/useStaffUnreadCountQuery";
import { useDashboardStatsQuery } from "../hooks/admin/useDashboardStatsQuery";
import { useComplaintStatsQuery } from "../hooks/admin/useComplaintStatsQuery";
import { STATION_FOR_ROLE, STATION_LABEL } from "../components/worker/workerConstants";
import { ROLE_LABEL } from "../constants/roleLabels";

const primaryButton =
  "block w-full text-center text-sm font-bold tracking-[0.02em] text-on-primary bg-primary rounded px-4 py-3 mt-2 hover:opacity-90 transition-opacity";
const secondaryButton =
  "block w-full text-center text-sm font-bold tracking-[0.02em] text-on-surface bg-transparent border border-outline rounded px-4 py-3 mt-2.5 hover:border-primary hover:text-primary transition-colors disabled:opacity-55 disabled:hover:border-outline disabled:hover:text-on-surface";

export function StaffDashboard() {
  const { employee } = useStaffAuth();
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();
  const unreadCountQuery = useStaffUnreadCountQuery();
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

  const isAdmin = employee?.role === "super_admin" || employee?.role === "outlet_admin";

  const dashboardStatsQuery = useDashboardStatsQuery({
    enabled: isAdmin,
  });
  const complaintStatsQuery = useComplaintStatsQuery({
    outlet_id: employee?.outlet_id,
    enabled: isAdmin,
  });

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/staff/login"),
    });
  };

  const station = employee ? STATION_FOR_ROLE[employee.role] : undefined;

  return (
    <div className="min-h-svh flex flex-col items-center justify-center text-center px-6 py-12 bg-background">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-5">
        <div className="relative w-full bg-surface-container-lowest border border-dashed border-outline text-left px-7 pt-7 pb-6 before:content-[''] before:absolute before:-top-px before:-left-px before:w-[22px] before:h-[22px] before:bg-background before:border-r before:border-b before:border-dashed before:border-outline">
          <span className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase text-on-surface-variant">Staf</span>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface my-1">{employee?.full_name}</h1>
          <span className="font-mono text-[11px] font-bold tracking-[0.08em] uppercase text-on-surface-variant">
            {employee ? ROLE_LABEL[employee.role] ?? employee.role : ""}
          </span>

          {isAdmin && (
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <div className="rounded-2xl border border-outline-variant bg-surface p-3 flex items-center gap-3">
                <PackageCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-on-surface leading-tight">
                    {dashboardStatsQuery.data?.needs_processing ?? "-"}
                  </div>
                  <div className="text-xs text-on-surface-variant">Perlu Diproses</div>
                </div>
              </div>
              <div className="rounded-2xl border border-outline-variant bg-surface p-3 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-on-surface leading-tight">
                    {dashboardStatsQuery.data?.awaiting_payment ?? "-"}
                  </div>
                  <div className="text-xs text-on-surface-variant">Menunggu Pembayaran</div>
                </div>
              </div>
              <div className="rounded-2xl border border-outline-variant bg-surface p-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-on-surface leading-tight">
                    {dashboardStatsQuery.data?.bypass_pending ?? "-"}
                  </div>
                  <div className="text-xs text-on-surface-variant">Bypass Tertunda</div>
                </div>
              </div>
              <div className="rounded-2xl border border-outline-variant bg-surface p-3 flex items-center gap-3">
                <MessageCircleWarning className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <div className="text-lg font-semibold text-on-surface leading-tight">
                    {complaintStatsQuery.data?.open ?? "-"}
                  </div>
                  <div className="text-xs text-on-surface-variant">Komplain Terbuka</div>
                </div>
              </div>
            </div>
          )}

          {employee?.role === "super_admin" && (
            <div className="flex flex-col gap-2.5 w-full mt-4">
              <Link to="/staff/admin/outlets" className={primaryButton}>Kelola Outlet</Link>
              <Link to="/staff/admin/employees" className={primaryButton}>Kelola Karyawan</Link>
              <Link to="/staff/admin/shifts" className={`${primaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Clock className="w-4 h-4" />
                Kelola Shift
              </Link>
              <Link to="/staff/admin/laundry-items" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Package className="w-4 h-4" />
                Item Laundry
              </Link>
              <Link to="/staff/admin/clothing-types" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Shirt className="w-4 h-4" />
                Jenis Pakaian
              </Link>
            </div>
          )}

          {station && (
            <div className="flex flex-col gap-2.5 w-full mt-4">
              <Link to="/staff/attendance" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Clock className="w-4 h-4" />
                Absensi
              </Link>
              <Link to="/staff/station" className={`${primaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Package className="w-4 h-4" />
                {STATION_LABEL[station]}
              </Link>
              <Link to="/staff/station/history" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <History className="w-4 h-4" />
                Riwayat {STATION_LABEL[station]}
              </Link>
              <Link to="/staff/attendance/history" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <History className="w-4 h-4" />
                Riwayat Absensi
              </Link>
            </div>
          )}

          {employee?.role === "outlet_admin" && (
            <div className="flex flex-col gap-2.5 w-full mt-4">
              <Link to="/staff/admin/orders" className={`${primaryButton} inline-flex items-center justify-center gap-1.5`}>
                <ClipboardList className="w-4 h-4" />
                Semua Pesanan
              </Link>
              <Link to="/staff/admin/orders/pending-process" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <PackageSearch className="w-4 h-4" />
                Proses Pesanan
              </Link>
              <Link to="/staff/admin/bypass-requests" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <ShieldAlert className="w-4 h-4" />
                Permintaan Bypass
              </Link>
            </div>
          )}

          {employee?.role === "driver" && (
            <div className="flex flex-col gap-2.5 w-full mt-4">
              <Link to="/staff/attendance" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Clock className="w-4 h-4" />
                Absensi
              </Link>
              <Link to="/staff/driver/tasks" className={`${primaryButton} inline-flex items-center justify-center gap-1.5`}>
                <ListChecks className="w-4 h-4" />
                Task Tersedia
              </Link>
              <Link to="/staff/driver/active" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <Truck className="w-4 h-4" />
                Task Aktif
              </Link>
              <Link to="/staff/driver/history" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <History className="w-4 h-4" />
                Riwayat Task
              </Link>
              <Link to="/staff/attendance/history" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
                <History className="w-4 h-4" />
                Riwayat Absensi
              </Link>
            </div>
          )}

          <div className="flex flex-col gap-2.5 w-full mt-4">
            <Link to="/staff/notifications" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
              <Bell className="w-4 h-4" />
              Notifikasi{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </Link>
            <Link to="/staff/profile" className={`${secondaryButton} inline-flex items-center justify-center gap-1.5`}>
              <UserRound className="w-4 h-4" />
              Profil
            </Link>
            <button
              className={secondaryButton}
              type="button"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Keluar..." : "Keluar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
