import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Bell, CheckCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useNotificationsQuery } from "../hooks/notifications/useNotificationsQuery";
import { useUnreadCountQuery } from "../hooks/notifications/useUnreadCountQuery";
import { useMarkNotificationReadMutation } from "../hooks/notifications/useMarkNotificationReadMutation";
import { useMarkAllNotificationsReadMutation } from "../hooks/notifications/useMarkAllNotificationsReadMutation";
import { NotificationItem } from "../components/notifications/NotificationItem";

const LIMIT = 10;

export function Notifications() {
  const [page, setPage] = useState(1);
  const offset = (page - 1) * LIMIT;

  const notificationsQuery = useNotificationsQuery(LIMIT, offset);
  const unreadCountQuery = useUnreadCountQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const notifications = notificationsQuery.data?.data ?? [];
  const total = notificationsQuery.data?.total_count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke beranda
      </Link>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-2">
            Notifikasi
          </span>
          <h1 className="text-3xl font-bold text-on-surface">Update pesanan kamu.</h1>
          {unreadCount > 0 && <p className="text-sm text-on-surface-variant mt-1">{unreadCount} notifikasi belum dibaca</p>}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2.5 text-sm font-medium text-on-surface hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {notificationsQuery.isLoading && (
        <div className="rounded-2xl border border-outline-variant bg-surface px-4 py-8 flex items-center justify-center gap-3 text-sm text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          Memuat notifikasi...
        </div>
      )}

      {!notificationsQuery.isLoading && notificationsQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
          <p className="font-semibold mb-2">Gagal memuat notifikasi.</p>
          <button
            onClick={() => notificationsQuery.refetch()}
            className="inline-flex items-center rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length === 0 && (
        <div className="rounded-2xl border border-dashed border-outline-variant bg-surface px-6 py-12 text-center">
          <div className="w-14 h-14 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-4">
            <Bell className="w-6 h-6 text-outline" />
          </div>
          <p className="font-semibold text-on-surface mb-1">Belum ada notifikasi</p>
          <p className="text-sm text-on-surface-variant">Update pesanan kamu akan muncul di sini.</p>
        </div>
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && notifications.length > 0 && (
        <>
          <p className="text-xs text-on-surface-variant">
            Menampilkan {notifications.length} dari {total} notifikasi
          </p>
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onMarkRead={(id) => markReadMutation.mutate(id)} />
            ))}
          </div>
        </>
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Sebelumnya
          </button>
          <span className="text-sm text-on-surface-variant px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
          >
            Berikutnya
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </main>
  );
}
