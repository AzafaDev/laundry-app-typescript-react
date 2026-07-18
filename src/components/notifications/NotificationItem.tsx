import { Bell, CreditCard, ClipboardList, PackageCheck, Truck, MessageSquareWarning } from "lucide-react";
import type { Notification, NotificationType } from "../../types/notification";

const NOTIFICATION_ICONS: Record<NotificationType, typeof Bell> = {
  order_details: ClipboardList,
  order_update: ClipboardList,
  payment: CreditCard,
  payment_completed: CreditCard,
  driver_pickup_started: Truck,
  driver_delivery_started: Truck,
  driver_arrived_outlet: Truck,
  driver_arrived_customer: PackageCheck,
  complaint_update: MessageSquareWarning,
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

interface Props {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: Props) {
  const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.is_read) onMarkRead(notification.id);
      }}
      className={`w-full text-left rounded-2xl border p-4 flex gap-3 items-start transition-all duration-200 ease-out ${
        notification.is_read
          ? "border-outline-variant bg-surface"
          : "border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 active:scale-[0.99]"
      }`}
    >
      <div
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          notification.is_read ? "bg-surface-container text-on-surface-variant" : "bg-primary/15 text-primary"
        }`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-on-surface text-sm">
            {!notification.is_read && <span className="sr-only">Belum dibaca: </span>}
            {notification.title}
          </p>
          {!notification.is_read && <span className="shrink-0 w-2 h-2 rounded-full bg-primary" aria-hidden="true" />}
        </div>
        <p className="text-sm text-on-surface-variant mt-0.5">{notification.body}</p>
        <p className="text-xs text-on-surface-variant/70 mt-1.5">{formatDateTime(notification.created_at)}</p>
        {!notification.is_read && <span className="sr-only">Ketuk untuk menandai sudah dibaca.</span>}
      </div>
    </button>
  );
}
