import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useStaffNotificationsQuery } from "../../hooks/staffNotifications/useStaffNotificationsQuery";
import { useStaffUnreadCountQuery } from "../../hooks/staffNotifications/useStaffUnreadCountQuery";
import { useMarkStaffNotificationReadMutation } from "../../hooks/staffNotifications/useMarkStaffNotificationReadMutation";
import { useMarkAllStaffNotificationsReadMutation } from "../../hooks/staffNotifications/useMarkAllStaffNotificationsReadMutation";
import { NotificationItem } from "../../components/notifications/NotificationItem";
import { LoadingState, ErrorState, EmptyState } from "../../components/ui/PageState";
import { Pagination } from "../../components/ui/Pagination";
import { BackLink } from "../../components/ui/BackLink";
import { Eyebrow } from "../../components/ui/Eyebrow";

const LIMIT = 10;

export function StaffNotifications() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;

  const notificationsQuery = useStaffNotificationsQuery(LIMIT, offset);
  const unreadCountQuery = useStaffUnreadCountQuery();
  const markReadMutation = useMarkStaffNotificationReadMutation();
  const markAllReadMutation = useMarkAllStaffNotificationsReadMutation();

  const notifications = notificationsQuery.data?.data ?? [];
  const total = notificationsQuery.data?.total_count ?? 0;
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <BackLink to="/staff/dashboard">Kembali ke dashboard</BackLink>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Eyebrow className="mb-2">Notifikasi</Eyebrow>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Update kerja kamu.</h1>
          {unreadCount > 0 && <p className="text-sm text-on-surface-variant mt-1">{unreadCount} notifikasi belum dibaca</p>}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() =>
              markAllReadMutation.mutate(undefined, {
                onSuccess: () => toast.success("Semua notifikasi ditandai dibaca"),
              })
            }
            disabled={markAllReadMutation.isPending}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {notificationsQuery.isLoading && <LoadingState label="Memuat notifikasi..." />}

      {!notificationsQuery.isLoading && notificationsQuery.isError && (
        <ErrorState message="Gagal memuat notifikasi." onRetry={() => notificationsQuery.refetch()} />
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 && (
        <EmptyState
          icon={Bell}
          title="Belum ada notifikasi"
          description="Update seputar tugas kamu akan muncul di sini."
        />
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={(id) => markReadMutation.mutate(id)} />
          ))}
        </div>
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length > 0 && (
        <Pagination page={page} limit={LIMIT} totalCount={total} onPageChange={setPage} />
      )}
    </main>
  );
}
