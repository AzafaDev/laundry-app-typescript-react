import type { OrderStatus } from "../../types/order";

export const ORDER_PROGRESS_STEPS: Array<{ key: OrderStatus; label: string }> = [
  { key: "waiting_pickup_driver", label: "Menunggu driver pickup" },
  { key: "laundry_to_outlet", label: "Driver menjemput laundry" },
  { key: "laundry_arrived_outlet", label: "Laundry tiba di outlet" },
  { key: "washing", label: "Sedang dicuci" },
  { key: "ironing", label: "Sedang disetrika" },
  { key: "packing", label: "Sedang dipacking" },
  { key: "waiting_payment", label: "Menunggu pembayaran" },
  { key: "ready_for_delivery", label: "Siap diantar" },
  { key: "delivery_to_customer", label: "Sedang dikirim" },
  { key: "received_by_customer", label: "Tiba di customer" },
  { key: "completed", label: "Selesai" },
];

export interface StatusGroup {
  key: string;
  label: string;
  statuses: OrderStatus[];
}

export const STATUS_GROUPS: StatusGroup[] = [
  { key: "all", label: "Semua", statuses: [] },
  {
    key: "processing",
    label: "Diproses",
    statuses: [
      "waiting_pickup_driver",
      "laundry_to_outlet",
      "laundry_arrived_outlet",
      "washing",
      "ironing",
      "packing",
    ],
  },
  { key: "waiting_payment", label: "Menunggu Pembayaran", statuses: ["waiting_payment"] },
  {
    key: "delivery",
    label: "Pengiriman",
    statuses: ["ready_for_delivery", "delivery_to_customer", "received_by_customer"],
  },
  { key: "completed", label: "Selesai", statuses: ["completed"] },
];

export const ORDER_STATUS_LABEL = Object.fromEntries(
  ORDER_PROGRESS_STEPS.map((s) => [s.key, s.label]),
) as Record<OrderStatus, string>;

export const COMPLAINT_STATUS_LABEL: Record<string, string> = {
  open: "Menunggu Ditinjau",
  in_progress: "Sedang Diproses",
  resolved: "Diselesaikan",
  rejected: "Ditolak",
};

const COMPLAINT_STATUS_BADGE_CLASSES: Record<string, string> = {
  open: "bg-tertiary-container text-on-tertiary-container",
  in_progress: "bg-secondary-container text-on-secondary-container",
  resolved: "bg-primary-container text-on-primary-container",
  rejected: "bg-error-container text-on-error-container",
};

export const complaintBadgeClasses = (status: string) =>
  COMPLAINT_STATUS_BADGE_CLASSES[status] ?? "bg-surface-container text-on-surface-variant";

export const formatDateTime = (value: string | Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const getProgressIndex = (status: OrderStatus) =>
  ORDER_PROGRESS_STEPS.findIndex((s) => s.key === status);
